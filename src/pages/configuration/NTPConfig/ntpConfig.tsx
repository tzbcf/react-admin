// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import { configuration } from 'src/api';
import { CstList, CstData, NtpParam } from 'src/api/configuration/ntpConfig/types';
import './index.less';
import { CheckCircleFilled, LoadingOutlined, CloseCircleFilled } from '@ant-design/icons/lib/icons';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};
type WebSocketData = {
    tableData: CstData[];
    groupId: string;
    commandType: string;
    selects: CstData[];
}

let ROWS = 10;
let sortName = '';
let sortType = 'asc';
const NtpConfigTab: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const cRef = useRef<CRef>();
    const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ cstList, setCstList ] = useFetchState<CstData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);

    const CONST_FAILURE = '0';
    const CONST_SUCCESS = '1';
    const CONST_WRITING = '2';
    const CONST_READING = '3';
    const CONST_TIMEOUT = '5';

    const CONST_WRITE = '1';
    const CONST_READ = '2';

    const onConfig = useRef<WebSocketData>({
        tableData: [],
        groupId: '',
        commandType: '',
        selects: [],
    });

    const getOpeartorIcon = (record:CstData) => {
        if (record.OPERATION === CONST_SUCCESS) {
            return (<Row><Col span={6}><CheckCircleFilled style={{ color: '#00ff00' }} /></Col><Col span={15}><span>Success</span></Col></Row>);
        } else if (record.OPERATION === CONST_FAILURE) {
            return (<Row><Col span={6}> <CloseCircleFilled style={{ color: '#ff0000' }} /></Col><Col span={15}><span>Failure</span></Col></Row>);
        } else if (record.OPERATION === CONST_WRITING) {
            return (<Row><Col span={6}> <LoadingOutlined /></Col><Col span={15}><span>Writing</span></Col></Row>);
        } else if (record.OPERATION === CONST_READING) {
            return (<Row><Col span={6}> <LoadingOutlined /></Col><Col span={15}><span>Reading</span></Col></Row>);
        } else if (record.OPERATION === CONST_TIMEOUT) {
            return (<Row><Col span={6}> <CloseCircleFilled style={{ color: '#ff0000' }} /></Col><Col span={15}><span>Timeout</span></Col></Row>);
        } else {
            return (<Row><Col span={6}> <CloseCircleFilled style={{ color: '#ff0000' }} /></Col><Col span={15}><span>None</span></Col></Row>);
        }
    };
    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableDcustatusdcustatus'],
            dataIndex: 'ONLINESTATUS',
            width: 100,
            render (_: any, record: CstData) {
                return (
                    <>
                        {record.ONLINESTATUS === '1'
                            ? <Row><Col className='onlineDot' span={3}></Col><Col span={15}><span>Online</span></Col></Row> : <Row><Col className='offlineDot' span={3}></Col><Col span={15}><span>Offline</span></Col></Row>}
                    </>
                );
            },
            sorter: true,
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'NTP_STATUS',
            width: 150,
            render (_: any, record: CstData) {
                return (
                    <>
                        {record.NTP_STATUS === CONST_SUCCESS
                            ? <Row><Col span={6}><CheckCircleFilled style={{ color: '#00ff00' }} /></Col><Col span={16}><span>Activated</span></Col></Row>
                            : <Row><Col span={6}> <CloseCircleFilled style={{ color: '#ff0000' }}/></Col><Col span={16}><span>Inactivated</span></Col></Row>}
                    </>
                );
            },
            sorter: true,
        },
        {
            title: Mes['titleTableOperationoperation'],
            dataIndex: 'OPERATION',
            width: 100,
            render (_: any, record: CstData) {
                return (
                    <>
                        { getOpeartorIcon(record)}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'CST_NAME',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
            sorter: true,
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            sorter: true,
        },
        {
            title: Mes['titleTableServeraddressserveraddress'],
            dataIndex: 'NTP_SERVER_ADDRESS',
        },
        {
            title: Mes['titleTableServerportserverport'],
            dataIndex: 'NTP_SERVER_PORT',
        },
        {
            title: Mes['titleTableAuthenticationmethodauthenticationmethod'],
            dataIndex: 'NTP_AUTHEN_TYPE',
        },
        {
            title: Mes['titleTableClientkeyclientkey'],
            dataIndex: 'NTP_KEY',
        },
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
        },
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'DST_NAME',
        },
        {
            title: Mes['titleTableModelmodel'],
            dataIndex: 'CST_TYPE_NAME',
        },

    ];

    const getData = (page: number = 1) => {
        setLoading(true);
        sRef.current?.getFormData().then((data: any) => {

            configuration.ntpConfigMgt.getCstList(page, ROWS, subSysNo, data.searchField, data.fieldValue, data.status, sortType, sortName).then((res:CstList) => {
                setLoading(false);
                setTotal(res.total);
                setCurrent(page);
                setCstList(res.rows);
                onConfig.current.tableData = res.rows;
            })
            ;
        });
    };

    const getNtpParam = () => {
        configuration.ntpConfigMgt.getNtpParam().then((res: NtpParam[]) => {
            if (res.length) {
                cRef.current?.openModel({
                    ip: res[0].NTP_SERVER_ADDRESS,
                    port: res[0].NTP_SERVER_PORT,
                    authentication: res[0].NTP_AUTHEN_TYPE,
                });
            }
        });
    };

    const saveNtpParam = async (row: any): Promise<any> => {
        configuration.ntpConfigMgt.saveNtpParam(row).then(() => {
            message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            setSelectedRowKeys([]);
            getData();
        });
    };

    // 发送webSocket消息
    const startSend = () => {
        showLoading();
        onConfig.current.groupId = v4();
        const obj = {
            name: 'otask',
            guid: onConfig.current.groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
        // console.log(JSON.stringify([ obj ]));
    };

    const readNtp = () => {
        if (selectedRowKeys.length > 0) {
            onConfig.current.selects = [];
            let select = [ ...selectedRowKeys ];

            cstList.map((v:CstData) => {
                if (selectedRowKeys.includes(v.rn__)) {
                    if (v.ONLINESTATUS === '1' && v.OPERATION !== '3' && v.OPERATION !== '2') {
                        onConfig.current.selects.push(v);
                    } else {
                        select.splice(select.indexOf(v.rn__), 1);
                    }
                }
            });
            setSelectedRowKeys(select);
            // let vaild = onConfig.current.selects.every((v: CstData) => v.ONLINESTATUS === '1' && v.OPERATION !== '3' && v.OPERATION !== '2');

            if (onConfig.current.selects.length > 0) {
                onConfig.current.commandType = CONST_READ;
                startSend();
            } else {
                message.warn(Mes['messageAlarmSelectvalidrowselectvalidrow']);
            }
            // console.log('read', cstList);
        } else {
            message.warn(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
        }
    };

    const activeNtp = () => {
        if (selectedRowKeys.length > 0) {
            onConfig.current.selects = [];
            let select = [ ...selectedRowKeys ];

            cstList.map((v:CstData) => {
                if (selectedRowKeys.includes(v.rn__)) {
                    if (v.ONLINESTATUS === '1' && v.OPERATION !== '3' && v.OPERATION !== '2' && v.NTP_STATUS !== '1') {
                        onConfig.current.selects.push(v);
                    } else {
                        select.splice(selectedRowKeys.indexOf(v.rn__), 1);
                    }
                }
            });
            setSelectedRowKeys(select);
            // let vaild = onConfig.current.selects.every((v: CstData) => v.ONLINESTATUS === '1' && v.OPERATION !== '3' && v.OPERATION !== '2' && v.NTP_STATUS !== '1');

            if (onConfig.current.selects.length > 0) {
                onConfig.current.commandType = CONST_WRITE;
                startSend();
            } else {
                message.warn(Mes['messageAlarmSelectvalidrowselectvalidrow']);
            }
        } else {
            message.warn(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
        }
    };

    const sendCommand = () => {
        let data = {
            rowsList: JSON.stringify(onConfig.current.selects),
            commandType: onConfig.current.commandType,
            groupId: onConfig.current.groupId,
            subSysNo: subSysNo,
        };

        configuration.ntpConfigMgt.sendCommand(data).then(() => {
            let list:CstData[] = [ ...onConfig.current.tableData ];

            // console.log('start', list);
            onConfig.current.tableData.map((v:CstData, index:number) => {
                if (onConfig.current.selects.includes(v)) {
                    if (onConfig.current.commandType === CONST_WRITE) {
                        v.OPERATION = CONST_WRITING;
                    } else {
                        v.OPERATION = CONST_READING;
                    }
                    list[index] = v;
                }
            });
            // console.log('end', list);
            setCstList(list);
            message.success(Mes['titleLabelBatchtokenstatus1batchtokenstatus1']);
        })
            .catch(() => {
                message.error(Mes['titleLabelBatchtokenstatus2batchtokenstatus2']);
                hideLoading();
            });
    };

    const getReadResult = (taskId: string, result: string, isSuccess: string) => {
        let data = { taskId: taskId, result: result, isSuccess: isSuccess };

        configuration.ntpConfigMgt.getReadResult(data).then(() => {
            hideLoading();
            setSelectedRowKeys([]);
            getData();
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
                setSelectedRowKeys([]);
                getData();
            });
    };

    // webSocket消息回调函数
    const OnDemand = (data: any) => {
        let wsguid = data.guid;
        let name = data.name;
        let taskId = data.taskid;
        let result = data.result;
        let isSuccess = data.success;

        console.log('webSocket收到消息', data);
        if (wsguid === onConfig.current.groupId) {
            if (name === 'otask-confirm') {
                sendCommand();
            } else {
                getReadResult(taskId, result, isSuccess);
            }

        }
    };

    const addOpt = [
        {
            type: 'Input',
            label: 'titleTableServeraddressserveraddress',
            name: 'ip',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Input',
            label: 'titleTableServerportserverport',
            name: 'port',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'number',
                maxLength: 10,
            },
        },

        {
            type: 'Select',
            label: 'titleTableAuthenticationmethodauthenticationmethod',
            name: 'authentication',
            rules: [ { required: true } ],
            col: 20,
            options: [ { name: 'No Security', value: '0' }, {name: 'Shared Secrets', value: '1'}, {name: 'Auto Key IFF', value: '2'} ],
        },

    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 弹窗参数设置
    const modelOpt = {
        title: 'titlePromptprompt',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 弹窗表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Install',
            btnType: 'primary',
            title: Mes['btnInstallntpinstallntp'],
            onClick () {
                getNtpParam();

            },
        },
        {
            type: 'Read',
            btnType: 'primary',
            title: Mes['btnReadntpreadntp'],
            onClick () {
                readNtp();

            },
        },
        {
            type: 'Send',
            btnType: 'primary',
            title: Mes['btnActiventpactiventp'],
            onClick () {
                activeNtp();

            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const initConfig = async () => {
        try {
            const searchList = [
                {
                    name: 'status',
                    col: 3,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: 'All', value: 'all'}, {name: 'Inactivated', value: '0'}, {name: 'Activated', value: '1'} ],
                },
                {
                    name: 'searchField',
                    col: 3,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: 'DCU Address', value: 'CST_ADDR'}, {name: 'DCU Name', value: 'CST_NAME'} ],
                },
                {
                    name: 'fieldValue',
                    col: 3,
                    type: 'Input',
                },
            ];

            setSearchColumns(searchList);
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    status: 'all',
                    searchField: 'CST_ADDR',
                    fieldValue: '',
                });
                getData();
            }, 500);

        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            ROWS = pageSize!;
            console.log('page', page);
            getData(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // table行选择设置
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: CstData[]) => {
            setSelectedRowKeys(keys);
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
        setSelectedRowKeys([]);
        getData(1);
    };

    const changeTable = (paginations:any, filters:any, sorter:any) => {
        console.log(paginations, filters, sorter);
        if (sorter.field) {
            sortName = sorter.field;
            if (sorter.order) {
                if (sorter.order.includes('asc')) {
                    sortType = sorter.order.substr(0, 3);
                } else {
                    sortType = sorter.order.substr(0, 4);
                }
            } else {
                sortType = 'asc';
            }
            setSelectedRowKeys([]);
            getData(paginations.current);
        }
    };


    useEffect(() => {
        initConfig();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
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

    return (<>
        <div className='main'>
            {/* <div className='flexCenter flexBetween title'>
                <h4>{Mes['titleTableFrozendataqueryfrozendataquery']}</h4>
            </div> */}
            <div>

                {
                    searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div className='table'>
                    <Table columns={detailColumns} style={{ width: '100%' }} rowKey='rn__' className='table' loading={loading} dataSource={ cstList}
                        pagination={false} onChange={changeTable} scroll={{y: tableHeight}}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        onRow={(record) => ({
                            onClick: () => {
                                let key = record.rn__;
                                const rowsKeys = [ ...selectedRowKeys ];
                                let index = rowsKeys.indexOf(key);

                                if (index >= 0) {
                                    rowsKeys.splice(index, 1);
                                    // meterNos.splice(index, 1);
                                    // meterIds.splice(index, 1);
                                } else {
                                    rowsKeys.push(key);
                                    // meterNos.push(record.METER_NO);
                                    // meterIds.push(record.METER_GUID_NO);
                                }
                                setSelectedRowKeys(rowsKeys);
                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <AddLangElment
                cRef={cRef}
                saveData={saveNtpParam}
                formOption={formOpt}
                modelOpt={modelOpt}
                Mes={Mes}
            />
        </div>
    </>);
};


export default NtpConfigTab;
