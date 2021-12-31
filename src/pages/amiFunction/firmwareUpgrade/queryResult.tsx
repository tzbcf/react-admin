/*
 * FileName : queryResult.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-15 14:30:17
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import TaskCom, {TaskRef, GetListParams} from 'src/components/business/taskCom';
import { Table, Row, Col, Select, message, Pagination, Modal } from 'antd';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import { ColumnsType } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import { TaskList } from 'src/api/AmiFunction/firmwareUpgrade/type';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IsEmptyObejct } from 'src/utils/utils';
import { dateFormat } from 'src/utils/utils';
import { GroupListRows } from 'src/api/AmiFunction/firmwareUpgrade/type';
import { deepClone } from 'src/utils/utils';
import { abnormalFn } from 'src/utils/function';
import moment from 'moment';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { amiFunc } from 'src/api';
const { Option } = Select;
const { confirm } = Modal;

type TaskInfo = {
    SuccessCount: number;
    failCount: number;
    upgradeTime: number;
    unfinished: number;
}

interface TableTaskList extends TaskList{
    orderStatus: number;
}

type PageSizeType = {
    page: number;
    rows: number;
}

type TaskGroupList = {
    groupId: string;
    PSN: string;
}

type OnDemandConfig = {
    groupIdList: TaskGroupList[];
    readType: number;
    funcType: string;
    receiveMessNum: number;
    taskRow: TableTaskList[],
    totalTaskNum: number;
}

type Props = {
    Mes: LangMessage,
    subSysNo: string;
    flag: boolean;
}

const QueryResult: React.FC<Props> = (props) => {
    const { subSysNo, Mes, flag } = props;
    const taskRef = useRef<TaskRef<GroupListRows>>();
    const onConfig = useRef<OnDemandConfig>({
        groupIdList: [],
        readType: 0,
        funcType: '0',
        receiveMessNum: 0,
        taskRow: [],
        totalTaskNum: 0,
    });
    const ROWS = 10;
    // 初始化分页
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    // 初始化方案基础信息
    const INITTASKINFO: TaskInfo = {
        SuccessCount: 0,
        failCount: 0,
        upgradeTime: 0,
        unfinished: 0,
    };
    // 右边table数据
    const [ tableData, setTableData ] = useFetchState<TableTaskList[]>([]);
    // 分页总数
    const [ total, setTotal ] = useFetchState<number>(0);
    // 当前页数
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 加载
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    // 左边列表选中数据
    const [ taskRow, setTaskRow ] = useFetchState<any>({});
    // 右边状态下拉数据
    const [ selStatus, setSelStatus ] = useFetchState<string>('All');
    // table下面方案信息展示数据
    const [ taskInfo, setTaskInfo ] = useFetchState<TaskInfo>(INITTASKINFO);
    // table选中Key值
    const [ selRowKeys, setSelRowKeys ] = useFetchState<Key[]>([]);
    // 获取table数据
    const getTableData = async (row: any = taskRow, pages: PageSizeType = INITPAGE, status: string = selStatus) => {
        try {
            setLoading(true);
            const res = await amiFunc.firmwareUpgrade.getTaskListAndStatusCount({
                subSysNo,
                status,
                sortOrder: 'asc',
                page: pages.page,
                rows: pages.rows,
                groupId: row.GROUP_ID || '',
            });

            setTaskInfo({
                SuccessCount: res.SuccessCount,
                failCount: res.failCount,
                upgradeTime: res.upgradeTime,
                unfinished: res.unfinished,
            });
            const rowsList: TableTaskList[] = res.rows.map((v) => {
                const obj:TableTaskList = deepClone<any>(v);

                obj.orderStatus = 0;
                return obj;
            });

            setTableData(rowsList);
            setTotal(res.total);
            setLoading(false);
            setCurrent(pages.page);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 方案选中事件
    const taskClick = async (row: any) => {
        if (row && IsEmptyObejct(row)) {
            setTaskRow(row);
            getTableData(row, INITPAGE, 'All');
        } else {
            setTaskRow({});
            setTableData([]);
            setTotal(0);
            setCurrent(1);
        }
    };

    // 按钮事件
    const btnList: BtnConfig[] = [
        { // 搜索
            type: 'Search',
            btnType: 'primary',
            title: 'Search upgrade result',
            async onClick () {
                getTableData(taskRow, INITPAGE, selStatus);
            },
        },
        { // 重新升级
            type: 'Restart',
            btnType: 'primary',
            title: 'Re-execution upgrade',
            async onClick () {
                try {
                    const rows = tableData.map((v) => {
                        const key = selRowKeys.find((o) => o === v.PSN);

                        if (key) {
                            if (v.UPGRADE_STATUS === '2') {
                                return v;
                            } else {
                                const newSelKeys = selRowKeys.filter((o) => o !== v.PSN);

                                setSelRowKeys(newSelKeys);
                            }
                        }
                    }).filter((v) => v);

                    if (!rows.length) {
                        return message.warning(Mes['messageAlarmSelectdevicefirstselectdevicefirst']);
                    }
                    confirm({
                        title: Mes['messageSuccessConfirmconfirm'],
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['btnBtnresendbtnresend'],
                        async onOk () {
                            try {
                                const res = await amiFunc.firmwareUpgrade.upgradeResend({
                                    subSysNo,
                                    strlist: JSON.stringify(rows),
                                });

                                if (res.flag) {
                                    getTableData();
                                    message.success(Mes['messageAlarmUpgradecommandsuccessandwaitupgradecommandsuccessandwait']);
                                } else {
                                    message.error(res.mess);
                                }

                            } catch (error:any) {
                                console.error(error);
                                message.error(`${error}`);
                            }
                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }
            },
        },
        { // 取消升级
            type: 'Refresh',
            btnType: 'primary',
            title: 'Cancel upgrade',
            async onClick () {
                try {
                    const rows = tableData.filter((v) => selRowKeys.some((key) => v.PSN === key));

                    if (!rows.length) {
                        return message.warning(Mes['messageAlarmOnlyusefulupgradingonlyusefulupgrading']);
                    }
                    confirm({
                        title: Mes['messageSuccessConfirmconfirm'],
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['btnResetupgraderesultresetupgraderesult'],
                        async onOk () {
                            try {
                                const res = await amiFunc.firmwareUpgrade.upgradeReset({
                                    subSysNo,
                                    strlist: JSON.stringify(rows),
                                });

                                if (res.flag) {
                                    getTableData();
                                    message.success(Mes['messageAlarmCancelupgradecancelupgrade']);
                                } else {
                                    message.error(res.mess);
                                }
                            } catch (error:any) {
                                console.error(error);
                                message.error(`${error}`);
                            }
                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }
            },
        },
    ];

    // 获取版本号
    const syncVersion = (val: TableTaskList) => {
        console.log('task------', val);
        const taskList = deepClone(tableData).map((v:TableTaskList) => {
            if (v.PSN === val.PSN) {
                v.orderStatus = 1;
            }
            return v;
        });

        setTableData(taskList);
        const groupId = v4();

        onConfig.current.groupIdList.push({ groupId, PSN: val.PSN });
        onConfig.current.taskRow = tableData;
        const obj = {
            name: 'otask',
            guid: groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
    };

    // table头部
    const columns: ColumnsType<TableTaskList> = [
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'CST_NAME',
        },
        {
            title: Mes['titleTableDcutypedcutype'],
            dataIndex: 'CST_TYPE_NAME',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableCompletetimecompletetime'],
            dataIndex: 'COMPLETION_DATE',
            render (value) {
                try {
                    return dateFormat('YYYY-MM-DD HH:mm:ss', new Date(parseInt(value, 10)));
                } catch (error) {
                    return '-';
                }
            },
        },
        {
            title: Mes['titleTableUpgradetypeupgradetype'],
            dataIndex: 'UPGRADE_TYPE',
        },
        {
            title: Mes['titleTableUploadtaskuploadtask'],
            dataIndex: 'UPGRADE_STATUS',
            render (value: string) {
                let status = parseInt(value, 10);

                if (status === 3) { // sucess
                    return (<span><i className='fa fa-check-circle' style={{verticalAlign: 'middle', color: '#21c913'}}></i>Success</span>);
                } else if (status === 2) {
                    return (<span><i className='fa fa-times-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Failure</span>);
                } else if (status === 0) {
                    return (<span><i className='fa fa-play-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Ready</span>);
                } else if (status === 1) {
                    return (<span><i className='fa fa-spinner fa-spin' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Upgrading</span>);
                } else {
                    return (<span><i className='fa fa-times-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Failure</span>);
                }
            },
        },
        {
            title: Mes['titleTableMessagemessage'],
            dataIndex: 'RETURN_DATA',
        },
        {
            title: Mes['titleTableRemoteoperateremoteoperate'],
            dataIndex: 'orderStatus',
            render (test: number, record: TableTaskList) {
                if (!test) {
                    return (
                        <a onClick={() => syncVersion(record)}>{ Mes['btnReadread'] }</a>
                    );
                }
                return (
                    <i className='fa fa-spinner fa-spin'></i>
                );

            },
        },
    ];

    // 方案展示title格式
    const groupTaskFormatTitle = (val: any):string => `${val['UPGRADE_TYPE']}--${val['PROGRAM_NAME']}`;

    // 获取左边方案数据
    const getLeftTreeData = async (val: GetListParams, flagType:boolean = false) => {
        try {
            const res = await amiFunc.firmwareUpgrade.getGroupList({
                startDate: val.startTime,
                endDate: val.endTime,
                sortName: '',
                sortOrder: 'asc',
                programName: val.inputVal || '',
            });

            if (flagType) {
                getTableData(res.rows[0], INITPAGE, 'All');
                setTaskRow(res.rows[0]);
                taskRef.current?.setSelKeys(res.rows[0].GROUP_ID);
            }

            taskRef.current?.setTreeData(res.rows);
        } catch (error: any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 分页配置
    const pagetion = {
        total: total,
        onChange (page: number) {
            getTableData(taskRow, {page, rows: ROWS});
        },
        current: current,
        showTotal: () => `Total ${total} items`,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // table选中事件
    const rowSelection = {
        selectedRowKeys: selRowKeys,
        onChange (rowKeys: Key[]) {
            setSelRowKeys(rowKeys);
        },
    };

    // 状态下拉事件
    const statusChange = (val: string) => {
        if (IsEmptyObejct(taskRow)) {
            setSelStatus(val);
            getTableData(taskRow, INITPAGE, val);
        } else {
            setSelStatus(val);
        }
    };

    useEffect(() => {
        if (flag) {
            taskRef.current?.initFiled();
            setSelStatus('All');
        }
        getLeftTreeData({
            startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
            endTime: dateFormat('YYYY-MM-DD'),
            inputVal: '',
        }, flag);
    }, [ flag ]);

    // 发送获取版本指令
    const pushOrder = (guid:string) => {
        abnormalFn(async () => {
            const groupItem = onConfig.current.groupIdList.find((v) => v.groupId === guid);
            const deviceList:TableTaskList[] = deepClone(onConfig.current.taskRow);
            const rowItem = deviceList.find((v) => v.PSN === groupItem?.PSN) as TableTaskList;

            const meterItems = [ {
                ITEM_ID: rowItem?.METER_GUID || '',
                CST_ID: rowItem?.CST_ID || '',
                SN_METER_TYPE: '',
            } ];
            let commandType = '';
            let param = '';

            if (rowItem.UPGRADE_TYPE === 'Meter') {
                commandType = '22';
            } else if (rowItem.UPGRADE_TYPE === 'Dcu') {
                commandType = '21';
            } else if (rowItem.UPGRADE_TYPE === 'Main Module') {
                commandType = '23';
            } else if (rowItem.UPGRADE_TYPE === 'Slave Module') {
                commandType = '24';
                param = rowItem.METER_ADDR;
            }
            const cmdParameter: any[] = [ {
                commandType: commandType,
                param: param,
            } ];
            const res = await amiFunc.onDemandReading.sendProtocalCommand({
                groupId: guid,
                meterItems: JSON.stringify(meterItems),
                cmdParameter: JSON.stringify(cmdParameter),
                remark: '',
            });

            if (!res.flag) {
                message.error(Mes['messageAlarmNoupgradeconfignoupgradeconfig']);
                rowItem.orderStatus = 0;
                rowItem.RETURN_DATA = res.mess as string;
                setTableData(deviceList);
            }
        });
    };

    // ws返回信息逻辑
    const OnDemand = (row:any) => {
        console.log(row);
        const groupItem = onConfig.current.groupIdList.find((v) => v.groupId === row.guid);
        const taskList = deepClone(onConfig.current.taskRow);
        const rowItem = taskList.find((v: TableTaskList) => v.PSN === groupItem?.PSN);

        if (groupItem && rowItem) {
            if (row.name === 'otask-confirm') { // 下发领悟指令
                pushOrder(row.guid);
            } else if (row.name === 'otask') { // 查询返回的结果
                rowItem.RETURN_DATA = row.result;
                rowItem.orderStatus = 0;
                setTableData(taskList);
            } else {
                rowItem.orderStatus = 0;
                setTableData(taskList);
            }
        }
    };

    useEffect(() => {
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
    }, []);

    return (<div className='queryResult contentWrap'>
        <div className='wrapLeft'>
            <TaskCom
                onChick={taskClick}
                title={Mes['titleTableUploadtaskuploadtask']}
                taskRef={taskRef}
                groupTaskFormatTitle={groupTaskFormatTitle}
                getList={getLeftTreeData} />
        </div>
        <div className='wrapRight'>
            <Row gutter={24} className='top'>
                <Col span={3}>
                    <Select value={selStatus} onChange={statusChange}>
                        <Option value='All'>All</Option>
                        <Option value='3'>Success</Option>
                        <Option value='2'>Failure</Option>
                        <Option value='1'>Upgrading</Option>
                        <Option value='0'>Ready</Option>
                    </Select>
                </Col>
                <Col>
                    <BtnList btnList={btnList} />
                </Col>
            </Row>
            <Row gutter={24} className='table'>
                <Col span={24}>
                    <Table
                        columns={columns}
                        loading={loading}
                        dataSource={tableData}
                        rowSelection={rowSelection}
                        pagination={false}
                        rowKey='PSN'
                    />
                </Col>
            </Row>
            <Row gutter={24} className='page'>
                <Col span={24}>
                    <Pagination {...pagetion} />
                </Col>
            </Row>
            <Row gutter={24} className='statistical'>
                <Col span={7}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <strong>{Mes['titleTableUpgradestarttimeupgradestarttime']}:</strong>
                        </Col>
                        <Col span={12}>
                            {taskInfo.upgradeTime ? dateFormat('YYYY-MM-DD hh:mm:ss', moment(taskInfo.upgradeTime)) : ''}
                        </Col>
                    </Row>
                </Col>
                <Col span={4}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <strong>{Mes['tableTitleStatus']}:</strong>
                        </Col>
                        <Col span={12}>
                            {total - taskInfo.SuccessCount - taskInfo.failCount > 0 ? 'Upgrading' : 'Finish'}
                        </Col>
                    </Row>
                </Col>
                <Col span={5}>
                    <Row gutter={24}>
                        <Col span={16}>
                            <strong>{Mes['titleTableUnfinishedunfinished']}:</strong>
                        </Col>
                        <Col span={8}>
                            {typeof taskInfo.unfinished === 'number' ? taskInfo.unfinished : 0}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </div>);
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(QueryResult);


