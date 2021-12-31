// eslint-disable-next-line no-use-before-define
import React, { useEffect, useImperativeHandle} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Modal, Form, Button, Select, Row, Col } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { WeekProfileData, WeekProfileList, DayProfileData } from 'src/api/configuration/activityCalender/types';
import { ExclamationCircleOutlined} from '@ant-design/icons';

export type CRef = {
    showAddDialog(): void;
    showEditDialog(): void;
    showDelDialog(): void;
}

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    cRef?: React.MutableRefObject<CRef | undefined>;
};

const WeekProfilePage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, cRef } = props;
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ weekProfileList, setWeekProfileList ] = useFetchState<WeekProfileData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    // const [ dialogWeekProfileList, setDialogWeekProfileList ] = useFetchState<WeekProfileData[]>([]);
    const [ dayIds, setDayIds ] = useFetchState<DayProfileData[]>([]);
    const [ weekSN, setWeekSN ] = useFetchState<string>('');
    const [ weekName, setWeekName ] = useFetchState<string>('');
    const [ form ] = Form.useForm();
    const { Option } = Select;
    const ROWS = 10;

    const tableColumns = [
        {
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTableWeekprofilenameweekprofilename'],
            dataIndex: 'WEEK_NAME',
        },
        {
            title: Mes['titleTableMonmon'],
            dataIndex: 'MO',
        },
        {
            title: Mes['titleTableTuetue'],
            dataIndex: 'TU',
        },
        {
            title: Mes['titleTableWedwed'],
            dataIndex: 'WE',
        },
        {
            title: Mes['titleTableThuthu'],
            dataIndex: 'TH',
        },
        {
            title: Mes['titleTableFrifri'],
            dataIndex: 'FR',
        },
        {
            title: Mes['titleTableSatsat'],
            dataIndex: 'SA',
        },
        {
            title: Mes['titleTableSunsun'],
            dataIndex: 'SU',
        },
    ];

    const getWeekProfileList = (page:number = 1) => {
        setLoading(true);
        configuration.activityCalender.getWeekProfile(page, ROWS, subSysNo).then((res:WeekProfileList) => {
            setTotal(res.total);
            setWeekProfileList(res.rows);
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
            getWeekProfileList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: WeekProfileData[]) => {
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

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = () => {
        form.validateFields().then((data) => {
            setSubmitLoading(true);
            if (!weekSN) {
                let params = {
                    'week_profile_name': data.week_profile_name,
                    monday: data.monday,
                    subSys: subSysNo,
                    tuesday: data.tuesday,
                    wednesday: data.wednesday,
                    thursday: data.thursday,
                    friday: data.friday,
                    saturday: data.saturday,
                    sunday: data.sunday,
                };

                configuration.activityCalender.addWeekProfile(params).then(() => {
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                    setDayIds([]);
                    form.resetFields();
                    getWeekProfileList();
                    setSelectedRowKeys([]);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            } else {
                let params = {
                    'week_profile_name': data.week_profile_name,
                    weekSn: weekSN,
                    oldWeekId: weekName,
                    monday: data.monday,
                    subSys: subSysNo,
                    tuesday: data.tuesday,
                    wednesday: data.wednesday,
                    thursday: data.thursday,
                    friday: data.friday,
                    saturday: data.saturday,
                    sunday: data.sunday,
                };

                configuration.activityCalender.editWeekProfile(params).then(() => {
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                    setDayIds([]);
                    form.resetFields();
                    getWeekProfileList();
                    setSelectedRowKeys([]);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            }
            setModalVisible(false);
            setDayIds([]);
            // form.resetFields();
        });
    };

    const getDayIds = () => {
        configuration.activityCalender.getDayIds(subSysNo).then((res) => {
            setDayIds(res);
        });
    };

    const getWeekProfileByName = (name:string) => {
        configuration.activityCalender.getWeekProfileById(name, subSysNo).then((res) => {
            // setDialogWeekProfileList(res);
            if (res.length > 0) {
                let obj = {
                    'week_profile_name': res[0].WEEK_NAME,
                    'monday': res[0].MO,
                    'tuesday': res[0].TU,
                    'wednesday': res[0].WE,
                    'thursday': res[0].TH,
                    'friday': res[0].FR,
                    'saturday': res[0].SA,
                    'sunday': res[0].SU,
                };

                form.setFieldsValue(obj);
            }
        });
    };

    const onSelectName = (value:string) => {
        getWeekProfileByName(value);
    };

    const showEditDialog = () => {
        if (selectedRowKeys.length > 0) {
            setModalVisible(true);
            setModalTitle('Edit Week Profile');
            getDayIds();
            let list = weekProfileList.filter((v) => v.WEEK_SN === selectedRowKeys[0]);

            setWeekSN(selectedRowKeys[0]);
            setWeekName(list[0].WEEK_NAME);
            getWeekProfileByName(list[0].WEEK_NAME);
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
                    configuration.activityCalender.delelteProfile({ 'weekSn': selectedRowKeys[0] }).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        getWeekProfileList();
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
            setModalTitle('Add Week Profile');
            getDayIds();
            setWeekSN('');
        },
        showEditDialog () {
            showEditDialog();
        },
        showDelDialog () {
            showDeleteConfirm();
        },
    }));

    useEffect(() => {
        getWeekProfileList();
    }, []);

    return (
        <div className='remoteControl contentWrap'>

            <Table columns={tableColumns} style={{ width: '60%' }} rowKey='WEEK_SN' className='table' dataSource={weekProfileList}
                pagination={pagination} loading={loading} bordered={true}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                onRow={(record) => ({
                    onClick: () => {
                        let key = record.WEEK_SN;
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
                })}
            ></Table>
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
                            <Form.Item name='week_profile_name' label='Week Profile Name' rules={[ { required: true } ]}>
                                <Select onSelect={ onSelectName}>
                                    <Option value='W1'>W1</Option>
                                    <Option value='W2'>W2</Option>
                                    <Option value='W3'>W3</Option>
                                    <Option value='W4'>W4</Option>
                                    <Option value='W5'>W5</Option>
                                    <Option value='W6'>W6</Option>
                                    <Option value='W7'>W7</Option>
                                    <Option value='W8'>W8</Option>
                                    <Option value='W9'>W9</Option>
                                    <Option value='W10'>W10</Option>
                                    <Option value='W11'>W11</Option>
                                    <Option value='W12'>W12</Option>

                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='monday' label='Monday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='tuesday' label='Tuesday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='wednesday' label='Wednesday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='thursday' label='Thursday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='friday' label='Friday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='saturday' label='Saturday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='sunday' label='Sunday' rules={[ { required: true } ]}>
                                <Select>
                                    {dayIds.length && dayIds.map((v) => (<Option value={v.DAY_IDX!} key={v.DAY_IDX}>{ v.DAY_IDX}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};


export default WeekProfilePage;
