/* eslint-disable camelcase */
/*
 * FileName : meterMatch.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-06 14:39:25
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import TransferTable, { PaginationConfig, CRef, arrFormat } from 'src/components/business/transfer';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import AddRowCom, { CRef as ARef } from 'src/components/business/addRowCom';
import { formOpt } from 'src/utils/initDynamicForm';
import { ColumnsType } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import LeftSolt from './leftSolt';
import RightSolt from './rightSolt';
import { connect } from 'react-redux';
import { customer } from 'src/api';
import bus from 'src/utils/eventBus';
import { deepClone } from 'src/utils/utils';
import { DeviceTreeRows } from 'src/api/common/type';
import { LangMessage } from 'src/store/common/language';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { BtnConfig } from 'src/components/common/btnList';
import { useHistory } from 'react-router-dom';
import './index.less';
import { message, Modal } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { hideLoading, showLoading } from 'src/components/common/loding';

const { confirm } = Modal;

interface LeftMeterRows {
    DB_DOT: string;
    IS_LOCK: string;
    METER_GUID: string;
    METER_MODEL_NAME: string;
    METER_NO: string;
    isPrepend: string;
}

interface RightMeterRows extends LeftMeterRows {
    CST_NAME: string;
    data?: any[];
    subFormData?: any[];
}
type DcuTypeSelect = {
    value: string;
    name: string;
}

type Props = {
    Mes: LangMessage,
    subSysNo: string;
}

const MeterMatch: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const PARMAS = {
        l_Meter_No: '',
        l_Meter_type: '',
        r_Meter_type: '',
        r_Meter_No: '',
        subSysNo: subSysNo,
        deviceId: '',
        meters: '',
        deviceType: '',
        allToRight: false,
    };

    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const aRef = useRef<ARef>();
    const history = useHistory();
    const ROWS = 10;
    const PAGATION = {
        page: 1,
        pageSize: ROWS,
    };
    // 查看设备详情
    const checkDevice = async (id: string) => {
        try {
            await tRef.current?.openModel('meter', id);
        } catch (error: any) {
            console.error(error);
        }
    };
    // 设备数据
    const [ deviceRow, setDeviceRow ] = useFetchState<DeviceTreeRows | null>(null);
    const [ updataList, setUpdataList ] = useFetchState<RightMeterRows[]>([]);
    const [ mguid, setMguid ] = useFetchState<string>('');
    const [ meterRows, setMeterRows ] = useFetchState<any[]>([]);
    const [ meterResp, setMeterResp ] = useFetchState<any[]>([]);
    // true为全部移动
    const [ metertFlag, setMetertFlag ] = useFetchState<boolean>(false);
    // 左边下拉数据
    const [ leftMeterTypeSelect, setLeftMeterTypeSelect ] = useFetchState<DcuTypeSelect[]>([]);
    const [ leftDefaultValue, setLeftDefaultValue ] = useFetchState<string>('');
    const [ leftInputVal, setLeftInput ] = useFetchState<string>('');
    const [ leftMeters, setLeftMeters ] = useFetchState<Key[]>([]);

    // 编辑弹窗表单数据
    const [ addOpt, setAddOpt ] = useFetchState<formOpt[]>([]);
    // 左边表单配置
    const leftColumns: ColumnsType<LeftMeterRows> = [
        {
            title: 'Meter No',
            dataIndex: 'METER_NO',
            width: 120,
        },
        {
            title: 'Meter Type',
            dataIndex: 'METER_MODEL_NAME',
        },
        {
            title: 'Batch Name',
            dataIndex: 'DB_DOT',
            ellipsis: true,
        },
    ];
    // 左边数据获取
    const leftGetData = async (page: PaginationConfig, query: any = {}): Promise<any> => {
        const searchQuery = {
            deviceType: leftDefaultValue,
            'l_Meter_No': leftInputVal,
            deviceId: deviceRow?.deviceGuid,
            meters: `'${leftMeters.join(',')}'`,
            allToRight: metertFlag,
        };

        return await customer.meterMgnt.getMeterLeft({
            ...PARMAS,
            ...searchQuery,
            ...query,
            page: page.page,
            rows: page.pageSize,
        });
    };
    // 左边下拉切换
    const leftSetChange = async (val: string) => {
        try {
            setLeftDefaultValue(val);
            cRef.current?.setLeftLoading(true);
            cRef.current?.setLeftCurrent(1);
            const res = await leftGetData(PAGATION, {
                deviceType: val,
                deviceId: deviceRow?.deviceGuid,
            });

            cRef.current?.setLeftData(res);
            cRef.current?.setLeftLoading(false);
        } catch (error: any) {
            message.error(error.toString());
        }
    };
    // 左边输入框搜索
    const leftInputSearch = async (val: string) => {
        try {
            if (!deviceRow) {
                message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                return;
            }
            setLeftInput(val);
            cRef.current?.setLeftLoading(true);
            cRef.current?.setLeftCurrent(1);
            const res = await leftGetData(PAGATION, {
                'L_Meter_No': val,
                deviceType: leftDefaultValue,
                deviceId: deviceRow?.deviceGuid,
            });

            cRef.current?.setLeftData(res);
            cRef.current?.setLeftLoading(false);
        } catch (error: any) {
            cRef.current?.setLeftLoading(false);
            message.error(error.toString());
        }
    };

    // 右边table配置
    const rightColums: ColumnsType<RightMeterRows> = [
        {
            title: 'DCU Name',
            dataIndex: 'CST_NAME',
            width: 80,
        },
        {
            title: 'Meter No',
            dataIndex: 'METER_NO',
            render (_: any, record: any) {
                return (
                    <>
                        <a onClick={() => checkDevice(record.METER_NO)}>{record.METER_NO }</a>
                    </>
                );
            },
        },
        {
            title: 'Meter Type',
            dataIndex: 'METER_MODEL_NAME',
            ellipsis: true,
        },
        {
            title: 'State',
            dataIndex: 'IS_LOCK',
            render (_: any, record: any) {
                let color = 'rgb(0, 0, 255)';

                if (record.IS_LOCK === 'Uninstall') {
                    color = 'rgb(255, 0, 0)';
                }
                return (<span style={{color: color}}>{ record.IS_LOCK }</span>);
            },
        },
    ];
    // 右边下拉数据
    const [ rightDcuTypeSelect, setRightDcuTypeSelect ] = useFetchState<DcuTypeSelect[]>([]);
    const [ rightDefaultValue, setRightDefaultValue ] = useFetchState<string>('');
    const [ rightInput, setRightInput ] = useFetchState<string>('');
    const [ rightData, setRightData ] = useFetchState<RightMeterRows[]>([]);
    const [ rightMoveData, setRightMoveData ] = useFetchState<RightMeterRows[]>([]);
    // 右边获取数据
    const rightGetData = async (page: PaginationConfig, query: any = {}, flag = true): Promise<any> => {
        let data = [];

        if ((rightData.length || rightMoveData.length) && !Object.keys(query).length && flag) {
            data = [ ...rightMoveData, ...rightData ];
        } else {
            const searchQuery = {
                R_Meter_type: rightDefaultValue,
                DeviceType: leftDefaultValue,
                'R_Meter_No': rightInput,
                deviceId: deviceRow?.deviceGuid,
            };

            data = await customer.meterMgnt.getMeterRight({
                ...PARMAS,
                ...searchQuery,
                ...query,
            });

            setRightData(data);
        }
        const rowsData = data.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

        return {
            total: data.length,
            rows: rowsData,
        };
    };
    const rightSetChange = async (val: string) => {
        try {
            setRightDefaultValue(val);
            cRef.current?.setLeftLoading(true);
            cRef.current?.setRightCurrent(1);
            const res = await rightGetData(PAGATION, {
                R_Meter_type: val,
                deviceId: deviceRow?.deviceGuid,
            });

            cRef.current?.setRightData(res);
            cRef.current?.setLeftLoading(false);
        } catch (error: any) {
            message.error(error.toString());
        }
    };
    // 右边搜索
    const rightInputSearch = async (val: string) => {
        if (!deviceRow) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }
        setRightInput(val);
        cRef.current?.setLeftLoading(true);
        cRef.current?.setRightCurrent(1);
        const res = await rightGetData(PAGATION, {
            R_Meter_No: val,
            R_Meter_type: rightDefaultValue,
            deviceId: deviceRow?.deviceGuid,
        });

        cRef.current?.setRightData(res);
        cRef.current?.setLeftLoading(false);
    };
    // 保存左移数据 true=no代表多选，false=yes代码全选
    // eslint-disable-next-line complexity
    const saveMetert = async (flag: Boolean = true) => {
        showLoading();
        // 获取左移选择的数据
        let rightSelectRow: Key[] = [];

        if (flag) {
            rightSelectRow = rightData.map((v) => v.METER_NO);
        } else {
            rightSelectRow = cRef.current?.getRightSelectKeysList() || [];
        }
        // 右移过去又左移后剩下的数据
        const newLeftMetersList = leftMeters.filter((v: Key) => rightSelectRow?.every((o) => v !== o));
        // 获取右边table数据
        const gainRightData = flag ? rightData : cRef.current?.getRightTableData() || [];
        const rightMeterArrForTable = arrFormat(gainRightData, newLeftMetersList, 'METER_NO', false);
        // 左移的数据
        const leftMoveList = rightSelectRow.filter((v) => leftMeters.every((o) => o !== v));
        const leftMeterArrForTable = arrFormat(gainRightData, leftMoveList, 'METER_NO', false);

        // 如果leftMeterArrForTable,rightMeterArrForTable,updateMeterArry数据都为空，无需保存
        if (!leftMeterArrForTable.length && !rightMeterArrForTable.length && !updataList.length) {

            /** 可抽离 */
            // 列表刷新左边，原因目前还未理解，老代码如此。有时间可以把这段代码抽离成一个方法
            cRef.current?.setLeftLoading(true);
            const leftCureent = cRef.current?.getLeftCurrent() || 1;
            const res = await leftGetData({ page: leftCureent, pageSize: ROWS }, {
                meters: '',
            });

            cRef.current?.setLeftData(res);
            cRef.current?.setLeftLoading(false);
            hideLoading();
            return;
        }

        // 保存数据
        const res = await customer.meterMgnt.saveSetting({
            deviceId: deviceRow?.deviceGuid || '',
            leftMeterArrForTable: JSON.stringify(leftMeterArrForTable),
            moveAllLeft: flag ? 'Yes' : 'No',
            subSysNo: subSysNo,
            rightMeterArrForTable: JSON.stringify(rightMeterArrForTable),
            updateMeterArry: JSON.stringify(updataList),
        }).catch((err:any) => err);

        if (!res) {
            message.success(Mes['messageSuccessResetsuccessresetsuccess']);
            setMetertFlag(false);

            /** 可抽离 */
            // 刷新两边的table
            cRef.current?.setLeftLoading(true);
            cRef.current?.setRightLoading(true);
            const leftCureent = cRef.current?.getLeftCurrent() || 1;
            const rightCurrent = cRef.current?.getRightCurrent() || 1;
            const resData = await Promise.all([
                leftGetData({ page: leftCureent, pageSize: ROWS }, {
                    meters: '', allToRight: false,
                }),
                rightGetData({page: rightCurrent, pageSize: ROWS }, {}, false),
            ]);

            setLeftMeters([]);
            setRightMoveData([]);

            cRef.current?.setLeftData(resData[0]);
            cRef.current?.setLeftLoading(false);
            cRef.current?.setRightData(resData[1]);
            cRef.current?.setRightLoading(false);
        } else {
            message.error(res);
        }
        hideLoading();
    };
    // 保存左移数据确认框
    const saveConfirm = (flag: boolean = true) => {
        const rightSelect = cRef.current?.getRightSelectKeysList() || [];

        if (!rightSelect?.length && !flag) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }
        let rightSelectData: RightMeterRows[] = rightData;

        if (!flag) {
            const rightTableData = cRef.current?.getRightTableData() || [];

            rightSelectData = arrFormat(rightTableData, rightSelect, 'METER_NO', false);
        }
        const installList = rightSelectData.filter((v: RightMeterRows) => v.IS_LOCK === 'Installed');
        // 是否有已经安装了的

        if (installList.length) {
            confirm({
                title: Mes['confirmTitleAreYouSure'],
                icon: <ExclamationCircleOutlined />,
                content: Mes['titleTableArchivearchive'],
                okText: Mes['btnOkok'],
                cancelText: Mes['btnCancelcancel'],
                onOk () {
                    history.push('/home/configuration/configDcuArchive');
                },
                onCancel () {
                    console.log('Cancel');
                },
            });
            return;
        }
        saveMetert(flag);
    };
    // true全部移动 false 选择移动
    const moveConfirm = (flag: boolean = true) => {
        if (!deviceRow) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }

        confirm({
            title: Mes['confirmTitleAreYouSure'],
            icon: <ExclamationCircleOutlined />,
            okText: Mes['btnOkok'],
            cancelText: Mes['btnCancelcancel'],
            onOk () {
                saveConfirm(flag);
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };
    // 左移
    const btnL = () => {
        moveConfirm(false);
    };
    // 右移
    const btnR = async (key?:string[]) => {
        try {
            if (!deviceRow) {
                message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                return;
            }
            // 获取左边列表数据
            const leftList = cRef.current?.getLeftTableData() as any[];
            // 获取左边选择数据key
            const leftSelectedRowKeys = key ? key : cRef.current?.getLeftSelectKeysList() as Key[];


            if (!leftSelectedRowKeys.length) {
                message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                return;
            }

            setLeftMeters([ ...leftMeters, ...leftSelectedRowKeys ]);
            // 获取左边选择数据
            const leftSelectData = arrFormat(leftList, leftSelectedRowKeys, 'METER_NO', false).map((v) => {
                v.CST_NAME = deviceRow?.deviceName;
                return v;
            });

            setRightMoveData([ ...rightMoveData, ...leftSelectData ]);
            // 获取右边当前分页
            const rightCurrent = cRef.current?.getRightCurrent() || 1;
            // 获取右边Table数据
            const gainRightData = cRef.current?.getRightTableData() || [];
            // 设置右边数据，将移动数据放入右边table中

            cRef.current?.setRightData({
                rows: [ ...leftSelectData, ...gainRightData ].slice(rightCurrent - 1, ROWS),
                total: [ ...leftSelectData, ...gainRightData ].length,
            });
            // 清空左边选择
            cRef.current?.setLeftSelectKeysList([]);
            // 左边表单重新加载
            cRef.current?.setLeftLoading(true);
            const res = await leftGetData({ page: 1, pageSize: ROWS }, {
                meters: `'${[ ...leftMeters, ...leftSelectedRowKeys ].join(',')}'`,
            });

            cRef.current?.setLeftData(res);
            cRef.current?.setLeftLoading(false);
        } catch (error: any) {
            cRef.current?.setLeftLoading(false);
            message.error(error);
        }
    };
    // 全部左移
    const btnLL = async () => {
        if (!deviceRow) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }
        moveConfirm(true);
    };
    // 全部右移
    const btnRR = async () => {
        try {
            if (!deviceRow) {
                message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                return;
            }
            // 如果右边有1024快表，不能再移动
            if (rightData.length >= 1024) {
                message.warning(Mes['messageAlarmExceedmaxmountexceedmaxmount']);
                return;
            }
            // 转移所需不到1024快表
            const rowsNum = 1024 - rightData.length;
            const meters = `'${leftMeters.join(',')}'`;
            const res = await leftGetData({ page: 1, pageSize: rowsNum }, { meters: meters });
            // 全部右移状态

            setMetertFlag(true);
            // 转换右边数据格式
            const moveRightData: RightMeterRows[] = res.rows.map((v: LeftMeterRows) => {
                const item = deepClone<any>(v);

                item.CST_NAME = deviceRow?.deviceName;
                return item;
            });
            const metersKey: Key[] = res.rows.map((v: LeftMeterRows) => v.METER_NO);

            setLeftMeters([ ...leftMeters, ...metersKey ]);
            setRightMoveData([ ...rightMoveData, ...moveRightData ]);
            // 获取右边当前分页
            const rightCurrent = cRef.current?.getRightCurrent() || 1;
            // 获取右边Table数据
            const gainRightData = cRef.current?.getRightTableData() || [];
            // 设置右边数据，将移动数据放入右边table中

            cRef.current?.setRightData({
                rows: [ ...moveRightData, ...gainRightData ].slice(rightCurrent - 1, ROWS),
                total: [ ...moveRightData, ...gainRightData ].length,
            });
            // 清空左边选择
            cRef.current?.setLeftSelectKeysList([]);
            // 左边表单重新加载
            cRef.current?.setLeftLoading(true);
            const resData = await leftGetData({ page: 1, pageSize: ROWS }, {
                meters: `'${[ ...leftMeters, ...metersKey ].join(',')}'`,
                allToRight: true,
            });

            cRef.current?.setLeftData(resData);
            cRef.current?.setLeftLoading(false);
        } catch (error: any) {
            message.error(error);
        }
    };
    // 编辑弹窗相关配置
    const modelOpt = {
        title: 'titleTabTitletitle',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };
    // 添加表单属性设置
    const layout = {
        labelCol: { span: 12 },
        wrapperCol: { span: 12 },
    };

    const formOptConfig = {
        options: addOpt,
        layout: layout,
        colSpan: 12,
    };

    // eslint-disable-next-line complexity
    const saveData = async (val: any) => {
        if (meterRows.length === 1) {
            let flag = false;
            const isMeterAdr = await customer.meterMgnt.isMeterAddRess({
                deviceId: deviceRow?.deviceGuid || '',
                subSysNo,
                ADDRESS: val['_protocal0005'],
                mguid,
            });

            for (const item of updataList) {
                if (item.METER_GUID !== meterRows[0].METER_GUID && item.data && item.data.length &&
                        item?.data[0]?.PARAMETER_VALUE === val['_protocal0005']) {
                    flag = true;
                    break;
                }
            }
            for (const item of rightMoveData) {
                if (meterRows[0].METER_GUID !== item.METER_GUID && item.data && item.data.length &&
                        item?.data[0]?.PARAMETER_VALUE === val['_protocal0005']) {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                throw Mes['messageAlarmAddressaddress'];
            }
            console.log(isMeterAdr);
        }
        const newUpdatalist = deepClone(updataList);

        for (let i = 0; i < meterRows.length; i++) {// 删除已存在的
            for (let j = 0; j < newUpdatalist.length; j++) {
                if (newUpdatalist[j].METER_NO === meterRows[i].METER_NO) {
                    newUpdatalist.splice(j, 1);
                }
            }
        }
        const subFormData = Object.keys(val).map((key: string) => ({ name: key, value: val[key] }));

        for (let i = 0; i < meterResp.length;i++) {
            const data = JSON.parse(meterResp[i].data);

            for (const key in val) {
                for (const rows of data) {
                    if (meterRows.length > 1) {
                        if (key === `_protocal${rows.PROTOCOL_NO}`) {
                            if (rows.XU_HAO !== 1 && rows.XU_HAO !== 3 && rows.XU_HAO !== 4) {
                                if (val[key]) {
                                    rows.PARAMETER_VALUE = val[key];
                                }
                            }
                        }
                    } else {
                        if (key === `_protocal${rows.PROTOCOL_NO}`) {
                            if (val[key]) {
                                rows.PARAMETER_VALUE = val[key];
                            }
                        }
                    }
                }
            }

            const arry = {
                data: data,
                subFormData: subFormData,
                METER_NO: meterRows[i].METER_NO,
                METER_GUID: meterRows[i].METER_GUID,
            };

            newUpdatalist.push(JSON.parse(JSON.stringify(arry)));
            setUpdataList(newUpdatalist);
        }
    };

    // 按钮列表
    const btnList: BtnConfig[] = [
        {
            type: 'Edit',
            btnType: 'primary',
            async onClick () {
                setUpdataList([]);
                console.log('a----');
                const rightSelectKey = cRef.current?.getRightSelectKeysList() || [];
                // 是否选择数据

                if (!rightSelectKey.length) {
                    return message.warn(Mes['messageAlarmSelectdcuselectdcu']);
                }
                const rightTableData = cRef.current?.getRightTableData() || [];
                const rightSelectData = arrFormat(rightTableData, rightSelectKey, 'METER_NO', false);
                // 是否选中安装的数据
                const installList = rightSelectData.filter((v: RightMeterRows) => v.IS_LOCK === 'Installed');

                if (installList.length) {
                    return message.warn(Mes['messageAlarmNoupdatemeteraminoupdatemeterami']);
                }
                // 编辑的类型是否相同, 编辑只能同类型表计
                const meterTypeName = rightSelectData[0].METER_MODEL_NAME;
                const meterTypeNameList = rightSelectData.map((v) => v.METER_MODEL_NAME !== meterTypeName).filter((v) => v);

                if (meterTypeNameList.length) {
                    return message.warning(Mes['messageAlarmSelectmetertypeselectmetertype']);
                }
                // 获取表计参数详情数据
                const res = await customer.meterMgnt.getMeterDetails({
                    subSysNo: subSysNo,
                    deviceId: deviceRow?.deviceGuid || '',
                    meterRows: JSON.stringify([ rightSelectData[0] ]),
                });

                const meterDetails = JSON.parse(res[0].data);

                setMeterRows(rightSelectData);
                const arryResp = rightSelectData.map(() => res[0]);

                setMeterResp(arryResp);
                setMguid(res[0].MeterGuid);
                const initVal = {};
                // 设置表单展示形式
                const editOpt = meterDetails.map((v: any, index: number) => {
                    // 设置默认值
                    initVal[`_protocal${v.PROTOCOL_NO}`] = v.PARAMETER_VALUE || v.DEFAULT_VALUE;
                    const obj: any = {
                        label: v.PROTOCAL_NAME,
                        name: `_protocal${v.PROTOCOL_NO}`,
                        attr: {},
                    };

                    if (!v.OPERATOR_NAME || v.OPERATOR_NAME === 'null' ||
                        v.OPERATOR_NAME === 'NULL' || v.OPERATOR_NAME === '0') {

                        if (parseInt(v.DATA_TYPE, 10) === 1) { // 下拉框
                            obj.type = 'Select';
                            const optList = v.ENUM_LIST.split('@');

                            obj.options = optList.map((str: string) => {
                                const keyName = str.split(',');

                                return {
                                    value: keyName[1],
                                    name: keyName[0],
                                };
                            });
                        } else {
                            obj.type = 'Input';
                            obj.attr.type = 'text';
                            if (parseInt(v.DATA_TYPE, 10) === 9) { // 密码框
                                obj.attr.type = 'password';
                            }
                        }
                        if (index === 3) { // 第三个属性禁止修改
                            obj.attr.disabled = true;
                        }
                        if (rightSelectData.length > 1 && index === 0) { // 多个表计修改时，第一个属性禁止修改
                            obj.attr.disabled = true;
                        }
                        if (rightSelectData.length > 1 && (index === 0 || index === 2 || index === 3)) { // 多个表计时，
                            initVal[`_protocal${v.PROTOCOL_NO}`] = '';
                        }
                        return obj;
                    } else if (v.OPERATOR_NAME === '1') {
                        return undefined;
                    }
                }).filter((v:any) => v); // 过滤掉undefined值

                setAddOpt(editOpt);
                aRef.current?.openModel(initVal);
            },
        },
        {
            type: 'Save',
            btnType: 'primary',
            onClick () {
                saveMetert(false);
            },
        },
        {
            type: 'Template',
            btnType: 'primary',
            async onClick () {
                const res = await customer.meterMgnt.downTemplate();

                console.log('c--------', res);
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            onClick () {
                console.log('d--------');
            },
        },
    ];

    // 获取集中器类型
    const getDcuTypeData = async (deviceId: string = '') => {
        const INITSELECT = {
            value: '',
            name: 'All',
        };
        let leftDefaultVal = '';

        try {
            // 设置左右两边的下拉，以及默认选项
            if (deviceId) {
                const res = await customer.meterMgnt.getDcuType(deviceId);
                const optList = res.map((v) => ({
                    value: v.SN_METER_TYPE_NAME,
                    name: v.SN_METER_TYPE_NAME,
                }));

                setLeftMeterTypeSelect(optList);
                setLeftDefaultValue(optList[0].value);
                leftDefaultVal = optList[0].value;
                const rightOptList = deepClone(optList);

                rightOptList.unshift(INITSELECT);
                setRightDcuTypeSelect(rightOptList);
                setRightDefaultValue('');
                cRef.current?.setLeftLoading(true);
                cRef.current?.setRightLoading(true);
                const resAll = await Promise.all([
                    leftGetData({ page: 1, pageSize: ROWS }, {
                        deviceType: leftDefaultVal,
                        deviceId: deviceId,
                    }),
                    rightGetData({ page: 1, pageSize: ROWS }, {
                        deviceId: deviceId,
                    }),
                ]) ;

                cRef.current?.setLeftData(resAll[0]);
                cRef.current?.setRightData(resAll[1]);
                cRef.current?.setLeftLoading(false);
                cRef.current?.setRightLoading(false);
            } else { // 没有选择设备时，清空两边table的数据，初始化
                setLeftMeterTypeSelect([]);
                setLeftDefaultValue('');
                setRightDcuTypeSelect([ INITSELECT ]);
                setRightDefaultValue('');
                cRef.current?.setLeftData({rows: [], total: 0});
                cRef.current?.setRightData({rows: [], total: 0});
            }
            // 重置左右两边table的数据
            cRef.current?.setLeftCurrent(1);
            cRef.current?.setRightCurrent(1);

        } catch (error: any) {
            setLeftMeterTypeSelect([]);
            setLeftDefaultValue('');
            setRightDefaultValue('All');
            setRightDcuTypeSelect([ INITSELECT ]);
        }
    };

    useEffect(() => {
        // 监听设备树选择集中器事件
        bus.on('nodeCheck', async (row: any) => {
            try {
                setDeviceRow(row[0] || null);
                // 修改集中器类型下拉事件
                getDcuTypeData(row[0]?.deviceGuid);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('nodeCheck');
        };
    }, []);

    return (
        <div className='meterMatch'>
            <TransferTable<LeftMeterRows, RightMeterRows>
                rowKey={'METER_NO'}
                leftColumns={leftColumns}
                rightColums={rightColums}
                leftGetData={leftGetData}
                rightGetData={rightGetData}
                rows={ROWS}
                LeftSolt={<LeftSolt
                    selectList={leftMeterTypeSelect}
                    defaultValue={leftDefaultValue}
                    inputSearch={leftInputSearch}
                    setChange={leftSetChange} />}
                cRef={cRef}
                btnEvent={{
                    btnL: btnL,
                    btnR: btnR,
                    btnLL: btnLL,
                    btnRR: btnRR,
                }}
                RightSolt={<RightSolt
                    btnList={btnList}
                    selectList={rightDcuTypeSelect}
                    defaultValue={rightDefaultValue}
                    inputSearch={rightInputSearch}
                    setChange={rightSetChange} />}
            />
            <TerminalInfo cRef={tRef} />
            <AddRowCom<void, any>
                cRef={aRef}
                saveData={saveData}
                formOption={formOptConfig}
                modelOpt={modelOpt}
                isI18n={false}
                Mes={Mes}
            />
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterMatch);

