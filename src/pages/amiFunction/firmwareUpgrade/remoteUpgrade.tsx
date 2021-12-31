/*
 * FileName : remoteUpgrade.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-15 14:28:59
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Input, Tree, Row, Col, Select, Button, message, Modal, Form, DatePicker, Upload, InputNumber } from 'antd';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import { formatArrOptions, Options } from 'src/utils/function';
import { customer, amiFunc } from 'src/api';
import { DeviceTypeData, ProgramsList } from 'src/api/AmiFunction/firmwareUpgrade/type';
import { UploadOutlined, ExclamationCircleOutlined, ToTopOutlined } from '@ant-design/icons';
import { Key } from 'antd/es/table/interface';
import UpgradeInfo, {PLanRowsInfo, PlanAreaInfo} from './upgradeInfo';
import { dateFormat, IsEmptyObejct, IsIp } from 'src/utils/utils';
import { showLoading, hideLoading } from 'src/components/common/loding';
import moment, {Moment} from 'moment';
const { confirm } = Modal;
const { Search } = Input;
const { Option } = Select;

type Props = {
    Mes: LangMessage,
    subSysNo: string;
    nodeNo: string;
    tabsChange: (val:string, flag?:boolean) => void
}

const rowsFormatTreeData = (arr: any) => arr.map((v:any) => ({
    key: v.rn__,
    title: v.Program_Name,
    ...v,
}));

const RemoteUpgrade: React.FC<Props> = (props) => {
    const { Mes, subSysNo, tabsChange } = props;
    const [ form ] = Form.useForm();
    const fileTypeList = [ 'DCU', 'Meter', 'Main Module', 'Slave Module', 'DC2000' ];
    const CATEGORYLIST = [
        {
            value: 'transformer',
            name: Mes['titleTableTransformertransformer'],
        },
        {
            value: 'meterGroup',
            name: Mes['labelTitleMeterGroup'],
        },
    ];
    const INITPROGRAMBASEINFO = {
        'Program_Name': '',
        'File_Type': '',
        'IP_Address': '',
        'User_Name': '',
        'File_Name': '',
        DEVICE_MODEL_NAME: '',
        IDENTIFIER: '',
        VERSION: '',
        ACTIVE_TIME: '',
        'Create_Time': '',
    };
    const INITAREABASEINFO = {
        dstName: '',
        failCount: 0,
        lastCreationTime: '',
        deviceType: '',
    };
    const [ treeData, setTreeData ] = useFetchState<any[]>([]);
    // table选中
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<Key[]>([]);
    const [ selectedRowNode, setSelectedRowNode ] = useFetchState<any>({});
    const [ categoryOpt, setCategoryOpt ] = useFetchState<Options[]>(CATEGORYLIST);
    const [ categoryKey, setCategoryKey ] = useFetchState<string>('transformer');
    const [ areaOpt, setAreaOpt ] = useFetchState<Options[]>([]);
    const [ areaKeys, setAreaKeys ] = useFetchState<string>('All');
    const [ groupOpt, setGroupOpt ] = useFetchState<Options[]>([]);
    const [ lineOpt, setLineOpt ] = useFetchState<Options[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ deviceType, setDeviceType ] = useFetchState<Options[]>([]);
    const [ retransTimes, setRetransTimes ] = useFetchState<Options[]>([]);
    // 方案详情
    const [ programBaseInfoObj, setProgramBaseInfoObj ] = useFetchState<PLanRowsInfo>(INITPROGRAMBASEINFO);
    const [ areaBaseInfoObj, setAreaBaseInfoObj ] = useFetchState<PlanAreaInfo>(INITAREABASEINFO);
    const [ equipmentTotal, setEquipmentTotal ] = useFetchState<number>(0);
    const [ fileFolder, setFileFolder ] = useFetchState<string>('');
    const [ editModel, setEditModel ] = useFetchState<boolean>(false);
    const [ fileList, setFileList ] = useFetchState<any[]>([]);
    const getProgramNameList = async (programName: string = '') => {
        try {
            const res = await amiFunc.firmwareUpgrade.getProgramList(programName);

            setTreeData(rowsFormatTreeData(res.rows));
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 设备类型获取
    const getDeviceType = async (fileType: string = '0') => {
        try {
            const res = await amiFunc.firmwareUpgrade.getDeviceType(fileType);
            const list = formatArrOptions<DeviceTypeData>(res, 'NO', 'NAME');

            form.setFieldsValue({
                deviceModel: list[0].value,
            });
            setDeviceType(list);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            async onClick () { // 添加
                try {
                    setFileList([]);
                    setEditModel(false);
                    await getDeviceType();
                    const res = await amiFunc.firmwareUpgrade.getSetting();
                    // 设置默认参数

                    form.setFieldsValue({
                        ftpIpAddress: res[0],
                        ftpIpPort: res[1],
                        ftpUserName: res[2],
                        ftpUserPwd: res[3],
                        programName: '',
                        fileType: 0,
                        upgradeType: '1',
                        retransTimes: '1',
                        activeDate: '',
                        identifier: '',
                        version: '',
                        fileName: [],
                    });
                    setModalVisible(true);

                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }

            },
        },
        {
            type: 'Edit',
            btnType: 'primary',
            async onClick () { // 编辑修改
                if (!selectedRowKeys.length) {
                    message.warning(Mes['messageAlarmSelectrowselectrow']);
                    return;
                }
                let activeDate: string|Moment = '';
                // 设置默认参数

                if (!selectedRowNode.ACTIVE_TIME || selectedRowNode.ACTIVE_TIME === 'null') {
                    activeDate = moment(dateFormat('YYYY/MM/DD'), 'YYYY/MM/DD');
                } else {
                    activeDate = moment(selectedRowNode.ACTIVE_TIME);
                }
                form.setFieldsValue({
                    ftpIpAddress: selectedRowNode.IP_Address,
                    ftpIpPort: selectedRowNode.FTP_Port,
                    ftpUserName: selectedRowNode.User_Name,
                    ftpUserPwd: selectedRowNode.Password,
                    programName: selectedRowNode.Program_Name,
                    fileType: selectedRowNode.File_Type,
                    deviceModel: selectedRowNode.DEVICE_MODEL,
                    upgradeType: selectedRowNode.UPGRADE_TYPE,
                    retransTimes: selectedRowNode.RETRANS_TIMES,
                    activeDate: activeDate,
                    identifier: selectedRowNode.IDENTIFIER,
                    version: selectedRowNode.VERSION,
                });
                // 设置编辑模式，禁止部分修改
                setEditModel(true);
                setModalVisible(true);
            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            async onClick () { // 删除
                if (!selectedRowKeys.length) {
                    message.warning(Mes['messageAlarmSelectrowselectrow']);
                    return;
                }
                confirm({ // 确认框
                    title: Mes['messageSuccessConfirmconfirm'],
                    icon: <ExclamationCircleOutlined />,
                    content: Mes['confirmTextDeleteFiles'],
                    async onOk () {
                        try {
                            const res = await amiFunc.firmwareUpgrade.delFileImpl({
                                rowsList: JSON.stringify([ selectedRowNode ]),
                                subSysNo,
                            });

                            if (res.flag) {
                                message.success(Mes['titleTableSuccesssuccess']);
                                setModalVisible(false);
                                getProgramNameList();
                                setSelectedRowKeys([]);
                                setSelectedRowNode({});
                            } else {
                                message.error(res.mess);
                            }
                        } catch (error) {
                            console.error(error);
                            message.error(`${error}`);
                        }
                    },
                    onCancel () {
                        console.log('Cancel');
                    },
                });
            },
        },
    ];

    // 方案搜索
    const planSearch = (val: string) => {
        getProgramNameList(val);
    };

    // 方案详情获取
    const getDevicepgradeInfo = async (rows: ProgramsList = selectedRowNode, areaVal: string = areaKeys, category:string = categoryKey) => {
        try {
            showLoading();
            const res = await amiFunc.firmwareUpgrade.getDevicepgradeInfo({
                subSysNo,
                deviceModel: rows.DEVICE_MODEL,
                fileType: rows.File_Type,
                programName: rows.Program_Name,
                area: category !== 'meterGroup' ? areaVal : '',
                sortGuid: category === 'meterGroup' ? areaVal : '',
            });

            setEquipmentTotal(res.totalCount);
            setAreaBaseInfoObj({
                dstName: res.dstName || 'All',
                failCount: res.failCount || 0,
                lastCreationTime: res.lastCreationTime || '',
                deviceType: rows.File_Type || '',
            });
            setProgramBaseInfoObj({
                'Program_Name': rows.Program_Name,
                'File_Type': rows.File_Type,
                'IP_Address': rows.IP_Address,
                'User_Name': rows.User_Name,
                'File_Name': rows.File_Name,
                DEVICE_MODEL_NAME: rows.DEVICE_MODEL_NAME,
                IDENTIFIER: rows.IDENTIFIER,
                VERSION: rows.VERSION,
                ACTIVE_TIME: rows.ACTIVE_TIME,
                'Create_Time': rows.Create_Time,
            });
            if ((rows.File_Type === 'DCU' || rows.File_Type === 'Main Module') &&
                categoryKey === 'meterGroup'
            ) {
                setCategoryOpt([ {
                    value: 'transformer',
                    name: Mes['titleTableTransformertransformer'],
                } ]);
                setCategoryKey('transformer');
                setAreaKeys('All');
            }
            hideLoading();
        } catch (error: any) {
            hideLoading();
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 鼠标点击table某列元素
    const onTreeCheck = (rowKey: Key[] | { checked: Key[]; halfChecked: Key[]; }, selectedRows: { checkedNodes: any[] }) => {
        const selKeys = rowKey as Key[];

        if (selKeys.length) {
            setSelectedRowKeys([ selKeys[selKeys.length - 1] ]);
            const checkedNodes = selectedRows.checkedNodes;

            setSelectedRowNode(checkedNodes[checkedNodes.length - 1]);
            getDevicepgradeInfo(checkedNodes[checkedNodes.length - 1]);
        } else {
            setSelectedRowKeys([]);
            setSelectedRowNode({});
        }
    };

    // 分类变化监听
    const categoryChange = async (val: string) => {
        try {
            if (val !== 'transformer') {
                if (groupOpt.length) {
                    setAreaOpt(groupOpt);
                } else {
                    const res = await customer.meterMgnt.getMeterGroup();
                    const groupList: Options[] = formatArrOptions(res, 'CLASSICAL_DETAIL_GUID', 'CLASSICAL_DETAIL_NAME');

                    groupList.unshift({value: 'All', name: 'All'});
                    setGroupOpt(groupList);
                    setAreaOpt(groupList);
                }
            } else {
                if (lineOpt.length) {
                    setAreaOpt(lineOpt);
                } else {
                    const res = await amiFunc.firmwareUpgrade.getAreaList();
                    const lineList: Options[] = formatArrOptions(res, 'ID', 'NAME');

                    lineList.unshift({ value: 'All', name: 'All' });
                    setLineOpt(lineList);
                    setAreaOpt(lineList);
                }
            }
            setCategoryKey(val);
            setAreaKeys('All');
            getDevicepgradeInfo(selectedRowNode, 'All', val);
        } catch (error: any) {
            console.error(error);
            message.error(error.toString());
        }
    };

    const areaChange = (val: string) => {
        setAreaKeys(val);
        getDevicepgradeInfo(selectedRowNode, val);
    };

    // 关闭弹窗
    const handleCancel = () => {
        setSubmitLoading(false);
        setModalVisible(false);
    };
    // 提交
    const handleOk = async () => {
        try {
            setSubmitLoading(true);
            const params = await form.validateFields();

            params.activeDate = dateFormat('YYYY-MM-DD HH:mm:ss', params.activeDate);
            params.fileName = `\\${fileFolder}` || '';
            params.deviceModelName = deviceType.find((v) => v.value === params.deviceModel)?.name || '';
            params.subSysNo = subSysNo;
            params.fileType = editModel ? params.fileType : fileTypeList[params.fileType];
            const res = await amiFunc.firmwareUpgrade.uploadFileImpl(params);

            setSubmitLoading(false);
            if (res.flag) {
                message.success(Mes['titleTableSuccesssuccess']);
                setModalVisible(false);
                getProgramNameList();
                setSelectedRowKeys([]);
                setSelectedRowNode({});
            } else {
                message.error(res.mess);
            }
        } catch (error: any) {
            setSubmitLoading(false);
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['formRuleTitleInputFormatIncorrect']);
        }
    };
    // 连接
    const handleConnect = async () => {
        setSubmitLoading(true);
        try {
            const params = await form.getFieldsValue(true);

            if (!params.ftpIpAddress) {
                setSubmitLoading(false);
                return message.error(Mes['messageInputFtpIpAddress']);
            }
            if (!params.ftpIpPort) {
                setSubmitLoading(false);
                return message.error(Mes['messageInputFtpport']);
            }
            if (!params.ftpUserName) {
                setSubmitLoading(false);
                return message.error(Mes['messageInputFtpUserName']);
            }
            if (!params.ftpUserPwd) {
                setSubmitLoading(false);
                return message.error(Mes['messageInputFtpPassword']);
            }
            const res = await amiFunc.firmwareUpgrade.tryFTPConn({
                ftpIpAddress: `${params.ftpIpAddress}:${params.ftpIpPort}`,
                ftpUserName: params.ftpUserName,
                ftpUserPwd: params.ftpUserPwd,
            });

            if (res.flag) {
                message.success(Mes['messageSuccessTestconnectionsucctestconnectionsucc']);
            } else {
                message.error(Mes['messageErrorTestconnectionfailtestconnectionfail']);
            }
            setSubmitLoading(false);
        } catch (err: any) {
            setSubmitLoading(false);
            console.error(err);
            message.error(typeof err === 'string' ? err : Mes['loadingfilesMessageConfirmSyncfailedsyncfailed']);
        }
    };

    // 表单类型变化监听
    const onFormLayoutChange = ({ fileType }: { fileType: string }) => {
        if (typeof fileType !== 'undefined') {
            getDeviceType(fileType);
        }
    };
    // 初始化转发时间
    const initRetransTimes = () => {
        const list: Options[] = [];

        for (let i = 1; i <= 10; i++) {
            list.push({
                value: `${i}`,
                name: `${i}`,
            });
        }
        setRetransTimes(list);
    };

    // 上传配置
    const uploadProps = {
        name: 'fileFolder',
        action: '/v1/upgradeFolderUpload',
        // headers: {
        //     ContentType: 'authorization-text',
        // },
        fileList: fileList,
        onChange (info: any) {
            console.log('a------', info);
            if (info.file.status === 'done') {
                if (info.file.response === 1) {
                    setFileList(info.fileList);
                    setFileFolder(info?.file?.name || '');
                } else {
                    message.error(Mes['messageTitleUploadFailed']);
                    setFileList([]);
                    setFileFolder('');
                    info.fileList = [];
                }
            } else if (info.file.status === 'error') {
                info.fileList = [];
                setFileList([]);
                setFileFolder('');
                message.error(Mes['messageTitleUploadFailed']);
            } else {
                info.fileList = [];
                setFileList([]);
                setFileFolder('');
            }
        },
    };
    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        if (e.file.status === 'done' && e.file.response !== 1) {
            e.fileList = [];
        }
        return e && e.fileList;
    };

    // 升级事件
    const handleUpgrade = () => {
        if (!selectedRowNode || !IsEmptyObejct(selectedRowNode)) {
            return message.warning(Mes['messageAlarmSelectfilerecordselectfilerecord']);
        }
        if (equipmentTotal <= 0) {
            return message.warn(Mes['messageAlarmNoupgdableequipnoupgdableequip']);
        }
        confirm({
            title: Mes['messageSuccessConfirmconfirm'],
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSureupgradethedcusureupgradethedevice'],
            async onOk () {
                try {
                    const res = await amiFunc.firmwareUpgrade.upgradeFileToDcuNew({
                        subSysNo,
                        programList: JSON.stringify([ selectedRowNode ]),
                        deviceModel: selectedRowNode?.DEVICE_MODEL || '',
                        fileType: selectedRowNode?.File_Type || '',
                        programName: selectedRowNode?.Program_Name || '',
                        area: categoryKey !== 'meterGroup' ? areaKeys : '',
                        sortGuid: categoryKey === 'meterGroup' ? areaKeys : '',
                    });

                    if (parseInt(res.flag, 10)) {
                        tabsChange('2', true);
                    } else {
                        message.error(res.mes);
                    }
                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    useEffect(() => {
        getProgramNameList();
        getDeviceType();
        initRetransTimes();
        categoryChange('transformer');
    }, []);

    return (
        <>
            <div className='remoteUpgrade contentWrap'>
                <div className='wrapLeft'>
                    <div className='btn borderBot'>
                        <BtnList btnList={btnList} />
                    </div>
                    <div className='search borderBot'>
                        <Search placeholder='Input search value' size='middle' onSearch={planSearch} enterButton />
                    </div>
                    <h4 className='borderBot'>{ Mes['titleTableProgramnameprogramname'] }</h4>
                    <div className='list scrollbar'>
                        <Tree
                            checkable
                            onCheck={onTreeCheck}
                            checkedKeys={selectedRowKeys}
                            treeData={treeData}
                        />
                    </div>
                </div>
                <div className='wrapRight'>
                    <Row gutter={24} className='top'>
                        <Col span={4}>
                            <Select onChange={categoryChange} value={categoryKey}>
                                {
                                    categoryOpt.map((v) => (
                                        <Option value={v.value} key={v.value}>{ v.name }</Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col span={3}>
                            <Select value={areaKeys} onChange={areaChange}>
                                {
                                    areaOpt.map((v) => (
                                        <Option value={v.value} key={v.value}>{ v.name }</Option>
                                    ))
                                }
                            </Select>
                        </Col>
                        <Col span={1}>
                            <Button type='primary' title={Mes['domTitleStartUpgrade']} icon={<ToTopOutlined />} onClick={handleUpgrade} />
                        </Col>
                    </Row>
                    <div className='info'>
                        {
                            selectedRowKeys.length ? <UpgradeInfo Mes={Mes} programBaseInfoObj={programBaseInfoObj} areaBaseInfoObj={areaBaseInfoObj} /> : <p style={{textAlign: 'center'}}>No matching records found</p>
                        }
                    </div>
                </div>
            </div>
            <Modal
                visible={modalVisible}
                title={Mes['titlePromptprompt']}
                destroyOnClose
                width={800}
                closable={true}
                onCancel={handleCancel}
                className='addUpgradeInfo'
                forceRender
                footer={[
                    <Button key='connect' type='primary' loading={submitLoading} onClick={handleConnect}> { Mes['comboboxConnectionconnection'] }</Button>,
                    <Button key='submit' type='primary' loading={submitLoading} onClick={handleOk}> { Mes['btnSubmit'] }</Button>,
                    <Button key='back' loading={submitLoading} onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                ]}
            >
                <Form
                    name='langForm'
                    labelCol={{ span: 9 }}
                    wrapperCol={{span: 15}}
                    form={form}
                    preserve={false}
                    onValuesChange={onFormLayoutChange}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name='ftpIpAddress'
                                label={Mes['titleTableUpgradeftpipupgradeftpip']}
                                rules={[
                                    { required: true },
                                    {
                                        validator: (_, value) =>
                                            IsIp(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputFormatIncorrect']),
                                    },
                                ]}
                            >
                                <Input disabled={editModel} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='ftpIpPort'
                                label={Mes['titleTableFtpnameportftpnameport']}
                                rules={[
                                    {
                                        validator: (_, value) => {
                                            if (value && /^\d+$/.test(value)) {
                                                if (value < 1) {
                                                    return Promise.reject(`${Mes['messageHintGreaterthan0greaterthan0']} 1`);
                                                } else if (value > 65535) {
                                                    return Promise.reject(`${Mes['messageHintLessthan0lessthan0']} 65535`);
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            } else {
                                                return Promise.reject(Mes['formRuleTitleInputFormatIncorrect']);
                                            }
                                        },
                                    },
                                ]}
                            >
                                <InputNumber disabled={editModel} min={1} max={65535} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='ftpUserName'
                                label={Mes['titleTableUpgradeusernameupgradeusername']}
                                rules={[
                                    {required: true },
                                    { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                                    { max: 20, message: Mes['hintRulesMaxBytes']?.replace('*', '20') },
                                    {
                                        validator: (_, value) =>
                                            /^[a-zA-Z0-9]+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']),
                                    },
                                ]}
                            >
                                <Input disabled={editModel} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='ftpUserPwd'
                                label='FTP User Password'
                                rules={[
                                    {required: true },
                                    { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                                    { max: 20, message: Mes['hintRulesMaxBytes']?.replace('*', '20') },
                                    {
                                        validator: (_, value) =>
                                            /^[a-zA-Z0-9]+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']),
                                    },
                                ]}
                            >
                                <Input disabled={editModel} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='programName'
                                label={Mes['titleTableProgramnameprogramname']}
                                rules={[
                                    {required: true, message: Mes['messageHintDate0date0'] },
                                    { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                                    { max: 50, message: Mes['hintRulesMaxBytes']?.replace('*', '50')},
                                ]}
                            >
                                <Input disabled={editModel} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='fileType' label={Mes['titleTableFiletypefiletype']}>
                                <Select disabled={editModel}>
                                    {fileTypeList.map((v: string, index: number) => (
                                        <Option value={index} key={index}>{ v }</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='deviceModel' label={Mes['titleTableDevicetypedevicetype']}>
                                <Select disabled={editModel}>
                                    {
                                        deviceType.map((v:Options) => (
                                            <Option value={v.value} key={v.value}>{ v.name }</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='upgradeType' label={Mes['titleTableUpgradetypeupgradetype']}>
                                <Select>
                                    <Option value='1'>{Mes['comboboxUnicastunicast']}</Option>
                                    <Option value='2'>{ Mes['comboboxBroadcastbroadcast'] }</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='retransTimes' label={Mes['labelTitleRetransTimes']}>
                                <Select>
                                    {
                                        retransTimes.map((v) => (
                                            <Option value={v.value} key={v.value}>{ v.name }</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name='activeDate' label={Mes['titleTableGridactivetimegridactivetime']}>
                                <DatePicker showTime={{ format: 'HH:mm' }} format='YYYY-MM-DD HH:mm' />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='identifier'
                                label={Mes['tableTitleIdentifier']}
                                rules={[
                                    {required: true, message: Mes['messageHintDate0date0'] },
                                    { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                                    { max: 50, message: Mes['hintRulesMaxBytes']?.replace('*', '50') },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name='version'
                                label={Mes['operationSystemParaLabelVersionversion']}
                                rules={[
                                    {required: true, message: Mes['messageHintDate0date0'] },
                                    { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                                    { max: 50, message: Mes['hintRulesMaxBytes']?.replace('*', '50') },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        {
                            !editModel && (
                                <Col span={12}>
                                    <Form.Item
                                        name='fileName'
                                        valuePropName='fileList'
                                        getValueFromEvent={normFile}
                                        rules={[
                                            { required: true },
                                        ]}
                                        label={Mes['labelTiltleFilePath']}>
                                        <Upload {...uploadProps}>
                                            <Button disabled={!!fileList.length} icon={<UploadOutlined />}>{ Mes['btnTitleChooseFile'] }</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            )
                        }
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo.sysUser.nodeNo,
}))(RemoteUpgrade);


