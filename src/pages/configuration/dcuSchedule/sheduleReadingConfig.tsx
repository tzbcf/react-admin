/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Modal, Form, Button, Input, Select, DatePicker, Row, Col, Checkbox, InputNumber } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import { configuration } from 'src/api';
import { DcuType, ProtocolType, CstGroup, TaskRuleData, TaskRuleList, CommandData, CommandType } from 'src/api/configuration/dcuSchedule/types';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type SelectGroup = {
    name: string;
    value: string;
    children?: SelectGroup[];
}

type SelectOption = {
    name: string;
    value: string;
}

const ScheduleReadingConfig: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ dcuTypeList, setDcuTypeList ] = useFetchState<SelectOption[]>([]);
    const [ protocolTypeList, setProtocolTypeList ] = useFetchState<SelectOption[]>([ {name: 'All', value: 'All'} ]);
    const [ cstGroupList, setCstGroupList ] = useFetchState<SelectGroup[]>([ { name: 'All', value: 'All', children: [ { name: 'All', value: 'All' } ] } ]);
    const [ taskRuleList, setTaskRuleList ] = useFetchState<TaskRuleData[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ configModalVisible, setConfigModalVisible ] = useFetchState<boolean>(false);
    const [ downEnable, setDownEnable ] = useFetchState<boolean>(false);
    const [ selectedDcus, setSelectedDcus ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ SN, setSN ] = useFetchState<string>('');
    const [ SNCommand, setSNCommand ] = useFetchState<string>('');
    const [ commandList, setCommandList ] = useFetchState<CommandData[]>([]);
    const [ commandTypeList, setCommandTypeList ] = useFetchState<CommandType[]>([]);
    const [ hours, setHours ] = useFetchState<number[]>([]);
    const [ minutes, setMinutes ] = useFetchState<number[]>([]);
    const [ readMode, setReadMode ] = useFetchState<string>('');
    const format = 'YYYY-MM-DD HH:mm:ss';
    const [ form ] = Form.useForm();
    const [ form1 ] = Form.useForm();
    const { Option, OptGroup} = Select;
    const ROWS = 10;
    // 点击设备树的DCU
    const onNodeCheck = (row: any[]) => {
        console.log(row);
        setSelectedDcus(row);
    };

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableSchedulednamescheduledname'],
            dataIndex: 'REMARK',
            // sorter: (a: DailyFrozenData, b: DailyFrozenData) => parseFloat(a.CST_ADDR) - parseFloat(b.CST_ADDR),
        },
        {
            title: Mes['titleTableDcutypedcutype'],
            dataIndex: 'CST_TYPE_NAME',
        },
        {
            title: Mes['titleTableCommandcommand'],
            dataIndex: 'FN_NAME',
            sorter: (a: TaskRuleData, b: TaskRuleData) => a.FN_NAME.localeCompare(b.FN_NAME),
        },
        {
            title: Mes['titleTableObisobis'],
            dataIndex: 'AFN',
            sorter: (a: TaskRuleData, b: TaskRuleData) => a.AFN.localeCompare(b.AFN),
        },
        {
            title: Mes['titleLabelWhethertoenablewhethertoenable'],
            dataIndex: 'IS_ENALBE',
            sorter: (a: TaskRuleData, b: TaskRuleData) => parseFloat(a.IS_ENALBE) - parseFloat(b.IS_ENALBE),
            render (_: any, record: TaskRuleData) {
                return (<span>{ record.IS_ENALBE === '1' ? 'YES' : 'NO'}</span>);
            },
        },
        {
            title: Mes['titleTableStarttimestarttime'],
            dataIndex: 'EXTRA_PARAMETERS',
        },
        {
            title: Mes['titleTableReadmodereadmode'],
            dataIndex: 'RULE_NAME',
        },
        {
            title: Mes['titleTableSpecialgroupnamespecialgroupname'],
            dataIndex: 'CLASSICAL_DETAIL_NAME',
        },
    ];

    // 获取table数据
    const getData = (page:number = 1) => {
        sRef.current?.getFormData().then((data:any) => {
            console.log(data);
            setLoading(true);
            configuration.dcuScheduleMgt.getTaskRuleList(page, ROWS, data.dcuType, data.period, data.protocolType, data.Group_id, subSysNo).then((res:TaskRuleList) => {
                setTotal(res.total);
                setCurrent(page);
                setLoading(false);
                setTaskRuleList(res.rows);
            })
                .catch((err) => {
                    message.error(err);
                    setLoading(false);
                });
        });
    };

    // 获取协议下拉数据
    const getProtocolType = (dcuType:string) => {
        configuration.dcuScheduleMgt.getProtocolTypeList(dcuType, subSysNo).then((res: ProtocolType[]) => {
            const list: SelectOption[] = [];

            list.push({
                name: 'All',
                value: 'All',
            });
            if (res.length) {

                res.map((v) => {
                    list.push({
                        name: v.AFN_NAME,
                        value: v.AFN,
                    });
                });
            }
            setProtocolTypeList(list);
        });
    };

    // 获取command的下拉数据列表
    const getCommandList = (dcu:string, commandType:string) => {
        configuration.dcuScheduleMgt.getCommandList(dcu, commandType).then((res) => {
            setCommandList(res);
            if (res.length) {
                form1.setFieldsValue({
                    snCommand: res[0].SN,
                });
            }
        });
    };

    const getCommandTypeList = (dcu:string) => {

        configuration.dcuScheduleMgt.getCommandTypeList(dcu, '').then((res) => {
            setCommandTypeList(res);
            if (res.length) {
                getCommandList(dcu, res[0].SN);
                if (res.length) {
                    form1.setFieldsValue({
                        snCommandType: res[0].SN,
                    });
                }
            }
        });


    };


    const selectDcuType = (value:string) => {
        getProtocolType(value);
        sRef.current?.setFieldsValue({
            protocolType: 'All',
        });
        getData();
    };

    const selectProtocolType = (value: string) => {
        console.log(value);
        getData();
    };

    const selectTimeType = (value: string) => {
        console.log(value);
        getData();
    };

    const selectGroupType = (value: string) => {
        console.log(value);
        getData();
    };

    const selectDcu = (value:string) => {
        getCommandTypeList(value);
    };

    const selectCommandType = (value: string) => {
        let dcuType = form1.getFieldValue('dcuType');

        form1.setFieldsValue({
            snCommand: '',
        });
        getCommandList(dcuType, value);
    };

    const selectReadMode = (value:string) => {
        setReadMode(value);
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnTitleAdd'],
            async onClick () {
                setModalVisible(true);
                setSN('');
                let data = await sRef.current?.getFormData();

                getCommandTypeList(data.dcuType);

                form1.setFieldsValue({
                    isEnable: '1',
                    sn_group_id: 'All',
                    readMode: '0',
                    hour: '1',
                    minute: '0',
                    dcuType: data.dcuType,
                });
                setReadMode('0');
            },
        },
        {
            type: 'Edit',
            btnType: 'primary',
            title: Mes['btnTitleEditor'],
            async onClick () {
                if (selectedRowKeys.length > 0) {
                    let data = await sRef.current?.getFormData();

                    getCommandTypeList(data.dcuType);
                    setModalVisible(true);
                    setSN(selectedRowKeys[0]);
                    let item = taskRuleList.filter((v) => v.SN === selectedRowKeys[0])[0];

                    setSNCommand(item.SN_COMMAND);
                    let time = item.EXTRA_PARAMETERS;
                    let day = '';
                    let hour = '1';
                    let minute = '0';

                    if (time.includes(' ')) {
                        let times = time.split(' ');

                        day = times[0];
                        hour = times[1].split(':')[0];
                        minute = times[1].split(':')[1];
                    } else if (time.includes(':')) {
                        let times = time.split(':');

                        hour = times[0];
                        minute = times[1];
                    }
                    form1.setFieldsValue({
                        isEnable: item.IS_ENALBE,
                        sn_group_id: item.GROUP_GUID ? item.GROUP_GUID : 'All',
                        readMode: item.READ_MODE,
                        hour: hour,
                        minute: minute,
                        days: day,
                        dcuType: data.dcuType,
                        // snCommand: item.SN_COMMAND,
                        preReadDays: item.STICK >= 24 ? item.STICK / 24 : item.STICK,
                        remark: item.REMARK,
                    });
                    setReadMode(item.READ_MODE);
                } else {
                    message.warn(Mes['messageAlarmSelectrowselectrow']);
                }

            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            title: Mes['btnTitleDelete'],
            onClick () {
                if (selectedRowKeys.length > 0) {
                    Modal.confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['messageAlarmDeleterecorddeleterecord'],
                        onOk () {
                            let param = {
                                sn: selectedRowKeys[0],
                            };

                            configuration.dcuScheduleMgt.deleteTaskRule(param).then(() => {
                                message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                                getData();
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
                    message.warn(Mes['messageAlarmSelectrowselectrow']);
                }

            },
        },
        {
            type: 'Read',
            btnType: 'primary',
            title: Mes['btnLoadload'],
            onClick () {// 加载
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: Mes['messageAlarmLoadtaskruleloadtaskrule'],
                    async onOk () {
                        let str = '';

                        if (selectedDcus.length > 0) {// 获取当前选择dcu设备
                            for (let i = 0; i < selectedDcus.length; i++) {
                                if (i === 0) {
                                    str += "\'" + selectedDcus[i].CST_ID + "\'";
                                } else {
                                    str += ",\'" + selectedDcus[i].CST_ID + "\'";
                                }
                            }
                        }
                        // console.log(str);
                        let data = await sRef.current?.getFormData();
                        let params = {
                            subSysNo: subSysNo,
                            dcuIds: str,
                            deviceType: data.dcuType,
                        };

                        configuration.dcuScheduleMgt.loadTaskRule(params).then(() => {
                            message.success(Mes['titleTableSuccesssuccess']);
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
        {
            type: 'Install',
            btnType: 'primary',
            title: Mes['btnConfigftpconfigftp'],
            async onClick () {
                const params: string[] = await configuration.dcuScheduleMgt.getSettings();

                if (params.length) {
                    setConfigModalVisible(true);
                    form.setFieldsValue({
                        ip: params[0],
                        port: params[1],
                        userName: params[2],
                        pwd: params[3],
                        startTime: moment(params[4], format),
                        period: params[5],
                        periodType: params[6],
                        downip: params[7],
                        downport: params[8],
                        downuserName: params[9],
                        downpwd: params[10],
                        downenable: params[11] === '1',
                    });
                    setDownEnable(params[11] === '1');
                }


            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const searchList = [
        {
            name: 'dcuType',
            type: 'Select',
            col: 3,
            options: dcuTypeList,
            attr: {
                style: { width: '100%' },
                onSelect: selectDcuType,
            },
        },
        {
            name: 'protocolType',
            col: 4,
            type: 'Select',
            options: protocolTypeList,
            attr: {
                style: { width: '100%' },
                onSelect: selectProtocolType,
            },
        },
        {
            name: 'period',
            col: 3,
            type: 'Select',
            options: [ {name: 'All', value: 'All'}, {name: 'Month', value: '0'}, {name: 'Day', value: '1'} ],
            attr: {
                style: { width: '100%' },
                onSelect: selectTimeType,
            },
        },
        {
            name: 'Group_id',
            col: 3,
            type: 'SelectGroup',
            options: cstGroupList,
            attr: {
                style: { width: '100%' },
                onSelect: selectGroupType,
            },
        },
    ];

    const search = (data: any) => {
        console.log('a-----', data);
        getData();
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            getData(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        hideSelectAll: true,
        onChange: (keys: React.Key[], selectedRows: TaskRuleData[]) => {
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

    const initConfig = async () => {
        let HOURS = [];

        for (let i = 0; i < 24; i++) {
            HOURS.push(i);
        }
        setHours(HOURS);
        let MINUTES = [];

        for (let i = 0; i < 60; i++) {
            MINUTES.push(i);
        }
        setMinutes(MINUTES);
        const dcutypes:DcuType[] = await configuration.dcuScheduleMgt.getDcuTypeList();

        if (dcutypes.length > 0) {
            let list:SelectOption[] = [];

            dcutypes.map((v) => {
                list.push({
                    name: v.CST_TYPE_NAME,
                    value: v.CST_TYPE,
                });
            });
            setDcuTypeList(list);
            getProtocolType(dcutypes[0].CST_TYPE);
        }
        const groups = await configuration.dcuScheduleMgt.getCstTypeList(subSysNo);

        let groupList = [ ...cstGroupList ];

        if (groups.length > 0) {
            const groupName: string[] = [];

            groups.map((v: CstGroup) => {
                if (!groupName.includes(v.GNAME)) {
                    groupName.push(v.GNAME);
                }
            });
            for (let g of groupName) {
                const list = groups.filter((v: CstGroup) => v.GNAME === g);
                let children:SelectGroup[] = [];

                list.map((v: CstGroup) => {
                    children.push({ name: v.CLASSICAL_DETAIL_NAME, value: v.CLASSICAL_DETAIL_GUID });
                });
                const group:SelectGroup = {
                    name: g,
                    value: g,
                    children: children,
                };

                groupList.push(group);
            }
        }
        setCstGroupList(groupList);
        setTimeout(() => {
            sRef.current?.setFieldsValue({
                dcuType: dcutypes.length > 0 ? dcutypes[0].CST_TYPE : '',
                protocolType: 'All',
                period: 'All',
                Group_id: 'All',
            });
            getData();
        }, 500);
    };

    // 保存设置信息
    const saveSettings = () => {
        form.validateFields().then((data:any) => {
            console.log(data);
            let time = data.startTime;
            let enable = data.downenable;

            data.startTime = moment(time).format(format);
            data.downenable = enable ? '1' : '0';

            configuration.dcuScheduleMgt.saveSettings(data).then(() => {
                setConfigModalVisible(false);
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        });
    };

    const connection = () => {
        form.validateFields().then((data:any) => {
            console.log(data);
            let params = {
                subSysNo: subSysNo,
                ftpIpAddress: data.ip,
                ftpUserName: data.userName,
                ftpUserPwd: data.pwd,
            };

            configuration.dcuScheduleMgt.tryFtpConnection(params).then(() => {
                message.success(Mes['messageSuccessTestconnectionsucctestconnectionsucc']);
            })
                .catch(() => {
                    message.error(Mes['messageErrorTestconnectionfailtestconnectionfail']);
                });
        });
    };

    const handleCancel = () => {
        setConfigModalVisible(false);
        setModalVisible(false);
    };

    const changeEnable = (e:any) => {
        setDownEnable(e.target.checked);
    };

    const saveData = () => {
        form1.validateFields().then((data: any) => {
            setSubmitLoading(true);

            data.subSys = subSysNo;
            console.log(data);
            if (data.sn_group_id === 'All') {
                data.sn_group_id = '';
            }
            if (SN) {// 编辑
                data.sn = SN;
                data.snoldComand = SNCommand;
                configuration.dcuScheduleMgt.editTaskRule(data).then(() => {
                    message.success(Mes['messageConfirmSendschemeloadingsendschemeloading']);
                    getData();
                    setSubmitLoading(false);
                    setModalVisible(false);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            } else {// 添加
                let preReadDays = data.preReadDays;

                data.preReadDays = preReadDays * 24;
                configuration.dcuScheduleMgt.addTaskRule(data).then(() => {
                    message.success(Mes['messageConfirmSendschemeloadingsendschemeloading']);
                    getData();
                    setSubmitLoading(false);
                    setModalVisible(false);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            }
        });
    };

    useEffect(() => {
        initConfig();
    }, []);

    return (<>
        <div className='remoteControl contentWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} checkbox={ false} cRef={cRef} PAGESIZE={12} />
            </div>
            <div className='wrapRight'>
                <div className='pv10h20'>
                    {
                        searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} isSearch={ false} btnConfig={ btnConfig}/>
                    }
                </div>
                <div id={'table'}>
                    <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' pagination={pagination}
                        loading={loading} dataSource={ taskRuleList} rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        onRow={(record) => ({
                            onClick: () => {
                                let key = record.SN;
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
                        })}></Table>
                </div>
            </div>
            <Modal visible={configModalVisible}
                title={Mes['titleTableFtpparametersftpparameters']}
                destroyOnClose
                width={ 1000}
                onCancel={handleCancel}
                // afterClose={afterClose}
                footer={[
                    <Button key='connection' onClick={connection}>{ Mes['comboboxConnectionconnection'] }</Button>,
                    <Button key='back' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                    <Button key='submit' type='primary' onClick={saveSettings}> { Mes['btnSavesave'] }</Button>,
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
                            <Form.Item name='ip' label='IP' rules={[ { required: true } ]}>
                                <Input maxLength={ 20}></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='port' label='Port' rules={[ { required: true } ]}>
                                <Input maxLength={ 20}></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='userName' label='Operator' rules={[ { required: true } ]}>
                                <Input maxLength={ 20}></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='pwd' label='Password' rules={[ { required: true } ]}>
                                <Input maxLength={ 20} type='password'></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='startTime' label='Time' rules={[ { required: true } ]}>
                                <DatePicker format={ format} showTime></DatePicker>
                            </Form.Item>
                        </Col>
                        <Col span={ 12}>
                            <Form.Item label='Period' required>
                                <Row>
                                    <Col span={6}>
                                        <Form.Item name='period' rules={[ { required: true } ]}>
                                            <Input maxLength={ 20}></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6} style={{marginLeft: '10px'}}>
                                        <Form.Item name='periodType' rules={[ { required: true } ]}>
                                            <Select>
                                                <Option value='0'>Day</Option>
                                                <Option value='1'>Hour</Option>
                                                <Option value='2'>Minute</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={3}></Col>
                        <Col span={12}>
                            <Form.Item name='downenable' valuePropName='checked'>
                                <Checkbox onChange={ changeEnable} >Frozen data uploaded to FTP server</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={6}></Col>
                    </Row>
                    <div style={{display: downEnable ? '' : 'none'}}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name='downip' label='IP' rules={[ { required: true } ]}>
                                    <Input maxLength={20}></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='downport' label='Port' rules={[ { required: true } ]}>
                                    <Input maxLength={20}></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name='downuserName' label='Operator' rules={[ { required: true } ]}>
                                    <Input maxLength={20}></Input>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name='downpwd' label='Password' rules={[ { required: true } ]}>
                                    <Input maxLength={20} type='password'></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal>

            <Modal visible={modalVisible}
                title={ Mes['titlePromptprompt']}
                destroyOnClose
                width={ 1200}
                onCancel={handleCancel}
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                    <Button key='submit' type='primary' onClick={saveData} loading={ submitLoading}> { Mes['btnSavesave'] }</Button>,
                ]}>
                <Form
                    form={form1}
                    name='langForm'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    preserve={false}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='remark' label='Scheduled Reading Name' rules={[ { required: true } ]}>
                                <Input maxLength={ 20}></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='dcuType' label='DCU Type' rules={[ { required: true } ]}>
                                <Select onSelect={ selectDcu}>
                                    {dcuTypeList.map((v) => <Option key={v.value} value={ v.value}>{ v.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='sn_group_id' label='Group Name' rules={[ { required: true } ]}>
                                <Select>
                                    {
                                        cstGroupList && cstGroupList.map((item) => (
                                            <OptGroup key={item.value} label={item.name}>
                                                {
                                                    item.children?.map((o) => (
                                                        <Option value={ o.value} key={o.value}>{ o.name }</Option>
                                                    ))
                                                }
                                            </OptGroup>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='snCommandType' label='Command Type' rules={[ { required: true } ]}>
                                <Select onSelect={ selectCommandType}>
                                    {commandTypeList.map((v) => <Option key={v.SN} value={ v.SN}>{ v.AFN_NAME}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='snCommand' label='Command' rules={[ { required: true } ]}>
                                <Select>
                                    {commandList.map((v) => <Option key={v.SN} value={ v.SN}>{ v.FN_NAME}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='isEnable' label='Whether to enable' rules={[ { required: true } ]}>
                                <Select>
                                    <Option value='1'>Enable</Option>
                                    <Option value='0'>Disable</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='readMode' label='Read mode' rules={[ { required: true } ]}>
                                <Select onSelect={ selectReadMode}>
                                    <Option value='0'>Month</Option>
                                    <Option value='1'>Day</Option>
                                    <Option value='2'>Profile</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='preReadDays' label='Pre-read Day' rules={[ { required: true } ]}>
                                <InputNumber min={1} max={ 90} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        {readMode !== '1' && (<Col span={12}>
                            <Form.Item name='days' label='Day' rules={[ { required: true } ]}>
                                <InputNumber min={1} max={30} style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>)}
                        {readMode !== '2' && (
                            <>
                                <Col span={12}>
                                    <Form.Item label='Time' required>
                                        <Row>
                                            <Col span={6}>
                                                <Form.Item name='hour' required>
                                                    <Select>
                                                        {hours.map((v) => <Option key={v} value={ v}>{ v}</Option>)}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={6} style={{ marginLeft: '10px' }}>
                                                <Form.Item name='minute' required>
                                                    <Select>
                                                        {minutes.map((v) => <Option key={v} value={ v}>{ v}</Option>)}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                {/* <Col span={6}>
                                    <Form.Item name='minute' rules={[ { required: true } ]}>
                                        <Select>
                                            {minutes.map((v) => <Option key={v} value={ v}>{ v}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col> */}
                            </>
                        )}
                    </Row>
                </Form>
            </Modal>
        </div>
    </>);
};


export default ScheduleReadingConfig;
