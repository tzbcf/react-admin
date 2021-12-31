// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect, Key } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs, Row, Col, Table, Pagination, message, Input } from 'antd';
import SearchList, { SRef } from 'src/components/business/searchList';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import { ColumnsType } from 'antd/es/table';
import { abnormalFn } from 'src/utils/function';
import { basicData, amiFunc } from 'src/api';
import { MeterlistParams, TaskByMeterTypeData, MeterListData } from 'src/api/AmiFunction/abnormalMgnt/type.d';
import moment, { Moment } from 'moment';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import {
    resCastOption,
    OptGroupList,
    CascaderData,
    nodeDataFormatCascader,
    Options,
    formatArrOptions,
} from 'src/utils/function';
import { dateFormat, arrPaging } from 'src/utils/utils';
import TaskCom, { TaskRef } from 'src/components/business/taskCom';
import { TaskGroupModuleData, TaskListRows } from 'src/api/AmiFunction/connectAndDisConnect/type';
const { TabPane } = Tabs;
const { Search } = Input;

const formatMeterOpt = (data: TaskByMeterTypeData[]) => {
    const obj = {};

    data.forEach((item:TaskByMeterTypeData) => {
        if (!obj[item['AFN_TYPE']]) {
            obj[item['AFN_TYPE']] = {
                label: item['AFN_TYPE'],
                value: item['COMMAND_TYPE'],
                children: [],
            };
        }
        obj[item['AFN_TYPE']].children.push({
            value: `${item.AFN},${item.COMMAND_TYPE}`,
            name: `${item.AFN_NAME}(${item.AFN})`,
        });
    });
    return Object.keys(obj).map((key:string) => obj[key]);
};

type CacheData = {
    groupId: string;
    taskTableData: TaskListRows[];
    totalTaskNum: number;
    receiveMessNum: number;
    meterList: MeterListData[];
    meterListKey: Key[];
}

type PageSizeType = {
    page: number;
    rows: number;
}
type Props = {
    Mes: LangMessage;
    subSysNo: string;
    nodeNo: string;
}
const AbnormalMgnt: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;
    const ROWS = 10;
    // 状态配置
    const INITSTATUS = [
        {
            value: '2',
            name: 'All',
        },
        {
            value: '1',
            name: 'Normal',
        },
        {
            value: '0',
            name: 'Abnormal',
        },
        {
            value: '3',
            name: 'Extra',
        },
    ];
    // 表计查询还是集中器地址查询
    const INITFIELDS = [
        {
            value: 'METER_NO',
            name: 'Meter No',
        },
        {
            value: 'CST_ADDR',
            name: 'DCU Address',
        },
    ];
    // 异常管理默认参数
    const SEARCHFIELDS = {
        afn: '',
        date: '',
        dstId: '',
        fieldValue: '',
        searchField: '',
        stationId: '',
        status: '',
        commandType: '',
        subsysNo: subSysNo,
    };
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    // 搜索
    const sRef = useRef<SRef>();
    const cacheData = useRef<CacheData>({
        groupId: '',
        taskTableData: [],
        receiveMessNum: 0,
        totalTaskNum: 0,
        meterList: [],
        meterListKey: [],
    });
    // 结果页左边列表
    const taskRef = useRef<TaskRef<TaskGroupModuleData>>();
    // tab页面切换
    const [ activeKey, setActiveKey ] = useFetchState<string>('1');
    // 系统地区联动下拉配置
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    // 线路下拉配置
    const [ lineOpt, setLineOpt ] = useFetchState<OptGroupList[]>([]);
    // 集中器类型选择
    const [ dcuTypeList, setDcuTypeList ] = useFetchState<Options[]>([]);
    // 数据类型
    const [ afnOpt, setAfnOpt ] = useFetchState<OptGroupList[]>([]);
    // 异常管理table数据
    const [ abormalTableData, setAbormalTableData ] = useFetchState<MeterListData[]>([]);
    // 异常管理所有表计数据
    const [ abormalMeterList, setAbormalMeterList ] = useFetchState<MeterListData[]>([]);
    // 异常管理table总数
    const [ abormalTableTotal, setAbormalTableTotal ] = useFetchState<number>(0);
    // 异常管理table的loading
    const [ abormalTableLoading, setAbormalTableLoading ] = useFetchState<boolean>(false);
    // 异常管理table当前分页
    const [ abormalCurrent, setAbormalCurrent ] = useFetchState<number>(1);
    // 异常管理table选择key
    const [ abormalSelectKeys, setAbormalSelectKeys ] = useFetchState<Key[]>([]);
    // 异常管理搜索条件
    const [ searchFields, setSearchFields ] = useFetchState<MeterlistParams>(SEARCHFIELDS);
    // 结果页点击某行数据
    const [ taskRow, setTaskRow ] = useFetchState<TaskGroupModuleData | null>(null);
    // 结果页右边Table总数
    const [ taskTotal, setTaskTotal ] = useFetchState<number>(0);
    // 结果页右边Table当前页
    const [ taskCurrent, setTaskCurrent ] = useFetchState<number>(1);
    // 结果页右边table数据
    const [ taskTableData, setTaskTableData ] = useFetchState<TaskListRows[]>([]);
    const [ taskLoading, setTaskLoading ] = useFetchState<boolean>(false);
    // 结果页表计号搜索
    const [ meterNO, setMeterNO ] = useFetchState<string>('');
    // 结果页右边table选中值
    const [ taskSelectKeys, setTaskSelectKeys ] = useFetchState<Key[]>([]);

    // 异常管理table获取数据
    const getAbormalTableData = (query: MeterlistParams) => {
        console.log(query);
        setAbormalTableLoading(true);
        abnormalFn(async () => {
            const res = await amiFunc.abnormalMgnt.getMeterList({
                ...searchFields,
                ...query,
            });

            cacheData.current.meterList = res;
            setAbormalMeterList(res);
            setAbormalTableTotal(res.length);
            setAbormalTableData(arrPaging(res, abormalCurrent, ROWS));
            setAbormalTableLoading(false);
        });
    };

    // node节点发生变化时，dstId下拉需要发生变化
    const nodeChange = (val: string[]) => {
        abnormalFn(async () => {
            sRef.current?.setFieldsValue({
                dstId: '',
            });
            const res = await basicData.transformMgt.getDstList({
                subSysNo,
                nodeNo: val[val.length - 1],
                sectionId: '',
            });

            setLineOpt(resCastOption(res));
        });
    };

    // 线路节点发生变化时
    const dstChange = (val: string) => {
        abnormalFn(async () => {
            sRef.current?.setFieldsValue({
                dcuType: '',
            });
            const res = await amiFunc.abnormalMgnt.getMeterTypeList(val);

            sRef.current?.setFieldsValue({
                dcuType: res[0].CST_TYPE,
            });
            setDcuTypeList(formatArrOptions(res, 'CST_TYPE', 'CST_TYPE_NAME'));
        });
    };

    // 集中器类型选择变化
    const dcuTypeChange = (val: string) => {
        abnormalFn(async () => {
            sRef.current?.setFieldsValue({
                afn: '',
            });
            const res = await amiFunc.abnormalMgnt.getTaskByMeterType(val);

            if (res && res.length) {
                sRef.current?.setFieldsValue({
                    afn: `${res[0].AFN},${res[0].COMMAND_TYPE}`,
                });

                setAfnOpt(formatMeterOpt(res));
            }
        });
    };

    // 异常管理时间变化
    const dateChange = (val: Moment|null) => {
        sRef.current?.setFieldsValue({
            date: dateFormat('YYYY-MM-DD', moment(val)),
        });
    };

    // 异常管理搜索设置
    const searchColumns = [
        {
            name: 'stationId',
            col: 4,
            type: 'Cascader',
            attr: {
                options: CascaderOpt,
                changeOnSelect: true,
                onChange: nodeChange,
            },
        },
        {
            name: 'dstId',
            col: 4,
            type: 'SelectGroup',
            options: lineOpt,
            attr: {
                onChange: dstChange,
            },
        },
        {
            name: 'dcuType',
            col: 4,
            type: 'Select',
            options: dcuTypeList,
            attr: {
                onChange: dcuTypeChange,
            },
        },
        {
            name: 'afn',
            col: 4,
            type: 'SelectGroup',
            options: afnOpt,
        },
        {
            name: 'date',
            col: 4,
            type: 'TimePicker',
            attr: {
                showTime: false,
                defaultValue: moment(new Date().getTime() - 24 * 60 * 60 * 1000),
                onChange: dateChange,
            },
        },
        {
            name: 'status',
            col: 4,
            type: 'Select',
            options: INITSTATUS,
        },
        {
            name: 'searchField',
            col: 4,
            type: 'Select',
            options: INITFIELDS,
        },
        {
            name: 'fieldValue',
            col: 4,
            type: 'Input',
        },
    ];

    // 搜索事件
    const searchFinsh = (val: any) => {
        console.log(val);
        if (!val.fieldValue) {
            message.warning(Mes['messageHintMeternoordcuaddressemptymeternoordcuaddressempty']);
        }
        const initVal = {
            ...searchFields,
            afn: val.afn?.split(',')[0],
            date: val.date,
            dstId: val.dstId,
            fieldValue: val.fieldValue,
            searchField: val.searchField,
            stationId: val.stationId[val.stationId.length - 1],
            commandType: val.afn?.split(',')[1],
            status: val.status,
        };

        getAbormalTableData(initVal);
        setSearchFields(initVal);
    };

    // 异常管理搜索后面的按钮事件
    const abormalBtnList: BtnConfig[] = [
        {
            type: 'Redo',
            btnType: 'primary',
            title: Mes['titleTableReaddatareaddata'],
            async onClick () { // 添加
                cacheData.current.groupId = v4();
                cacheData.current.receiveMessNum = 0;
                cacheData.current.totalTaskNum = 0;
                const obj = {
                    name: 'otask',
                    guid: cacheData.current.groupId,
                    result: '',
                };

                bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
            },
        },
    ];

    // 异常管理Table表头
    const abormalColumns: ColumnsType<MeterListData> = [
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
            title: Mes['titleTableCeliangdianhaoceliangdianhao'],
            dataIndex: 'CHECK_POINT_NUM',
        },
        {
            title: Mes['titleTableFrozenvaluefrozenvalue'],
            dataIndex: 'FREEZEN_VALUE',
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'DSTATUS',
            render (val: string) {
                let html: React.ReactNode | null = null;

                switch (parseInt(val, 10)) {
                    case 1:
                        html = (
                            <span>
                                <i className='fa fa-check-circle-o'></i> {Mes['titleTableNormalnormal']}
                            </span>
                        );
                        break;
                    case 0:
                        html = (
                            <span style={{ color: 'red' }}>
                                <i style={{ color: 'red' }} className='fa fa-times-circle-o'></i>{Mes['titleTableAbnormalabnormal']}
                            </span>
                        );
                        break;
                    case 3:
                        html = (
                            <span style={{ color: 'red' }}>
                                <i className='fa fa-warning'></i>{Mes['titleTableExtraextra']}
                            </span>
                        );
                        break;
                    case 4:
                        html = (
                            <span>
                                <i className='fa fa-stop-circle-o'></i>{Mes['titleTableStoppedstopped']}
                            </span>
                        );
                        break;
                    case 7:
                        html = (
                            <span>
                                <i className='fa fa-warning'></i>{Mes['titleTableTimeouttimeout']}
                            </span>
                        );
                        break;
                    default:
                        html = (
                            <span>
                                <i className='fa fa-check-circle-o'></i>{Mes['titleTableNormalnormal']}
                            </span>
                        );
                        break;
                }
                return html;
            },
        },
        {
            title: Mes['titleLabelAfnnameafnname'],
            dataIndex: 'AFN_NAME',
        },
    ];

    // 异常管理table行选择
    const abormalTableOnChange = (selectedRowKeys: Key[]) => {
        cacheData.current.meterListKey = selectedRowKeys;
        setAbormalSelectKeys(selectedRowKeys);
    };

    // 异常管理控制分页
    const abormalPagination = {
        total: abormalTableTotal,
        onChange (page: number) {
            setAbormalTableData(arrPaging(abormalMeterList, page, ROWS));
            setAbormalCurrent(page);
        },
        current: abormalCurrent,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    // 异常管理获取配置
    const getAbormalConfigInit = () => {
        abnormalFn(async () => {
            const res = await Promise.all([
                basicData.transformMgt.getDstList({
                    subSysNo,
                    nodeNo,
                    sectionId: '',
                }),
                amiFunc.abnormalMgnt.getNodeByLoginUser(subSysNo),
                amiFunc.abnormalMgnt.getMeterTypeList(),
            ]);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(res[1], nodeTree);

            setCascaderOpt(nodeTree);
            setLineOpt(resCastOption(res[0]));
            console.log('-e-3-----', res[2]);

            setDcuTypeList(formatArrOptions(res[2], 'CST_TYPE', 'CST_TYPE_NAME'));
            dstChange(res[2][0].CST_TYPE);
            const initValue = {
                stationId: [ res[1][0].ID ],
                dstId: res[0][0]?.ID,
                dcuType: res[2][0].CST_TYPE,
                date: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                status: '2',
                searchField: 'METER_NO',
            };

            setSearchFields({
                ...SEARCHFIELDS,
                ...{
                    date: dateFormat('YYYY-MM-DD'),
                    status: '2',
                    searchField: 'METER_NO',
                    stationId: res[1][0].ID,
                },
            });
            sRef.current?.setFieldsValue(initValue);
        });
    };

    // 结果页获取数据
    const getTaskList = async (val: any, pages: PageSizeType = INITPAGE) => {
        setTaskLoading(true);
        console.log('----', val);
        try {
            const res = await amiFunc.remoteControl.getTaskListGroup({
                ...pages,
                sortOrder: 'asc',
                sortName: '',
                parameters: '',
                groupId: val.GROUP_ID || taskRow?.GROUP_ID,
                meterNo: typeof val.meterNo !== undefined ? val.meterNo : meterNO,
            });

            cacheData.current.taskTableData = res.rows;
            setTaskTableData(res.rows);
            setTaskTotal(res.total);
            setTaskCurrent(pages.page);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
        setTaskLoading(false);
    };

    // 结果页左边列表点击事件
    const taskClick = (row: any) => {
        console.log('selectedRowKeys-----', row);
        setTaskRow(row);
        getTaskList(row);
    };

    // 结果页table配置
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
    ];

    // 分页配置
    const taskPagetion = {
        total: taskTotal,
        onChange (page: number) {
            console.log('-', page);
            setTaskTotal(0);
            setTaskCurrent(1);
        },
        current: taskCurrent,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 结果页表计号搜索
    const onTaskMeterNoSearch = (val: string) => {
        console.log(val);
        setMeterNO(val);
        getTaskList({
            meterNo: val,
        });
    };

    // 结果页同步事件
    const taskBtnList: BtnConfig[] = [
        {
            type: 'Refresh',
            btnType: 'primary',
            title: Mes['btnReexecutereexecute'],
            async onClick () {
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
                    getTaskList({});
                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }


            },
        },
    ];

    // 结果页右边Table选中事件
    const taskTableChange = (selectedRowKeys: Key[]) => {
        setTaskSelectKeys(selectedRowKeys);
    };

    // 结果页左边列表每项标题设置
    const groupTaskFormatTitle = (val: any): string => `${val['GROUP_NAME']}`;

    // 结果页左边列表数据获取
    const getLeftTreeData = async (val: any) => {
        console.log(val);
        try {
            const res = await amiFunc.remoteControl.getTaskGroupByRemark({
                taskType: 'abnormal',
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
            message.error(`${error}`);
        }
    };

    // tab切换
    const handleTabsChange = (val: string) => {
        setActiveKey(val);
        if (val === '2' && !taskTableData.length) {
            getLeftTreeData({
                startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                endTime: dateFormat('YYYY-MM-DD'),
            });
        }
    };

    useEffect(() => {
        getAbormalConfigInit();
    }, []);

    const supplementaryData = () => {
        setAbormalSelectKeys([]);
        const { meterList, meterListKey } = cacheData.current;
        const newMeterListKey: Key[] = [];
        const selectMetertList: MeterListData[] = [];

        for (const key of meterListKey) {
            const item = meterList.find((v) => v.KEY === key);

            if (item && item.DSTATUS === '0') {
                newMeterListKey.push(key);
                selectMetertList.push(item);
            }
        }
        setAbormalSelectKeys(newMeterListKey);
        if (!newMeterListKey.length) {
            return message.warning(Mes['messageAlarmSelectrowselectrow']);
        }
        abnormalFn(async () => {
            const res = await amiFunc.abnormalMgnt.supplementaryData({
                subsysNo: subSysNo,
                meters: JSON.stringify(selectMetertList),
                groupId: cacheData.current.groupId,
            });

            if (res.flag === '1') {
                cacheData.current.totalTaskNum = parseInt(res.result, 10) || 0;
                setActiveKey('2');
                getLeftTreeData({
                    startTime: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                    endTime: dateFormat('YYYY-MM-DD'),
                });
            } else {
                message.error(Mes['messageErrorOperfailedoperfailed']);
            }
        });
    };

    // webscoket接收信息
    const OnDemand = (row: any) => {
        if (row.guid && row.guid === cacheData.current.groupId) {
            cacheData.current.receiveMessNum++;
            if (cacheData.current.receiveMessNum === 1) {
                console.log('-----1');
                supplementaryData();
            }
            if (cacheData.current.receiveMessNum > 1) {
                console.log('-----2');
            }
            if (cacheData.current.totalTaskNum === cacheData.current.receiveMessNum - 1) {
                console.log('-----3');
                cacheData.current.totalTaskNum = 0;
                cacheData.current.groupId = '';
            }
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
        return () => {
            // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
        };
    }, []);

    return (
        <div className='contnectControl tabWrap'>
            <Tabs activeKey={activeKey} onChange={handleTabsChange}>
                <TabPane tab={Mes['menuTitleAbnormalManagement']} key='1'>
                    <div className='abormalControl tablePage'>
                        <SearchList
                            cRef={sRef}
                            columns={searchColumns}
                            onFinish={searchFinsh}
                            isReset={false}
                            btnConfig={{ col: 3, btnList: abormalBtnList }} />
                        <div className='table'>
                            <Table
                                columns={abormalColumns}
                                dataSource={abormalTableData}
                                pagination={false}
                                loading={abormalTableLoading}
                                rowSelection={{
                                    selectedRowKeys: abormalSelectKeys,
                                    onChange: abormalTableOnChange,
                                }}
                                rowKey='KEY'
                            />
                        </div>
                        <div className='page'>
                            <Pagination {...abormalPagination} />
                        </div>
                    </div>
                </TabPane>
                <TabPane tab={Mes['titleLabelIdqueryresultidqueryresult']} key='2'>
                    <div className='queryTaskResult contentWrap'>
                        <div className='wrapLeft'>
                            <TaskCom onChick={taskClick} showInput={false} title='Group Name' taskRef={taskRef} groupTaskFormatTitle={groupTaskFormatTitle} getList={getLeftTreeData} />
                        </div>
                        <div className='wrapRight'>
                            <Row gutter={24} className='top'>
                                <Col span={4}>
                                    <Search placeholder='Meter No' onSearch={onTaskMeterNoSearch} enterButton />
                                </Col>
                                <Col>
                                    <BtnList btnList={taskBtnList} />
                                </Col>
                            </Row>
                            <Row gutter={24} className='table'>
                                <Col span={24}>
                                    <Table
                                        columns={taskColumns}
                                        dataSource={taskTableData}
                                        loading={taskLoading}
                                        rowSelection={{
                                            selectedRowKeys: taskSelectKeys,
                                            onChange: taskTableChange,
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
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(AbnormalMgnt);
