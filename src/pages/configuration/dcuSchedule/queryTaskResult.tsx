// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col, Modal, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { configuration } from 'src/api';
import { CstData, CstList, LoadedTaskData, LoadedTaskList, ReadResult, MeterData } from 'src/api/configuration/dcuSchedule/types';
import { BtnConfig } from 'src/components/common/btnList';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type WebSocketData = {
    receiveMessNum: number;
    totalTaskNum: number;
    groupId: string;
    cstId: string;
}


const QueryTaskResultTab: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const ROWS = 10;
    const [ cstTotal, setCstTotal ] = useFetchState<number>(0);
    const [ cstCurrent, setCstCurrent ] = useFetchState<number>(0);
    const [ cstLoading, setCstLoading ] = useFetchState<boolean>(false);
    const [ cstList, setCstList ] = useFetchState<CstData[]>([]);
    const [ selectedCstKeys, setSelectedCstKeys ] = useFetchState<any[]>([]);
    // const [ taskTotal, setTaskTotal ] = useFetchState<number>(0);
    // const [ taskCurrent, setTaskCurrent ] = useFetchState<number>(0);
    const [ taskLoading, setTaskLoading ] = useFetchState<boolean>(false);
    const [ readLoading, setReadLoading ] = useFetchState<boolean>(false);
    const [ taskList, setTaskList ] = useFetchState<LoadedTaskData[]>([]);
    const [ readResultList, setReadResultList ] = useFetchState<ReadResult[]>([]);
    const [ expandTableData, setExpandTableData ] = useFetchState<any[]>([]);

    const onConfig = useRef<WebSocketData>({
        receiveMessNum: 0,
        totalTaskNum: 0,
        groupId: '',
        cstId: '',
    });

    const getReadResultList = (cstId:string, taskId:string) => {
        setReadLoading(true);
        configuration.dcuScheduleMgt.getReadResult(cstId, taskId).then((res) => {
            setReadResultList(res);
            setReadLoading(false);
            hideLoading();
        })
            .catch((err) => {
                message.error(err);
                setReadLoading(false);
                hideLoading();
            });
    };

    const readDcuTask = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageAlarmReadtaskrulereadtaskrule'],
            async onOk () {
                showLoading();
                let params = {
                    subSysNo: subSysNo,
                    cstId: onConfig.current.cstId,
                    groupId: onConfig.current.groupId,
                };

                configuration.dcuScheduleMgt.readDcuTaskRule(params).then(() => {
                    // message.success(Mes['titleTableSuccesssuccess']);
                })
                    .catch(() => {
                        message.error(Mes['messageErrorReadcommandfailedreadcommandfailed']);
                    });
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const startSend = (record:CstData) => {
        // showLoading();
        onConfig.current.groupId = v4();
        onConfig.current.receiveMessNum = 0;
        onConfig.current.totalTaskNum = 1;
        onConfig.current.cstId = record.CST_ID;
        const obj = {
            name: 'otask',
            guid: onConfig.current.groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
    };

    // webSocket消息回调函数
    const OnDemand = (data: any) => {
        let wsguid = data.guid;
        let name = data.name;
        let taskId = data.taskid;
        // let result = data.result;
        // let isSuccess = data.success;

        console.log('webSocket收到消息', data);

        if (wsguid === onConfig.current.groupId) {
            onConfig.current.receiveMessNum++;
            if (onConfig.current.receiveMessNum === 1 && name === 'otask-confirm') {
                readDcuTask();
            } else if (onConfig.current.receiveMessNum > 1) {
                if (taskId) {
                    getReadResultList(onConfig.current.cstId, taskId);
                }

            }

        }
    };

    const searchColumns = [
        {
            name: 'existFailTask',
            type: 'Select',
            col: 4,
            options: [ {name: 'All', value: 'All'}, {name: 'Success', value: '1'}, {name: 'Failure', value: '0'} ],
            attr: {
                style: { width: '100%' },
            },
        },
        {
            name: 'searchField',
            type: 'Select',
            col: 4,
            options: [ {name: 'DCU Address', value: 'CST_ADDR'}, {name: 'DCU No', value: 'CST_No'} ],
            attr: {
                style: { width: '100%' },
            },
        },
        {
            name: 'fieldValue',
            type: 'Input',
            col: 4,
            attr: {
                style: { width: '100%' },
            },
        },
    ];

    const getTimeString = (inputTime:number) => {
        let date = new Date(inputTime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let ms = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        let ds = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        let hs = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let minutes = minute < 10 ? ('0' + minute) : minute;
        let seconds = second < 10 ? ('0' + second) : second;

        return y + '-' + ms + '-' + ds + ' ' + hs + ':' + minutes + ':' + seconds;

    };

    const cstColumns = [
        {
            dataIndex: 'CST_NO',
            title: Mes['titleTableDcunodcuno'],
        },
        {
            dataIndex: 'CST_ADDR',
            title: Mes['titleTableDcuaddrdcuaddr'],
        },
        {
            dataIndex: 'CST_TYPE_NAME',
            title: Mes['titleTableDcutypedcutype'],
        },
        {
            dataIndex: 'LOADED_STATUS',
            title: Mes['titleTableLoadstatusloadstatus'],
        },
        {
            dataIndex: 'LOADED_TIME',
            title: Mes['titleTableLoadtimeloadtime'],
            render (_: any, record: CstData) {
                return (
                    <>
                        <span>{ getTimeString(record.LOADED_TIME)}</span>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableOperationoperation'],
            render (_: any, record: CstData) {
                return (
                    <>
                        <a onClick={(e: any) => {
                            e.stopPropagation();// 阻止点击事件向上冒泡
                            startSend(record);
                        }}>Read</a>
                    </>
                );
            },
        },
        {
            dataIndex: 'DB_DOT',
            title: Mes['titleTableTblcaozuoyuantblcaozuoyuan'],
        },
        {
            dataIndex: 'RETURN_DATA',
            title: Mes['titleTableMessagemessage'],
        },
    ];

    const taskColumns = [
        {
            dataIndex: 'AFN',
            title: Mes['titleTableAfnafn'],
        },
        {
            dataIndex: 'AFN_NAME',
            title: Mes['titleTableAfnnameafnname'],
        },
        {
            dataIndex: 'READ_MODE',
            title: Mes['titleLabelReadmodereadmode'],
        },
        {
            dataIndex: 'EXTRA_PARAMETERS',
            title: Mes['titleTableParametersparameters'],
        },
        {
            dataIndex: 'CLASSICAL_DETAIL_NAME',
            title: Mes['titleTableSpecialgroupnamespecialgroupname'],
        },
    ];

    const resultColumns = [
        {
            dataIndex: 'AFN',
            title: Mes['titleTableAfnafn'],
        },
        {
            dataIndex: 'READ_MODE',
            title: Mes['titleLabelReadmodereadmode'],
        },
        {
            dataIndex: 'EXTRA_PARAMETERS',
            title: Mes['titleTableParametersparameters'],
        },
    ];

    const getCstList = (page: number = 1) => {
        setCstLoading(true);
        sRef.current?.getFormData().then((data) => {
            configuration.dcuScheduleMgt.getCstList(page, ROWS, data.searchField, data.fieldValue, data.existFailTask, subSysNo).then((res:CstList) => {
                setCstTotal(res.total);
                setCstList(res.rows);
                setCstLoading(false);
                setCstCurrent(page);
            })
                .catch((err) => {
                    setCstLoading(false);
                    message.error(err);
                });
        });
    };

    const getTaskList = (page: number = 1, cstId:string, cstType:string) => {

        setTaskLoading(true);
        configuration.dcuScheduleMgt.getLoadedTaskList(page, ROWS, cstType, cstId).then((res: LoadedTaskList) => {
            // setTaskTotal(res.total);
            setTaskLoading(false);
            // setTaskCurrent(page);
            setTaskList(res.rows);
        })
            .catch((err) => {
                setTaskLoading(false);
                message.error(err);
            });

    };

    const search = (data: any) => {
        console.log('a-----', data);
        getCstList();
    };

    const pagination = {
        total: cstTotal,
        onChange (page: number) {
            getCstList(page);
        },
        current: cstCurrent,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // const taskPagination = {
    //     total: taskTotal,
    //     onChange (page: number) {
    //         getTaskList(page);
    //     },
    //     current: taskCurrent,
    //     hideOnSinglePage: true,
    //     pageSize: ROWS,
    //     showSizeChanger: false,
    // };

    // table行选择设置
    const cstRowSelection = {
        selectedRowKeys: selectedCstKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: CstData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedCstKeys(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
                getTaskList(1, selectedRows[selectedRows.length - 1].CST_ID, selectedRows[selectedRows.length - 1].CST_TYPE);
                //     selectedRows.forEach((v:CstData) => {
                //         meterNos.push(v.METER_NO);
                //         meterIds.push(v.METER_GUID_NO);
                //     });
            } else {
                setTaskList([]);
            }
        },
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Restart',
            btnType: 'primary',
            title: Mes['btnBtnresendbtnresend'],
            onClick () {
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: Mes['messageConfirmResendtaskruleresendtaskrule'],
                    async onOk () {
                        let params = {
                            subSysNo: subSysNo,
                        };

                        configuration.dcuScheduleMgt.resendFailTask(params).then(() => {
                            message.success(Mes['titleTableSuccesssuccess']);
                            getCstList();
                        })
                            .catch((err) => {
                                message.error(err);
                            });
                    },
                    onCancel () {
                        console.log('Cancel');
                    },
                });
            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const expandedRowRender = (item: LoadedTaskData) => {
        console.log(item, expandTableData[item.AFN]);
        const columns = [
            { title: Mes['titleTableMeternometerno'], dataIndex: 'METER_NO', key: 'METER_NO'},
        ];

        // let list = await configuration.dcuScheduleMgt.getTaskMeterList(item.CLASSICAL_DETAIL_GUID);

        // console.log(list);

        return <Table pagination={false} rowKey='METER_NO' style={{ width: '50%' }} columns={columns} dataSource={ expandTableData[item.AFN]}/>;
    };

    const initConfig = async () => {
        setTimeout(() => {
            sRef.current?.setFieldsValue({
                searchField: 'CST_ADDR',
                fieldValue: '',
                existFailTask: 'All',
            });
            getCstList();
        }, 500);
    };

    useEffect(() => {
        initConfig();
        // webSocket监听
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
        };
    }, []);
    return (
        <div>
            {
                searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
            }
            <div>
                <Table columns={cstColumns} style={{ width: '100%' }} rowKey='CST_ID' className='table' dataSource={cstList} bordered={ true}
                    rowSelection={{
                        type: 'checkbox',
                        ...cstRowSelection,
                    }}
                    pagination={false} loading={ cstLoading}
                    onRow={(record) => ({
                        onClick: () => {
                            let key = record.CST_ID;
                            const rowsKeys = [ key ];

                            setSelectedCstKeys(rowsKeys);
                            getTaskList(1, key, record.CST_TYPE);
                        },
                    })}></Table>
                <div style={{padding: '10px'}}>
                    <Pagination {...pagination} />
                </div>
                <div style={{margin: '10px'}}>
                    <Row>
                        <Col span={12}>
                            <Table columns={taskColumns} style={{ width: '100%' }} rowKey='AFN' className='table' bordered={true}
                                dataSource={taskList} pagination={false} loading={taskLoading} expandable={{
                                    expandedRowRender,
                                    onExpand: (bool, item) => {
                                        if (bool) {
                                        // let list = expandTableData[item.AFN];

                                            // if (list && list.length > 0) {
                                            //     console.log(list);
                                            // } else {
                                            configuration.dcuScheduleMgt.getTaskMeterList(item.CLASSICAL_DETAIL_GUID).then((res:MeterData[]) => {
                                            // let map = [ ...expandTableData ];

                                                // map[item.AFN] = res;
                                                // console.log(map);
                                                setExpandTableData({...expandTableData, [item.AFN]: res});
                                            });
                                        // }
                                        }
                                    } }}>

                            </Table>
                        </Col>
                        <Col span={ 1}></Col>
                        <Col span={8}>
                            <Table columns={resultColumns} dataSource={readResultList} loading={readLoading}
                                style={{ width: '100%' }} rowKey='AFN' className='table' bordered={true} pagination={ false}>

                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default QueryTaskResultTab;
