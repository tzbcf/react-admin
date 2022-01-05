// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { connect } from 'react-redux';
import { Row, Col, Select, Button, Table, Input, Tree, Pagination, message, Modal } from 'antd';
import { LangMessage } from 'src/store/common/language';
import { ReloadOutlined } from '@ant-design/icons';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { amiFunc } from 'src/api';
import useFetchState from 'src/utils/useFetchState';
import { DeviceTreeRows } from 'src/api/common/type';
import { constructCommandData, TypeNodeAttr, NodeProperty, NodeChildProperty, abnormalFn } from 'src/utils/function';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import { Key } from 'rc-tree/es/interface';
import { arrPaging, dateFormat } from 'src/utils/utils';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import bus from 'src/utils/eventBus';
import { deepClone } from 'src/utils/utils';
import ColumnsSelect from 'src/components/common/columnsSelect';
import { CascaderValueType, DataNode } from 'rc-cascader/es/interface';
import moment from 'moment';
import { v4 } from 'uuid';
import './index.less';
const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;

type Props = {
  Mes: LangMessage,
  subSysNo: string;
}

interface TableProcolData {
    SN: string;
    DEVICE_TYPE: string;
    DEVICE_NO: string;
    DEVICE_ID:string;
    PARENT_ID: string;
    METER_MODEL_NO: string;
    SN_METER_TYPE: string;
    INSTALL_ADDR: string;
    COMMAND_NAME: string;
    DATA_TYPE: string;
    RESULT_DATA_TYPE: string;
    INPUT_PARAM_COUNT: string;
    OUTPUT_PARAM_COUNT: string;
    PARAMETER_FLAG?: string;
    SN_PROTOCAL_COMMAND: string;
    FN_NAME: string;
    COMMAND_SN: string;
    PARAM_SN: string|null;
    DEFAULT_VALUE: string|null;
    MAX_VALUE:string|null;
    MIN_VALUE: string|null;
    DATA_FORMAT: string|null;
    PARAM: string;
    RETURN_TYPE?: string;
    STATUS: string;
    RESULT: string;
    BITSQ?: string;
    CREATE_TIME: string;
    COMPLETE_TIME: string;
    TASK_ID?: string | null;
    UNIT: string;
    FN:string;
}

const addTask = (node:NodeChildProperty, deviceData:DeviceTreeRows[], status:number) => {
    const task: TableProcolData[] = [];
    let deviceList: any[] = deviceData;

    if (typeof node.parentId === 'undefined' || node.id === 'commandTree') {
        return [];
    }
    let strParam = '';

    if (node.nodeType === 3) {
        if (node.inputParamCount === '1') {
            strParam = '';
        } else {
            strParam = `${dateFormat('YYYY-MM-DD HH:mm:ss', moment(new Date().getTime() - 1000 * 60 * 60 * 24))},${dateFormat('YYYY-MM-DD HH:mm:ss')}`;
        }
    } else {
        strParam = node.defaultValue || '';
        if (!strParam) {
            strParam = '';
        }
    }
    for (const o of deviceList) {

        const row = {
            SN: node.no + o.deviceGuid,
            DEVICE_TYPE: o.nodeType,
            DEVICE_NO: o.deviceNo,
            DEVICE_ID: o.deviceGuid,
            PARENT_ID: o.CST_ID,
            METER_MODEL_NO: 'metermodelno' in o ? o.metermodelno : '',
            SN_METER_TYPE: o.deviceModel,
            INSTALL_ADDR: o.address,
            COMMAND_NAME: node.title,
            DATA_TYPE: `${node.dataType}`,
            RESULT_DATA_TYPE: node.resultDataType,
            SN_PROTOCAL_COMMAND: node.protocalCommand,
            INPUT_PARAM_COUNT: node.inputParamCount,
            OUTPUT_PARAM_COUNT: node.outputParamCount,
            // PARAMETER_FLAG: node.PARAMETER_FLAG,
            FN_NAME: node.title,
            COMMAND_SN: node.no,
            PARAM_SN: node.paramSn,
            DEFAULT_VALUE: node.defaultValue,
            MAX_VALUE: node.maxValue,
            MIN_VALUE: node.minValue,
            DATA_FORMAT: node.dataFormat,
            PARAM: strParam,
            RETURN_TYPE: node.returnType,
            STATUS: `${status}`,
            RESULT: '',
            // TASK_ID: '',
            // BITSQ: node.bitSQ,
            CREATE_TIME: dateFormat(),
            COMPLETE_TIME: '-',
            UNIT: node.unit,
            FN: node.commandFN,
            PRIORITY: node.priority,
        };

        task.push(row);
    }
    return task;
};

type TaskLogProperty = {
    sn: string;
    taskid: string;
    etime: string;
    result: string;
}

type TaskListLogAttr = {
    [id: string]: TaskLogProperty[]
}

type OnDemandConfig = {
    groupId: string[];
    readType: number;
    funcType: string;
    tableData: TableProcolData[];
    receiveMessNum: number;
    taskSelectKeys: Key[];
    taskLogList: TaskListLogAttr;
    totalTaskNum: number;
}

const OnDemandRead: React.FC<Props> = (props) => {
    const { subSysNo, Mes } = props;
    const history = useHistory();
    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const onConfig = useRef<OnDemandConfig>({
        groupId: [],
        readType: 0,
        funcType: '0',
        tableData: [],
        receiveMessNum: 0,
        taskSelectKeys: [],
        taskLogList: {},
        totalTaskNum: 0,
    });
    // 随抄状态全集
    const enum READ_STATUS {
        FAILURE,
        SUCCESS,
        READY,
        READING,
        STOP,
        TIMEOUT,
        UNREGISTER
    }
    const CONST_RESULT_TIMEOUT = 'Task time out';
    // 随抄任务全集
    const typeNodeMap:TypeNodeAttr = {
        '0': {title: Mes['comboboxReadingdatareadingdata'], key: '0', children: []},
        '1': {title: Mes['comboboxSettingparamsettingparam'], key: '1', children: []},
        '3': {title: Mes['comboboxSettingparamsettingparam'], key: '3', children: []},
        '4': {title: Mes['comboboxReadingdatareadingdata'], key: '4', children: []},
        '5': {title: Mes['comboboxSettingparamsettingparam'], key: '5', children: []},
    };

    // 设备数据
    const [ deviceRow, setDeviceRow ] = useFetchState<DeviceTreeRows[]>([]);
    // 设备类型
    const [ deviceType, setDeviceType ] = useFetchState<string>('1');
    // 随抄任务数据
    const [ treeData, setTreeData ] = useFetchState<NodeProperty[]>([]);
    // 随抄选中数据
    const [ checkData, setCheckData ] = useFetchState<TableProcolData[]>([]);
    // 随抄选中Key值
    const [ checkKeyList, setCheckKeyList ] = useFetchState<Key[]>([]);
    // 随抄选中table中数据
    const [ tableData, setTableData ] = useFetchState<TableProcolData[]>([]);
    // table分页页码
    const [ current, setCurrent ] = useFetchState<number>(1);
    // table选中Key值为SN
    const [ taskSelectKeys, setTaskSelectKeys ] = useFetchState<Key[]>([]);
    // 弹窗日志table数据
    const [ taskLogList, setTaskLogList ] = useFetchState<TaskLogProperty[]>([]);
    // 是否显示弹窗
    const [ visible, setVisible ] = useFetchState<boolean>(false);
    const [ tableColunms, setTableColunms ] = useFetchState<ColumnsType<TableProcolData>>([]);
    const [ casOpt, setCasOpt ] = useFetchState<DataNode[]>([]);
    const [ casVal, setCasVal ] = useFetchState<CascaderValueType[]>([]);
    // 发送指令
    const execute = (keys: Key[] = taskSelectKeys) => {
        if (!keys.length) {
            return message.warning(Mes['messageAlarmSelectvalidrowselectvalidrow']);
        }
        const groupId = v4();

        onConfig.current.receiveMessNum = 0;
        onConfig.current.groupId.push(groupId);
        const obj = {
            name: 'otask',
            guid: groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
    };
    // 同步任务
    const syncScale = (record:TableProcolData) => {
        if (parseInt(record.FN, 10) === 3 || parseInt(record.FN, 10) === 4) {
            onConfig.current.funcType = '4';
            setTaskSelectKeys([ record.SN ]);
            execute([ record.SN ]);
        } else {
            message.warning(Mes['messageAlarmNosupportoperationnosupportoperation']);
        }
    };
    // 查看日志
    const lookLog = (record: TableProcolData) => {
        const list = onConfig.current.taskLogList[record.SN];

        setTaskLogList(list);
        setVisible(true);
    };

    const resultEvent = (row: TableProcolData) => {
        console.log('row-------', row);
        if (row) {
            if (row.RESULT_DATA_TYPE === '6' || row.RESULT_DATA_TYPE === '5') {
                message.info('打开弹窗');
            } else {
                if (row.COMMAND_NAME === 'Instantaneous Values Profile') {
                    // openPhaseDialog(row);
                    message.info('打开相位图');
                    return;
                }
                const arr = row.PARAM.split(',');

                history.push('/home/collectReport/loadProfileDataQuery', {
                    subSysNo,
                    endtime: arr[1] || '',
                    name: row.DEVICE_NO || '',
                    type: row.SN_METER_TYPE || '',
                    obis: row.COMMAND_SN || '',
                    queryType: 3,
                    deviceType: row.DEVICE_TYPE,
                    snTask: row.TASK_ID,
                });
            }
        } else {
            message.error(Mes['messageHintRowdataerrorrowdataerror']);
        }
    };

    const seeDeviceInfo = (id:string, nodeType:string) => {
        console.log('s----', id, nodeType);
        tRef.current?.openModel(nodeType === '1' ? 'dcu' : 'meter', id);
    };

    const viewParamEvent = (row: TableProcolData) => {
        console.log('r------', row);
    };

    // table列表th
    const colunms:ColumnsType<TableProcolData> = [
        {
            title: Mes['tableTitleSn'],
            dataIndex: 'SN',
            width: '60',
            ellipsis: true,
        },
        {
            title: Mes['titleTableTblzhuangtaitblzhuangtai'],
            dataIndex: 'STATUS',
            render (record: string) {
                let element: React.ReactNode | null = null;

                switch (record) {
                    case '0':
                        element = (
                            <>
                                <i className='fa fa-times-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>
                                <span style={{color: '#FC321E'}}>{ Mes['titleTableIsfailisfail'] }</span>
                            </>
                        );
                        break;
                    case '1':
                        element = (
                            <>
                                <i className='fa fa-check-circle' style={{verticalAlign: 'middle', color: '#f7ca01'}}></i>
                                <span style={{color: '#f7ca01'}}>{ Mes['titleTableSuccesssuccess'] }</span>
                            </>
                        );
                        break;
                    case '2':
                        element = (
                            <>
                                <i className='fa fa-play-circle' style={{verticalAlign: 'middle', color: '#0a74c9'}}></i>
                                <span style={{color: '#0a74c9'}} >{ Mes['titleTableTitleRead'] }</span>
                            </>
                        );
                        break;
                    case '3':
                        element = (
                            <>
                                <i className='fa fa-spinner fa-spin'></i>
                            </>
                        );
                        break;
                    case '4':
                        element = (
                            <>
                                <i className='fa fa-stop-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>
                                <span style={{color: '#FC321E'}}>{ Mes['comboboxStopstop'] }</span>
                            </>
                        );
                        break;
                    case '5':
                        element = (
                            <>
                                <i className='fa fa-clock-o' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>
                                <span style={{color: '#FC321E'}}>{ Mes['titleTableTimeouttimeout'] }</span>
                            </>
                        );
                        break;
                    case '6':
                        element = (
                            <>
                                <span style={{color: '#FC321E'}}>{ Mes['titleTableUnregisteredunregistered'] }</span>
                            </>
                        );
                        break;
                    default:
                        element = null;
                        break;
                }
                if (!element) {return '-';}
                return element;
            },
        },
        {
            title: Mes['titleTableResultresult'],
            dataIndex: 'RESULT',
            ellipsis: true,
            // eslint-disable-next-line complexity
            render (test: string, record: TableProcolData) {
                if (record.OUTPUT_PARAM_COUNT && record.RESULT) {
                    const count = parseInt(record.OUTPUT_PARAM_COUNT, 10);

                    if (count > 0) {
                        if (count > 1) {
                            return (
                                <a onClick={() => {resultEvent(record);}}>
                                    <i className='fa fa-pencil-square-o'></i>
                                </a>
                            );
                        } else {
                            if (record.RESULT_DATA_TYPE === '6' || record.RESULT_DATA_TYPE === '5') {
                                return (<a onClick={() => {resultEvent(record);}}>
                                    <i className='fa fa-pencil-square-o'></i>
                                </a>);
                            } else {
                                let strUnit = '';

                                if (record.STATUS !== '1' || !record.UNIT || record.UNIT === 'null' || !record.UNIT || record.UNIT === '0' || record.RESULT === 'Sync success!') {
                                    strUnit = '';
                                } else {
                                    strUnit = record.UNIT;
                                }
                                let strResult = '';

                                if (!record.RESULT || record.RESULT === 'null') {
                                    strResult = '';
                                } else {
                                    strResult = record.RESULT;
                                }
                                return (<span title={strResult}> {strResult + strUnit}</span>);
                            }
                        }
                    }
                    return '-';
                }
                return '-';
            },
        },
        {
            title: Mes['titleTableSyncscalesyncscale'],
            dataIndex: 'SYNC_SCALE',
            render (test:string, record: TableProcolData) {
                if (record.FN === '3' || record.FN === '4') {
                    return (<Button type='primary' onClick={() => syncScale(record)}>Sync</Button>);
                } else {
                    return '-';
                }
            },
        },
        {
            title: Mes['titleTableDevicenodeviceno'],
            dataIndex: 'DEVICE_NO',
            ellipsis: true,
            render (test: string, record: TableProcolData) {
                let color = '#f7ca01';

                if (record.DEVICE_TYPE === '0') {
                    color = '#0a74c9';
                }
                return (
                    <a onClick={() => {seeDeviceInfo(test, record.DEVICE_TYPE);}}>
                        <i className='fa fa-tachometer ' style={{color: color}}></i>{test}
                    </a>
                );
            },
        },
        {
            title: 'Command Name',
            dataIndex: 'COMMAND_NAME',
            width: '200',
            ellipsis: true,
            render (test: string) {
                return (<span title={test}>{ test}</span>);
            },
        },
        {
            title: '-',
            dataIndex: 'PARAMINPUT',
            ellipsis: true,
            render (test: string, record: TableProcolData) {
                if (record.INPUT_PARAM_COUNT) {
                    if (parseInt(record.INPUT_PARAM_COUNT, 10) > 0 && record.DATA_TYPE) {
                        return (
                            <a title='Parameter' onClick={() => {viewParamEvent(record);}}>
                                <i className='fa fa-pencil-square-o'></i>
                            </a>
                        );
                    }
                    return '-';
                }
                return '-';
            },
        },
        {
            title: 'Parameter',
            dataIndex: 'PARAM',
            ellipsis: true,
            render (test: string, record:TableProcolData) {
                let pstr = '-';

                if (parseInt(record.INPUT_PARAM_COUNT, 10) > 0) {
                    pstr = record.PARAM;
                }
                return (<span title={pstr}>{ pstr }</span>);
            },
        },
        {
            title: 'Create Time',
            dataIndex: 'CREATE_TIME',
            width: '120',
            ellipsis: true,
        },
        {
            title: 'Complete Time',
            dataIndex: 'COMPLETE_TIME',
            width: '120',
            ellipsis: true,
            render (test: string, record: TableProcolData) {
                if (record.STATUS === '2') {
                    return '-';
                }
                return record.COMPLETE_TIME;
            },
        },
        {
            title: 'Show Log',
            dataIndex: 'showLog',
            render (record: any) {
                return (<Button type='primary' onClick={() => lookLog(record)}>view</Button>);
            },
        },
    ];

    const columnsChange = (value: ColumnsType<TableProcolData>) => {
        console.log('-----2222');
        setTableColunms(value);
    };
        // 设置表头列展示下拉
    const setThHeaderCol = () => {
        let newCol = deepClone(colunms);

        if (newCol.length > 3) {
            newCol = newCol.map((v, i) => {
                if (i && i !== colunms.length - 2 && i !== colunms.length - 3) {
                    return v;
                }
            }).filter((v) => v) as ColumnsType<TableProcolData>;
        }
        setTableColunms(newCol);
        const list = newCol.map((v: any) => [ v.dataIndex ]);

        setCasVal(list);
        const casColList = colunms.map((v:any) => ({
            label: v.title,
            value: v.dataIndex || v.title,
        }));

        console.log('------', casColList);
        setCasOpt(casColList);
    };

    // 右边table按钮
    const btnList: BtnConfig[] = [
        {
            type: 'Start',
            btnType: 'primary',
            async onClick () {
                execute();
            },
        },
        {
            type: 'Restart',
            btnType: 'primary',
            async onClick () {
                onConfig.current.groupId = [];
                onConfig.current.readType = 1;
                execute();
            },
        },
        {
            type: 'Refresh',
            btnType: 'primary',
            title: 'Get results manually',
            async onClick () {
                try {
                    const strukList = tableData.filter((v) => taskSelectKeys.some((o) => v.SN === o));

                    const res = await amiFunc.onDemandReading.batchRefresh(JSON.stringify(strukList));

                    if (res.length) {
                        const cloneData: TableProcolData[] = deepClone(tableData);

                        for (const item of res) {
                            let id: string = '';

                            if (!item.param3) {
                                id = `${item.param4}${item.param2}`;
                            } else {
                                id = `${item.param4}${item.param3}`;
                            }
                            const itemTask = cloneData.find((v) => v.SN === id);

                            if (!itemTask) {return;}

                            if (item.flag) {
                                itemTask.RESULT = item.param1;
                                itemTask.STATUS = `${READ_STATUS.SUCCESS}`;
                                itemTask.COMPLETE_TIME = item.param5;
                            } else {
                                if (item.param1 === CONST_RESULT_TIMEOUT) {
                                    itemTask.RESULT = item.param6;
                                    itemTask.STATUS = `${READ_STATUS.TIMEOUT}`;
                                    itemTask.COMPLETE_TIME = item.param5;
                                } else if (parseInt(item.param1, 10) === READ_STATUS.READY) {
                                    itemTask.RESULT = '-';
                                    itemTask.STATUS = `${READ_STATUS.READY}`;
                                    itemTask.COMPLETE_TIME = '-';
                                } else if (parseInt(item.param1, 10) === READ_STATUS.READING) {
                                    itemTask.RESULT = '-';
                                    itemTask.STATUS = `${READ_STATUS.READING}`;
                                    itemTask.COMPLETE_TIME = '-';
                                } else {
                                    itemTask.RESULT = item.param6;
                                    itemTask.STATUS = `${READ_STATUS.FAILURE}`;
                                    itemTask.COMPLETE_TIME = item.param5;
                                }
                            }
                        }
                        setTableData(cloneData);
                    } else {
                        message.info(Mes['messageAlarmTaskcompletedtaskcompleted']);
                    }
                } catch (error:any) {
                    console.error(error.toString());
                    message.error(error.toString());
                }
            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            title: 'Clear results',
            async onClick () {
                try {
                    const strukList = tableData.filter((v) => taskSelectKeys.some((o) => v.SN === o));

                    if (strukList.length) {
                        const res = await amiFunc.onDemandReading.clearTaskStatus(JSON.stringify(strukList));

                        if (!res.flag) {
                            return message.error(res.mess);
                        }
                    }
                    onConfig.current.tableData = [];
                    onConfig.current.taskSelectKeys = [];
                    setCheckData([]);
                    setTaskSelectKeys([]);
                    setTableData([]);
                    setCurrent(1);
                    setCheckKeyList([]);
                    setTaskLogList([]);
                } catch (e: any) {
                    console.error(e.toString());
                    message.error(e.toString());
                }
            },
        },
        {
            type: 'Export',
            btnType: 'primary',
            async onClick () {
                const res = await amiFunc.onDemandReading.createReadeExcel(JSON.stringify(tableData));

                location.href = '/v1/random-read/export-random-read-excel?excelFileName=' + res.mess;
            },
        },
        {
            type: 'BatchSync',
            btnType: 'primary',
            async onClick () {
                onConfig.current.funcType = '4';
                // 获取选中数据
                const strukList = tableData.filter((v) => taskSelectKeys.some((o) => v.SN === o));
                // 获取能同步选中数据的key值
                const selectSyncTaskList = strukList.map((v) => {
                    if (parseInt(v.FN, 10) === 3 || parseInt(v.FN, 10) === 4) {
                        return v;
                    }
                }).filter((v) => v) as TableProcolData[];
                // 获取能同步选中数据的key值
                const selectSyncTaskKeyList = selectSyncTaskList.map((v) => v.SN).filter((v) => v) as Key[];

                setTaskSelectKeys(selectSyncTaskKeyList);
                execute(selectSyncTaskKeyList);
            },
        },
    ];
    // 获取任务列表
    const getProtocolData = async (query: Object = {}) => {
        let deviceNodeType = deviceRow[0]?.nodeType;
        let deviceId = deviceRow[0]?.deviceGuid;
        const params = {
            subsys: subSysNo,
            deviceType: deviceNodeType,
            deviceId: deviceId,
            obis: '',
            ...query,
        };
        const res = await amiFunc.onDemandReading.getProtocolList(params);
        const data = constructCommandData(res.list, typeNodeMap);

        setTreeData(data as NodeProperty[]);
    };
    // 根据obis搜索任务
    const searchObis = (val: string) => {
        getProtocolData({
            obis: val,
        });
    };
    // 重置任务列表
    const resetTask = () => {
        cRef.current?.clearCheckedKeys();
        cRef.current?.setSameTypeDevice('');
        setTreeData([]);
        setCheckKeyList([]);
    };
    // 设备类型选择
    const handleTypeChange = (val: string) => {
        setDeviceType(val);
        resetTask();
        cRef.current?.refreshTree();
    };
    // 设备选中
    const onNodeCheck = (row: any[]) => {
        const deviceList = [];

        if (row.length) {
            for (const item of row) {
                if (parseInt(deviceType, 10) === 2 && item.nodeType === '1') {
                    deviceList.push(item);
                }
                if (parseInt(deviceType, 10) === 1 && item.nodeType === '0') {
                    deviceList.push(item);
                }
            }
            setDeviceRow(deviceList);
            if (deviceList.length && !treeData.length) {
                getProtocolData({
                    deviceType: deviceList[0]?.nodeType,
                    deviceId: deviceList[0]?.deviceGuid,
                });
            } else {
                console.log('-as-s-s-s-');
            }
        } else {
            resetTask();
        }
    };

    // 随抄任务选中
    const onReadingCheck = (checkedKeysValue: {
        checked: Key[];
        halfChecked: Key[];
    } | Key[], info: { halfCheckedKeys?: Key[], checkedNodes: any[], node:any }) => {
        console.log('-------', checkKeyList);
        console.log('-------1', checkedKeysValue);
        const selKeysList = checkedKeysValue as Key[];

        if (!info.node.checked) { // 选择下发任务项

            setCheckKeyList(selKeysList);
            const cloneTaskTableData = deepClone(checkData);
            let taskList:TableProcolData[] = [];

            if (info.node.parentId) {
                const item = cloneTaskTableData.find((v) => v.COMMAND_SN === info.node.no);

                if (item) { // 如果已存在，不在添加
                    return;
                }
                const data = addTask(info.node, deviceRow, READ_STATUS.READY);

                taskList = [ ...data ];
            } else {
                const childList = info.node.children;
                const childTaskList:TableProcolData[][] = [];

                for (const item of childList) {
                    const row = cloneTaskTableData.find((v) => v.COMMAND_SN === item.no);

                    if (row) {continue;}
                    const data = addTask(item, deviceRow, READ_STATUS.READY);

                    childTaskList.push(data);
                }
                taskList = childTaskList.flat();
            }

            const newTaskTableData = [ ...cloneTaskTableData, ...taskList ];
            const keyList = taskList.map((v) => v.SN);
            const newKeyList = [ ...taskSelectKeys, ...keyList ];

            setTaskSelectKeys(newKeyList);
            onConfig.current.tableData = newTaskTableData;
            onConfig.current.taskSelectKeys = newKeyList;
            setCheckData(newTaskTableData);
            setTableData(newTaskTableData.slice(current - 1, 10));
        } else {
            const newSelKeys = selKeysList.filter((key) => key !== info.node.key);

            setCheckKeyList(newSelKeys);
        }
        console.log('-------2', checkData);
    };
    // 分页配置
    const pagetion = {
        total: checkData.length,
        onChange (page: number, pageSize: number | undefined = 10) {
            setCurrent(page);
            setTableData(checkData.slice((page - 1) * pageSize, page * pageSize));
        },
        current: current,
        pageSize: 10,
        showSizeChanger: false,
    };
    // table选中变化事件
    const tableOnChange = (selectedRowKeys: Key[]) => {
        onConfig.current.taskSelectKeys = selectedRowKeys;
        setTaskSelectKeys(selectedRowKeys);
    };
    // 关闭日志弹窗
    const handleCancel = () => {
        setVisible(false);
    };
    // 日志table数据展示
    const logColumns:ColumnsType<TaskLogProperty> = [
        {
            title: 'No.',
            dataIndex: 'index',
            width: 40,
            render (text:string, record:any, index:number) {
                return index + 1;
            },
        },
        {
            title: 'Task Id',
            dataIndex: 'taskid',
            width: 80,
            ellipsis: true,
        },
        {
            title: 'Create Time',
            dataIndex: 'etime',
            width: 80,
            ellipsis: true,
        },
        {
            title: 'Log Info',
            width: 240,
            dataIndex: 'result',
        },
    ];
    // 重新发送任务
    const resendcontrol = (wsguid: string) => {
        confirm({
            title: Mes['messageSuccessConfirmconfirm'],
            content: Mes['messageConfirmReexecutepromptreexecuteprompt'],
            async onOk () {
                try {
                    const { tableData: data, taskSelectKeys: keys } = onConfig.current;

                    const strukList = data.filter((v) => keys.some((o) => v.SN === o));
                    const params = {
                        strlist: JSON.stringify(strukList),
                        groupId: wsguid,
                        subSysNo: subSysNo,
                    };
                    const res = await amiFunc.onDemandReading.batchSendCommond(params);

                    if (parseInt(res.flag, 10)) {
                        onConfig.current.totalTaskNum = parseInt(res.mes2 || '0', 10);
                        const cloneData: TableProcolData[] = deepClone(onConfig.current.tableData);

                        for (const item of res.list) {
                            const itemTask = cloneData.find((v) => v.SN === item.sn);

                            if (!itemTask) {return;}
                            itemTask.STATUS = '3';
                            itemTask.TASK_ID = item.taskId;
                        }
                        setTableData(cloneData);

                    } else {
                        onConfig.current.totalTaskNum = 0;
                        onConfig.current.receiveMessNum = -10000;
                        onConfig.current.groupId = onConfig.current.groupId.filter((v) => v !== res.mes);
                        message.info(Mes['messageAlarmTaskcompletedtaskcompleted']);
                    }
                } catch (error: any) {
                    console.error(error.toString());
                    message.error(error.toString());
                }
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };
    // 发送任务
    const sendcontrol = async (wsguid: string) => {
        try {
            const { tableData: data, taskSelectKeys: keys } = onConfig.current;

            const strukList = data.filter((v) => keys.some((o) => v.SN === o));
            const res = await amiFunc.onDemandReading.sendProtocalByCst({
                strlist: JSON.stringify(strukList),
                groupId: wsguid,
                subSysNo: subSysNo,
                'func_type': onConfig.current.funcType,
            });

            onConfig.current.funcType = '0';
            const strArr = res.mes.split(';');
            const plist = res.list;

            if (parseInt(res.flag, 10)) {
                const cloneData:TableProcolData[] = deepClone(onConfig.current.tableData);

                for (const item of plist) {
                    const itemTask = cloneData.find((v) => v.SN === item.sn);

                    if (!itemTask) {return;}
                    itemTask.STATUS = item.status;
                    if (parseInt(item.status, 10) === READ_STATUS.READING) {
                        itemTask.TASK_ID = item.taskId;
                        itemTask.COMPLETE_TIME = item.createTime;
                    }
                }
                onConfig.current.tableData = cloneData;
                setTableData(cloneData);
            } else {
                onConfig.current.groupId = onConfig.current.groupId.filter((v) => v !== strArr[0]);
                onConfig.current.totalTaskNum = 0;
            }
        } catch (error:any) {
            console.error(error.toString());
            message.error(error.toString());
        }
    };

    // 刷新获取任务值
    const refreshItem = (taskId:string, result:string, isSuccess:string, completeTime:string) => {
        abnormalFn(async () => {
            const res = await amiFunc.onDemandReading.getResultValue({ taskId, result, isSuccess, completeTime });
            let id = '';

            if (!res.param3) {
                id = `${res.param4}${res.param2}`;
            } else {
                id = `${res.param4}${res.param3}`;
            }
            const { tableData: meterItemList } = onConfig.current;

            console.log('-------------', id);
            const row = meterItemList.find((v) => v.SN === id);

            if (row) {
                if (res.flag) {
                    row.RESULT = res.param1 || '';
                    row.STATUS = '1';
                    row.COMPLETE_TIME = res.param5 || '';
                } else {
                    if (result === 'Task time out') {
                        row.STATUS = '5';
                        row.COMPLETE_TIME = res.param5 || '';
                        row.RESULT = res.param6 || '';
                    } else {
                        row.STATUS = '0';
                        row.COMPLETE_TIME = res.param5 || '';
                        row.RESULT = res.param6 || '';
                    }
                }
                onConfig.current.tableData = meterItemList;
                setCheckData(meterItemList);
                setTableData(arrPaging(meterItemList, current, 10));
            }
        });
    };

    // 设备树展开子集
    const calladdNextNode = async (item: DeviceTreeRows) => await cRef.current?.getReadTreeChildNode(item) || null;
    // 接收websocket任务数据
    const OnDemand = (data: any) => {
        const groupId: string|undefined = onConfig.current.groupId.find((v) => v === data.guid);
        let { receiveMessNum, totalTaskNum } = onConfig.current;

        if (groupId) {
            receiveMessNum++;
            onConfig.current.receiveMessNum = receiveMessNum;
            if (receiveMessNum === 1 && data.name === 'otask-confirm') {
                if (!onConfig.current.readType) {
                    sendcontrol(data.guid);
                } else {
                    resendcontrol(data.guid);
                }
                onConfig.current.receiveMessNum = 0;
            } else if (receiveMessNum > 0) {
                if (typeof data.commandid === 'string' && data.commandid) {
                    let id: string = '';
                    const cloneData = deepClone(onConfig.current.tableData);

                    if (!data.meterid) {
                        id = `${data.commandid}${data.dcuid}`;
                    } else {
                        id = `${data.commandid}${data.meterid}`;
                    }
                    const item:TableProcolData| undefined = cloneData.find((v: TableProcolData) => v.SN === id);

                    if (!item) {return;}
                    item.RESULT = data.result;
                    item.COMPLETE_TIME = data.etime;
                    if (data.success) {
                        item.STATUS = `${READ_STATUS.SUCCESS}`;
                    } else {
                        if (data.result === CONST_RESULT_TIMEOUT) {
                            item.STATUS = `${READ_STATUS.TIMEOUT}`;
                        } else {
                            item.STATUS = `${READ_STATUS.FAILURE}`;
                        }
                    }
                    onConfig.current.tableData = cloneData;
                    setTableData(cloneData);
                    onConfig.current.groupId = onConfig.current.groupId.filter((v) => v !== groupId);
                } else {
                    refreshItem(data.taskid, data.result, data.success, data.etime);
                }
            }
            if (receiveMessNum === totalTaskNum) {
                totalTaskNum = 0;
                onConfig.current.groupId = onConfig.current.groupId.filter((v) => v !== data.guid);
            }
        }
    };
    // 接收websocket日志数据
    const OnDemandLog = (data: any) => {
        let id: string = '';

        if (data.taskid && data.commandid) {
            if (!data.meterid) {
                id = data.commandid + data.dcuid;
            } else {
                id = data.commandid + data.meterid;
            }
            if (!onConfig.current.taskLogList[id]) {
                onConfig.current.taskLogList[id] = [];
            }
            onConfig.current.taskLogList[id].push({
                sn: id,
                taskid: data.taskid,
                etime: data.etime,
                result: data.result,
            });
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
        setThHeaderCol();
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
            bus.removeAllListeners('otask-log');
        };
    }, []);

    return (
        <div className='OnDemand flex'>
            <DeviceTree
                cRef={cRef}
                isExpand={parseInt(deviceType, 10) === 1}
                checkbox={false}
                calladdNextNode={calladdNextNode}
                checkType={true} onNodeCheck={onNodeCheck} />
            <Row gutter={24} justify='center' align='top' className='cardBody'>
                <Col span={6}>
                    <div className='card'>
                        <Row gutter={24} className='top'>
                            <Col span={9}>
                                <Select value={deviceType} style={{ width: '100%' }} onChange={handleTypeChange}>
                                    <Option value='2'>DCU</Option>
                                    <Option value='1'>Meter</Option>
                                </Select>
                            </Col>
                            <Col span={3}>
                                <Button type='primary' icon={<ReloadOutlined />} onClick={resetTask} />
                            </Col>
                            <Col span={12}>
                                <Search placeholder='obis' onSearch={searchObis} enterButton />
                            </Col>
                        </Row>
                        <Row gutter={24} className='tree'>
                            <Col span={24}>
                                <Tree
                                    checkable
                                    onCheck={onReadingCheck}
                                    checkedKeys={checkKeyList}
                                    treeData={treeData}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={18}>
                    <div className='reading'>
                        <Row gutter={24} className='top'>
                            <Col span={6}>
                                <BtnList btnList={ btnList}/>
                            </Col>
                            <Col span={3}>
                                <ColumnsSelect<TableProcolData>
                                    columns={colunms}
                                    casOpt={casOpt}
                                    defaultCasVal={casVal}
                                    change={columnsChange} />
                            </Col>
                        </Row>
                        <Row gutter={24} className='table'>
                            <Col span={24}>
                                <Table
                                    columns={tableColunms}
                                    dataSource={tableData}
                                    pagination={false}
                                    rowSelection={{
                                        type: 'checkbox',
                                        selectedRowKeys: taskSelectKeys,
                                        onChange: tableOnChange,
                                        // selections: [
                                        //     Table.SELECTION_ALL,
                                        //     Table.SELECTION_NONE,
                                        // ],
                                    }}
                                    rowKey='SN'
                                />
                            </Col>
                        </Row>
                        <Row gutter={24} className='pagetion'>
                            <Col span={24}>
                                <Pagination {...pagetion} />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <TerminalInfo cRef={tRef} />
            <Modal
                title={Mes['titleTableLoginfologinfo']}
                visible={visible}
                width={600}
                onCancel={handleCancel}
                footer={[
                    <Button key='CLose' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                ]}
            >
                <Table
                    columns={logColumns}
                    dataSource={taskLogList}
                />
            </Modal>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(OnDemandRead);
