/* eslint-disable init-declarations */
/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { Table, Button, message, Modal, Form, Row, Col, Input, Select} from 'antd';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { OrganizationData, OrganizationJson, OrganizationParams, SGCData, SGCDataList } from 'src/api/basicData/organizationMgt/types';
import { basicData } from 'src/api';
import useFetchState from 'src/utils/useFetchState';
import { FileFilled, FolderOpenFilled, FolderFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import { Option } from 'antd/lib/mentions';
import {EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { RefSelectProps } from 'antd/lib/select';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const OrganizationalStructure: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const [ organizationList, setOrganizationList ] = useFetchState<OrganizationData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ expandList, setExpandList ] = useFetchState<string[]>([]);
    const cRef = useRef<CRef>();
    const [ isAdd, setIsAdd ] = useFetchState<boolean>(false);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ SGCList, setSGCList ] = useFetchState<SGCData[]>([]);
    const [ SGCColumns, setSGCColumns ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);

    const [ form ] = Form.useForm();
    let selectInstance: RefSelectProps|null;

    // 设置树形组件展开ID
    const getExpandList = (list: OrganizationData[]) => {
        let temp: string[] = [];

        for (let value of list) {
            if (value.children.length > 0) {
                temp.push(value.id);
                for (let child of value.children) {
                    if (child.children.length > 0) {
                        temp.push(child.id);
                    }
                }
            }
        }

        setExpandList(temp);
    };

    // 获取组织架构列表
    const getOrganizationData = () => {
        setLoading(true);

        basicData.organizationMgt.getOrganizationList().then((res: OrganizationData[]) => {
            setLoading(false);
            getExpandList(res);
            setOrganizationList(res);
        })
            .catch((error) => {
                message.error(error);
                setLoading(false);
            });
    };

    // 弹出删除确认窗口
    const showDelDialog = (record: OrganizationData) => {
        if (record.children.length > 0) {
            message.error(Mes['messageAlarmHaschildnodeshaschildnodes']);
        } else {
            Modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + record.name + ')'),
                onOk () {
                    console.log('OK');
                    const params: OrganizationParams = {
                        node_No: record.id,
                        subSysNo: subSysNo,
                    };

                    basicData.organizationMgt.deleteOrganization(params).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        getOrganizationData();
                    })
                        .catch((err) => {
                            message.error(err);
                        });
                },
                onCancel () {
                    console.log('Cancel');
                },
            });
        }
    };


    // 弹窗点击submit
    const saveData = async (row: any): Promise<any> => {
        if (isAdd) {// 新增
            const params: OrganizationParams = {
                node_Name: row.node_Name,
                encryptType_id: '1',
                limit: row.limit,
                limitMin: row.limitMin,
                alarmMsgValue: row.alarmMsgValue,
                remark: row.remark,
                father_Node_No: row.father_Node_No,
                subSysNo: subSysNo,
                selectComposeNo: '',
                compose_no: '',
            };

            basicData.organizationMgt.addOrganization(params).then(() => {
                getOrganizationData();
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        } else {// 更新
            const params: OrganizationParams = {
                node_Name: row.node_Name,
                encryptType_id: '1',
                limit: row.limit,
                limitMin: row.limitMin,
                alarmMsgValue: row.alarmMsgValue,
                remark: row.remark,
                node_No: row.father_Node_No,
                subSysNo: subSysNo,
                selectDKGA: '',
                selectComposeNo: '',
                compose_no: '',
            };

            basicData.organizationMgt.editOrganization(params).then(() => {
                getOrganizationData();
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        }
    };

    // 弹窗form内组件的参数配置
    const addOpt = [
        {
            type: 'Input',
            label: 'titleTableOrganizationnoorganizationno',
            name: 'father_Node_No',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                disabled: true,
            },
        },
        {
            type: 'Input',
            label: 'titleTableStationnamestationname',
            name: 'node_Name',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },
        {
            type: 'Input',
            label: 'titleTableMinrechargeamountminrechargeamount',
            name: 'limitMin',
            col: 20,
            rules: [ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ],
            attr: {
                type: 'number',
                maxLength: 10,
            },
        },
        {
            type: 'Input',
            label: 'titleTableMaxrechargeamountmaxrechargeamount',
            col: 20,
            name: 'limit',
            rules: [ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ],
            attr: {
                type: 'number',
                maxLength: 10,
            },
        },
        {
            type: 'Input',
            label: 'titleTableAlarmmsgvaluealarmmsgvalue',
            name: 'alarmMsgValue',
            col: 20,
            rules: [ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ],
            attr: {
                type: 'number',
                maxLength: 10,
            },
        },
        {
            type: 'Input',
            label: 'titleLabelRemarkremark',
            name: 'remark',
            col: 20,
            attr: {
                type: 'text',
                maxLength: 30,
            },
        },
    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 弹窗参数设置
    const modelOpt = {
        title: 'btnTitleAdd',
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

    // SGC table title的设置
    const SGCColumns1 = [
        {
            title: Mes['titleTableGridmoduleidgridmoduleid'],
            dataIndex: 'MODULE_ID',
        },
        {
            title: Mes['titleTableSgcnumbersgcnumber'],
            dataIndex: 'SGC_NO',
        },
        {
            title: Mes['titleTableGridkeyregnogridkeyregno'],
            dataIndex: 'KEY_REGNO',
        },
        {
            title: Mes['titleTableSgcnamesgcname'],
            dataIndex: 'SGC_NAME',
        },
        {
            title: Mes['titleTableGridkeytypegridkeytype'],
            dataIndex: 'SGC_TYPE',
        },
        {
            title: Mes['titleTableGridkrngridkrn'],
            dataIndex: 'KEY_KRN',
        },
        {
            title: Mes['titleTableGridkengridken'],
            dataIndex: 'KEY_KEN',
        },
        {
            title: Mes['titleTableDkgadkga'],
            dataIndex: 'DKGA',
        },
        {
            title: Mes['titleTableBdtdatebdtdate'],
            dataIndex: 'KEY_BDTDATE',
        },
        {
            title: Mes['titleTableBdttimebdttime'],
            dataIndex: 'KEY_BDTTIME',
        },
        {
            title: Mes['titleTableGridkeyvaluegridkeyvalue'],
            dataIndex: 'KEY_VALUE',
        },

    ];
    const SGCColumns2 = [

        {
            title: Mes['titleTableSgcnumbersgcnumber'],
            dataIndex: 'SGC_NO',
        },
        {
            title: Mes['titleTableSgcnamesgcname'],
            dataIndex: 'SGC_NAME',
        },
        {
            title: Mes['titleTableGridkeytypegridkeytype'],
            dataIndex: 'SGC_TYPE',
        },
        {
            title: Mes['titleTableGridkrngridkrn'],
            dataIndex: 'KEY_KRN',
        },
        {
            title: Mes['titleTableGridkengridken'],
            dataIndex: 'KEY_KEN',
        },
        {
            title: Mes['titleTableDkgadkga'],
            dataIndex: 'DKGA',
        },
        {
            title: Mes['titleTableGridkeyvaluegridkeyvalue'],
            dataIndex: 'KEY_VALUE',
        },

    ];

    const getKMFList = () => {
        basicData.organizationMgt.getKMFList().then((res:SGCDataList) => {
            setSGCList(res.rows);
            setSGCColumns(SGCColumns1);
        });
    };

    const getSGCList = () => {
        basicData.organizationMgt.getSGCList().then((res:SGCDataList) => {
            setSGCList(res.rows);
            setSGCColumns(SGCColumns2);
        });
    };

    // 树形结构一级节点弹窗函数
    const openFirstModal = (item?: OrganizationData, nodeNo?: string) => {
        let val:any = {};

        if (item) {// 更新
            setIsAdd(false);
            const limit = item.limit;
            const min = limit.slice(0, limit.indexOf(' -- '));
            const max = limit.slice(limit.indexOf(' -- ') + 4, limit.length);
            let alarm = item.alarmMsgValue;

            if (alarm.indexOf('.') >= 0) {
                alarm = alarm.slice(0, alarm.indexOf('.'));
            }

            val = {
                father_Node_No: nodeNo,
                node_Name: item.name,
                remark: item.remark,
                alarmMsgValue: alarm,
                limit: max,
                limitMin: min,
            };
        } else {// 新增
            setIsAdd(true);

            val = {
                father_Node_No: nodeNo,
            };
        }
        cRef.current?.openModel(val);
    };

    // 弹出add窗口
    const showAddDialog = (record: OrganizationData) => {
        if (record.level === 'the third node') {
            message.error(Mes['messageAlarmOnlythreeonlythree']);
        }
        if (record.level === 'the first node') {
            openFirstModal(undefined, record.id);
        }
        if (record.level === 'the second node') {
            setModalVisible(true);
            setModalTitle(Mes['titleLabelAddadd']);
            setIsAdd(true);
            form.setFieldsValue({
                father_Node_No: record.id,
                encryptType_id: '1',
            });
            getKMFList();
        }

    };

    // 弹出edit窗口
    const showEditDialog = (record: OrganizationData) => {
        if (record.level === 'the third node') {

            setModalTitle(Mes['titleLabelEditedit']);
            setIsAdd(false);
            basicData.organizationMgt.getOrganizationJson(record.id).then((res: OrganizationJson[]) => {
                let encryptType_id = '0';

                setModalVisible(true);
                if (res.length > 0) {
                    res.map((v: OrganizationJson) => {
                        if (v.ID === record.id) {
                            encryptType_id = v.ENCRYPT_TYPE;
                        }
                    });
                }

                if (encryptType_id === '0') {
                    getSGCList();
                } else {
                    getKMFList();
                }
                const limit = record.limit;
                const min = limit.slice(0, limit.indexOf(' -- '));
                const max = limit.slice(limit.indexOf(' -- ') + 4, limit.length);
                let alarm = record.alarmMsgValue;

                if (alarm.indexOf('.') >= 0) {
                    alarm = alarm.slice(0, alarm.indexOf('.'));
                }
                form.setFieldsValue({
                    father_Node_No: record.id,
                    node_Name: record.name,
                    remark: record.remark !== 'null' ? record.remark : '',
                    alarmMsgValue: alarm,
                    limit: max,
                    limitMin: min,
                    encryptType_id: encryptType_id,
                    compose_no: record.composeNo !== 'null' ? record.composeNo : '',
                });
            });

        } else {
            openFirstModal(record, record.id);
        }

    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    // 点击弹窗submit按钮
    const handleOk = () => {
        form.validateFields().then((res) => {
            const max = res.limit;
            const min = res.limitMin;

            if (parseInt(max, 10) < parseInt(min, 10)) {
                message.warn('The min recharge amount can not be bigger than the max recharge amount.');
                return;
            }
            setSubmitLoading(true);
            if (isAdd) {// 新增
                const params: OrganizationParams = {
                    node_Name: res.node_Name,
                    encryptType_id: res.encryptType_id,
                    limit: res.limit,
                    limitMin: res.limitMin,
                    alarmMsgValue: res.alarmMsgValue,
                    remark: res.remark,
                    father_Node_No: res.father_Node_No,
                    subSysNo: subSysNo,
                    compose_no: res.compose_no,
                    selectDKGA: '',
                    selectComposeNo: res.compose_no,
                };

                basicData.organizationMgt.addOrganization(params).then(() => {
                    setSubmitLoading(false);
                    setModalVisible(false);
                    getOrganizationData();
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                })
                    .catch((err) => {
                        setSubmitLoading(false);
                        message.error(err);
                    });
            } else {// 更新
                const params: OrganizationParams = {
                    node_Name: res.node_Name,
                    encryptType_id: res.encryptType_id,
                    limit: res.limit,
                    limitMin: res.limitMin,
                    alarmMsgValue: res.alarmMsgValue,
                    remark: res.remark,
                    node_No: res.father_Node_No,
                    subSysNo: subSysNo,
                    selectDKGA: '',
                    selectComposeNo: res.compose_no,
                    compose_no: res.compose_no,
                };

                basicData.organizationMgt.editOrganization(params).then(() => {
                    setSubmitLoading(false);
                    setModalVisible(false);
                    getOrganizationData();
                    message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
                })
                    .catch((err) => {
                        setSubmitLoading(false);
                        message.error(err);
                    });
            }
        });

    };

    // 下拉框选择加密方式
    const onSelect = (value: string) => {
        form.setFieldsValue({
            compose_no: '',
        });
        if (value === '1') {
            getKMFList();
        } else {
            getSGCList();
        }
    };

    // table title的设置
    const columns = [
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'name',
        },
        {
            title: Mes['titleTableOrganizationnoorganizationno'],
            dataIndex: 'id',
        },
        {
            title: Mes['titleTableSgcnumbersgcnumber'],
            dataIndex: 'composeNo',
            render (_: any, record: OrganizationData) {
                return (
                    <>
                        {record.composeNo !== 'null' && (<span>{record.composeNo }</span>)}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableLimitrechargelimitrecharge'],
            dataIndex: 'limit',
        },
        {
            title: Mes['titleTableAlarmmsgvaluealarmmsgvalue'],
            dataIndex: 'alarmMsgValue',
        },
        {
            title: Mes['titleLabelRemarkremark'],
            dataIndex: 'remark',
            render (_: any, record: OrganizationData) {
                return (
                    <>
                        {record.remark !== 'null' && (<span>{record.remark }</span>)}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'createDate',
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            className: 'flex flexBetween',
            width: 150,
            render (_: any, record: OrganizationData) {
                return (
                    <>
                        <Button type='primary' onClick={() => {showAddDialog(record);}} title={Mes['btnTitleAdd']} icon={ <PlusOutlined />}>

                        </Button>

                        <Button type='primary' onClick={() => {showEditDialog(record);}} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                        <Button type='default' danger onClick={() => {showDelDialog(record);}} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> }>

                        </Button>

                    </>
                );
            },
        },
    ];


    // let selectInstance:React.ReactElement;
    // const refCB = (instance:React.ReactElement) => {
    //     console.log('ref', instance);
    //     selectInstance = instance;
    // };

    useEffect(() => {
        getOrganizationData();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 250);
    }, []);

    return (
        <>
            <div className='main'>
                <div className='flexCenter flexBetween title' style={{height: '50px'}}>
                    <h4>{Mes['titleLabelStationstation']}</h4>

                </div>
                <div className='pv10h20'>
                    <Table columns={columns} dataSource={organizationList} rowKey='id' scroll={{y: tableHeight}} expandable={{
                        defaultExpandAllRows: true,
                        rowExpandable: (record: OrganizationData) => record.children.length > 0,
                        expandedRowKeys: expandList, // 设置需要展开的行
                        // eslint-disable-next-line react/display-name
                        expandIcon: ({ expanded, onExpand, record }) =>// 设置展开图标
                            record.children.length > 0 ? (
                                expanded ? <FolderOpenFilled onClick={(e) => onExpand(record, e)} /> : <FolderFilled onClick={(e) => onExpand(record, e)} />
                            ) : (
                                <FileFilled onClick={(e) => onExpand(record, e)}/>
                            ),
                        onExpand: (bool, row) => {// 行展开的回调方法
                            if (bool) {
                                setExpandList([ ...expandList, row.id ]);
                            } else {
                                const index = expandList.findIndex((e) => e === row.id);
                                const newArray = [ ...expandList ];

                                newArray.splice(index, 1);
                                setExpandList(newArray);
                            }
                        },
                    }}
                    size='small' loading={loading} pagination={false}></Table>

                    <AddLangElment
                        cRef={cRef}
                        saveData={saveData}
                        formOption={formOpt}
                        modelOpt={modelOpt}
                        Mes={Mes}
                    />

                    <Modal visible={modalVisible}
                        title={modalTitle}
                        destroyOnClose
                        width={ 800}
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
                                <Col span={24}>
                                    <Form.Item name='father_Node_No' label={Mes['titleTableOrganizationnoorganizationno']} rules={[ { required: true } ]}>
                                        <Input disabled maxLength={ 20} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='node_Name' label={Mes['titleTableStationnamestationname']} rules={[ { required: true } ]}>
                                        <Input maxLength={ 20} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='encryptType_id' label={Mes['titleLabelWithhardwaremodulewithhardwaremodule']}>
                                        <Select value='1' defaultValue='1' onSelect={ onSelect}>
                                            <Option value='1'>YES</Option>
                                            <Option value='0'>NO</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='compose_no' label={Mes['titleTableSgcnumbersgcnumber']}>
                                        {/* <div onMouseDown={(e) => {
                                            e.preventDefault();
                                            return false;
                                        }}> */}
                                        <Select ref={ (node) => selectInstance = node} style={{width: '100%'}} dropdownRender={() => (
                                            <div>
                                                <Table dataSource={SGCList} columns={SGCColumns} size='small' rowKey='SGC_NO' scroll={{x: true}}
                                                    onRow={(record) => ({
                                                        onClick: () => {
                                                            let key = record.SGC_NO;

                                                            form.setFieldsValue({
                                                                compose_no: key,
                                                            });
                                                            if (selectInstance) {
                                                                selectInstance.blur();
                                                            }
                                                        },
                                                    })}></Table>
                                            </div>
                                        )}>
                                        </Select>
                                        {/* </div> */}
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='limitMin' label={Mes['titleTableMinrechargeamountminrechargeamount']}
                                        rules={[ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                        <Input maxLength={ 10}/>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='limit' label={Mes['titleTableMaxrechargeamountmaxrechargeamount']}
                                        rules={[ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                        <Input maxLength={ 10}/>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='alarmMsgValue' label={Mes['titleTableAlarmmsgvaluealarmmsgvalue']}
                                        rules={[ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                        <Input maxLength={ 10}/>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item name='remark' label={Mes['titleLabelRemarkremark']}>
                                        <Input maxLength={ 50} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </div>
            </div>
        </>
    );
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(OrganizationalStructure);
