// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import useFetchState from 'src/utils/useFetchState';
import { Tabs, Modal, Table, Row, Col, Select, Pagination, message, Input, Button } from 'antd';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { SelectedMeterList } from 'src/api/AmiFunction/connectAndDisConnect/type';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import TaskCom, { TaskRef } from 'src/components/business/taskCom';
import { TaskGroupModuleData, TaskListRows } from 'src/api/AmiFunction/connectAndDisConnect/type';
import { DeviceTreeRows } from 'src/api/common/type';
import {SyncOutlined} from '@ant-design/icons';
import { Key } from 'antd/es/table/interface';
import { ColumnsType } from 'antd/es/table';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { deepClone, arrPaging, dateFormat } from 'src/utils/utils';
import { amiFunc } from 'src/api';
import moment from 'moment';
import { compact } from 'lodash';
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

type Props = {
    Mes: LangMessage;
    subSysNo: string;
}
type PageSizeType = {
    page: number;
    rows: number;
};
type TaskLog = {
    etime: string;
    result: string;
    taskid: string;
}
type ConstConfig = {
    groupId: string;
    sendCmdType: number;
    receiveMessNum: number;
    totalTaskNum: number;
    meterRowList: SelectedMeterList[];
    taskLogMap: Map<string, TaskLog[]>;
    taskTableData: TaskListRows[];
};
const ConnectAndDisconnect: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const cRef = useRef<CRef>();
    const ROWS = 10;
    const taskRef = useRef<TaskRef<TaskGroupModuleData>>();
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    //
    const cacheData = useRef<ConstConfig>({
        groupId: '',
        sendCmdType: 0,
        receiveMessNum: 0,
        totalTaskNum: 0,
        meterRowList: [],
        taskLogMap: new Map(),
        taskTableData: [],
    });
    // 选择拉合闸模式
    const modeMap = {
        1: [ 1, 2 ],
        0: [ 3, 4, 11, 12 ],
    };
    const [ activeKey, setActiveKey ] = useFetchState<string>('1');
    // 密码确认弹窗
    const [ confirmVisible, setConfirmVisible ] = useFetchState<boolean>(false);
    const [ cmdmode, setCmdmode ] = useFetchState<string>('2');
    // 选中表计列表
    const [ meterCstIdList, setMeterCstIdList ] = useFetchState<string>('');
    // 获取的表计详细列表，缓存，分页时数据切割
    const [ meterList, setMeterList ] = useFetchState<SelectedMeterList[]>([]);
    // 展示在table中的表计详细列表
    const [ meterTableData, setMeterTableData ] = useFetchState<SelectedMeterList[]>([]);
    // 表计列表总数
    const [ meterListtotal, setMeterListtotal ] = useFetchState<number>(0);
    // 表计列表当前页
    const [ meterListCurrent, setMeterListCurrent ] = useFetchState<number>(1);
    // 表计列表页发送指令密码确认
    const [ password, setPassword ] = useFetchState<string>('');
    // 任务结果页列表总数
    const [ taskTotal, setTaskTotal ] = useFetchState<number>(0);
    // 任务结果当前页
    const [ taskCurrent, setTaskCurrent ] = useFetchState<number>(1);
    // 任务结果页表计号搜索
    const [ meterNoVal, setMeterNoVal ] = useFetchState<string>('');
    // 任务左边列表某项选择数据
    const [ taskRow, setTaskRow ] = useFetchState<TaskGroupModuleData | null>(null);
    // 任务table列表数据
    const [ taskTableData, setTaskTableData ] = useFetchState<TaskListRows[]>([]);
    // 任务结果页日志弹窗展示
    const [ logVisible, setLogVisible ] = useFetchState<boolean>(false);
    // 日志列表数据
    const [ taskLogList, setTaskLogList ] = useFetchState<TaskLog[]>([]);
    // 任务列表选择数据
    const [ taskSelectKeys, setTaskSelectKeys ] = useFetchState<Key[]>([]);
    // tab切换
    const handleTabsChange = (val: string) => {
        setActiveKey(val);
        if (!taskTableData.length && val === '2') {
            // eslint-disable-next-line no-use-before-define
            getLeftTreeData({
                startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                endTime: dateFormat('YYYY-MM-DD'),
            });
        }
    };

    // 获取表计列表数据，前端分页
    const getMeterTableData = async (cstId: string = meterCstIdList, pages: PageSizeType = INITPAGE) => {
        try {
            const res = await amiFunc.remoteControl.getMeterList({
                subSysNo,
                rowsList: cstId,
                ...pages,
            });
            const newMeterList = res.rows.map((v) => {
                v.SN_STATUS = cmdmode;
                return v;
            });

            console.log('b------');
            cacheData.current.meterRowList = newMeterList;
            setMeterList(newMeterList);
            setMeterTableData(arrPaging(newMeterList, pages.page, pages.rows));
            setMeterListCurrent(pages.page);
            setMeterListtotal(res.total);
        } catch (error: any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 设备树展开子集
    const calladdNextNode = async (item: DeviceTreeRows) => await cRef.current?.addNextNodeByLoading(item) || null;

    // 设备树点击表计设备
    const onNodeCheck = (row: any[]) => {
        console.log('a------');
        const cstId = compact(row.map((v) => {
            if (v.nodeType === '0') {
                return {
                    ITEM_ID: v.deviceGuid,
                    nodeType: v.nodeType,
                };
            }
        }));

        setMeterCstIdList(JSON.stringify(cstId));
        getMeterTableData(JSON.stringify(cstId), {page: meterListCurrent, rows: ROWS});
    };

    // 表计列表页按钮操作
    const btnList: BtnConfig[] = [
        {
            type: 'Edit',
            btnType: 'primary',
            title: 'Execute',
            async onClick () {
                setConfirmVisible(true);
            },
        },
        {
            type: 'BatchSync',
            btnType: 'primary',
            title: 'Sync',
            async onClick () {
                cacheData.current.groupId = v4();
                const obj = {
                    name: 'otask',
                    guid: cacheData.current.groupId,
                    result: '',
                };

                cacheData.current.sendCmdType = 1;
                cacheData.current.receiveMessNum = 0;
                cacheData.current.totalTaskNum = 0;
                bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
            },
        },
    ];

    // 表计列表页某行修改状态
    const hanleStatusChange = (metertKey: string, val: string) => {
        const list = deepClone(meterTableData);
        const row = list.find((v: SelectedMeterList) => v.METER_GUID === metertKey);

        if (row) {
            row.SN_STATUS = val;
            setMeterTableData(list);
        }
        const newMeterList = deepClone(meterList);
        const item = newMeterList.find((v: SelectedMeterList) => v.METER_GUID === metertKey);

        if (item) {
            item.SN_STATUS = val;
            setMeterList(newMeterList);
            cacheData.current.meterRowList = newMeterList;
        }
    };

    // 表计列表页table配置
    const meterColumns: ColumnsType<SelectedMeterList> = [
        {
            title: Mes['titleTableOperatoroperator'],
            dataIndex: 'SN_STATUS',
            width: '240',
            ellipsis: true,
            render (value: string, record: SelectedMeterList) {
                let opt: React.ReactNode | null = null;

                if (parseInt(record.SN, 10) === 1) {
                    value = value ? value : '2';
                    opt = (
                        <>
                            <Option value='2'>Connection</Option>
                            <Option value='1'>Disconnection</Option>
                        </>
                    );
                } else {
                    value = value ? value : '3';
                    opt = (
                        <>
                            <Option value='3'>Open valve</Option>
                            <Option value='4'>Close valve</Option>
                            <Option value='11'>Open half valve</Option>
                            <Option value='12'>Cancel mandatory open valve</Option>
                        </>
                    );
                }
                return (
                    <Select value={value} onChange={(val: string) => hanleStatusChange(record.METER_GUID, val)}>
                        {opt}
                    </Select>
                );
            },
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
            sorter: (a, b) => parseInt(a.METER_NO, 10) - parseInt(b.METER_NO, 10),
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            sorter: (a, b) => parseInt(a.CST_ADDR, 10) - parseInt(b.CST_ADDR, 10),
        },
        {
            title: Mes['titleTableMeteraddrmeteraddr'],
            dataIndex: 'METER_ADDR',
        },
        {
            title: Mes['titleTableCeliangdianhaoceliangdianhao'],
            dataIndex: 'CHECK_POINT_NUM',
            sorter: (a, b) => parseInt(a.CHECK_POINT_NUM, 10) - parseInt(b.CHECK_POINT_NUM, 10),

        },
        {
            title: Mes['titleTableSwitchstatusswitchstatus'],
            dataIndex: 'LAST_STATE',
            render (test: string) {
                switch (parseInt(test, 10)) {
                    case 0:
                        return <span style={{ color: 'rgb(0,0,255)' }}>Connection</span>;
                    case 1:
                        return <span style={{ color: 'rgb(255,0,0)' }}>Disconnection</span>;
                    case 2:
                        return <span style={{ color: 'rgb(255,0,0)' }}>Open half valve</span>;
                    case 3:
                        return <span style={{ color: 'rgb(255,0,0)' }}>Abnormal valve control</span>;
                    default:
                        return 'Open';
                }
            },
        },
    ];

    // 表计列表页分页配置
    const meterPagetion = {
        total: meterListtotal,
        onChange (page: number) {
            setMeterTableData(arrPaging(meterList, page, ROWS));
            setMeterListCurrent(page);
        },
        showTotal: (total: number) => `Total ${total} items`,
        current: meterListCurrent,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 密码输入
    const passChange = ({ target: { value } }: any) => {
        setPassword(value);
    };

    // 密码确认
    const handeConfirmUser = async () => {
        try {
            if (!meterTableData.length) {
                message.warning(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
                return setConfirmVisible(false);
            }
            if (!password) {
                return message.warning(Mes['messageAlarmPasswordrequiredpasswordrequired']);
            }
            const res = await amiFunc.remoteControl.confirmUser({ pwd: password });

            if (!res.flag) {
                message.error(Mes['messageAlarmUserpasswordisincorrectuserpasswordisincorrect']);
                return setConfirmVisible(false);
            }

            const resMes = await amiFunc.remoteControl.getGuid();

            setConfirmVisible(false);
            if (!resMes.flag) {
                return message.error(resMes.mess);
            }
            cacheData.current.groupId = resMes.mess || '';
            cacheData.current.receiveMessNum = 0;
            const obj = {
                name: 'otask',
                guid: cacheData.current.groupId,
                result: '',
            };

            cacheData.current.sendCmdType = 0;
            bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
        } catch (error: any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 操作表计列表修改状态
    const handeModeSelect = (val: string) => {
        setCmdmode(val);
        const newMeterList = deepClone(meterList).map((v: SelectedMeterList) => {
            let optArr: number[] = [];

            if (parseInt(v.SN, 10) === 1) {
                optArr = modeMap[1];
            } else {
                optArr = modeMap[0];
            }
            const item = optArr.find((o) => parseInt(val, 10) === o);

            if (item) {
                v.SN_STATUS = val;
            }
            return v;
        });

        setMeterList(newMeterList);
        cacheData.current.meterRowList = newMeterList;
        const newTableData = arrPaging(newMeterList, meterListCurrent, ROWS);

        setMeterTableData(newTableData);
    };

    // 表计列表页发送指令请求
    const excuteMeterControl = async (wsguid: string) => {
        try {
            console.log(wsguid);
            const { meterRowList } = cacheData.current;
            let meterStr = '';
            let idStr = '';
            let cstStr = '';
            let meterModelNoStr = '';
            let snMeterTypeStr = '';
            let statusStr = '';

            meterRowList.forEach((v) => {
                meterStr += `${v.METER_GUID},`;
                if (!v.SN_STATUS) {
                    idStr += `${cmdmode},`;
                } else {
                    idStr += `${v.SN_STATUS},`;
                }
                cstStr += `${v.CST_ID},`;
                meterModelNoStr += `${v.METER_MODEL_NO},`;
                snMeterTypeStr += `${v.SN_METER_TYPE},`;
                statusStr += `${v.LAST_STATE},`;
            });
            // eslint-disable-next-line max-len
            const xmldata = `<?xml version="1.0" encoding="UTF-8"?><root><idStr>${idStr}</idStr><meterStr>${meterStr}</meterStr><cstStr>${cstStr}</cstStr><meterModelNoStr>${meterModelNoStr}</meterModelNoStr><snMeterTypeStr>${snMeterTypeStr}</snMeterTypeStr><statusStr>${statusStr}</statusStr><groupName>${Mes['titleLabelMetergroupnamemetergroupname']}</groupName><groupId>${cacheData.current.groupId}</groupId></root>`;
            const res = await amiFunc.remoteControl.sendCmdByMeter({
                subSysNo,
                xmldata,
            });
            const taskNum = res.mess?.split(';');

            cacheData.current.totalTaskNum = taskNum && taskNum.length ? parseInt(taskNum[0], 10) : 0;
            if (!res.flag) {
                message.error(Mes['messageErrorRemotecontrolcommandfailedremotecontrolcommandfailed']);
            } else {
                message.success(Mes['messageSuccessRemotecontrolcommandssuccessremotecontrolcommandssuccess']);
            }
            setActiveKey('2');
            // eslint-disable-next-line no-use-before-define
            getLeftTreeData({
                startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                endTime: dateFormat('YYYY-MM-DD'),
            });
        } catch (error: any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 表计列表页发送同步请求
    const sendSynchronousCmd = async (wsguid: string) => {
        const deveiceList = cacheData.current.meterRowList;

        if (!deveiceList.length) {
            return message.warning(Mes['messageAlarmSelectdeviceselectdevice']);
        }
        const meterStr = deveiceList.map((v) => v.METER_GUID).join(',');
        const cstStr = deveiceList.map((v) => v.CST_ID).join(',');

        try {
            const res = await amiFunc.remoteControl.stateSynchronous({
                cstStr,
                groupId: wsguid,
                meterStr,
                subSysNo,
            });

            if (res.mess && res.mess?.split(';')[0]) {
                cacheData.current.totalTaskNum = parseInt(res.mess?.split(';')[0], 10) || 0;
            }
            let strText: string = '';

            if (res.flag) {
                strText = Mes['messageSuccessExecsucessfullyexecsucessfully'];
            } else {
                strText = Mes['messageErrorExecfailedexecfailed'];
            }
            message.success(strText);
            setActiveKey('2');
            // eslint-disable-next-line no-use-before-define
            getLeftTreeData({
                startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                endTime: dateFormat('YYYY-MM-DD'),
            });
        } catch (error) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 刷新表计
    const updateMeterListRow = async (taskid: string) => {
        try {
            const res = await amiFunc.remoteControl.getMeterByTask(taskid);

            if (res.flag === '1') {
                const newMeterList = deepClone(cacheData.current.meterRowList);
                const resArr = res.result.split('@');

                for (const item of newMeterList) {
                    if (item.METER_GUID === resArr[0]) {
                        item.LAST_STATE = resArr[1];
                        break;
                    }
                }
                cacheData.current.meterRowList = newMeterList;
                setMeterList(newMeterList);
                setMeterTableData(arrPaging(newMeterList, meterListCurrent, ROWS));
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 更新任务列表某行数据
    const updateTaskRow = (taskid: string = '', success:string = '') => {
        // 更新状态
        const newTaskTableData = deepClone(cacheData.current.taskTableData);

        for (const item of newTaskTableData) {
            if (item.SN === taskid) {
                item.IS_SUCCESS = success;
                item.IS_EXECUTED = '1';
                break;
            }
        }
        cacheData.current.taskTableData = newTaskTableData;
        setTaskTableData(newTaskTableData);
    };

    // webscoket接收信息
    const OnDemand = (row: any) => {
        if (row?.guid === cacheData.current.groupId) {
            cacheData.current.receiveMessNum++;
            if (cacheData.current.receiveMessNum === 1) {
                if (cacheData.current.sendCmdType) {
                    sendSynchronousCmd(row?.guid);
                } else {
                    excuteMeterControl(row?.guid);
                }
            }
            if (cacheData.current.receiveMessNum > 1) {
                updateMeterListRow(row.taskid);
                updateTaskRow(row.taskid, row.success);
            }
            if (cacheData.current.totalTaskNum === cacheData.current.receiveMessNum - 1) {
                cacheData.current.totalTaskNum = 0;
                cacheData.current.groupId = '';
            }
        }
    };

    // 设备树翻页，清空当前所选设备列表
    const movePage = () => {
        setMeterList([]);
        setMeterTableData([]);
        cacheData.current.meterRowList = [];
        setMeterListCurrent(1);
        setMeterListtotal(0);
        cRef.current?.clearCheckedKeys();
        cRef.current?.clearExpandedKeys();
    };

    // 获取结果列表数据
    const getTaskList = async (val: any, pages:PageSizeType = INITPAGE) => {
        try {
            const res = await amiFunc.remoteControl.getTaskListGroup({
                ...pages,
                sortOrder: 'asc',
                sortName: '',
                parameters: '',
                groupId: val.GROUP_ID || taskRow?.GROUP_ID,
                meterNo: val.meterNo === undefined ? meterNoVal : val.meterNo,
            });

            cacheData.current.taskTableData = res.rows;
            setTaskTableData(res.rows);
            setTaskTotal(res.total);
            setTaskCurrent(pages.page);
        } catch (error:any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };
    // 任务左边列表选中事件
    const taskClick = (row: any) => {
        if (row) {
            getTaskList(row);
        }
        setTaskRow(row);
    };

    // 刷新列表页下发指令
    const refreshExcute = async () => {
        try {
            const taskIds: string = taskSelectKeys.map((key) => {
                const item = taskTableData.find((v) => v.SN === key);

                if (item && parseInt(item.IS_SUCCESS, 10) !== 1) {
                    return key;
                }
            }).filter((v) => v)
                .join(',');

            await amiFunc.remoteControl.resetTask({
                groupId: taskRow?.GROUP_ID || '',
                taskIds: taskIds || '',
            });

            message.success(Mes['titleTableSuccesssuccess']);
            setTaskSelectKeys([]);
            taskRef.current?.resetTreeData();
        } catch (error:any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 任务结果页左边列表title展示
    const groupTaskFormatTitle = (val: any): string => `${val['GROUP_NAME']}`;

    // 任务结果页左边数据获取
    const getLeftTreeData = async (val: any) => {
        console.log(val);
        try {
            const res = await amiFunc.remoteControl.getTaskGroupByRemark({
                taskType: 'remoteControl',
                startDate: val.startTime,
                endDate: val.endTime,
            });

            taskRef.current?.setTreeData(res);
            if (Array.isArray(res) && res.length) {
                taskRef.current?.setSelKeys(res[0].GROUP_ID);
                setTaskRow(res[0]);
                getTaskList({
                    GROUP_ID: res[0].GROUP_ID,
                });
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 查看日志
    const lookLog = (val: TaskListRows) => {
        const logList = cacheData.current.taskLogMap.get(val.SN) || [];

        setTaskLogList(logList);
        setLogVisible(true);
    };

    // 任务table表头设置
    const taskColumns: ColumnsType<TaskListRows> = [
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'CST_NAME',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableGridcustomernamegridcustomername'],
            dataIndex: 'CUSTOMER_NAME',
        },
        {
            title: Mes['titleTableFnnamefnname'],
            dataIndex: 'AFN_NAME',
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'BUILD_DATE',
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'IS_EXECUTED',
            render (val: string, record: TaskListRows) {
                if (parseInt(val, 10) === 0 || parseInt(val, 10) === 2) {
                    return (<i className='fa fa-spinner fa-spin'></i>);
                } else if (parseInt(record.IS_SUCCESS, 10) === 1) {
                    return (
                        <>
                            <i className='fa fa-check-circle'></i>
                            <span style={{
                                verticalAlign: 'middle',
                                color: 'rgb(246,201,2)',
                                fontWeight: 'bold',
                                marginLeft: '5px',
                            }}>{Mes['titleTableSuccesssuccess']}</span>
                        </>
                    );
                } else if (parseInt(record.IS_SUCCESS, 10) === 0) {
                    return (<>
                        <i className='fa fa-check-circle'></i>
                        <span style={{
                            verticalAlign: 'middle',
                            color: 'rgb(252,50,30)',
                            fontWeight: 'bold',
                            marginLeft: '5px',
                        }}>{Mes['titleTableIsfailisfail']}</span>
                    </>);
                } else {
                    return '';
                }
            },
        },
        {
            title: Mes['titleTableResultresult'],
            dataIndex: 'RETURN_DATA',
        },
        {
            title: Mes['titleTableParametersparameters'],
            dataIndex: 'PARAMETERS',
        },
        {
            title: Mes['titleTableLogtitlelogtitle'],
            render (test:string, record: TaskListRows) {
                return (
                    <a onClick={() => lookLog(record)}>{ Mes['titleTableLogbtnlogbtn'] }</a>
                );
            },
        },
    ];

    // 任务table列表选中事件
    const taskTableOnChange = (selectedRowKeys: Key[]) => {
        setTaskSelectKeys(selectedRowKeys);
    };

    // log日志弹窗表头设置
    const logColumns: ColumnsType<TaskLog> = [
        {
            title: Mes['tableTitleSn'],
            dataIndex: 'index',
            render (value: any, record: TaskLog, index: number) {
                return index + 1;
            },
        },
        {
            title: Mes['tableTitleTaskId'],
            dataIndex: 'taskid',
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'etime',
        },
        {
            title: Mes['titleTableLoginfologinfo'],
            dataIndex: 'result',
        },
    ];

    // 任务列表分页配置
    const taskPagetion = {
        total: taskTotal,
        onChange (page: number) {
            getTaskList({}, {page, rows: ROWS});
        },
        current: taskCurrent,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 任务列表搜索表号
    const onSearch = (val: string) => {
        setMeterNoVal(val);
        getTaskList({
            meterNo: val,
        });
    };

    // 关闭日志弹窗
    const handleCancel = () => {
        setLogVisible(false);
    };

    // 任务日志
    const OnDemandLog = (row:any) => {
        const { taskLogMap } = cacheData.current;

        if (row.taskid) {
            let logList:TaskLog[] = [];

            if (taskLogMap.get(row.taskid) && Array(taskLogMap.get(row.taskid))) {
                logList = taskLogMap.get(row.taskid) as TaskLog[];
            }
            logList.push({
                etime: row.etime || '',
                result: row.result || '',
                taskid: row.taskid || '',
            });
            taskLogMap.set(row.taskid, logList);
        }
    };

    // 获取websocket数据
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
        bus.on('otask-log', async (row: any) => {
            try {
                OnDemandLog(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        return () => {
            // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
            bus.removeAllListeners('otask-log');
        };
    }, []);

    return (
        <>
            <div className='contnectControl tabWrap'>
                <Tabs activeKey={activeKey} onChange={handleTabsChange}>
                    <TabPane tab={Mes['titleTabRemotercontrolremotercontrol']} key='1'>
                        <div className='remoteControl contentWrap'>
                            <div className='wrapLeft'>
                                <DeviceTree
                                    onNodeCheck={onNodeCheck}
                                    isExpand={true}
                                    checkbox={false}
                                    cRef={cRef}
                                    PAGESIZE={14}
                                    movePage={movePage}
                                    selectOpt={[ 'DCU', 'Meter' ]}
                                    calladdNextNode={calladdNextNode}
                                />
                            </div>
                            <div className='wrapRight'>
                                <Row gutter={24} className='top'>
                                    <Col span={5}>
                                        <Select value={cmdmode} onChange={handeModeSelect}>
                                            <Option value='2'>Connection</Option>
                                            <Option value='1'>Disconnection</Option>
                                            <Option value='3'>Open valve</Option>
                                            <Option value='4'>Close valve</Option>
                                            <Option value='11'>Open half valve</Option>
                                            <Option value='12'>Cancel mandatory open valve</Option>
                                        </Select>
                                    </Col>
                                    <Col span={2}>
                                        <BtnList btnList={btnList} />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='table'>
                                    <Col span={24}>
                                        <Table columns={meterColumns} dataSource={meterTableData} pagination={false} rowKey='METER_GUID' />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='page'>
                                    <Col span={24}>
                                        <Pagination {...meterPagetion} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab={Mes['titleTabQuerytaskquerytask']} key='2'>
                        <div className='queryTaskResult contentWrap'>
                            <div className='wrapLeft'>
                                <TaskCom onChick={taskClick} showInput={false} title='Group Name' taskRef={taskRef} groupTaskFormatTitle={groupTaskFormatTitle} getList={getLeftTreeData} />
                            </div>
                            <div className='wrapRight'>
                                <Row gutter={24} className='top'>
                                    <Col span={4}>
                                        <Search placeholder='Meter No' onSearch={onSearch} enterButton />
                                    </Col>
                                    <Col span={1}>
                                        <Button
                                            type='primary'
                                            icon={<SyncOutlined/>}
                                            onClick={refreshExcute}
                                            title={Mes['btnReexecutecommandreexecutecommand']} />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='table'>
                                    <Col span={24}>
                                        <Table
                                            columns={taskColumns}
                                            dataSource={taskTableData}
                                            rowSelection={{
                                                selectedRowKeys: taskSelectKeys,
                                                onChange: taskTableOnChange,
                                            }}
                                            pagination={false}
                                            rowKey='SN'
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='page'>
                                    <Col span={24}>
                                        <Pagination {...taskPagetion} />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <Modal title={Mes['titleDialogPasswordinputpasswordinput']} centered visible={confirmVisible} onOk={handeConfirmUser} onCancel={() => setConfirmVisible(false)} width={400}>
                <p>{Mes['messageConfirmSureperformoperationsureperformoperation']}</p>
                <div className='flex'>
                    <label htmlFor='password' className='mr10'>
                        {Mes['titlePassword']}:
                    </label>
                    <Input type='password' id='password' value={password} onChange={passChange} />
                </div>
            </Modal>
            <Modal
                title={Mes['titleTableLoginfologinfo']}
                visible={logVisible}
                width={600}
                onCancel={handleCancel}
                footer={[
                    <Button key='CLose' onClick={handleCancel}>CLose</Button>,
                ]}
            >
                <Table
                    columns={logColumns}
                    dataSource={taskLogList}
                    rowKey={(record: TaskLog, index?: number) => index as number}
                    pagination={{pageSize: 4}}
                />
            </Modal>
        </>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(ConnectAndDisconnect);
