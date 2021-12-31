/*
 * FileName : dcuMgnt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-17 10:48:50
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
import { CstList, InactiveDcuList } from 'src/api/customer&Device/dcuMgnt/type';
import {GetDstListData} from 'src/api/basicData/transformMgt/type';
import LeftSolt from './leftSolt';
import RightSolt from './rightSolt';
import { BtnConfig } from 'src/components/common/btnList';
import { ColumnsType } from 'antd/es/table';
import { LangMessage } from 'src/store/common/language';
import { connect } from 'react-redux';
import useFetchState from 'src/utils/useFetchState';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import AddRowCom, { CRef as ARef } from 'src/components/business/addRowCom';
import { formOpt } from 'src/utils/initDynamicForm';
import { arrPaging, deepClone } from 'src/utils/utils';
import { customer, basicData } from 'src/api';
import UploadModal, { URef } from 'src/components/business/uploadModal';
import { RcFile } from 'antd/es/upload/interface';
import { findManyTreeRow } from 'src/utils/function';
import {CstTypeJsonData} from 'src/api/customer&Device/dcuMgnt/type';
import './index.less';
import { message } from 'antd';

type GroupList = {
    value: string;
    name: string;
}

type OptGroupList = {
    label: string;
    value: string;
    children: GroupList[];
}

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    nodeNo: string;
}

const resCastOption = (res:GetDstListData[]):OptGroupList[] => {
    const obj = {};
    let id = 'CLASSICAL_DETAIL_GUID';
    let name = 'CLASSICAL_DETAIL_NAME';

    if ('ID' in res[0]) {
        id = 'ID';
        name = 'NAME';
    }

    res.forEach((v) => {
        if (obj[v.GNAME]) {
            obj[v.GNAME].children.push({
                value: v[id],
                name: v[name],
            });
        } else {
            obj[v.GNAME] = {
                label: v.GNAME,
                value: v[id],
                children: [],
            };
            obj[v.GNAME].children.push({
                value: v[id],
                name: v[name],
            });
        }
    });
    return Object.keys(obj).map((v) => obj[v]);
};

const DcuMgnt: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;
    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const aRef = useRef<ARef>();
    const uRef = useRef<URef>();
    const ROWS = 10;
    const INITPAGING = {
        page: 1,
        pageSize: ROWS,
    };
    const ENABLE_LIST = [
        {
            value: '0',
            name: Mes['titleTableNono'],
        },
        {
            value: '1',
            name: Mes['titleTableYesyes'],
        },
    ];
    const ACCESS_LEVEL = [
        {
            value: '0',
            name: Mes['titleLabelLowlevellowlevel'],
        },
        {
            value: '1',
            name: Mes['titleLabelHighlevelhighlevel'],
        },
    ];
    const SECURITY_POLICY = [
        {
            value: '1',
            name: Mes['titleLabelAuthenticatedauthenticated'],
        },
        {
            value: '2',
            name: Mes['titleLabelEncryptedencrypted'],
        },
        {
            value: '3',
            name: Mes['titleLabelAcecacec'],
        },
    ];
    // 查看设备详情
    const checkDevice = (cstId: string) => {
        tRef.current?.openModel('dcu', cstId);
    };
    // 线路下拉
    const [ dstOpt, setDstOpt ] = useFetchState<OptGroupList[]>([]);
    // 集中器工厂json
    const [ dcuFuc, setDcuFuc ] = useFetchState<GroupList[]>([]);
    const [ dstTypeJson, setDstTypeJson ] = useFetchState<CstTypeJsonData[]>([]);
    const leftColumns: ColumnsType<InactiveDcuList> = [
        {
            title: 'DCU No',
            dataIndex: 'CST_NO',
            width: 120,
            render (_: any, record: any) {
                if (record.isPrepend === 'R') {
                    return (
                        <a onClick={(e) => {
                            checkDevice(record.CST_ID);
                            e.stopPropagation();
                        }}>{record.CST_NO}</a>
                    );
                } else {
                    return record.CST_NO;
                }
            },
        },
        {
            title: 'Model',
            dataIndex: 'CST_TYPE_NAME',
            width: 120,
        },
    ];
    // 编辑弹窗表单数据
    const [ addOpt, setAddOpt ] = useFetchState<formOpt[]>([]);
    // 左边数据
    const [ leftData, setLeftData ] = useFetchState<InactiveDcuList[]>([]);
    const [ leftMoveData, setLeftMoveData ] = useFetchState<InactiveDcuList[]>([]);
    // 左边集中器类型
    const [ leftDcuModel, setLeftDcuModel ] = useFetchState<string>('');
    // 左边集中器标号
    const [ leftFieldValue, setLeftFieldValue ] = useFetchState<string>('');
    const rightColums: ColumnsType<CstList> = [
        {
            title: 'DCU No',
            dataIndex: 'CST_NO',
            width: 120,
            render (_: any, record: any) {
                if (record.isPrepend === 'R') {
                    return (
                        <a onClick={(e) => {
                            checkDevice(record.CST_ID);
                            e.stopPropagation();
                        }}>{record.CST_NO}</a>
                    );
                } else {
                    return record.CST_NO;
                }
            },
        },
        {
            title: 'Model',
            dataIndex: 'CST_TYPE_NAME',
            width: 120,
        },
        {
            title: 'Transformer',
            dataIndex: 'DST_NAME',
            width: 120,
        },
        {
            title: 'Meter Count',
            dataIndex: 'Archive_Count',
            width: 120,
            render (_: any, record: any) {
                return (<span>{record.Archive_Count || 0 }</span>);
            },
        },
    ];
    const [ rightData, setRightData ] = useFetchState<CstList[]>([]);
    const [ rightMoveData, setRightMoveData ] = useFetchState<CstList[]>([]);
    // 右边集中器类型
    const [ rightDcuModel, setRightDcuModel ] = useFetchState<string>('CST_NO');
    const [ rightFieldValue, setRightFieldValue ] = useFetchState<string>('');
    const [ updateRightData, setUpdateRightData ] = useFetchState<CstList[]>([]);

    // 获取左边表单数据
    const leftGetData = async (pages: PaginationConfig, query: any = {}, flag: boolean = true, moveData?:any[]): Promise<any> => {
        let data = [];

        if (leftData.length && !Object.keys(query).length && flag) {
            data = [ ...leftMoveData, ...leftData ];
        } else {
            const params = {
                page: pages.page,
                pageSize: pages.pageSize,
                subSysNo,
                sortOrder: 'asc',
                searchField: 'CST_NO',
                dcuModel: leftDcuModel,
                fieldValue: leftFieldValue,
                nodeNo,
                ...query,
            };

            const res = await customer.dcuMgnt.getLeftCstList(params);
            const oldData = moveData || leftMoveData;

            data = [ ...oldData, ...res.rows ];
            setLeftData(res.rows);
        }
        const resData = arrPaging(data, pages.page, pages.pageSize);

        return {
            rows: resData,
            total: data.length,
        };
    };
    // 获取右边表单数据
    const rightGetData = async (pages: PaginationConfig, query: any = {}, flag: boolean = true, moveData?:any[]) => {
        let data = [];

        if (rightData.length && !Object.keys(query).length && flag) {
            data = [ ...rightMoveData, ...rightData ];
        } else {
            const params = {
                page: pages.page,
                pageSize: pages.pageSize,
                subSysNo,
                sortOrder: 'asc',
                searchField: rightDcuModel,
                fieldValue: rightFieldValue,
                nodeNo,
                ...query,
            };

            const res = await customer.dcuMgnt.getRightCstList(params);
            const oldData = moveData || rightMoveData;

            data = [ ...oldData, ...res.rows ];
            setRightData(res.rows);
        }
        const rowsData = arrPaging(data, pages.page, pages.pageSize);

        return {
            rows: rowsData,
            total: data.length,
        };
    };
    // 左移
    const btnL = (keys?:string[]) => {
        // 获取选中设备Key值
        const selectKeys = keys?.length ? keys : cRef.current?.getRightSelectKeysList() || [];
        // 没有选中无法左移

        if (!selectKeys?.length) {
            return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
        }
        // 获取左移的数据
        const selectData = arrFormat([ ...rightMoveData, ...rightData ], selectKeys, 'CST_ID', false);
        // 保存左移的数据

        setLeftMoveData([ ...selectData, ...leftMoveData ]);
        cRef.current?.setRightSelectKeysList([]);
        // 获取左边分页
        const leftCurrent = cRef.current?.getLeftCurrent() || 1;
        const data = [ ...selectData, ...leftMoveData, ...leftData ];
        const resLeftData = arrPaging(data, leftCurrent, ROWS);
        // 设置左边table数据

        cRef.current?.setLeftData({ rows: resLeftData, total: data.length });
        // 右边剩余数据
        const reduiceRightData = arrFormat(rightData, selectKeys, 'CST_ID', true);
        // 移到右边剩余数据
        const reduiceRightMoveData = arrFormat(rightMoveData, selectKeys, 'CST_ID', true);
        // 跟新右边数据

        setRightData(reduiceRightData);
        setRightMoveData(reduiceRightMoveData);
        const rightCurrent = cRef.current?.getRightCurrent() || 1;
        const resRightData = arrPaging([ ...reduiceRightMoveData, ...reduiceRightData ], rightCurrent, ROWS);

        cRef.current?.setRightData({rows: resRightData, total: [ ...reduiceRightData, ...reduiceRightMoveData ].length});
    };
    // 全部左移
    const btnLL = () => {
        // 获取左边所有数据
        const moveLeftData = [ ...rightData, ...rightMoveData ] as unknown as InactiveDcuList[];

        setLeftMoveData(moveLeftData);
        // 获取当前分页
        const leftCurrent = cRef.current?.getLeftCurrent() || 1;
        const newLeftData = [ ...leftData, ...leftMoveData, ...moveLeftData ];
        const resLeftData = arrPaging(newLeftData, leftCurrent, ROWS);

        cRef.current?.setLeftData({ rows: resLeftData, total: newLeftData.length });
        setRightMoveData([]);
        setRightData([]);
        cRef.current?.setRightCurrent(1);
        cRef.current?.setRightData({rows: [], total: 0});
    };
    // 右移
    const btnR = (keys?:string[]) => {
        const selectKeys = keys?.length ? keys : cRef.current?.getLeftSelectKeysList();

        if (!selectKeys?.length) {
            return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
        }
        const selectData = arrFormat([ ...leftMoveData, ...leftData ], selectKeys, 'CST_ID', false).map((v: any) => {
            v.CST_NAME = v.CST_NO;
            v.CST_ADDR = v.CST_NO;
            v.SN_CST_TYPE = v.SN;
            v.CST_TYPE_CODE = v.REMARK;
            v.DST_ID = dstOpt[0].children[0].value;
            return v;
        });

        setRightMoveData([ ...selectData, ...rightMoveData ]);
        cRef.current?.setLeftSelectKeysList([]);
        const rightCurrent = cRef.current?.getRightCurrent() || 1;
        const data = [ ...selectData, ...rightData, ...rightMoveData ];
        const resData = arrPaging(data, rightCurrent, ROWS);

        cRef.current?.setRightData({ rows: resData, total: data.length });
        const reduiceLeftData = arrFormat(leftData, selectKeys, 'CST_ID', true);
        const reduiceLeftMoveData = arrFormat(leftMoveData, selectKeys, 'CST_ID', true);

        setLeftData(reduiceLeftData);
        setLeftMoveData(reduiceLeftMoveData);
        const leftCurrent = cRef.current?.getRightCurrent() || 1;
        const resLeftData = arrPaging([ ...reduiceLeftMoveData, ...reduiceLeftData ], leftCurrent, ROWS);

        cRef.current?.setLeftData({rows: resLeftData, total: [ ...reduiceLeftData, ...reduiceLeftMoveData ].length});
    };
    // 全部右移
    const btnRR = () => {
        const moveRightData = [ ...leftData, ...leftMoveData ] as unknown as CstList[];

        setRightMoveData(moveRightData);
        const rightCurrent = cRef.current?.getRightCurrent() || 1;
        const newRightData = [ ...rightData, ...rightMoveData, ...moveRightData ];
        const resRightData = arrPaging(newRightData, rightCurrent, ROWS);

        cRef.current?.setRightData({ rows: resRightData, total: newRightData.length });
        setLeftMoveData([]);
        setLeftData([]);
        cRef.current?.setLeftCurrent(1);
        cRef.current?.setLeftData({rows: [], total: 0});
    };

    // 按钮列表
    const btnList: BtnConfig[] = [
        { // 编辑事件
            type: 'Edit',
            btnType: 'primary',
            async onClick () {
                // 获取选中数据,只能选中右边table的数据
                const selectKeys = cRef.current?.getRightSelectKeysList();
                // 未选中提示

                if (!selectKeys?.length) {
                    return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                }
                // 是否同类型
                let dcuTypeName = '';
                let dcuTypeFlag = true;
                // 是否有挂载表计的集中器
                let isMeterCount = false;
                const selectData = arrFormat([ ...rightMoveData, ...rightData ], selectKeys, 'CST_ID', false);

                selectData.every((val) => {
                    if (typeof val.Archive_Count === 'number' && val.Archive_Count) {
                        isMeterCount = true;
                    }
                    if (!dcuTypeName) {
                        dcuTypeName = val.CST_TYPE_NAME;
                        return true;
                    }
                    if (val.CST_TYPE_NAME !== dcuTypeName) {
                        dcuTypeFlag = false;
                        return false;
                    } else {
                        return true;
                    }
                });
                if (!dcuTypeFlag) {
                    return message.warning(Mes['messageAlarmSelectmodelselectmodel']);
                }
                const keyRule = [ { min: 10, max: 64 } ];
                // 修改弹窗表单编辑
                const formOption: any[] = [
                    {
                        type: 'SelectGroup',
                        label: 'titleTableTransformernametransformername',
                        name: 'dst_id',
                        attr: {
                            disabled: !!isMeterCount, // 有集中器挂载表计不能修改
                        },
                        options: dstOpt,
                    },
                    {
                        type: 'Input',
                        label: 'titleTableDcunodcuno',
                        name: 'dcu_no',
                        attr: {
                            type: 'text',
                            disabled: true,
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleTableDcunamedcuname',
                        name: 'dcu_name',
                        rules: [
                            { min: 2 },
                            { max: 30 },
                            {
                                validator: (_: any, value: any) => {
                                    if (selectKeys.length === 1 && !value) {
                                        return Promise.reject(Mes['messageHintNotempty0notempty0']);
                                    } else if (selectKeys.length === 1 && value) {
                                        return /^[a-zA-Z0-9]+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']);
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ],
                        attr: {
                            type: 'text',
                            disabled: selectData.length > 1,
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleTableDcuaddrdcuaddr',
                        name: 'dcu_address',
                        rules: [
                            { min: 2 },
                            { max: 50 },
                            {
                                validator: (_: any, value: any) => {
                                    if (selectKeys.length === 1 && !value) {
                                        return Promise.reject(Mes['messageHintNotempty0notempty0']);
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ],
                        attr: {
                            type: 'text',
                            disabled: selectData.length > 1,
                        },
                    },
                    {
                        type: 'Select',
                        label: 'titleLabelFactoryfactory',
                        name: 'dcu_factory',
                        options: dcuFuc,
                    },
                    {
                        type: 'Select',
                        label: 'titleTableModelmodel',
                        name: 'dcu_model',
                        attr: {
                            disabled: true,
                        },
                        options: [],
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelRemarkremark',
                        name: 'remark',
                        rules: [
                            { max: 30 },
                        ],
                        attr: {
                            type: 'text',
                        },
                    },
                    {
                        type: 'Select',
                        label: 'titleLabelIotenableiotenable',
                        name: 'switch_iot_enable',
                        attr: {},
                        options: ENABLE_LIST,
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelAccesspasswordaccesspassword',
                        name: 'password',
                        rules: [
                            { required: true },
                            { min: 2 },
                            { max: 30 },
                        ],
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelSourceportsourceport',
                        name: 'clientaddr',
                        rules: [
                            { required: true },
                            { max: 128 },
                            {
                                validator: (_:any, value:any) =>
                                    /^\d+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['messageHintRegexp0regexp0']),
                            },
                        ],
                        attr: {
                            type: 'text',
                        },
                    },
                    {
                        type: 'Select',
                        label: 'titleLabelAccesslevelaccesslevel',
                        name: 'accessLevel',
                        attr: {},
                        options: ACCESS_LEVEL,
                    },
                    {
                        type: 'Select',
                        label: 'titleLabelEncrypteddataencrypteddata',
                        name: 'switch_encrypted',
                        attr: {},
                        options: ENABLE_LIST,
                    },
                    {
                        type: 'Select',
                        label: 'titleLabelSecuritypolicysecuritypolicy',
                        name: 'security_policy',
                        attr: {},
                        options: SECURITY_POLICY,
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelClienttitleclienttitle',
                        name: 'clientTitle',
                        rules: [
                            {min: 10},
                            { max: 20 },
                            {
                                validator: (_: any, value: any) => {
                                    if (value) {
                                        if (/^[a-zA-Z0-9]+$/.test(value)) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']);
                                        }
                                    } else {
                                        return Promise.resolve();
                                    }
                                },
                            },
                        ],
                        attr: {
                            type: 'text',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelMkeymkey',
                        name: 'mkey',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelAkeyakey',
                        name: 'akey',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelEkey',
                        name: 'eKey',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelDkeydkey',
                        name: 'dkey',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelBkeybkey',
                        name: 'bKey',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                    {
                        type: 'Input',
                        label: 'titleLabelPskpsk',
                        name: 'psk',
                        rule: keyRule,
                        attr: {
                            type: 'password',
                        },
                    },
                ];

                setAddOpt(formOption);
                // 默认初始值
                const initVal = {
                    'dst_id': dstOpt[0]?.children[0]?.value || '',
                    'dcu_no': selectData.length > 1 ? '' : selectData[0].CST_NO,
                    'dcu_name': selectData.length > 1 ? '' : selectData[0].CST_NAME,
                    'dcu_address': selectData.length > 1 ? '' : selectData[0].CST_ADDR,
                    'dcu_factory': selectData[0].FACTORY_NO,
                    'dcu_model': dcuTypeName,
                    'remark': selectData[0].CST_RMK && selectData[0].CST_RMK !== 'null' ? selectData[0].CST_RMK : '',
                    'switch_iot_enable': selectData[0].DB_FLAG,
                    'password': selectData[0].CST_PWD,
                    'clientaddr': selectData[0].ClientAddr,
                    'accessLevel': `${selectData[0].SECURITY_LEVEL}`,
                    'switch_encrypted': selectData[0].EncryptedData,
                    'security_policy': selectData[0].SecurityPolicy,
                    'clientTitle': selectData[0].ClientTitle,
                    'mkey': selectData[0].MKey,
                    'akey': selectData[0].AKey,
                    'eKey': selectData[0].EKey,
                    'dkey': selectData[0].DKey,
                    'bKey': selectData[0].BKey,
                    'psk': selectData[0].PSK,
                };

                aRef.current?.openModel(initVal);
            },
        },
        { // 保存事件
            type: 'Save',
            btnType: 'primary',
            async onClick () {
                try {
                    const saveRowsList = [ ...leftMoveData, ...rightMoveData ];

                    if (!saveRowsList.length) {
                        return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
                    }
                    const params = {
                        updateRowsList: JSON.stringify(updateRightData),
                        saveRowsList: JSON.stringify(rightMoveData),
                        delList: JSON.stringify(leftMoveData),
                        subSysNo,
                    };

                    setLeftMoveData([]);
                    setRightMoveData([]);
                    const res = await customer.dcuMgnt.saveBatchCst(params);

                    cRef.current?.setLeftLoading(true);
                    cRef.current?.setRightLoading(true);
                    if (parseInt(res.flag, 10)) {
                        const resList = await Promise.all([
                            leftGetData(INITPAGING, {}, false, []),
                            rightGetData(INITPAGING, {}, false, []),
                        ]);

                        cRef.current?.setLeftCurrent(1);
                        cRef.current?.setRightCurrent(1);
                        const resLeftData = arrPaging(resList[0].rows, 1, ROWS);

                        cRef.current?.setLeftData({ rows: resLeftData, total: resList[0].total });
                        const resRightData = arrPaging(resList[1].rows, 1, ROWS);

                        cRef.current?.setRightData({rows: resRightData, total: resList[1].total});
                        cRef.current?.setLeftLoading(false);
                        cRef.current?.setRightLoading(false);
                        message.success(Mes['titleTableSuccesssuccess']);
                    } else {
                        message.error(res.mes);
                    }
                } catch (error) {
                    console.error(error);
                    message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
                }
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            onClick () {
                uRef.current?.openModel();
            },
        },
    ];

    const getData = async () => {
        cRef.current?.setRightLoading(true);
        const res = await Promise.all([
            rightGetData(INITPAGING, { searchField: 'CST_NO' }),
            basicData.transformMgt.getDstList({
                subSysNo,
                nodeNo,
                sectionId: '',
            }),
            customer.dcuMgnt.getDcuFacJson(),
        ]);

        cRef.current?.setRightData({
            rows: res[0].rows,
            total: res[0].total,
        });
        const fucJson = res[2].map((v) => ({
            value: v.FAC_CODE,
            name: v.FAC_NAME,
        }));

        setDcuFuc(fucJson);
        setDstOpt(resCastOption(res[1]));
        cRef.current?.setRightLoading(false);

    };
    const leftSearch = async (key: string, val: string, typeJson: CstTypeJsonData[]) => {
        if (!dstTypeJson.length) {
            setDstTypeJson(typeJson);
        }
        cRef.current?.setLeftLoading(true);
        if (key === 'dcuModel') {
            setLeftDcuModel(val);
        }
        if (key === 'fieldValue') {
            setLeftFieldValue(val);
        }
        const res = await leftGetData({ page: 1, pageSize: ROWS }, {[key]: val});

        cRef.current?.setLeftCurrent(1);
        cRef.current?.setLeftData(res);
        cRef.current?.setLeftLoading(false);
    };

    const rightSearch = async (key: string, val: string) => {
        cRef.current?.setRightLoading(true);
        if (key === 'dcuModel') {
            setRightDcuModel(val);
        }
        if (key === 'fieldValue') {
            setRightFieldValue(val);
        }
        const res = await rightGetData({ page: 1, pageSize: ROWS }, { [key]: val });

        cRef.current?.setRightCurrent(1);
        cRef.current?.setRightData(res);
        cRef.current?.setRightLoading(false);
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
        labelCol: { span: 9},
        wrapperCol: { span: 15 },
    };

    const formOptConfig = {
        options: addOpt,
        layout: layout,
        colSpan: 12,
    };

    // eslint-disable-next-line complexity
    const saveData = async (val: any) => {
        console.log('a---', val);
        const rightSelectKeys = cRef.current?.getRightSelectKeysList() || [];
        const newRightData = deepClone(rightData);
        const rightSelectRows = arrFormat(newRightData, rightSelectKeys, 'CST_ID', false);
        const cstName = val.dcu_name || '';
        const cstAddr = val.dcu_address || '';
        // 如果选择了一个设备

        if (rightSelectRows?.length === 1) {
            const cstId = rightSelectRows[0].CST_ID;
            const res = await customer.dcuMgnt.isDcuRepeat({
                subSysNo,
                'cst_addr': cstAddr,
                'cst_name': cstName,
                'cst_id': cstId,
            });
            let mess = res.mess;
            // 如果设置的cstname和cstAddr在列表中数据已存在，则报错

            for (const item of rightData) {
                if (item.CST_ID !== cstId && item.CST_NAME === cstName) {
                    mess = '1';
                    break;
                }
                if (item.CST_ID !== cstId && item.CST_ADDR === cstAddr) {
                    mess = '2';
                    break;
                }
            }
            // 如果在修改的数据中存在，则报错
            for (const item of updateRightData) {
                if (item.CST_ID !== cstId && item.CST_NAME === cstName) {
                    mess = '1';
                    break;
                }
                if (item.CST_ID !== cstId && item.CST_ADDR === cstAddr) {
                    mess = '2';
                    break;
                }
            }
            if (mess === '1') {
                message.warning(Mes['messageAlarmCstnamecstname']);
                return;
            }
            if (mess === '2') {
                message.warning(Mes['messageAlarmCstaddrcstaddr']);
                return;
            }
        }
        const dstTypeVale = dstTypeJson.find((v) => v.CST_TYPE_NAME === val.dcu_model);
        const typeString = dstTypeVale?.CST_TYPE?.split(',');
        const rows = {
            DST_ID: val.dst_id,
            CST_NO: val.dcu_no.trim(),
            CST_PWD: val.password.trim(),
            CST_NAME: val.dcu_name.trim(),
            CST_ADDR: val.dcu_address.trim(),
            CST_RMK: val.remark.trim(),
            ClientAddr: val.clientaddr.trim(),
            FACTORY_NO: val.dcu_factory.trim(),
            EncryptedData: val.switch_encrypted,
            SecurityPolicy: val.security_policy,
            ClientTitle: val.clientTitle,
            DB_FLAG: val.switch_encrypted,
            DST_NAME: findManyTreeRow(dstOpt, 'value', val.dst_id)?.label || '',
            CST_TYPE_NAME: val.dcu_model,
            SECURITY_LEVEL: val.accessLevel,
            SN_CST_TYPE: Array.isArray(typeString) ? typeString[0] : '',
            CST_TYPE_CODE: Array.isArray(typeString) ? typeString[1] : '',
            MKey: val.mkey,
            AKey: val.akey,
            EKey: val.eKey,
            DKey: val.dkey,
            BKey: val.bKey,
            PSK: val.psk,
        };
        const newRightUpdate = deepClone(updateRightData);

        for (const item of rightSelectRows) {
            if (rightSelectRows.length > 1) {
                delete rows.CST_NO;
                delete rows.CST_NAME;
                delete rows.CST_ADDR;
            } else {
                item.CST_NO = rows.CST_NO;
                item.CST_NAME = rows.CST_NAME;
                item.CST_ADDR = rows.CST_ADDR;
            }
            item.DST_ID = rows.DST_ID;
            item.CST_PWD = rows.CST_PWD;
            item.CST_RMK = rows.CST_RMK;
            item.ClientAddr = rows.ClientAddr;
            item.FACTORY_NO = rows.FACTORY_NO;
            item.EncryptedData = rows.EncryptedData;
            item.SecurityPolicy = rows.SecurityPolicy;
            item.ClientTitle = rows.ClientTitle;
            item.DB_FLAG = rows.DB_FLAG;
            item.DST_NAME = rows.DST_NAME;
            item.CST_TYPE_NAME = rows.CST_TYPE_NAME;
            item.SN_CST_TYPE = rows.SN_CST_TYPE;
            item.CST_TYPE_CODE = rows.CST_TYPE_CODE;
            item.SECURITY_LEVEL = rows.SECURITY_LEVEL;
            item.MKey = rows.MKey;
            item.AKey = rows.AKey;
            item.EKey = rows.EKey;
            item.DKey = rows.DKey;
            item.BKey = rows.BKey;
            item.PSK = rows.PSK;
            // 如果已经编辑了一次，再次编辑
            let updateItem = newRightUpdate.find((v:any) => v.CST_ID === item.CST_ID);

            if (updateItem) {
                updateItem = item;
            } else {
                newRightUpdate.push(item);
            }
            // 更新table
            let tableItem = newRightData.find((v: any) => v.CST_ID === item.CST_ID);

            if (tableItem) {
                tableItem = item;
            }
        }
        setRightData(newRightData);
        setUpdateRightData(newRightUpdate);
        // 更新table
        const leftCurrent = cRef.current?.getRightCurrent() || 1;
        const resLeftData = arrPaging(newRightData, leftCurrent, ROWS);

        cRef.current?.setLeftData({rows: resLeftData, total: newRightData.length});
    };
    // 下载模板
    const downExcel = () => {
        window.location.href = '/v1/amr/files/cst/downTemplate.do';
    };
    // 保存上传
    const saveUpload = async (file: RcFile| null) => {
        console.log('--v----');
        try {
            if (file) {
                console.log(file);
            } else {
                message.warning(Mes['messageWarnSelectFile']);
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (<div className='dcuMgnt'>
        <TransferTable<InactiveDcuList, CstList>
            rowKey={'CST_ID'}
            leftColumns={leftColumns}
            rightColums={rightColums}
            leftGetData={leftGetData}
            rightGetData={rightGetData}
            rows={ROWS}
            LeftSolt={ dcuFuc.length && <LeftSolt
                facCode={dcuFuc[0]?.value}
                search={leftSearch}
            />}
            cRef={cRef}
            sidePagination={{
                left: true,
                right: true,
            }}
            btnEvent={{
                btnL: btnL,
                btnR: btnR,
                btnLL: btnLL,
                btnRR: btnRR,
            }}
            RightSolt={<RightSolt
                btnList={btnList}
                search={rightSearch}
            />}
        />
        <TerminalInfo cRef={tRef} />
        <AddRowCom<void, any>
            cRef={aRef}
            saveData={saveData}
            formOption={formOptConfig}
            modelOpt={modelOpt}
            Mes={Mes}
        />
        <UploadModal
            uRef={uRef}
            title={Mes['titleExcelimportexcelimport']}
            downEvent={downExcel}
            onfinish={saveUpload} />
    </div>);
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(DcuMgnt);
