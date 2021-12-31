// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect, useImperativeHandle} from 'react';
import { LangMessage } from 'src/store/common/language';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { Table, message, Modal, Form, Button, Row, Col, Input, DatePicker } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { SchemeProfileData, SchemeProfileList, SeasonProfileData, WebSocketMessage } from 'src/api/configuration/activityCalender/types';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';

export type ARef = {
    showAddDialog(): void;
    showEditDialog(): void;
    showDelDialog(): void;
    excute(): void;
}
type Props = {
    Mes: LangMessage;
    subSysNo: string;
    aRef?: React.MutableRefObject<ARef | undefined>;
    excuteTask: any;
};

type WebSocketData = {
    receiveMessNum: number;
    totalTaskNum: number;
    groupId: string;
    selectData: SchemeProfileData[];
    meter: any[];
}

const SchemeProfilePage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, aRef, excuteTask } = props;
    const cRef = useRef<CRef>();
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ schemeProfileList, setSchemeProfileList ] = useFetchState<SchemeProfileData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ dialogSeasonProfileList, setDialogSeasonProfileList ] = useFetchState<SeasonProfileData[]>([]);
    const [ schemeSN, setSchemeSN ] = useFetchState<string>('');
    const [ schemeName, setSchemeName ] = useFetchState<string>('');
    const [ selectedSeasonKeys, setSelectedSeasonKeys ] = useFetchState<any[]>([]);
    // const [ selectedMeter, setSelectedMeter ] = useFetchState<any[]>([]);
    const ROWS = 10;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const [ form ] = Form.useForm();
    const onConfig = useRef<WebSocketData>({
        receiveMessNum: 0,
        totalTaskNum: 0,
        groupId: '',
        selectData: [],
        meter: [],
    });

    const onNodeCheck = (row: any[]) => {
        console.log(row);
        onConfig.current.meter = row;
    };

    const tableColumns = [
        {
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTableSchemenameschemename'],
            dataIndex: 'SCHEME_NAME',
        },
        {
            title: Mes['titleTableActivedatetimeactivedatetime'],
            dataIndex: 'ACTIVE_DATE_TIME',
        },

    ];

    const dialogColumns = [
        {
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTableSeasonprofilenameseasonprofilename'],
            dataIndex: 'SEASON_TABLE_NAME',
        },
        {
            title: Mes['titleTableSeasonstartseasonstart'],
            dataIndex: 'START_TIME',
        },
        {
            title: Mes['titleTableWeeknameweekname'],
            dataIndex: 'WEEK_NAME',
        },
    ];

    const getSchemeProfileList = (page:number = 1) => {
        setLoading(true);
        configuration.activityCalender.getSchemeProfile(page, ROWS, subSysNo).then((res:SchemeProfileList) => {
            setTotal(res.total);
            setSchemeProfileList(res.rows);
            // onConfig.current.tableData = res.rows;
            setCurrent(page);
            setLoading(false);
        })
            .catch((err) => {
                message.error(err);
                setLoading(false);
            });
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            getSchemeProfileList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: SchemeProfileData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedRowKeys(keys);
            onConfig.current.selectData = selectedRows;
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

    const seasonSelection = {
        selectedRowKeys: selectedSeasonKeys,
        onChange: (keys: React.Key[], selectedRows: SeasonProfileData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedSeasonKeys(keys);
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

    const getSeasonProfileList = () => {
        configuration.activityCalender.getSeasonProfile(1, 99, subSysNo).then((res) => {
            setDialogSeasonProfileList(res.rows);
        });
    };

    const getSeasonProfileBySN = (sn:string) => {
        configuration.activityCalender.getSeasonProfileBySN(sn, subSysNo).then((res) => {
            if (res.length) {
                setSelectedSeasonKeys([ res[0].SEASON_SN ]);
            }
        });
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = () => {
        if (selectedSeasonKeys.length > 0) {
            form.validateFields().then((data) => {
                setSubmitLoading(true);
                if (!schemeSN) {
                    let time = moment(data.time).format(format);
                    let list = dialogSeasonProfileList.filter((v) => v.SEASON_SN === selectedSeasonKeys[0]);
                    let params = {
                        schemeName: data.schemeName,
                        activeDate: time.substr(0, time.indexOf(' ')),
                        activeTime: time.substr(time.indexOf(' ') + 1, time.length),
                        subSys: subSysNo,
                        schemeSelectListJson: JSON.stringify(list),
                    };

                    console.log(params);
                    configuration.activityCalender.addSchemeProfile(params).then(() => {
                        message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                        getSchemeProfileList();
                        setModalVisible(false);
                        setDialogSeasonProfileList([]);
                        setSelectedSeasonKeys([]);
                        setSubmitLoading(false);
                        form.resetFields();
                    })
                        .catch((err) => {
                            message.error(err);
                            setSubmitLoading(false);
                        });
                } else {
                    let time = moment(data.time).format(format);
                    let list = dialogSeasonProfileList.filter((v) => v.SEASON_SN === selectedSeasonKeys[0]);
                    let params = {
                        schemeName: data.schemeName,
                        activeDate: time.substr(0, time.indexOf(' ')),
                        activeTime: time.substr(time.indexOf(' ') + 1, time.length),
                        subSys: subSysNo,
                        schemeSelectListJson: JSON.stringify(list),
                        oldSchemeName: schemeName,
                        schemeSn: schemeSN,
                    };

                    console.log(params);
                    configuration.activityCalender.editSchemeProfile(params).then(() => {
                        message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                        getSchemeProfileList();
                        setModalVisible(false);
                        setDialogSeasonProfileList([]);
                        setSelectedSeasonKeys([]);
                        setSubmitLoading(false);
                        setSelectedRowKeys([]);
                        form.resetFields();
                    })
                        .catch((err) => {
                            message.error(err);
                            setSubmitLoading(false);
                        });
                }
            });
        } else {
            message.warn(Mes['messageHintHintselectonerecordhintselectonerecord']);
        }
    };

    const showEditDialog = () => {
        if (selectedRowKeys.length > 0) {
            setModalVisible(true);
            setModalTitle('Edit Scheme Profile');
            getSeasonProfileList();
            let list = schemeProfileList.filter((v) => v.SCHEME_SN === selectedRowKeys[0]);

            form.setFieldsValue({
                'schemeName': list[0].SCHEME_NAME,
                'time': moment(list[0].ACTIVE_DATE_TIME, format),
            });
            setSchemeSN(list[0].SCHEME_SN);
            setSchemeName(list[0].SCHEME_NAME);
            getSeasonProfileBySN(list[0].SCHEME_SN);
        } else {
            message.warn(Mes['messageHintHintselectonerecordhintselectonerecord']);
        }
    };

    const showDeleteConfirm = () => {
        if (selectedRowKeys.length > 0) {
            Modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
                onOk () {
                    configuration.activityCalender.delelteProfile({ 'schemeSn': selectedRowKeys[0] }).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        getSchemeProfileList();
                    })
                        .catch((err) => {
                            message.error(err);
                        });
                },
                onCancel () {
                    console.log('Cancel');
                },
            });
        } else {
            message.warn(Mes['messageAlarmSelectrecordstoremoveselectrecordstoremove']);
        }
    };

    const sendProtocalCommand = () => {
        console.log('sendProtocalCommand');
        let cmds = [];

        cmds.push({
            param: onConfig.current.selectData[0].SCHEME_SN,
            commandType: '17',
        });
        let meterList:any[] = [];

        onConfig.current.meter.map((v) => {
            meterList.push({
                ITEM_ID: v.deviceGuid,
                CST_ID: v.CST_ID,
                SN_METER_TYPE: v.deviceModel,
            });
        });
        let params = {
            groupId: onConfig.current.groupId,
            remark: 'activityCalender',
            meterItems: JSON.stringify(meterList),
            cmdParameter: JSON.stringify(cmds),
        };

        configuration.activityCalender.sendProtocalCommand(params).then((res: WebSocketMessage) => {
            hideLoading();
            if (res.flag) {
                let messArr = res.mess.split(';');

                onConfig.current.groupId = messArr[0];
                let taskNum = messArr[1];

                onConfig.current.totalTaskNum = parseInt(taskNum, 10); // 总任务数量
                excuteTask();
            } else {
                onConfig.current.totalTaskNum = 0;
                onConfig.current.groupId = '';
                if (res.mess) {
                    let messArr = res.mess.split(';');

                    message.error(messArr[2]);
                } else {
                    message.error(Mes['messageErrorExecfailureexecfailure']);
                }
            }
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const startSend = () => {
        showLoading();
        onConfig.current.groupId = v4();
        onConfig.current.receiveMessNum = 0;
        onConfig.current.totalTaskNum = 0;
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
        // hideLoading();
        if (wsguid === onConfig.current.groupId) {
            onConfig.current.receiveMessNum++;
            if (onConfig.current.receiveMessNum === 1 && name === 'otask-confirm') {
                sendProtocalCommand();
                onConfig.current.receiveMessNum = 0;
            } else {
                if (taskId) {
                    // let list: SchemeProfileData[] = [ ...onConfig.current.tableData ];
                    // let selects = list.filter((v) => v.SCHEME_SN === taskId);

                    // selects.map((v: SchemeProfileData, index: number) => {

                    // });
                    console.log(taskId);

                }
                if (onConfig.current.totalTaskNum === onConfig.current.receiveMessNum) {
                    onConfig.current.totalTaskNum = 0;
                    hideLoading();
                }
            }

        }
    };

    useImperativeHandle(aRef, () => ({
        showAddDialog () {
            setModalVisible(true);
            setModalTitle('Add Scheme Profile');
            getSeasonProfileList();
            setSchemeSN('');
        },
        showEditDialog () {
            showEditDialog();
        },
        showDelDialog () {
            showDeleteConfirm();
        },
        excute () {
            if (selectedRowKeys.length > 0) {
                if (onConfig.current.meter.length > 0) {
                    startSend();
                } else {
                    Modal.confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['messageConfirmIssuetoallmetertypeissuetoallmetertype'],
                        onOk () {
                            startSend();
                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                }

            } else {
                message.warn(Mes['messageAlarmSelectschemeselectscheme']);
            }
        },
    }));

    useEffect(() => {
        getSchemeProfileList();
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
        <div className='remoteControl contentWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} isExpand={true} checkbox={false} cRef={cRef} PAGESIZE={12} />
            </div>
            <div className='wrapRight'>
                <Table columns={tableColumns} style={{ width: '50%' }} rowKey='SCHEME_SN' className='table' dataSource={schemeProfileList}
                    pagination={pagination} loading={loading} bordered={true}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            let key = record.SCHEME_SN;
                            const rowsKeys = [ ...selectedRowKeys ];
                            let index = rowsKeys.indexOf(key);

                            if (index >= 0) {
                                rowsKeys.splice(index, 1);
                                onConfig.current.selectData.splice(index, 1);
                            } else {
                                rowsKeys.splice(0, rowsKeys.length);
                                onConfig.current.selectData.splice(0, onConfig.current.selectData.length);
                                rowsKeys.push(key);
                                onConfig.current.selectData.push(record);
                            }
                            setSelectedRowKeys(rowsKeys);
                        },
                    })}
                ></Table>
            </div>
            <Modal visible={modalVisible}
                title={modalTitle}
                destroyOnClose
                width={ 1000}
                onCancel={handleCancel}
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                    <Button key='submit' type='primary' onClick={handleOk} loading={ submitLoading}> { Mes['btnSubmit'] }</Button>,
                ]}>
                <Form
                    form={form}
                    name='langForm'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    preserve={false}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='schemeName' label='Scheme Profile Name' rules={[ { required: true } ]}>
                                <Input maxLength={ 20}></Input>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='time' label='Active Date Time' rules={[ { required: true } ]}>
                                <DatePicker format={ format} showTime></DatePicker>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Table columns={dialogColumns} style={{ width: '100%' }} rowKey='SEASON_SN' className='table' dataSource={dialogSeasonProfileList}
                        pagination={false} bordered={true}
                        rowSelection={{
                            type: 'checkbox',
                            ...seasonSelection,
                        }}
                        onRow={(record) => ({
                            onClick: () => {
                                let key = record.SEASON_SN;
                                const rowsKeys = [ ...selectedSeasonKeys ];
                                let index = rowsKeys.indexOf(key);

                                if (index >= 0) {
                                    rowsKeys.splice(index, 1);
                                } else {
                                    rowsKeys.splice(0, rowsKeys.length);
                                    rowsKeys.push(key);
                                }
                                setSelectedSeasonKeys(rowsKeys);
                            },
                        })}
                    ></Table>
                </Form>
            </Modal>
        </div>
    );
};


export default SchemeProfilePage;
