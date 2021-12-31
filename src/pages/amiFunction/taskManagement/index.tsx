// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import DeviceTree, { CRef, NodeTree } from 'src/components/business/deviceTree';
import { Table, Pagination, message, Row, Col, Button, Select, DatePicker, Modal, Cascader } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { MeterListActionList } from 'src/api/AmiFunction/taskMgnt/type.d';
import { ColumnsType } from 'antd/es/table';
import SearchList, { SRef } from 'src/components/business/searchList';
import { formatArrOptions, Options } from 'src/utils/function';
import { PauseCircleOutlined, SwapOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CascaderValueType, DataNode } from 'rc-cascader/es/interface';
import { DeviceTreeRows } from 'src/api/common/type';
import { Key } from 'antd/es/table/interface';
import moment, {Moment} from 'moment';
import './index.less';
import { dateFormat, deepClone } from 'src/utils/utils';
import { amiFunc } from 'src/api';
import { uniq } from 'lodash';
const { Option } = Select;

import {abnormalFn} from 'src/utils/function';

type Cadtion = {
    afn?: string;
    endDateTime: string;
    excuteStatus: string;
    excuteResult: string;
    operator: string;
    startDateTime: string;
    taskType: string;
    meterIds: string[];
    dcuIds: string[];
}

type Props = {
  Mes: LangMessage,
  subSysNo: string;
}

const TaskMgnt: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    const EXCUTESTATE = [
        {
            value: 'All',
            name: 'All',
        },
        {
            value: '0',
            name: 'Unexecuted',
        },
        {
            value: '1',
            name: 'Completed',
        },
        {
            value: '2',
            name: 'In execution',
        },
        {
            value: '3',
            name: 'Stop',
        },
    ];
    const EXCUTERESULT = [
        {
            value: '2',
            name: 'All',
        },
        {
            value: '1',
            name: 'Success',
        },
        {
            value: '0',
            name: 'Failure',
        },
    ];
    const PRIORITYOPT = [
        {
            value: '1',
            name: 'Primary',
        },
        {
            value: '4',
            name: 'Middle',
        },
        {
            value: '9',
            name: 'High',
        },
    ];
    const ROWS = 10;
    const FORMAT = 'YYYY-MM-DD HH:mm';
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const todayData = new Date(new Date().toLocaleDateString()).getTime();
    const todayStart = dateFormat(FORMAT, moment(todayData));
    const todayEnd = dateFormat(FORMAT, moment(todayData + 24 * 60 * 60 * 1000 - 1));
    const [ operateOpt, setOperateOpt ] = useFetchState<Options[]>([ { value: '0', name: 'All' } ]);
    const [ tableData, setTableData ] = useFetchState<MeterListActionList[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ taskSelectKeys, setTaskSelectKeys ] = useFetchState<Key[]>([]);
    const [ priority, setPriority ] = useFetchState<string>('1');
    const [ planDateTime, setPlanDateTime ] = useFetchState<Moment>(moment(new Date().getTime()));
    const [ tableCol, setTableCol ] = useFetchState<ColumnsType<MeterListActionList>>([]);
    const [ casVal, setCasVal ] = useFetchState<CascaderValueType[]>([]);
    const [ condition, setCondition ] = useFetchState<Cadtion>({
        endDateTime: '',
        excuteStatus: '',
        operator: '',
        startDateTime: '',
        taskType: '',
        excuteResult: '',
        dcuIds: [],
        meterIds: [],
    });
    const [ casOpt, setCasOpt ] = useFetchState<DataNode[]>([]);

    const columns: ColumnsType<MeterListActionList> = [
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableMeteraddrmeteraddr'],
            dataIndex: 'METER_ADDR',
        },
        {
            title: Mes['titleTableFnnamefnname'],
            dataIndex: 'AFN_NAME',
        },

        {
            title: Mes['titleTableCommandafncommandafn'],
            dataIndex: 'AFN',
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'IS_EXECUTED',
            render (val:string) {
                const item = EXCUTESTATE.find((v) => v.value === val);

                if (item) {
                    return item.name;
                } else {
                    return 'Unexecuted';
                }
            },
        },
        {
            title: Mes['titleTablePrioritypriority'],
            dataIndex: 'COMMAND_PRIORITY',
            render (val: string) {
                const item = PRIORITYOPT.find((v) => parseInt(v.value, 10) === parseInt(val, 10));

                if (item) {
                    return item.name;
                } else {
                    return 'Middle';
                }
            },
        },
        {
            title: Mes['titleTableResultresult'],
            dataIndex: 'RETURN_DATA',
            width: 200,
            ellipsis: true,
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'BUILD_DATE',
        },
        {
            title: Mes['titleTablePlanned_timeplanned_time'],
            dataIndex: 'Execute_date',
        },
        {
            title: Mes['titleTableCompletetimecompletetime'],
            dataIndex: 'COMPLETION_DATE',
        },
        {
            title: Mes['titleTableOperatoroperator'],
            dataIndex: 'OPERATOR_NAME',
        },
    ];

    const timeChange = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            startDateTimeValue: [ dateFormat(FORMAT, moment(dateStrings[0])), dateFormat(FORMAT, moment(dateStrings[1])) ],
        });
    };

    const searchColumns = [
        {
            name: 'taskType',
            col: 4,
            type: 'Select',
            options: [
                {
                    value: '1',
                    name: 'OnDemand Task',
                },
                {
                    value: '0',
                    name: 'Schedule Task',
                },
            ],
        },
        {
            name: 'excuteStatus',
            col: 3,
            type: 'Select',
            options: EXCUTESTATE,
        },
        {
            name: 'excuteResult',
            col: 2,
            type: 'Select',
            options: EXCUTERESULT,
        },
        {
            name: 'operator',
            col: 2,
            type: 'Select',
            options: operateOpt,
        },
        {
            name: 'startDateTimeValue',
            col: 7,
            type: 'DatePicker',
            attr: {
                showTime: { format: 'HH:mm' },
                format: FORMAT,
                defaultValue: [ moment(todayStart), moment(todayEnd) ],
                onChange: timeChange,
            },
        },
        {
            name: 'afn',
            col: 4,
            type: 'Input',
            attr: {
                placeholder: 'Command AFN',
            },
        },
    ];


    const getTableData = async (query:Cadtion = condition, { page = 1, rows = ROWS }) => {
        setLoading(true);
        try {
            let dcuIds = '';
            let meterIds = '';

            query.dcuIds.forEach((v) => dcuIds += `'${v}'`);
            query.meterIds.forEach((v) => meterIds += `'${v}'`);
            const res = await amiFunc.taskMgnt.getMeterList({
                page,
                rows,
                afn: query.afn || '',
                dcuIds: dcuIds || '',
                startDateTime: query.startDateTime,
                endDateTime: query.endDateTime,
                excuteStatus: query.excuteStatus === 'All' ? '' : query.excuteStatus,
                meterIds: query.meterIds.join(',') || '',
                operator: !parseInt(query.operator, 10) ? '' : query.operator,
                excuteResult: query.excuteResult,
                sortName: '',
                sortOrder: 'asc',
                taskType: query.taskType,
                subsysNo: subSysNo,
            });

            setTableData(res.rows);
            setTableTotal(res.total);
            setCurrent(page);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
        setLoading(false);
    };
    const onNodeCheck = (row: any[], node:NodeTree) => {
        console.log('a-----', row);
        const query = deepClone(condition);

        if (node.nodeType === '1') { // 选择集中器
            if (node.checked) {
                query.dcuIds = query.dcuIds.filter((v) => v !== node.key.toString());
            } else {
                query.dcuIds?.push(node.key.toString());
            }
        }
        if (node.nodeType === '0') {// 选择表计
            if (node.checked) {
                query.meterIds = query.meterIds.filter((v) => row.some((o:any) => v === o.deviceGuid));
            } else {
                query.meterIds = row.map((v: any) => v.deviceGuid);
            }
        }
        query.meterIds = uniq(query.meterIds);
        query.dcuIds = uniq(query.dcuIds);
        setCondition(query);
    };
        // 设备树展开子集
    const calladdNextNode = async (item: DeviceTreeRows) => await cRef.current?.addNextNodeByLoading(item) || null;

    const searchFinsh = (val:any) => {
        const query = deepClone(condition);

        query.startDateTime = val.startDateTimeValue[0];
        query.endDateTime = val.startDateTimeValue[1];
        query.afn = val.afn;
        query.excuteResult = val.excuteResult;
        query.excuteStatus = val.excuteStatus;
        query.operator = val.operator;
        query.taskType = val.taskType;
        setCondition(query);
        getTableData(query, {page: 1});
    };

    const tableOnChange = (val: Key[]) => {
        setTaskSelectKeys(val);
    };

    const priorityChange = (val: string) => {
        setPriority(val);
    };

    const planDateTimeChange = (val: Moment | null) => {
        setPlanDateTime(val as Moment);
    };

    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getTableData(condition, { page, rows: ROWS });
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    const getOperatorList = async () => {
        try {
            const res = await amiFunc.taskMgnt.getOperatorList({
                taskType: '1',
                excuteStatus: '0',
                excuteResult: '2',
                startDateTime: todayStart,
                endDateTime: todayEnd,
                dcuIds: '',
                meterIds: '',
            });
            const optList = formatArrOptions(res, 'value', 'text');

            optList.unshift({value: '0', name: 'All'});
            setOperateOpt(optList);
            sRef.current?.setFieldsValue({
                taskType: '1',
                excuteStatus: '0',
                excuteResult: '2',
                operator: '0',
                startDateTimeValue: [ todayStart, todayEnd ],
            });
            getTableData({
                startDateTime: todayStart,
                endDateTime: todayEnd,
                taskType: '1',
                excuteStatus: '0',
                excuteResult: '2',
                meterIds: [],
                dcuIds: [],
                afn: '',
                operator: '',
            }, {page: 1, rows: 10});
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 停止事件
    const stopTask = () => {
        abnormalFn(async () => {
            const res = await amiFunc.taskMgnt.stopTask({
                taskType: condition.taskType,
                taskIdList: JSON.stringify(taskSelectKeys),
            });

            if (res.flag) {
                if (res.mess && res.mess.indexOf(';') === -1) {
                    return message.error(res.mess);
                }
                message.success(Mes['messageAlarmStoptaskstoptask']);
                return getTableData(condition, {page: 1, rows: ROWS});
            }
            message.error(res.mess || '');
        });
    };

    // 优先级事件
    const changePriority = () => {
        abnormalFn(async () => {
            const res = await amiFunc.taskMgnt.changePriority({
                taskType: condition.taskType,
                taskIdList: JSON.stringify(taskSelectKeys),
                priorityValue: priority,
            });

            if (res.flag) {
                if (res.mess && res.mess.indexOf(';') === -1) {
                    return message.error(res.mess);
                }
                message.success(Mes['messageAlarmStoptaskstoptask']);
                return getTableData(condition, {page: 1, rows: ROWS});
            }
            message.error(res.mess || '');
        });
    };

    // 设置执行事件
    const setExucteTime = () => {
        abnormalFn(async () => {
            const res = await amiFunc.taskMgnt.setExucuteTime({
                taskType: condition.taskType,
                taskIdList: JSON.stringify(taskSelectKeys),
                planDateTime: dateFormat(FORMAT, planDateTime),
            });

            if (res.flag) {
                if (res.mess && res.mess.indexOf(';') === -1) {
                    return message.error(res.mess);
                }
                message.success(Mes['messageAlarmStoptaskstoptask']);
                return getTableData(condition, {page: 1, rows: ROWS});
            }
            message.error(res.mess || '');
        });
    };

    const handleTaskEvent = (type: string) => {
        // 获取选中数据
        const selctTableList = tableData.filter((v) => taskSelectKeys.some((o) => v.SN === o));
        // 是否有选中

        if (!selctTableList.length) {
            return message.warning(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
        }
        // 获取选中类型
        const selectTypeList = selctTableList.filter((v) => v.IS_EXECUTED === '1');

        if (selectTypeList.length) {
            return message.warning(Mes['messageAlarmNotselectcompletedtasksnotselectcompletedtasks']);
        }
        let msgObj:any = {};

        if (type === 'stop') {
            msgObj.content = Mes['messageAlarmOnlyworkstasksonlyworkstasks'];
            msgObj.fn = stopTask;
        }
        if (type === 'priority') {
            msgObj.content = Mes['messageAlarmChangeoperationchangeoperation'];
            msgObj.fn = changePriority;
        }
        if (type === 'excuteTime') {
            msgObj.content = Mes['messageAlarmSetoperationsetoperation'];
            msgObj.fn = setExucteTime;
        }
        Modal.confirm({
            title: Mes['messageSuccessConfirmconfirm'],
            icon: <ExclamationCircleOutlined />,
            content: msgObj.content,
            onOk () {
                msgObj.fn();
            },
        });
    };

    const casChange = (value:CascaderValueType[]) => {
        console.log(value);
        setLoading(true);
        const newColumns = columns.map((v:any) => {
            const item = value.find((o) => o[0] === v.dataIndex);

            if (item) {
                return v;
            }
        }).filter((v) => v);

        setCasVal(value);
        setTableCol(newColumns);
        setLoading(false);
    };

    // 设置表头列展示下拉
    const setThHeaderCol = () => {
        let newCol = columns;

        if (columns.length > 3) {
            newCol = columns.slice(0, columns.length - 3);
        }
        setTableCol(newCol);
        const list = newCol.map((v: any) => [ v.dataIndex ]);

        console.log('list=-==--', list);
        setCasVal(list);
        const casColList = columns.map((v:any) => ({
            label: v.title,
            value: v.dataIndex,
        }));

        setCasOpt(casColList);
    };

    useEffect(() => {
        getOperatorList();
        setThHeaderCol();
    }, []);

    return (
        <div className='taskMgnt'>
            <h4 className='title'>{Mes['menuTitleTaskManagement']}</h4>
            <div className='contentWrap'>
                <div className='wrapLeft'>
                    <DeviceTree
                        onNodeCheck={onNodeCheck}
                        isExpand={true}
                        checkbox={false}
                        cRef={cRef}
                        PAGESIZE={14}
                        calladdNextNode={calladdNextNode}
                    />
                </div>
                <div className='wrapRight'>
                    <div className='search top'>
                        <SearchList
                            cRef={sRef}
                            columns={searchColumns}
                            onFinish={searchFinsh}
                            isReset={false}
                            btnConfig={{col: 1}}
                        />
                    </div>
                    <div className='opterate top'>
                        <Row gutter={24}>
                            <Col span={1}>
                                <Button
                                    type='primary'
                                    icon={<PauseCircleOutlined />}
                                    title={Mes['comboboxStopstop']}
                                    onClick={() => handleTaskEvent('stop')} />
                            </Col>
                            <Col span={3}>
                                <Select value={priority} onChange={priorityChange}>
                                    {
                                        PRIORITYOPT.map((v) => (
                                            <Option value={v.value} key={v.value}>{ v.name }</Option>
                                        ))
                                    }
                                </Select>
                            </Col>
                            <Col span={1}>
                                <Button
                                    type='primary'
                                    icon={<SwapOutlined />}
                                    title={Mes['btnSetprioritysetpriority']}
                                    onClick={() => handleTaskEvent('priority')} />
                            </Col>
                            <Col span={4}>
                                <DatePicker showTime={{ format: 'HH:mm' }} format='YYYY-MM-DD HH:mm' value={planDateTime} onChange={planDateTimeChange} />
                            </Col>
                            <Col span={1}>
                                <Button
                                    type='primary'
                                    icon={<ClockCircleOutlined />}
                                    title={Mes['btnSettimesettime']}
                                    onClick={() => handleTaskEvent('excuteTime')} />
                            </Col>
                            <Col span={3}>
                                <Cascader
                                    multiple={true}
                                    options={casOpt}
                                    onChange={casChange}
                                    maxTagCount='responsive'
                                    value={casVal}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='table'>
                        <Table
                            columns={tableCol}
                            dataSource={tableData}
                            loading={loading}
                            rowKey='SN'
                            rowSelection={{
                                selectedRowKeys: taskSelectKeys,
                                onChange: tableOnChange,
                            }}
                            pagination={false} />
                    </div>
                    <div className='page'>
                        <Pagination {...pagination} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(TaskMgnt);
