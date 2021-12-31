/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef } from 'react';
import { Table, Button, message, Modal, Pagination } from 'antd';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { FeederDataList, FeederData, FeederListParam, FeederSaveParam, FeederDataJson } from 'src/api/basicData/feederMgt/types';
import { basicData, user } from 'src/api';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import { UserNode } from 'src/api/user/type';
import useFetchState from 'src/utils/useFetchState';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
// import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type CascaderData = {
    value: string;
    title: string;
    children?: CascaderData[];
}

type SelectOption = {
    name: string;
    value: string;
}

const FeederListPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const [ feederList, setFeederList ] = useFetchState<FeederData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    const [ guid, setGuid ] = useFetchState<string>('');
    const [ feeders, setFeeders ] = useFetchState<SelectOption[]>([]);
    const ROWS = 10;
    const getFeederList = (page = 1) => {// 获取列表数据接口
        sRef.current?.getFormData().then((data) => {
            setLoading(true);
            const params: FeederListParam = {
                subSysNo: subSysNo,
                page: page,
                rows: ROWS,
                searchNode: data.searchNode,
                feederId: data.feederId,
            };

            basicData.feederMgt.feederList(params).then((res: FeederDataList) => {
                setLoading(false);
                setFeederList(res.rows);
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
    const showDeleteConfirm = (data:FeederData) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + data.SECTION_NAME + ')'),
            onOk () {
                const params: FeederSaveParam = {
                    guid: data.SECTION_ID,
                };

                basicData.feederMgt.deleteFeeder(params).then(() => {
                    message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                    getFeederList();
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


    const pagination = {// table分页设置
        total: total,
        onChange (page: number) {
            getFeederList(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 弹窗点击submit
    const saveData = async (row: any): Promise<any> => {
        console.log(row);
        if (guid) {// 编辑
            const params: FeederSaveParam = {
                section_name: row.section_name,
                node_no: row.node_no instanceof Array ? row.node_no[0] : row.node_no,
                remark: row.remark,
                fedr_spec: row.fedr_spec,
                section_no: row.section_no,
                subSysNo: subSysNo,
                guid: guid,
            };

            basicData.feederMgt.editFeeder(params).then(() => {
                getFeederList();
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        } else {// 添加
            const params: FeederSaveParam = {
                section_name: row.section_name,
                node_no: row.node_no,
                remark: row.remark,
                fedr_spec: row.fedr_spec,
                section_no: row.section_no,
                subSysNo: subSysNo,
            };

            basicData.feederMgt.addFeeder(params).then(() => {
                getFeederList();
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        }
    };

    // 添加根节点数转换函数
    const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
        const node = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

        node.forEach((item:UserNode) => {
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

    // 打开弹窗,带有参数是编辑，没有带是添加
    const openModel = async (item?: FeederData, maxFeederNo?:string) => {
        user.userNodeTree(subSysNo).then((res:UserNode[]) => {
            let nodeTree: CascaderData[] = [];
            let val:any = {};
            let title = '';

            nodeDataFormatCascader(res, nodeTree);
            setCascaderOpt(nodeTree);
            if (item?.SECTION_ID) {// 编辑
                setGuid(item.SECTION_ID);
                val = {
                    node_no: [ item.MODIFY_NODE_NO ],
                    section_no: item.SECTION_NO,
                    section_name: item.SECTION_NAME,
                    fedr_spec: item.FEDR_SPEC,
                    remark: item.REMARK,
                };
                title = Mes['btnTitleEditor'];
            } else {// 添加
                setGuid('');
                val = {
                    node_no: '',
                    section_no: maxFeederNo,
                };
                title = Mes['titleLabelAddadd'];
            }
            cRef.current?.openModel(val, title);
        });
    };

    // 弹窗form内组件的参数配置
    const addOpt = [
        {
            type: 'SelectTree',
            label: 'titleTableStationnamestationname',
            name: 'node_no',
            rules: [ { required: true } ],
            col: 12,
            treeOpt: CascaderOpt,
            // attr: {
            //     options: CascaderOpt,
            //     changeOnSelect: true,
            // },
        },
        {
            type: 'Input',
            label: 'titleTableSectionnosectionno',
            name: 'section_no',
            col: 12,
            rules: [ { required: true } ],
            attr: {
                type: 'text',
                disabled: true,
            },
        },
        {
            type: 'Input',
            label: 'measurepointTitleTableSectionnamesectionname',
            name: 'section_name',
            rules: [ { required: true } ],
            col: 12,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },
        {
            type: 'Input',
            label: 'titleTableFedrspecfedrspec',
            name: 'fedr_spec',
            col: 12,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },
        {
            type: 'Input',
            label: 'titleLabelRemarkremark',
            name: 'remark',
            col: 12,
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
        width: 1000,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 弹窗表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    // 显示新增弹窗
    const showAddModal = async () => {
        const res:string = await basicData.feederMgt.getMaxFeederNo(subSysNo);

        openModel(undefined, res);
    };

    // table title的设置
    const columns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleTableSectionnosectionno'],
            dataIndex: 'SECTION_NO',
            sorter: (a:FeederData, b:FeederData) => parseFloat(a.SECTION_NO) - parseFloat(b.SECTION_NO),
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
        },
        {
            title: Mes['titleTableFedrspecfedrspec'],
            dataIndex: 'FEDR_SPEC',
        },
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleLabelRemarkremark'],
            dataIndex: 'REMARK',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_TIME',
            sorter: (a: FeederData, b: FeederData) => Date.parse(a.CREATE_TIME) - Date.parse(b.CREATE_TIME),
            render (_: any, record: FeederData) {
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
            render (_: any, record: FeederData) {
                return (
                    <>
                        <Button type='primary' onClick={ () => openModel(record)} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                        <Button type='default' danger onClick={() => showDeleteConfirm(record)} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> }>

                        </Button>
                    </>
                );
            },
        },
    ];

    const search = (data: any) => {
        console.log('a-----', data);
        getFeederList();
    };

    const onSelect = async (keys: React.Key[], info: any) => {
        console.log(info);
        sRef.current?.setFieldsValue({
            feederId: '',
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
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnTitleAdd'],
            onClick () {
                showAddModal();
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
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    searchNode: nodes[0].value,
                    feederId: '',
                });
                getFeederList();
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
                <h4>{Mes['menuTitleFeederManagement']}</h4>
                {/* <Button type='primary' icon={ <PlusOutlined />} onClick={ showAddModal} title={Mes['btnTitleAdd']}></Button> */}
            </div>
            <div className='pv10h20'>
                {
                    searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div className='table'>
                    <Table columns={columns} dataSource={feederList} rowKey='rn__' pagination={ false}
                        size='small' loading={loading}
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                openModel(record);
                            // message.info(`${record.OPERATOR_NAME} doubleClick`);
                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <AddLangElment
                cRef={cRef}
                saveData={saveData}
                formOption={formOpt}
                modelOpt={modelOpt}
                Mes={Mes}
            />
        </div>

    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(FeederListPage);
