// eslint-disable-next-line no-use-before-define
import React, { useEffect, useImperativeHandle} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Modal, Form, Button, Select, Row, Col, Input, TimePicker, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { DayProfileData, DayProfileList } from 'src/api/configuration/activityCalender/types';
import moment from 'moment';
import { ExclamationCircleOutlined} from '@ant-design/icons';

export type DRef = {
    showAddDialog(): void;
    showEditDialog(): void;
    showDelDialog(): void;
}


type Props = {
    Mes: LangMessage;
    subSysNo: string;
    cRef?: React.MutableRefObject<DRef | undefined>;
};

const DayProfilePage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, cRef } = props;
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ dayProfileList, setDayProfileList ] = useFetchState<DayProfileData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ dialogDayProfileList, setDialogDayProfileList ] = useFetchState<DayProfileData[]>([]);
    // const [ daySN, setDaySN ] = useFetchState<string>('');
    const ROWS = 10;
    const format = 'HH:mm:ss';
    const [ form ] = Form.useForm();
    const { Option } = Select;
    const tableColumns = [
        {
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTableDayiddayid'],
            dataIndex: 'DAY_IDX',
            width: 200,
        },
        {
            title: Mes['titleTableTimebucketnotimebucketno'],
            dataIndex: 'DAY_TIME_BUCKET_NO',
            width: 200,
        },
        {
            title: Mes['titleTableStarttimestarttime'],
            dataIndex: 'START_TIME',
            width: 200,
        },
        {
            title: Mes['titleTableScriptlogicalnamescriptlogicalname'],
            dataIndex: 'SCRIPT_LOGICAL_NAME',
            width: 200,
        },
        {
            title: Mes['titleTableScriptselectorscriptselector'],
            dataIndex: 'SCRIPT_SELECTOR',
            width: 200,
        },

    ];

    const dailogColumns = [
        {
            title: Mes['titleTableTimebucketnotimebucketno'],
            dataIndex: 'DAY_TIME_BUCKET_NO',
            render (_: any, record: DayProfileData, index:number) {
                return (
                    <>
                        <Form.Item name={'seqNo' + (index + 1)} rules={[ { required: true } ]} preserve={ false}>
                            <Input style={{width: '150px'}} disabled></Input>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableStarttimestarttime'],
            dataIndex: 'START_TIME',
            render (_: any, record: DayProfileData, index:number) {
                return (
                    <>
                        <Form.Item name={'day_start_time' + (index + 1)} rules={[ { required: true } ]} preserve={ false}>
                            <TimePicker style={{ width: '150px' }} format={format} allowClear={ false}></TimePicker>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableScriptlogicalnamescriptlogicalname'],
            dataIndex: 'SCRIPT_LOGICAL_NAME',
            render (_: any, record: DayProfileData, index:number) {
                return (
                    <>
                        <Form.Item name={'scriptLogicalName' + (index + 1)} rules={[ { required: true } ]} preserve={ false}>
                            <Input style={{width: '150px'}} disabled></Input>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableScriptselectorscriptselector'],
            dataIndex: 'SCRIPT_SELECTOR',
            render (_: any, record: DayProfileData, index:number) {
                return (
                    <>
                        <Form.Item name={'script_selector' + (index + 1)} rules={[ { required: true } ]} preserve={ false}>
                            <Select>
                                <Option value='1'>1</Option>
                                <Option value='2'>2</Option>
                                <Option value='3'>3</Option>
                                <Option value='4'>4</Option>
                                <Option value='5'>5</Option>
                                <Option value='6'>6</Option>
                                <Option value='7'>7</Option>
                                <Option value='8'>8</Option>
                                <Option value='9'>9</Option>
                                <Option value='10'>10</Option>
                                <Option value='11'>11</Option>
                                <Option value='12'>12</Option>
                                <Option value='13'>13</Option>
                                <Option value='14'>14</Option>
                                <Option value='15'>15</Option>
                                <Option value='16'>16</Option>
                            </Select>
                        </Form.Item>
                    </>
                );
            },
        },

    ];

    const getDayProfileList = (page:number = 1) => {
        setLoading(true);
        configuration.activityCalender.getDayProfile(page, ROWS, subSysNo).then((res:DayProfileList) => {
            setTotal(res.total);
            setDayProfileList(res.rows);
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
            getDayProfileList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: DayProfileData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
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

    const getDayProfileById = (dayId:string) => {
        configuration.activityCalender.getDayProfileById(dayId, subSysNo).then((res: DayProfileData[]) => {
            form.resetFields();
            setDialogDayProfileList(res);
            if (res.length > 0) {
                let obj = {};

                obj['dayId'] = res[0].DAY_IDX;
                obj['time_bucket_num'] = res.length + '';
                for (let i = 0; i < res.length; i++) {
                    let data = res[i];

                    obj['seqNo' + (i + 1)] = data.DAY_TIME_BUCKET_NO;
                    obj['scriptLogicalName' + (i + 1)] = data.SCRIPT_LOGICAL_NAME;
                    obj['script_selector' + (i + 1)] = data.SCRIPT_SELECTOR;
                    obj['day_start_time' + (i + 1)] = moment(data.START_TIME, format);
                }
                form.setFieldsValue(obj);
            } else {
                form.setFieldsValue({
                    dayId: dayId,
                });
            }
        });
    };

    const onSelectDayId = (value:string) => {
        getDayProfileById(value);
    };

    const onSelectNum = (value: string) => {
        let num = parseInt(value, 10);

        console.log(num, dialogDayProfileList.length);
        if (dialogDayProfileList.length > 0) {
            if (num > dialogDayProfileList.length) {
                let list = [ ...dialogDayProfileList ];
                let obj = {};

                for (let i = dialogDayProfileList.length; i < num ; i++) {
                    list.push({
                        DAY_TIME_BUCKET_NO: (i + 1) + '',
                        SCRIPT_LOGICAL_NAME: '0.0.10.0.100.255',
                        SCRIPT_SELECTOR: '1',
                    });
                    obj['seqNo' + (i + 1)] = (i + 1) + '';
                    obj['scriptLogicalName' + (i + 1)] = '0.0.10.0.100.255';
                    obj['script_selector' + (i + 1)] = '1';
                }
                setDialogDayProfileList(list);
                form.setFieldsValue(obj);
            } else {
                let list = [ ...dialogDayProfileList ];

                for (let i = 0; i < (dialogDayProfileList.length - num); i++) {
                    list.pop();
                }
                setDialogDayProfileList(list);
            }
        } else {
            let list:DayProfileData[] = [];
            let obj = {};

            for (let i = 0; i < num; i++) {
                list.push({
                    DAY_TIME_BUCKET_NO: (i + 1) + '',
                    SCRIPT_LOGICAL_NAME: '0.0.10.0.100.255',
                    SCRIPT_SELECTOR: '1',
                });
                obj['seqNo' + (i + 1)] = (i + 1) + '';
                obj['scriptLogicalName' + (i + 1)] = '0.0.10.0.100.255';
                obj['script_selector' + (i + 1)] = '1';
            }
            setDialogDayProfileList(list);
            form.setFieldsValue(obj);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = () => {

        form.validateFields().then((data) => {
            // if (!daySN) {
            setSubmitLoading(true);
            let params = {
                dayId: data.dayId,
                subSys: subSysNo,
                'time_bucket_num': data.time_bucket_num,
            };
            let num = parseInt(data.time_bucket_num, 10);

            for (let i = 0; i < num; i++) {
                params['seqNo' + (i + 1)] = data['seqNo' + (i + 1)];
                params['day_start_time' + (i + 1)] = moment(data['day_start_time' + (i + 1)]).format(format);
                params['scriptLogicalName' + (i + 1)] = data['scriptLogicalName' + (i + 1)];
                params['script_selector' + (i + 1)] = data['script_selector' + (i + 1)];
            }
            configuration.activityCalender.addDayProfile(params).then(() => {
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                setModalVisible(false);
                setSubmitLoading(false);
                setDialogDayProfileList([]);
                form.resetFields();
                getDayProfileList();
                setSelectedRowKeys([]);
            })
                .catch((err) => {
                    message.error(err);
                    setSubmitLoading(false);
                });
            // }
        });
        // form.resetFields();
    };

    const showEditDialog = () => {
        if (selectedRowKeys.length > 0) {
            setModalVisible(true);
            setModalTitle('Edit Day Profile');
            let list = dayProfileList.filter((v) => v.rn__ === selectedRowKeys[0]);
            let dayId = list[0].DAY_IDX!;

            // setDaySN(list[0].DAY_GROUP_SN!);
            getDayProfileById(dayId);
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
                    let list = dayProfileList.filter((v) => v.rn__ === selectedRowKeys[0]);

                    configuration.activityCalender.delelteProfile({ daySn: list[0].DAY_GROUP_SN, id: list[0].DAY_IDX }).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        getDayProfileList();
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

    useImperativeHandle(cRef, () => ({
        showAddDialog () {
            setModalVisible(true);
            setModalTitle('Add Day Profile');
            // setDaySN('');
            let addDayId = 1;

            if (dayProfileList.length > 0) {
                addDayId = parseInt(dayProfileList[dayProfileList.length - 1].DAY_IDX!, 10) + 1;
            }
            form.setFieldsValue({
                dayId: addDayId,
            });
            if (selectedRowKeys.length > 0) {
                let list = dayProfileList.filter((v) => v.rn__ === selectedRowKeys[0]);
                let obj = {};
                let temp = {
                    DAY_TIME_BUCKET_NO: list[0].DAY_TIME_BUCKET_NO,
                    SCRIPT_LOGICAL_NAME: list[0].SCRIPT_LOGICAL_NAME,
                    SCRIPT_SELECTOR: list[0].SCRIPT_SELECTOR,
                };

                obj['seqNo' + 1] = list[0].DAY_TIME_BUCKET_NO;
                obj['scriptLogicalName' + 1] = list[0].SCRIPT_LOGICAL_NAME;
                obj['script_selector' + 1] = list[0].SCRIPT_SELECTOR;
                obj['day_start_time' + 1] = moment('00:00:00', format);
                obj['time_bucket_num'] = '1';
                setDialogDayProfileList([ temp ]);
                form.setFieldsValue(obj);
            }
        },
        showEditDialog () {
            showEditDialog();
        },
        showDelDialog () {
            showDeleteConfirm();
        },
    }));

    useEffect(() => {
        getDayProfileList();
    }, []);

    return (
        <div className='remoteControl contentWrap'>
            <div className='table'>
                <Table columns={tableColumns} style={{ width: '60%' }} rowKey='rn__' className='table' dataSource={dayProfileList}
                    pagination={false} loading={loading} bordered={true}
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
                            } else {
                                rowsKeys.splice(0, rowsKeys.length);
                                rowsKeys.push(key);
                            }
                            setSelectedRowKeys(rowsKeys);
                        },
                    // onDoubleClick: (e: any) => {
                    //     e.stopPropagation();// 阻止点击事件向上冒泡
                    //     showEditDialog();
                    // },
                    })}
                ></Table>
            </div>
            <div className='positonLtBt'>
                <Pagination {...pagination} />
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
                            <Form.Item name='dayId' label='Day Id' rules={[ { required: true } ]}>
                                <Select onSelect={ onSelectDayId}>
                                    <Option value='1'>1</Option>
                                    <Option value='2'>2</Option>
                                    <Option value='3'>3</Option>
                                    <Option value='4'>4</Option>
                                    <Option value='5'>5</Option>
                                    <Option value='6'>6</Option>
                                    <Option value='7'>7</Option>
                                    <Option value='8'>8</Option>
                                    <Option value='9'>9</Option>
                                    <Option value='10'>10</Option>
                                    <Option value='11'>11</Option>
                                    <Option value='12'>12</Option>
                                    <Option value='13'>13</Option>
                                    <Option value='14'>14</Option>
                                    <Option value='15'>15</Option>
                                    <Option value='16'>16</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='time_bucket_num' label='Time Bucket Num' rules={[ { required: true } ]}>
                                <Select onSelect={ onSelectNum}>
                                    <Option value='1'>1</Option>
                                    <Option value='2'>2</Option>
                                    <Option value='3'>3</Option>
                                    <Option value='4'>4</Option>
                                    <Option value='5'>5</Option>
                                    <Option value='6'>6</Option>
                                    <Option value='7'>7</Option>
                                    <Option value='8'>8</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={4}>
                            <span style={{float: 'right', margin: '5px'}}>Day Profile List:</span>
                        </Col>

                        <Col span={20}>
                            <Table columns={dailogColumns} pagination={false} dataSource={ dialogDayProfileList}>

                            </Table>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </div>
    );
};


export default DayProfilePage;
