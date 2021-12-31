// eslint-disable-next-line no-use-before-define
import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import useFetchState from 'src/utils/useFetchState';
import { CustomerListData, CustomerType } from 'src/api/customer&Device/customerMgnt/type';
import { Table, Button, Row, Pagination, message, Col } from 'antd';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import SearchList, { SRef } from 'src/components/business/searchList';
import AddRowCom, { CRef } from 'src/components/business/addRowCom';
import { formOpt } from 'src/utils/initDynamicForm';
import { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import { customer, user } from 'src/api';
import { PaginationConfig } from 'src/api/types';
import { nodeDataFormatCascader, CascaderData, findParentKeyArr } from 'src/utils/function';
import {UserNode} from 'src/api/user/type';
type InitCondition = {
    customerType: string;
    queryField: string;
    searchNode: string;
}

type AttrOpt = {
    key: string;
    name: string;
    proto: string;
    type?: string;
    rules?: any[];
}

type CustRef = {
    'cust_GUID': string;
}

type Props = {
  Mes: LangMessage;
  subSysNo: string;
  nodeNo: string;
}
const CustomerMgnt: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const ROWS = 10;
    const tRef = useRef<TRef>();
    const INITPAGING = {
        page: 1,
        pageSize: ROWS,
    };
    const CUSTOMER_TYPE = [
        {
            value: '2',
            name: Mes['titleTableYesyes'],
        },
        {
            value: '1',
            name: Mes['titleTableNono'],
        },
    ];
    const CUSTOMER_FIELD = [
        {
            value: 'CUSTOMER_NO',
            name: Mes['titleTableCustomernocustomerno'],
        },
        {
            value: 'CUSTOMER_NAME',
            name: Mes['titleTableGridcustomernamegridcustomername'],
        },
    ];
    const editAttr:AttrOpt[] = [
        {
            name: Mes['titleLabelStationstation'],
            key: 'nodeDlgTree',
            proto: 'NODE_NO',
            type: 'Cascader',
        },
        {
            name: Mes['titleTableCustomernocustomerno'],
            key: 'customer_no',
            proto: 'CUSTOMER_NO',
            rules: [ {len: 8} ],
        },
        {
            name: Mes['titleTableGridcustomernamegridcustomername'],
            key: 'customer_name',
            proto: 'CUSTOMER_NAME',
            rules: [ {max: 60}, {min: 1} ],
        },
        {
            name: Mes['titleLabelLinkmanlinkman'],
            key: 'customer_lxr',
            proto: 'LINKMAN',
            rules: [ {max: 20}, {min: 0} ],
        },
        {
            name: Mes['titleLabelLinkphonelinkphone'],
            key: 'customer_phone',
            proto: 'PHONE',
            rules: [ {max: 20}, {min: 1} ],
        },
        {
            name: Mes['titleTableBuildingnobuildingno'],
            key: 'building',
            proto: 'ROOM_ID',
            rules: [ {max: 32}, {min: 1} ],
        },
        {
            name: Mes['titleTableUnitnounitno'],
            key: 'unit',
            proto: 'UNIT_NO',
            rules: [ {max: 32}, {min: 1} ],
        },
        {
            name: Mes['titleTableFloornofloorno'],
            key: 'floor',
            proto: 'LAYER_NO',
            rules: [
                {
                    validator (_: any, value: any) {
                        if (value) {
                            if (parseInt(value, 10) > 999) {
                                return Promise.reject(new Error(`${Mes['rulesTitleMaximumValue']}999`));
                            }
                            if (parseInt(value, 10) < -3) {
                                return Promise.reject(new Error(`${Mes['rulesTitleMinimumValue']}-3`));
                            }
                        }
                        return Promise.resolve();
                    },
                },
            ],
        },
        {
            name: Mes['titleTableHousenohouseno'],
            key: 'house',
            proto: 'HOUSE_NO',
            rules: [ {max: 20}, {min: 1} ],
        },
        {
            name: Mes['titleTableAddressaddress'],
            key: 'customer_address',
            proto: 'ADDRESS',
            rules: [ {max: 60}, {min: 0} ],
        },
        {
            name: Mes['titleLabelRemarkremark'],
            key: 'customer_remark',
            proto: 'REMARK',
            rules: [ {max: 100}, {min: 0} ],
        },
    ];
    const sRef = useRef<SRef>();
    const aRef = useRef<CRef>();
    const custRef = useRef<CustRef>({
        'cust_GUID': '',
    });
    // table数据
    const [ tableData, setTableData ] = useFetchState<CustomerListData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ nodeList, setNodeList ] = useFetchState<UserNode[]>([]);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ searchColumns, setsearchColumns ] = useFetchState<any[]>([]);
    const [ searchVal, setSearchVal ] = useFetchState<Object>({});
    const [ initSearchVal, setInitSearchVal ] = useFetchState<InitCondition | null>(null);
    const [ nodeTreeOpt, setNodeTreeOpt ] = useFetchState<CascaderData[]|null>(null);
    // 编辑弹窗表单数据
    const [ addOpt, setAddOpt ] = useFetchState<formOpt[]>([]);

    // 编辑事件
    const editor = (val: CustomerListData) => {
        const initVal: any = {};
        const initOpt:formOpt[] = editAttr.map((row:AttrOpt) => {
            const obj:formOpt = {
                label: row.name,
                name: row.key,
                attr: {},
                type: 'Input',
                col: 12,
            };

            initVal[row.key] = val[row.proto];
            obj.rules = row.rules;
            if (row.key === 'nodeDlgTree') {
                obj.attr.disabled = true;
            }
            if (row.key === 'customer_no' && val.CUSTOMER_TYPE === '2') {
                obj.attr.disabled = true;
                obj.rules = [];
            }
            if (row.type) {
                obj.type = row.type;
                if (row.type === 'Cascader') {
                    obj.attr.options = nodeTreeOpt;
                    let cascaderList = [];

                    cascaderList.push(val[row.proto]);
                    findParentKeyArr(nodeList, 'ID', 'PARENTID', val[row.proto], cascaderList);
                    initVal[row.key] = cascaderList;
                }
            }
            if (row.key === 'floor') {
                obj.attr.type = 'number';
            }
            return obj;
        }).filter((v) => v);

        console.log('----------initVal', initVal);
        console.log('----------nodeTreeOpt', nodeTreeOpt);

        custRef.current['cust_GUID'] = val.CUST_GUID;
        setAddOpt(initOpt);
        aRef.current?.openModel(initVal);
    };
        // 查看设备详情
    const checkDevice = (cstId: string) => {
        tRef.current?.openModel('meter', cstId);
    };

    // 表单配置
    const columns:ColumnsType<CustomerListData> = [
        {
            title: Mes['titleLabelUserstatususerstatus'],
            dataIndex: 'CUSTOMER_TYPE',
            render (_: any, record: any) {
                return <span style={{ color: parseInt(record['CUSTOMER_TYPE'], 10) === 2 ? 'blue' : 'red' }}>
                    {parseInt(record['CUSTOMER_TYPE'], 10) === 2 ? Mes['titleTableYesyes'] : Mes['titleTableNono']}
                </span>;
            },
        },
        {
            title: Mes['titleTableCustomernocustomerno'],
            dataIndex: 'CUSTOMER_NO',
            sorter: (a, b) => parseInt(a.CUSTOMER_NO, 10) - parseInt(b.CUSTOMER_NO, 10),
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
            sorter: (a, b) => parseInt(a.METER_NO, 10) - parseInt(b.METER_NO, 10),
            render (value: string) {
                return (<a onClick={(e) => {
                    checkDevice(value);
                    e.stopPropagation();
                }}>{value}</a>);
            },
        },
        {
            title: Mes['measurepointTitleTableMeasurepointnomeasurepointno'],
            dataIndex: 'MP_NO',
            sorter: (a, b) => parseInt(a.MP_NO, 10) - parseInt(b.MP_NO, 10),
        },
        {
            title: Mes['titleTableGridcustomernamegridcustomername'],
            dataIndex: 'CUSTOMER_NAME',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_TIME',
            render (_: any, record: any) {
                return <span>{ record.CREATE_TIME?.split(' ')?.[0] || '-' }</span>;
            },
            sorter: (a, b) => parseInt(a.CREATE_TIME, 10) - parseInt(b.CREATE_TIME, 10),
        },
        {
            title: Mes['titleTableOperatoroperator'],
            dataIndex: 'operate',
            className: 'flex flexBetween',
            render (value:any, record: CustomerListData) {
                return (
                    <>
                        <Button type='primary' icon={<EditOutlined />}
                            onClick={() => editor(record)}
                            htmlType='button' title={Mes['btnTitleEditor']}
                        />
                    </>
                );
            },
        },
    ];

    // 获取数据
    const getData = async (pages: PaginationConfig, query: Object = {}) => {
        setLoading(true);
        const params = {
            page: pages.page,
            rows: pages.pageSize,
            subSysNo: subSysNo,
            customerType: '2' as CustomerType,
            status: '1',
            queryField: '',
            queryValue: '',
            meterNo: '',
            sqlSort: '',
            sqlOrder: '',
            searchNode: '',
            ...searchVal,
            ...query,
        };
        const res = await customer.customerMgnt.getCustomerList(params);

        setTableData(res.rows);
        setTableTotal(res.total);
        setCurrent(pages.page);
        setLoading(false);
    };


    // 分页组件配置
    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getData({page: page, pageSize: ROWS});
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    const search = (data: any) => {
        console.log('1-----', data);
        const lg = data.searchNode.length;

        data.searchNode = data.searchNode[lg - 1];
        setSearchVal({
            ...searchVal,
            ...data,
        });

        getData(INITPAGING, {
            ...searchVal,
            ...data,
        });
    };

    const initConfig = async () => {
        try {
            const res = await user.userNodeTree(subSysNo);

            if (!res.length) {return;}
            setNodeList(res);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(res, nodeTree);
            const searchList = [
                {
                    name: 'customerType',
                    type: 'Select',
                    col: 3,
                    options: CUSTOMER_TYPE,
                },
                {
                    name: 'queryField',
                    col: 3,
                    type: 'Select',
                    options: CUSTOMER_FIELD,
                },
                {
                    name: 'queryValue',
                    col: 3,
                    type: 'Input',
                },
                {
                    name: 'meterNo',
                    col: 3,
                    type: 'Input',
                    attr: {
                        placeholder: 'Meter No',
                    },
                },
                {
                    name: 'searchNode',
                    col: 4,
                    type: 'Cascader',
                    attr: {
                        options: nodeTree,
                        changeOnSelect: true,
                    },
                },
            ];

            setNodeTreeOpt(nodeTree);
            setsearchColumns(searchList);
            sRef.current?.setFieldsValue({
                customerType: '2',
                queryField: 'CUSTOMER_NAME',
                searchNode: [ res[0].ID ],
            });
            setInitSearchVal({
                searchNode: res[0].ID,
                customerType: '2',
                queryField: 'CUSTOMER_NAME',
            });
            await getData(INITPAGING, {
                searchNode: res[0].ID,
                customerType: '2',
                queryField: 'CUSTOMER_NAME',
            });
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const tableChange = (...val: any[]) => {
        let order = '';
        let key = '';

        if (val[2].field && val[2].order) {
            key = val[2].field;

            if (val[2].order === 'ascend') {
                order = 'ASC';
            }
            if (val[2].order === 'descend') {
                order = 'DESC';
            }
            if (key === 'CREATE_TIME') {
                key = 'a.CREATE_TIME';
            }
            getData(INITPAGING, {
                sqlSort: key,
                sqlOrder: order,
            });
        } else {
            getData(INITPAGING);
        }
        setSearchVal({
            ...searchVal,
            ...{
                sqlSort: key,
                sqlOrder: order,
            },
        });
    };

    const initSearch = () => {
        setSearchVal(initSearchVal as any);
        getData(INITPAGING, initSearchVal as InitCondition);
    };

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };

    // 表单参数
    const formOptConfig = {
        options: addOpt,
        layout: layout,
    };

    // 保存修改编辑数据
    const saveData = async (val:any) => {
        console.log(val);
        const res = await customer.customerMgnt.updateCustomer({
            building: val.building || '',
            'cust_GUID': custRef.current['cust_GUID'] || '',
            'customer_address': val.customer_address || '',
            'customer_lxr': val.customer_address || '',
            'customer_name': val.customer_name || '',
            'customer_no': val.customer_no || '',
            'customer_phone': val.customer_phone || '',
            'customer_remark': val.customer_remark || '',
            'customer_sms_phone': val.customer_sms_phone || '',
            floor: val.floor || '',
            house: val.house || '',
            nodeId: val.nodeDlgTree[val.nodeDlgTree.length - 1] || '',
            subSysNo,
            unit: val.unit || '',
        });

        if (!res.flag) {
            throw res.mess;
        } else {
            message.success(Mes['messageSuccessResetsuccessresetsuccess']);
            getData({page: current, pageSize: ROWS});
        }
    };

    // model参数设置
    const modelOpt = {
        title: 'titleLabelEdituserdocedituserdoc',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    useEffect(() => {
        initConfig();
    }, []);

    return (
        <>
            <div className='main customerMgnt'>
                <Row>
                    <h4 className='title'>{Mes['menuTitleCustomerManagement']}</h4>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        {
                            searchColumns.length && <SearchList
                                cRef={sRef}
                                columns={searchColumns}
                                resetFn={initSearch}
                                onFinish={search} />
                        }
                    </Col>
                </Row>
                <div className='table'>
                    <Table
                        dataSource={tableData}
                        pagination={false}
                        columns={columns}
                        loading={loading}
                        onChange={tableChange}
                        rowKey='CUST_GUID'
                    />
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <TerminalInfo cRef={tRef} />
            <AddRowCom<void, any>
                cRef={aRef}
                saveData={saveData}
                formOption={formOptConfig}
                modelOpt={modelOpt}
                isI18n={false}
                Mes={Mes}
            />
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(CustomerMgnt);
