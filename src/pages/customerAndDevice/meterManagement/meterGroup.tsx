/*
 * FileName : meterGroup.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-14 10:58:37
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef } from 'react';
import { Row, Input, Col, Select, message } from 'antd';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { ColumnsType } from 'antd/es/table';
import { customer } from 'src/api';
import { MeterGroupList, GroupMeterList } from 'src/api/customer&Device/meterMgnt/type';
import TransferTable, { PaginationConfig, CRef, arrFormat } from 'src/components/business/transfer';
import useFetchState from 'src/utils/useFetchState';
import { LangMessage } from 'src/store/common/language';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import { connect } from 'react-redux';
import { DeviceTreeRows } from 'src/api/common/type';
import AddRowCom, { CRef as ARef } from 'src/components/business/addRowCom';
import bus from 'src/utils/eventBus';
const { Option, OptGroup } = Select;

import './index.less';

type GroupList = {
    value: string;
    name: string;
}
type OptGroupList = {
    label: string;
    value: string;
    children: GroupList[];
}

type SelectType = {
    value: string;
    name: string;
}

type QueryParams = {
    'group_id': string;
    'meter_no': string;
}

const resCastOption = (res:MeterGroupList[]):OptGroupList[] => {
    const obj = {};

    res.forEach((v) => {
        if (obj[v.GNAME]) {
            obj[v.GNAME].children.push({
                value: v.CLASSICAL_DETAIL_GUID,
                name: v.CLASSICAL_DETAIL_NAME,
            });
        } else {
            obj[v.GNAME] = {
                label: v.GNAME,
                value: v.CLASSICAL_DETAIL_GUID,
                children: [],
            };
            obj[v.GNAME].children.push({
                value: v.CLASSICAL_DETAIL_GUID,
                name: v.CLASSICAL_DETAIL_NAME,
            });
        }
    });
    return Object.keys(obj).map((v) => obj[v]);
};

type Props = {
    Mes: LangMessage,
    subSysNo: string;
}

const MeterGroup: React.FC<Props> = (props) => {
    const { subSysNo, Mes } = props;
    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const aRef = useRef<ARef>();
    // 初始化请求数据
    const INITPARAMS = {
        subSysNo: subSysNo,
        deviceAddr: '',
        'dst_id': '',
        'meter_no': '',
        'group_id': '',
    };
    // 分页每页数量
    const ROWS = 10;
    const INITPAGE = {
        page: 1,
        pageSize: ROWS,
    };
    // table的coloums
    const groupColumns: ColumnsType<GroupMeterList> = [
        {
            title: 'Meter No',
            dataIndex: 'METER_NO',
        },
        {
            title: 'Transformer',
            dataIndex: 'DST_NAME',
        },
        {
            title: 'DCU Address',
            dataIndex: 'CST_ADDR',
        },
        {
            title: 'Group Name',
            dataIndex: 'CLASSICAL_DETAIL_NAME',
        },
    ];
    // 设备数据
    const [ deviceRow, setDeviceRow ] = useFetchState<DeviceTreeRows | null>(null);
    // 表计分组设置下拉
    const [ groupOpt, setGroupOpt ] = useFetchState<OptGroupList[]>([]);
    // 添加弹窗分组下拉
    const [ modalGroupOpt, setModalGroupOpt ] = useFetchState<SelectType[]>([]);

    const [ defaultKey, setDefaultKey ] = useFetchState<QueryParams>({
        'group_id': '',
        'meter_no': '',
    });
    //

    // 获取设备分组数据
    const gainGroupOpt = async () => {
        try {
            const res = await customer.meterMgnt.getMeterGroup();
            // 转换数据格式

            defaultKey['group_id'] = res[0].CLASSICAL_DETAIL_GUID;
            setDefaultKey(defaultKey);
            setGroupOpt(resCastOption(res));
        } catch (error: any) {
            message.error(error);
            setGroupOpt([]);
        }
    };
        // 分组change事件
    const selectChange = (val: string) => {
        defaultKey['group_id'] = val;
        setDefaultKey(defaultKey);
    };

    // 获取左边分组数据
    const gainLeftNoGroupMeter = async (page: PaginationConfig = INITPAGE, query: any = {}) => {
        const params = {
            ...INITPARAMS,
            deviceAddr: deviceRow?.CST_ADDR || '',
            'group_id': defaultKey['group_id'],
            ...query,
            page: page.page,
            rows: page.pageSize,
        };
        const res = await customer.meterMgnt.getNoGroupMeterList(params);

        return res;
    };

    // 获取右边分组数据
    const gainRightGroupMeter = async (page: PaginationConfig = INITPAGE, query: any = {}) => {
        const params = {
            ...INITPARAMS,
            'group_id': defaultKey['group_id'],
            deviceAddr: deviceRow?.CST_ADDR || '',
            ...query,
            page: page.page,
            rows: page.pageSize,
        };
        const res = await customer.meterMgnt.getGroupMeterList(params);

        return res;
    };

    // 点击事件初始化
    const initBatchTableData = async (row: DeviceTreeRows|null = null) => {
        cRef.current?.setLeftLoading(true);
        cRef.current?.setRightLoading(true);
        const res = await Promise.all([
            gainLeftNoGroupMeter(INITPAGE, { deviceAddr: row?.CST_ADDR || deviceRow?.CST_ADDR }),
            gainRightGroupMeter(INITPAGE, { deviceAddr: row?.CST_ADDR || deviceRow?.CST_ADDR}),
        ]);

        cRef.current?.setLeftData(res[0]);
        cRef.current?.setRightData(res[1]);
        cRef.current?.setLeftCurrent(1);
        cRef.current?.setLeftCurrent(1);
        cRef.current?.setLeftLoading(false);
        cRef.current?.setRightLoading(false);
    };

    // 打开弹窗
    const openAddModal = async () => {
        let resOpt = modalGroupOpt;

        if (!resOpt.length) {
            const res = await customer.meterMgnt.getClassicalJson(subSysNo);

            resOpt = res.map((v) => ({ value: v.CLASSICAL_GUID, name: v.CLASSICAL_NAME }));

            setModalGroupOpt(resOpt);
        }
        const initVal = {
            'sys_classical': resOpt[0].value,
            isEnable: 1,
        };

        aRef.current?.openModel(initVal);
    };

    // 增加保存分组
    const saveData = async (value: any) => {
        const res = await customer.meterMgnt.saveGroupClassical({
            ...value,
            subSysNo,
        });

        gainGroupOpt();
        console.log('-----2', res);
    };

    // 添加参数配置
    const addOpt = [
        {
            type: 'Select',
            label: 'titleLabelClassificationnameclassificationname',
            name: 'sys_classical',
            rules: [ { required: true } ],
            attr: {},
            col: 12,
            options: modalGroupOpt,
        },
        {
            type: 'Input',
            label: 'titleLabelCodenamecodename',
            name: 'classicalDetailName',
            rules: [ { required: true } ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'titleLabelCodenocodeno',
            name: 'classicalDetailNo',
            rules: [ { required: true } ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Select',
            label: 'tableTitleStatus',
            name: 'isEnable',
            rules: [ { required: true } ],
            col: 12,
            options: [
                {
                    value: '1',
                    name: 'Enabled',
                },
                {
                    value: '0',
                    name: 'Disable',
                },
            ],
        },
    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };
    // 添加表单参数配置
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    // model参数设置
    const modelOpt = {
        title: 'titleLabelAddclassificationdetailaddclassificationdetail',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 按钮列表
    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            onClick () {
                openAddModal();
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            onClick () {
                console.log('c--------');
            },
        },
    ];

    const saveMetersData = async (data:GroupMeterList[] = [], flag: boolean = true) => {
        const rowList = flag ? '[]' : JSON.stringify(data);
        const leftRowList = flag ? JSON.stringify(data) : '[]';

        return await customer.meterMgnt.saveGroupMeters({
            leftRowList: leftRowList,
            rowList: rowList,
            classicalDetailGuid: defaultKey.group_id,
            subSysNo: subSysNo,
        });
    };

    // 左移
    const btnL = async () => {
        if (!deviceRow) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }
        const rightSelectKey = cRef.current?.getRightSelectKeysList() || [];
        const rightTableData = cRef.current?.getRightTableData() || [];
        const rightSelectData = arrFormat(rightTableData, rightSelectKey, 'METER_NO', false);

        cRef.current?.setRightSelectKeysList([]);
        await saveMetersData(rightSelectData);
        await initBatchTableData();
    };
    // 右移
    const btnR = async () => {
        if (!deviceRow) {
            message.warning(Mes['messageAlarmSelectdcuselectdcu']);
            return;
        }
        const leftSelectKey = cRef.current?.getLeftSelectKeysList() || [];
        const leftTableData = cRef.current?.getLeftTableData() || [];
        const leftSelectData = arrFormat(leftTableData, leftSelectKey, 'METER_NO', false);

        cRef.current?.setLeftSelectKeysList([]);
        await saveMetersData(leftSelectData, false);
        await initBatchTableData();
    };

    useEffect(() => {
        gainGroupOpt();
        // 监听设备树选择集中器事件
        bus.on('nodeCheck', async (row: any) => {
            try {
                setDeviceRow(row[0] || null);
                initBatchTableData(row[0]);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('nodeCheck');
        };
    }, []);

    return (<div className='meterGroup'>
        <Row gutter={24}>
            <Col span={5}>
                <Select value={defaultKey.group_id} onChange={selectChange}>
                    {
                        groupOpt.map((v) => (
                            <OptGroup label={v.label} key={v.label}>
                                {
                                    v.children.map((item) => (
                                        <Option value={item.value} key={item.value}>{item.name}</Option>
                                    ))
                                }
                            </OptGroup>
                        ))
                    }
                </Select>
            </Col>
            <Col span={6}>
                <Input.Group compact>
                    <Select defaultValue='left' style={{ width: '30%' }}>
                        <Option value='left'>left</Option>
                        <Option value='right'>right</Option>
                    </Select>
                    <Input style={{ width: '70%' }} placeholder='Meter No' />
                </Input.Group>
            </Col>
            <Col span={5}>
                <BtnList btnList={btnList} />
            </Col>
        </Row>
        <Row gutter={24} className='transfer'>
            <Col span={24}>
                <TransferTable<GroupMeterList, GroupMeterList>
                    rowKey={'METER_NO'}
                    leftColumns={groupColumns}
                    rightColums={groupColumns}
                    leftGetData={ gainLeftNoGroupMeter }
                    rightGetData={gainRightGroupMeter}
                    btnEvent={{
                        btnL: btnL,
                        btnR: btnR,
                    }}
                    rows={ROWS}
                    cRef={cRef}
                />
            </Col>
        </Row>
        <TerminalInfo cRef={tRef} />
        <AddRowCom<void, any>
            cRef={aRef}
            saveData={saveData}
            formOption={formOpt}
            modelOpt={modelOpt}
            Mes={Mes}
        />
    </div>);
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterGroup);


