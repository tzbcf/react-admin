/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { Table, Button, message, Modal, Form, Select, Row, Col, Input, Pagination } from 'antd';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { TransformDataList, TransformData, TransformParam } from 'src/api/basicData/transformMgt/type';
import {FeederDataJson } from 'src/api/basicData/feederMgt/types';
import { basicData, user } from 'src/api';
import { UserNode } from 'src/api/user/type';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type FeederSelect = {
    group: string;
    children: FeederDataJson[];
}

type CascaderData = {
    value: string;
    title: string;
    children?: CascaderData[];
}

type SelectOption = {
    name: string;
    value: string;
}

const { Option, OptGroup } = Select;

const TransformListPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const [ transformList, setTransformList ] = useFetchState<TransformData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ guid, setGuid ] = useFetchState<string>('');
    const [ node, setNode ] = useFetchState<string>('');
    // const [ initialValues, setInitialValues ] = useFetchState<any>();
    const [ feederGroupList, setFeederGroupList ] = useFetchState<FeederSelect[]>([]);
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    const [ feeders, setFeeders ] = useFetchState<SelectOption[]>([]);
    const [ transformers, setTransformers ] = useFetchState<SelectOption[]>([]);

    const [ form ] = Form.useForm();
    const sRef = useRef<SRef>();
    const ROWS = 10;
    // 获取列表数据接口
    const getTransformList = (page = 1) => {
        sRef.current?.getFormData().then((data) => {
            setLoading(true);

            basicData.transformMgt.transformList(subSysNo, page, ROWS, data.searchNode, data.feederId, data.transformerId).then((res: TransformDataList) => {
                setLoading(false);
                setTransformList(res.rows);
                setTotal(res.total);
                setCurrent(page);
            })
                .catch((error) => {
                    message.error(error);
                    setLoading(false);
                });
        });

    };

    // 删除数据提示框
    const showDeleteConfirm = (data:TransformData) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + data.DST_NAME + ')'),
            onOk () {
                const params: TransformParam = {
                    guid: data.DST_ID,
                };

                basicData.transformMgt.deleteTransform(params).then(() => {
                    message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                    getTransformList();
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

    const openModel = (item?: TransformData) => {
        basicData.feederMgt.feederListJson(subSysNo, '').then((res:FeederDataJson[]) => {
            const groupName: string[] = [];
            const feederss: FeederSelect[] = [];

            if (res && res.length > 0) {
                res.map((v: FeederDataJson) => {
                    if (!groupName.includes(v.GNAME)) {
                        groupName.push(v.GNAME);
                    }
                });
                for (let g of groupName) {
                    const list = res.filter((v: FeederDataJson) => v.GNAME === g);
                    const feeder:FeederSelect = {
                        group: g,
                        children: list,
                    };

                    feederss.push(feeder);
                }
                setFeederGroupList(feederss);
            }
        });
        if (item) {// 编辑

            setModalTitle(Mes['titleLabelEditedit']);
            // setInitialValues({
            //     dst_no: item.DST_NO,
            //     section_id: item.SECTION_ID,
            //     dst_name: item.DST_NAME,
            //     dst_spec: item.DST_SPEC,
            //     dst_addr: item.DST_ADDR,
            //     loop: item.REL_ID,
            // });
            form.setFieldsValue({
                dst_no: item.DST_NO,
                section_id: item.SECTION_ID,
                dst_name: item.DST_NAME,
                dst_spec: item.DST_SPEC,
                dst_addr: item.DST_ADDR,
                loop: item.REL_ID,
            });
            setGuid(item.DST_ID);
            setNode(item.NODE_NO);
            setModalVisible(true);

        } else {// 添加

            basicData.transformMgt.getMaxTransformNo(subSysNo).then((res: string) => {
                // setInitialValues({
                //     dst_no: res,
                //     section_id: '',
                //     dst_name: '',
                //     dst_spec: '',
                //     dst_addr: '',
                //     loop: '',
                // });
                form.setFieldsValue({
                    dst_no: res,
                    section_id: '',
                    dst_name: '',
                    dst_spec: '',
                    dst_addr: '',
                    loop: '',
                });
                setGuid('');
                setNode('');
                setModalTitle(Mes['titleLabelAddadd']);
                setModalVisible(true);

            });


        }

    };

    // table title的设置
    const columns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTablePipelinenopipelineno'],
            dataIndex: 'DST_NO',
            sorter: (a:TransformData, b:TransformData) => parseFloat(a.DST_NO) - parseFloat(b.DST_NO),
        },
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'DST_NAME',
        },
        {
            title: Mes['titleTableDstspecdstspec'],
            dataIndex: 'DST_SPEC',
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
        },
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleTableDstaddressdstaddress'],
            dataIndex: 'DST_ADDR',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_TIME',
            sorter: (a: TransformData, b: TransformData) => Date.parse(a.CREATE_TIME) - Date.parse(b.CREATE_TIME),
            render (_: any, record: TransformData) {
                return (
                    <>
                        <span>{ record.CREATE_TIME.substring(0, 10)}</span>
                    </>);
            },
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            className: 'flex flexBetween',
            width: 100,
            render (_: any, record: TransformData) {
                return (
                    <>
                        <Button type='primary' onClick={ () => openModel(record)} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                        <Button type='default' danger onClick={ () => showDeleteConfirm(record)} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> }>

                        </Button>
                    </>
                );
            },
        },
    ];

    // table分页设置
    const pagination = {
        total: total,
        onChange (page: number) {
            getTransformList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = () => {
        setSubmitLoading(true);
        form.validateFields().then((res) => {
            if (guid) {// 编辑
                const params: TransformParam = {
                    guid: guid,
                    section_id: res.section_id,
                    dst_no: res.dst_no,
                    dst_name: res.dst_name,
                    dst_spec: res.dst_spec,
                    dst_addr: res.dst_addr,
                    loop: res.loop,
                    subSysNo: subSysNo,
                    node_no: node,
                };

                basicData.transformMgt.editTransform(params).then(() => {
                    getTransformList();
                    message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            } else {// 添加
                const params: TransformParam = {
                    section_id: res.section_id,
                    dst_no: res.dst_no,
                    dst_name: res.dst_name,
                    dst_spec: res.dst_spec,
                    dst_addr: res.dst_addr,
                    loop: res.loop,
                    subSysNo: subSysNo,
                    node_no: node,
                };

                basicData.transformMgt.addTransform(params).then(() => {
                    getTransformList();
                    message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                    setModalVisible(false);
                    setSubmitLoading(false);
                })
                    .catch((err) => {
                        message.error(err);
                        setSubmitLoading(false);
                    });
            }
        })
            .catch(() => {
                setSubmitLoading(false);
            });
        // form.resetFields();
    };

    const afterClose = () => {

        form.setFieldsValue({
            dst_no: '',
            section_id: '',
            dst_name: '',
            dst_spec: '',
            dst_addr: '',
            loop: '',
        });
        // setInitialValues({
        //     dst_no: '',
        //     section_id: '',
        //     dst_name: '',
        //     dst_spec: '',
        //     dst_addr: '',
        //     loop: '',
        // });
    };

    const onFeederChange = (value:string) => {
        if (feederGroupList) {
            for (let v of feederGroupList) {
                for (let child of v.children) {
                    if (child.ID === value) {
                        setNode(child.NODE_NO);
                        console.log('selectedNode:' + child.NODE_NO);
                        break;
                    }
                }
            }
        }
    };

    // 添加根节点数转换函数
    const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
        const nodes = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

        nodes.forEach((item:UserNode) => {
            const findNode = nodeList.find((v:UserNode) => v.PARENTID === item.ID);
            const obj: CascaderData = {
                title: item.NAME,
                value: item.ID,
            };

            if (findNode) {
                obj.children = [];
                rootNode.push(obj);
                nodeDataFormatCascader(nodeList, obj.children, item.ID);
            } else {
                rootNode.push(obj);
            }
        });
    };

    const search = (data: any) => {
        console.log('a-----', data);
        getTransformList();
    };

    const onSelect = async (keys: React.Key[], info: any) => {
        console.log(info);
        sRef.current?.setFieldsValue({
            feederId: '',
            transformerId: '',
        });
        let feederss = await basicData.feederMgt.feederListJson(subSysNo, info.key);

        let feederlist = [];

        feederlist.push({ name: Mes['titleLabelComboallcomboall'], value: ''});
        if (feederss && feederss.length > 0) {
            feederss.map((v: FeederDataJson) => {
                feederlist.push({
                    name: v.NAME,
                    value: v.ID,
                });
            });


        }
        setFeeders(feederlist);
        let transformss = await basicData.transformMgt.getDstList({subSysNo: subSysNo, nodeNo: info.key, sectionId: ''});

        let transformlist = [];

        transformlist.push({ name: Mes['titleLabelComboallcomboall'], value: ''});
        if (transformss && transformss.length > 0) {
            transformss.map((v) => {
                transformlist.push({
                    name: v.NAME,
                    value: v.ID,
                });
            });


        }
        setTransformers(transformlist);
    };

    const onSelectFeeder = async (keys: React.Key[], info: any) => {
        sRef.current?.setFieldsValue({
            transformerId: '',
        });
        let data = await sRef.current?.getFormData();
        let transformss = await basicData.transformMgt.getDstList({subSysNo: subSysNo, nodeNo: data.searchNode, sectionId: info.value});

        let transformlist = [];

        transformlist.push({ name: Mes['titleLabelComboallcomboall'], value: ''});
        if (transformss && transformss.length > 0) {
            transformss.map((v) => {
                transformlist.push({
                    name: v.NAME,
                    value: v.ID,
                });
            });


        }
        setTransformers(transformlist);
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnTitleAdd'],
            onClick () {
                openModel();
            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const searchList = [
        {
            name: 'searchNode',
            col: 3,
            type: 'SelectTree',
            treeOpt: CascaderOpt,
            attr: {
                style: { width: '100%' },
                onSelect: onSelect,
            },
        },
        {
            name: 'feederId',
            col: 3,
            type: 'Select',
            options: feeders,
            attr: {
                style: { width: '100%' },
                onSelect: onSelectFeeder,
            },
        },
        {
            name: 'transformerId',
            col: 3,
            type: 'Select',
            options: transformers,
            attr: {
                style: { width: '100%' },
            },
        },
    ];

    const initConfig = async () => {
        try {
            const res = await user.userNodeTree(subSysNo);
            let nodes = [ ...CascaderOpt ];

            nodeDataFormatCascader(res, nodes);
            // nodeName = nodes[0].title;
            // nodeNo = nodes[0].value;
            setCascaderOpt(nodes);
            let feederss = await basicData.feederMgt.feederListJson(subSysNo, nodes[0].value);

            let feederlist = [];

            feederlist.push({ name: Mes['titleLabelComboallcomboall'], value: ''});
            if (feederss && feederss.length > 0) {
                feederss.map((v: FeederDataJson) => {
                    feederlist.push({
                        name: v.NAME,
                        value: v.ID,
                    });
                });


            }
            setFeeders(feederlist);

            let transformss = await basicData.transformMgt.getDstList({subSysNo: subSysNo, nodeNo: nodes[0].value, sectionId: ''});

            let transformlist = [];

            transformlist.push({ name: Mes['titleLabelComboallcomboall'], value: ''});
            if (transformss && transformss.length > 0) {
                transformss.map((v) => {
                    transformlist.push({
                        name: v.NAME,
                        value: v.ID,
                    });
                });


            }
            setTransformers(transformlist);
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    searchNode: nodes[0].value,
                    feederId: '',
                    transformerId: '',
                });
                getTransformList();
            }, 500);

        } catch (error: any) {
            message.warn(error.toString());
        }
    };


    useEffect(() => {
        initConfig();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleTransformerManagement']}</h4>
                {/* <Button type='primary' icon={ <PlusOutlined />} onClick={ () => openModel()} title={Mes['btnTitleAdd']}></Button> */}
            </div>
            <div className='pv10h20'>
                {
                    searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div className='table'>
                    <Table columns={columns} dataSource={transformList} pagination={false} rowKey='rn__'
                        size='small' loading={loading}
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                openModel(record);
                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <Modal visible={modalVisible}
                title={modalTitle}
                destroyOnClose
                width={ 1200}
                onCancel={handleCancel}
                afterClose={afterClose}
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
                    // initialValues={initialValues}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name='section_id' label={Mes['titleTableSectionsection']} rules={[ { required: true } ]}>
                                <Select onChange={ onFeederChange}>
                                    ({feederGroupList && feederGroupList.map((v: FeederSelect) => (<OptGroup key={ v.group} label={v.group}>
                                        {v.children.map((child: FeederDataJson) => (<Option key={child.ID} value={ child.ID}>{ child.NAME}</Option>))}
                                    </OptGroup>))})
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='dst_no' label={Mes['titleTablePipelinenopipelineno']} rules={[ { required: true } ]}>
                                <Input disabled maxLength={ 20} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='dst_name' label={Mes['titleTableTransformernametransformername']} rules={[ { required: true } ]}>
                                <Input maxLength={ 30} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='dst_spec' label={Mes['titleTableDstspecdstspec']}>
                                <Input maxLength={ 30} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='dst_addr' label={Mes['titleTableDstaddressdstaddress']}>
                                <Input maxLength={ 30} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name='loop' label={Mes['titleTableLooploop']}>
                                <Input maxLength={ 2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(TransformListPage);
