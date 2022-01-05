// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef, useImperativeHandle} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { configuration } from 'src/api';
import { TaskGroup, TaskList, TaskData } from 'src/api/configuration/ntpConfig/types';
import moment from 'moment';
import { BtnConfig } from 'src/components/common/btnList';
import { CheckCircleFilled, LoadingOutlined, CloseCircleFilled } from '@ant-design/icons/lib/icons';

export type TRef = {
    resend(): void;
    initSearch(): void;
}

type Props = {
    Mes: LangMessage;
    cRef?: React.MutableRefObject<TRef | undefined>;
};
let selectGroupId = '';
const ActivityCalenderTask: React.FC<Props> = (props) => {
    const { Mes, cRef } = props;
    const format = 'YYYY-MM-DD';
    const sRef = useRef<SRef>();
    const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ taskGroupList, setTaskGroupList ] = useFetchState<TaskGroup[]>([]);
    const [ taskList, setTaskList ] = useFetchState<TaskData[]>([]);
    const [ selectedGroupKeys, setSelectedGroupKeys ] = useFetchState<any[]>([]);
    const [ selectedTaskKeys, setSelectedTaskKeys ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const ROWS = 10;

    const groupColumns = [
        {
            dataIndex: 'GROUP_NAME',
            title: Mes['titleTableSpecialgroupnamespecialgroupname'],
        },
    ];

    const getStateIcon = (record:TaskData) => {
        if (record.IS_EXECUTED === '0' || record.IS_EXECUTED === '2') {
            return (<Row><Col span={6}> <LoadingOutlined /></Col><Col span={15}><span>Executing</span></Col></Row>);
        } else if (record.IS_SUCCESS === '1') {
            return (<Row><Col span={6}><CheckCircleFilled style={{ color: '#00ff00' }} /></Col><Col span={15}><span>Success</span></Col></Row>);
        } else if (record.IS_SUCCESS === '0') {
            return (<Row><Col span={6}> <CloseCircleFilled style={{ color: '#ff0000' }} /></Col><Col span={15}><span>Failure</span></Col></Row>);
        }
    };

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 50,
        },
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
            render (_: any, record: TaskData) {
                return (
                    <>
                        { getStateIcon(record)}
                    </>
                );
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

    const getTaskList = (page: number = 1, groupId: string) => {
        sRef.current?.getFormData().then((data: any) => {
            setLoading(true);
            configuration.ntpConfigMgt.getTaskList(page, ROWS, groupId, data.meterNo, 'asc', '', 'DESC').then((res:TaskList) => {
                setCurrent(page);
                setTotal(res.total);
                setTaskList(res.rows);
                setLoading(false);
                selectGroupId = groupId;
                // if (selectedGroupKeys.length <= 0) {
                setSelectedGroupKeys([ groupId ]);
                // }
            })
                .catch((err) => {
                    message.error(err);
                });
        });
    };

    const getData = () => {
        sRef.current?.getFormData().then((data: any) => {

            configuration.ntpConfigMgt.getTaskGroup(data.searchDate[0].format(format), data.searchDate[1].format(format), 'alarm').then((res:TaskGroup[]) => {
                setTaskGroupList(res);
                if (res.length) {
                    if (selectGroupId) {
                        getTaskList(1, selectGroupId);
                    } else {
                        getTaskList(1, res[0].GROUP_ID);
                    }
                }
            });

        });
    };

    const changeDate = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            searchDate: [ moment(dateStrings[0], format), moment(dateStrings[1], format) ],
        });
        getData();
    };

    const resetTask = () => {
        let taskIds = '';

        if (selectedTaskKeys.length > 0) {
            selectedTaskKeys.map((v) => {
                taskIds = taskIds + v + ',';
            });
        }
        // taskList.map((v:TaskData) => {
        //     if (selectedTaskKeys.length) {
        //         if (selectedTaskKeys.includes(v.SN) && v.IS_SUCCESS !== '1') {
        //             taskIds = taskIds + v.SN + ',';
        //         }
        //     } else {
        //         if (v.IS_SUCCESS !== '1') {
        //             taskIds = taskIds + v.SN + ',';
        //         }
        //     }
        // });
        // console.log(taskIds);
        let params = {
            taskIds: taskIds,
            groupId: selectedGroupKeys[0],
        };

        configuration.ntpConfigMgt.resetTask(params).then(() => {
            message.success(Mes['messageSuccessResetsuccessresetsuccess']);
            getTaskList(current, selectedGroupKeys[0]);
        })
            .catch((err) => {
                message.error(err);
            });
        setSelectedTaskKeys([]);

    };

    const btnList: BtnConfig[] = [
        {
            type: 'Restart',
            btnType: 'primary',
            title: Mes['btnResetreset'],
            onClick () {
                resetTask();

            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const initConfig = async () => {
        try {
            const date = new Date();

            let end = moment(date).format(format);
            let start = moment(date.setDate(date.getDate() - 1)).format(format);
            const searchList = [
                {
                    name: 'searchDate',
                    type: 'RangePicker',
                    col: 4,
                    attr: {
                        format: format,
                        style: { width: '100%' },
                        defaultValue: [ moment(start, format), moment(end, format) ],
                        onChange: changeDate,
                        allowClear: false,
                    },
                },
                {
                    name: 'meterNo',
                    type: 'Input',
                    col: 4,
                    attr: {
                        placeholder: 'Meter No',
                        style: { width: '100%' },
                    },
                },
            ];

            setSearchColumns(searchList);
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    searchDate: [ moment(start, format), moment(end, format) ],
                    meterNo: '',
                });
                getData();
            }, 500);

        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    // table行选择设置
    const groupRowSelection = {
        selectedRowKeys: selectedGroupKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: TaskGroup[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedGroupKeys(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
                selectGroupId = selectedRows[selectedRows.length - 1].GROUP_ID;
                getTaskList(1, selectedRows[selectedRows.length - 1].GROUP_ID);
                //     selectedRows.forEach((v:CstData) => {
                //         meterNos.push(v.METER_NO);
                //         meterIds.push(v.METER_GUID_NO);
                //     });
            } else {
                selectGroupId = '';
            }
        },
    };

    // table行选择设置
    const taskRowSelection = {
        selectedRowKeys: selectedTaskKeys,
        onChange: (keys: React.Key[], selectedRows: TaskData[]) => {
            setSelectedTaskKeys(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
            //     selectedRows.forEach((v:CstData) => {
            //         meterNos.push(v.METER_NO);
            //         meterIds.push(v.METER_GUID_NO);
            //     });
            }
        },
    };

    const search = (data: any) => {
        console.log('a-----', data);
        getData();
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            getTaskList(page, selectedGroupKeys[0]);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    useImperativeHandle(cRef, () => ({
        resend () {
            resetTask();
        },
        initSearch () {// 从其他页跳转过来，并初始化查询
            selectGroupId = '';
            const date = new Date();

            let end = moment(date).format(format);
            let start = moment(date.setDate(date.getDate() - 1)).format(format);

            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    searchDate: [ moment(start, format), moment(end, format) ],
                    meterNo: '',
                });
                getData();
            }, 500);
        },
    }));

    useEffect(() => {
        initConfig();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
    }, []);

    return (<>
        <div style={{height: '100%'}}>
            <div>

                {
                    searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div>
                    <Row>
                        <Col span={6}>
                            <Table columns={groupColumns} style={{ width: '100%' }} rowKey='GROUP_ID' className='table' dataSource={taskGroupList} bordered={ true}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...groupRowSelection,
                                }}
                                pagination={false}
                                scroll={{y: tableHeight}}
                                onRow={(record) => ({
                                    onClick: () => {
                                        let key = record.GROUP_ID;
                                        const rowsKeys = [ key ];

                                        setSelectedGroupKeys(rowsKeys);
                                        getTaskList(1, key);
                                    },
                                })}></Table>
                        </Col>
                        <Col span={ 1}></Col>
                        <Col span={16}>
                            <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' dataSource={taskList}
                                pagination={pagination} loading={loading} bordered={true} scroll={{y: tableHeight}}
                                rowSelection={{
                                    type: 'checkbox',
                                    ...taskRowSelection,
                                }}
                                onRow={(record) => ({
                                    onClick: () => {
                                        let key = record.SN;
                                        const rowsKeys = [ ...selectedTaskKeys ];
                                        let index = rowsKeys.indexOf(key);

                                        if (index >= 0) {
                                            rowsKeys.splice(index, 1);
                                        } else {
                                            rowsKeys.push(key);
                                        }
                                        setSelectedTaskKeys(rowsKeys);
                                    },
                                })}
                            ></Table>
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
    </>);
};


export default ActivityCalenderTask;
