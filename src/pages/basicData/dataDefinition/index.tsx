/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, message, Table, Button, Input, Select, Modal } from 'antd';
import { basicData } from 'src/api';
import { ClassificationList, ClassificationParams, ClassificationData, ClassificationDetail, ClassificationDetailList, ClassificationType, AddClassification, AddClassificationDetail } from 'src/api/basicData/dataDefinition/types';
import useFetchState from 'src/utils/useFetchState';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import {EditOutlined, DeleteOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

let queryDetailValue = '';
let classification = '';// 左边table选择的classification

const DataDefinition: React.FC<Props> = (props) => {
    const { Search } = Input;
    const { Option } = Select;
    const { Mes, subSysNo } = props;
    const [ classificationList, setClassificationList ] = useFetchState<ClassificationData[]>([]);
    const [ classificationTypeList, setClassificationTypeList ] = useFetchState<ClassificationType[]>([]);
    const [ listTotal, setListTotal ] = useFetchState<number>(0);
    const [ listCurrent, setListCurrent ] = useFetchState<number>(0);
    const [ listLoading, setListLoading ] = useFetchState<boolean>(false);
    const [ detailList, setDetailList ] = useFetchState<ClassificationDetail[]>([]);
    const [ detailTotal, setDetailTotal ] = useFetchState<number>(0);
    const [ detailCurrent, setDetailCurrent ] = useFetchState<number>(0);
    const [ detailLoading, setDetailLoading ] = useFetchState<boolean>(false);
    const [ classificationId, setClassificationId ] = useFetchState<string>('');
    const [ classificationDetailId, setClassificationDetailId ] = useFetchState<string>('');
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);

    const cRef = useRef<CRef>();
    const cRef1 = useRef<CRef>();

    // 获取左边table列表数据
    const getClassificationList = (page: number = 1, rows: number = 10, queryValue?: string) => {
        setListLoading(true);
        const parmas:ClassificationParams = {
            subSysNo: subSysNo,
            page: page,
            rows: rows,
            queryValue: queryValue,
        };

        basicData.dataDefinition.classificationList(parmas).then((res: ClassificationList) => {
            setListLoading(false);
            setClassificationList(res.rows);
            setListTotal(res.total);
            setListCurrent(page);
        })
            .catch((error) => {
                message.error(error);
                setListLoading(false);
            });
    };

    // 获取右边table列表数据
    const getClassificationDetailList = (page: number = 1, rows: number = 20,) => {
        setDetailLoading(true);
        if (queryDetailValue) {
            console.log(queryDetailValue);
        } else if (classification) {
            queryDetailValue = classification;
        } else {
            queryDetailValue = '';
        }
        const parmas:ClassificationParams = {
            subSysNo: subSysNo,
            page: page,
            rows: rows,
            queryValue: queryDetailValue,
        };

        basicData.dataDefinition.classificationDetailList(parmas).then((res: ClassificationDetailList) => {
            setDetailLoading(false);
            setDetailList(res.rows);
            setDetailTotal(res.total);
            setDetailCurrent(page);
        })
            .catch((error) => {
                message.error(error);
                setDetailLoading(false);
            });
    };

    const getClassificationTypeList = () => {
        basicData.dataDefinition.classificationTypeList().then((res: ClassificationType[]) => {
            setClassificationTypeList(res);
        })
            .catch((error) => {
                message.error(error);
            });
    };

    const showDeleteConfirm = (data:ClassificationDetail) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + data.CLASSICAL_DETAIL_NAME + ')'),
            onOk () {
                const params: any = {
                    id: data.CLASSICAL_DETAIL_GUID,
                };

                basicData.dataDefinition.delClassificationDetail(params).then(() => {
                    message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                    getClassificationDetailList();
                })
                    .catch((err) => {
                        message.error(err);
                    });
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const showClassification = (item?: ClassificationData) => {
        let val:any = {};

        if (item) {
            setClassificationId(item.CLASSICAL_GUID);

            val = {
                classification_name: item.CLASSICAL_NAME,
                classification_no: item.CLASSICAL_CODE,
            };
            cRef.current?.openModel(val, Mes['titleLabelEditedit']);
        } else {
            setClassificationId('');

            val = {
                classification_name: '',
                classification_no: '',
            };
            cRef.current?.openModel(val, Mes['titleLabelAddadd']);
        }
    };

    const showClassificationDetail = (item?: ClassificationDetail) => {


        let val: any = {};

        if (item) {
            setClassificationDetailId(item.CLASSICAL_DETAIL_GUID);
            // setClassificationId(item.CLASSICAL_GUID);
            val = {
                code_name: item.CLASSICAL_DETAIL_NAME,
                code_no: item.CLASSICAL_DETAIL_CODE,
                is_enable: item.IS_ENABLE,
            };
            cRef1.current?.openModel(val, Mes['titleLabelEditedit']);
        } else {
            if (classification) {
                setClassificationDetailId('');
                val = {
                    code_name: '',
                    code_no: '',
                    is_enable: '1',
                };
                cRef1.current?.openModel(val, Mes['titleLabelAddadd']);
            } else {
                message.error(Mes['messageAlarmSelectrowselectrow']);
            }
        }

    };

    // table title的设置
    const classifinationColumns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleLabelClassificationnameclassificationname'],
            dataIndex: 'CLASSICAL_NAME',
            // sorter: (a:TransformData, b:TransformData) => parseFloat(a.DST_NO) - parseFloat(b.DST_NO),
        },
        {
            title: Mes['titleTableClassificationnoclassificationno'],
            dataIndex: 'CLASSICAL_CODE',
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            className: 'flex flexBetween',
            render (_: any, record: ClassificationData) {
                return (
                    <>
                        <Button type='primary' onClick={() => {showClassification(record);}} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                    </>
                );
            },
        },
    ];

    const detailColumns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleLabelCodenamecodename'],
            dataIndex: 'CLASSICAL_DETAIL_NAME',
            // sorter: (a:TransformData, b:TransformData) => parseFloat(a.DST_NO) - parseFloat(b.DST_NO),
        },
        {
            title: Mes['titleLabelCodenocodeno'],
            dataIndex: 'CLASSICAL_DETAIL_CODE',
        },
        {
            title: Mes['comboboxEnabledenabled'],
            dataIndex: 'IS_ENABLE',
            render (_: any, record: ClassificationDetail) {
                return (
                    <>
                        { record.IS_ENABLE === '1' ? <span>YES</span> : <span>NO</span>}
                    </>
                );
            },
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            className: 'flex flexBetween',
            width: 100,
            render (_: any, record: ClassificationDetail) {
                return (
                    <>
                        <Button type='primary' onClick={() => {showClassificationDetail(record);}} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                        <Button type='default' danger onClick={() => {showDeleteConfirm(record);}} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> }>

                        </Button>
                    </>
                );
            },
        },
    ];

    const listPagination = {
        total: listTotal,
        onChange (page: number, pageSize: number | undefined) {
            getClassificationList(page, pageSize);
        },
        current: listCurrent,
        hideOnSinglePage: true,
        pageSize: 10,
        showSizeChanger: false,
    };

    const detailPagination = {
        total: detailTotal,
        onChange (page: number, pageSize: number | undefined) {
            getClassificationDetailList(page, pageSize);
        },
        current: detailCurrent,
        hideOnSinglePage: true,
        pageSize: 20,
        showSizeChanger: false,
    };

    const onSearch = (value:string) => {
        getClassificationList(1, 10, value);
    };

    const onSelectClassifinacation = (record:ClassificationData) => {
        classification = record.CLASSICAL_GUID;
        queryDetailValue = '';
        getClassificationDetailList(1, 20);
        setSelectedRowKeys([ record.rn__ ]);
    };

    // 右边下拉框选项
    const onSelected = (value: string) => {
        queryDetailValue = value;
        classification = value;
        getClassificationDetailList(1, 20);
    };

    const saveData = async (row: any): Promise<any> => {
        console.log('row------', row);
        if (classificationId) {
            const params: AddClassification = {
                subSysNo: subSysNo,
                classification_name: row.classification_name,
                classification_no: row.classification_no,
                classification_guid: classificationId,
            };

            basicData.dataDefinition.updateClassification(params).then(() => {
                getClassificationList();
                getClassificationTypeList();
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        } else {
            const params: AddClassification = {
                subSysNo: subSysNo,
                classification_name: row.classification_name,
                classification_no: row.classification_no,
            };

            basicData.dataDefinition.addClassification(params).then(() => {
                getClassificationList();
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        }
    };

    const saveData1 = async (row: any): Promise<any> => {
        if (classificationDetailId) {
            const params: AddClassificationDetail = {
                code_name: row.code_name,
                code_no: row.code_no,
                is_enable: row.is_enable,
                classificationGuid: classification,
                classification_detail_guid: classificationDetailId,
            };

            basicData.dataDefinition.updateClassificationDetail(params).then(() => {
                getClassificationDetailList();
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        } else {
            const params: AddClassificationDetail = {
                code_name: row.code_name,
                code_no: row.code_no,
                is_enable: row.is_enable,
                classificationGuid: classification,
            };

            basicData.dataDefinition.addClassificationDetail(params).then(() => {
                getClassificationDetailList();
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        }
    };

    const addOpt = [
        {
            type: 'Input',
            label: 'titleLabelClassificationnameclassificationname',
            name: 'classification_name',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },
        {
            type: 'Input',
            label: 'titleTableClassificationnoclassificationno',
            name: 'classification_no',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

    ];

    const addOpt1 = [
        {
            type: 'Input',
            label: 'titleLabelClassificationnameclassificationname',
            name: 'code_name',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },
        {
            type: 'Input',
            label: 'titleTableClassificationnoclassificationno',
            name: 'code_no',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Select',
            label: 'comboboxEnabledenabled',
            name: 'is_enable',
            col: 20,
            rules: [ { required: true } ],
            options: [ { name: 'YES', value: '1' }, {name: 'NO', value: '0'} ],
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

    const formOpt1 = {
        options: addOpt1,
        layout: layout,
    };


    useEffect(() => {
        getClassificationList();
        getClassificationDetailList();
        getClassificationTypeList();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleDataDefinition']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={24}>
                    <Col span={11}>
                        <Row gutter={16}>
                            <Col span={10}><Search onSearch={onSearch} enterButton placeholder={Mes['titleLabelClassificationnameclassificationname']}/></Col>
                            <Col span={6}><Button type='primary' icon={<PlusOutlined />} onClick={() => {showClassification();}} title={Mes['btnTitleAdd']}></Button></Col>
                        </Row>
                        <Table columns={classifinationColumns} dataSource={ classificationList} rowKey='rn__'
                            size='small' loading={listLoading} pagination={listPagination} bordered={true} style={{marginTop: '10px'}}
                            rowSelection={{
                                type: 'checkbox',
                                selectedRowKeys,
                                onSelect: onSelectClassifinacation,
                            }
                            }
                            onRow={(record) => ({
                                onDoubleClick: () => {
                                    showClassification(record);
                                },
                                onClick: () => {
                                    onSelectClassifinacation(record);
                                },

                            })}></Table>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={11}>
                        <Row gutter={16}>
                            <Col span={10}>
                                <Select onChange={onSelected} style={{ width: '100%' }}>
                                    ({classificationTypeList.map((v: ClassificationType) => (<Option key={v.CLASSICAL_GUID} value={v.CLASSICAL_GUID}>{v.CLASSICAL_NAME}</Option>))})
                                </Select>
                            </Col>
                            <Col span={6}><Button type='primary' icon={<PlusOutlined />} onClick={() => {showClassificationDetail();}} title={Mes['btnTitleAdd']}></Button></Col>
                        </Row>
                        <Table columns={detailColumns} dataSource={ detailList} rowKey='rn__' style={{marginTop: '10px'}}
                            size='small' loading={detailLoading} pagination={detailPagination} bordered
                        ></Table>
                    </Col>
                </Row>

                <AddLangElment
                    cRef={cRef}
                    saveData={saveData}
                    formOption={formOpt}
                    modelOpt={modelOpt}
                    Mes={Mes}
                />

                <AddLangElment
                    cRef={cRef1}
                    saveData={saveData1}
                    formOption={formOpt1}
                    modelOpt={modelOpt}
                    Mes={Mes}
                />
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(DataDefinition);
