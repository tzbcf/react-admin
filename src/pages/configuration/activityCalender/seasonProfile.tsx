// eslint-disable-next-line no-use-before-define
import React, { useEffect, useImperativeHandle} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Modal, Form, Button, Select, Row, Col, DatePicker } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { SeasonProfileData, SeasonProfileList, WeekProfileData } from 'src/api/configuration/activityCalender/types';
import moment from 'moment';
import { ExclamationCircleOutlined} from '@ant-design/icons';

export type BRef = {
    showAddDialog(): void;
    showEditDialog(): void;
    showDelDialog(): void;
}

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    cRef?: React.MutableRefObject<BRef | undefined>;
};

const SeasonProfilePage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, cRef } = props;
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ seasonProfileList, setSeasonProfileList ] = useFetchState<SeasonProfileData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ weekNames, setWeekNames ] = useFetchState<WeekProfileData[]>([]);
    const [ seasonSN, setSeasonSN ] = useFetchState<string>('');
    const [ form ] = Form.useForm();
    const { Option } = Select;
    const ROWS = 10;
    const format = 'MM-DD HH:mm:ss';

    const tableColumns = [
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

    const getSeasonProfileList = (page:number = 1) => {
        setLoading(true);
        configuration.activityCalender.getSeasonProfile(page, ROWS, subSysNo).then((res:SeasonProfileList) => {
            setTotal(res.total);
            setSeasonProfileList(res.rows);
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
            getSeasonProfileList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: SeasonProfileData[]) => {
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
            if (!seasonSN) {
                let time = moment(data.time).format(format);
                let params = {
                    'season_name': data.season_name,
                    'week_name': data.week_name,
                    subSys: subSysNo,
                    startDate: time.substr(0, time.indexOf(' ')),
                    startTime: time.substr(time.indexOf(' ') + 1, time.length),
                };

                configuration.activityCalender.addSeasonProfile(params).then(() => {
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                    setWeekNames([]);
                    form.resetFields();
                    getSeasonProfileList();
                    setSelectedRowKeys([]);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            } else {
                let time = moment(data.time).format(format);
                let params = {
                    'season_name': data.season_name,
                    'week_name': data.week_name,
                    subSys: subSysNo,
                    startDate: time.substr(0, time.indexOf(' ')),
                    startTime: time.substr(time.indexOf(' ') + 1, time.length),
                    seasonSn: seasonSN,
                };

                configuration.activityCalender.editSeasonProfile(params).then(() => {
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                    setWeekNames([]);
                    form.resetFields();
                    getSeasonProfileList();
                    setSelectedRowKeys([]);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            }

        });
    };

    const getWeekNames = () => {
        configuration.activityCalender.getWeekNames(subSysNo).then((res) => {
            setWeekNames(res);
        });
    };

    const showEditDialog = () => {
        if (selectedRowKeys.length > 0) {
            setModalVisible(true);
            setModalTitle('Edit Season Profile');
            getWeekNames();
            let list = seasonProfileList.filter((v) =>
                v.SEASON_SN === selectedRowKeys[0]
            );
            let time = list[0].START_TIME;
            let obj = {
                'season_name': list[0].SEASON_TABLE_NAME,
                'week_name': list[0].WEEK_NAME,
                'time': moment(time.substr(time.indexOf('-') + 1, time.length), format),
            };

            setSeasonSN(list[0].SEASON_SN);
            form.setFieldsValue(obj);
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
                    let list = seasonProfileList.filter((v) =>
                        v.SEASON_SN === selectedRowKeys[0]
                    );

                    configuration.activityCalender.delelteProfile({ 'seasonSn': selectedRowKeys[0], id: list[0].SEASON_TABLE_NAME }).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        getSeasonProfileList();
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
            setModalTitle('Add Season Profile');
            getWeekNames();
            setSeasonSN('');
        },
        showEditDialog () {
            showEditDialog();
        },
        showDelDialog () {
            showDeleteConfirm();
        },
    }));

    useEffect(() => {
        getSeasonProfileList();
    }, []);

    return (
        <div className='remoteControl contentWrap'>

            <Table columns={tableColumns} style={{ width: '50%' }} rowKey='SEASON_SN' className='table' dataSource={seasonProfileList}
                pagination={pagination} loading={loading} bordered={true}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                onRow={(record) => ({
                    onClick: () => {
                        let key = record.SEASON_SN;
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
                            <Form.Item name='season_name' label='Season Profile Name' rules={[ { required: true } ]}>
                                <Select>
                                    <Option value='S1'>S1</Option>
                                    <Option value='S2'>S2</Option>
                                    <Option value='S3'>S3</Option>
                                    <Option value='S4'>S4</Option>
                                    <Option value='S5'>S5</Option>
                                    <Option value='S6'>S6</Option>
                                    <Option value='S7'>S7</Option>
                                    <Option value='S8'>S8</Option>
                                    <Option value='S9'>S9</Option>
                                    <Option value='S10'>S10</Option>
                                    <Option value='S11'>S11</Option>
                                    <Option value='S12'>S12</Option>
                                    <Option value='S13'>S13</Option>
                                    <Option value='S14'>S14</Option>

                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='time' label='Season Start' rules={[ { required: true } ]}>
                                <DatePicker format={ format} showTime/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='week_name' label='Week Name' rules={[ { required: true } ]}>
                                <Select>
                                    {weekNames.length && weekNames.map((v) => (<Option value={v.WEEK_NAME} key={v.WEEK_NAME}>{ v.WEEK_NAME}</Option>))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};


export default SeasonProfilePage;
