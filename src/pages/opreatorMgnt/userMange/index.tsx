// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { user } from 'src/api';
import { UserList, UserInfo, UserRoleList, UserParams } from 'src/api/user/type';
import { Table, Button, Modal, message, Pagination } from 'antd';
import {ReturnUser} from 'src/api/user/type';
import { ExclamationCircleOutlined, UndoOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { LangMessage } from 'src/store/common/language';
import AddRowCom, { CRef } from 'src/components/business/addRowCom';
import SearchList, { SRef } from 'src/components/business/searchList';
import { RuleType } from 'rc-field-form/es/interface';
import useFetchState from 'src/utils/useFetchState';
import { BtnConfig } from 'src/components/common/btnList';
import { nodeDataFormatCascader, CascaderData } from 'src/utils/function';
const { confirm } = Modal;

type Props = {
    Mes: LangMessage;
    User: ReturnUser;
};

type SelectType = {
    value: string;
    name: string;
}

type Query = {
    operatorId: string;
    operatorName: string;
}

const INITQUERY: Query = { operatorId: '', operatorName: '' };

const ROWS: number = 10;

const UserListPage: React.FC<Props> = (props) => {
    const { Mes, User } = props;
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    const [ guid, setGuid ] = useFetchState<string>('');
    const [ tableData, setTableData ] = useFetchState<UserInfo[]>([]);
    // 设置分页的当前页数
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 设置查询的值
    const [ userQuery, setUserQuery ] = useFetchState<Query>(INITQUERY);
    // 设置分页的值
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    const [ roleList, setRoleList ] = useFetchState<SelectType[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);

    // 获取用户列表数据
    const getUserList = async (page: number = 1, pageSize: number = ROWS, query: Query = INITQUERY) => {
        try {
            const params = {
                ...query,
                sysNo: User.sysType.substring(0, 2),
                subSysNo: User.sysUser.nodeNo,
                page: page,
                rows: pageSize,
            };

            const res: UserList = await user.userList(params);

            setCurrent(page);
            setTableTotal(res.total);
            setTableData(res.rows);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            message.error(error.toString());
        }
    };
    // 打开弹窗,带有参数是编辑，没有带是添加
    const openModel = async (item?: UserInfo) => {
        try {
            const res = await Promise.all([ user.userNodeTree(User.sysType), user.userRoleList(User.sysType) ]);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(res[0], nodeTree);
            setCascaderOpt(nodeTree);
            const roleData = res[1].map((v: UserRoleList) => ({ value: v.GROUP_GUID, name: v.GROUP_NAME }));
            let val:any = {};

            setRoleList(roleData);
            if (item?.OPERATOR_GUID) {
                setGuid(item.OPERATOR_GUID);
                val = {
                    organization: [ item.NODE_NO ],
                    roleName: item.GROUP_GUID,
                    loginName: item.OPERATOR_ID,
                    operatorName: item.OPERATOR_NAME,
                    status: item.CLOSE_FLAG,
                    operatorType: item.DB_DOT,
                    phone: item.PHONE,
                    email: item.EMAIL,
                    remark: item.MODIFY_NODE_NO,
                };
            } else {
                setGuid('');
                val = {
                    organization: [ nodeTree[0].value ],
                    operatorType: '0',
                    status: '1',
                };
            }
            cRef.current?.openModel(val);
        } catch (error: any) {
            message.error(error.toString());
        }
    };
    // 展示删除确认框
    const showDeleteConfirm = (item: any) => {
        confirm({
            title: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk () {
                try {
                    const res = await user.deleteUser({ guid: item.OPERATOR_GUID });

                    if (res) {
                        message.error(res);
                    } else {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        getUserList();
                    }
                } catch (err) {
                    console.error(err);
                    message.error(typeof err === 'string' ? err : Mes['messageAlarmRequestfailrequestfail']);
                }

            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };
    // 重置密码确认框
    const resetPasswordConfirm = (item: any) => {
        confirm({
            title: 'Are you sure reset password?',
            icon: <ExclamationCircleOutlined />,
            content: 'Sure you reset password to "00000000" !',
            async onOk () {
                const res = await user.restPwd({
                    guid: item.OPERATOR_GUID,
                    subSysNo: User.sysType,
                    date: new Date().toString(),
                });

                if (res) {
                    message.error(res);
                } else {
                    message.success(Mes['messageSuccessResetsuccessresetsuccess']);
                }
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    // 表单配置
    const columns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['tableTitleStatus'],
            dataIndex: 'CLOSE_FLAG',
            render (_: any, record: any) {
                return <span style={{color: parseInt(record.CLOSE_FLAG, 10) === 1 ? '' : 'red'}}>{parseInt(record.CLOSE_FLAG, 10) === 1 ? Mes['comboboxEnabledenabled'] : Mes['comboboxDisabledisable']}</span>;
            },
        },
        {
            title: Mes['tableTitleLoginName'],
            dataIndex: 'OPERATOR_ID',
        },
        {
            title: Mes['tableTitleOperator'],
            dataIndex: 'OPERATOR_NAME',
        },
        {
            title: Mes['titleLabelRolenamerolename'],
            dataIndex: 'GROUP_NAME',
        },
        {
            title: Mes['tableTitleOperatorType'],
            dataIndex: 'DB_DOT',
            render (_: any, record: any) {
                let valueStr: string = '';

                switch (parseInt(record.DB_DOT, 10)) {
                    case 0:
                        valueStr = 'Web';
                        break;
                    case 1:
                        valueStr = 'Vendor';
                        break;
                    case 2:
                        valueStr = 'Vendor Operator';
                        break;
                    default:
                        valueStr = record.DB_DOT;
                }
                return <span>{valueStr}</span>;
            },
        },
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_TIME',
            render (_: any, record: any) {
                return <span>{record.CREATE_TIME && record.CREATE_TIME.split(' ')[0]}</span>;
            },
        },
        {
            title: Mes['titleTableOperatoroperator'],
            dataIndex: 'operate',
            className: 'flex flexBetween',
            render (_: any, record: any) {
                return (
                    <>
                        <Button
                            type='primary'
                            onClick={() => openModel(record)}
                            title={Mes['btnTitleEditor']}
                            icon={<FormOutlined/>}
                        ></Button>
                        <Button
                            type='default'
                            onClick={() => showDeleteConfirm(record)}
                            danger
                            title={Mes['btnTitleDelete']}
                            icon={<DeleteOutlined/>}
                        ></Button>
                        <Button
                            type='default'
                            onClick={() => resetPasswordConfirm(record)}
                            title={Mes['btnResetpsdresetpsd']}
                            icon={<UndoOutlined/>}
                            danger></Button>
                    </>
                );
            },
        },
    ];

    // 分页组件配置
    const pagination = {
        total: tableTotal,
        onChange (page: number, pageSize: number | undefined) {
            setLoading(true);
            getUserList(page, pageSize, userQuery);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 保存数据
    const saveData = async (row: any): Promise<void> => {
        const params: UserParams = {
            'sys_no': '10',
            'company_no': '0068',
            'role_id': row.roleName,
            'name': row.loginName,
            'zname': row.operatorName,
            'status': row.status,
            'statusOld': '',
            'dbDot': row.operatorType,
            'phone': row.phone,
            'email': row.email,
            'remark': row.remark,
            'subSysNo': User.sysType,
            'node_no': row.organization[row.organization.length - 1],
        };

        if (!guid) {
            const res = await user.addUser(params);

            if (res) {
                message.error(res);
                throw res;
            } else {
                message.success(`${Mes['messageSuccessSavesuccesssavesuccess']} ${Mes['hintInitPassword']}`);
            }
        } else {
            const res = await user.editorUser({ ...params, guid: guid });

            if (res) {
                message.error(res);
                throw res;
            } else {
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            }
        }
        setLoading(true);
        getUserList();
        // message.error(e.toString());
        // message.error(typeof e === 'string' ? e : Mes['messageAlarmRequestfailrequestfail']);
    };

    // 添加参数配置
    const addOpt = [
        {
            type: 'Cascader',
            label: 'titleTableStationnamestationname',
            name: 'organization',
            rules: [ {required: true} ],
            col: 12,
            attr: {
                options: CascaderOpt,
                changeOnSelect: true,
                disabled: !!guid, // 编辑的时候禁止修改，编辑的时候，会设置guid
            },
        },
        {
            type: 'Select',
            label: 'titleLabelRolenamerolename',
            name: 'roleName',
            col: 12,
            rules: [ {required: true} ],
            attr: {},
            options: roleList,
        },
        {
            type: 'Input',
            label: 'tableTitleLoginName',
            name: 'loginName',
            col: 12,
            rules: [ {required: true},
                { min: 4 }, { max: 16 },
                {
                    validator: (_: any, value: any) => {
                        if (value.length >= 4 && value.length <= 16) {
                            return /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(value) ? Promise.resolve() : Promise.reject(Mes['hintRulesLoginNotLawful']);
                        } else {
                            return Promise.resolve();
                        }
                    },
                },
            ],
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'tableTitleOperator',
            name: 'operatorName',
            col: 12,
            rules: [
                {
                    required: true,
                },
                {
                    min: 4,
                }, {
                    max: 16,
                },
            ],
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Select',
            label: 'tableTitleStatus',
            name: 'status',
            col: 12,
            rules: [ {required: true},
            ],
            options: [
                {
                    value: '1',
                    name: 'Enabled',
                },
                {
                    value: '0',
                    name: 'Disable',
                },
            ],
        },
        {
            type: 'Select',
            label: 'tableTitleOperatorType',
            name: 'operatorType',
            rules: [ {required: true},
            ],
            col: 12,
            options: [
                {
                    value: '0',
                    name: 'web',
                },
                {
                    value: '1',
                    name: 'Vendor',
                },
                {
                    value: '2',
                    name: 'Vendor Operator',
                },
            ],
        },
        {
            type: 'Input',
            label: 'titleTablePhonephone',
            name: 'phone',
            rules: [ {max: 30} ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'titleTableEmailemail',
            name: 'email',
            rules: [ { type: 'email' as RuleType } ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'titleLabelRemarkremark',
            name: 'remark',
            rules: [ { max: 30 } ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };

    // model参数设置
    const modelOpt = {
        title: !guid ? 'titleDialogAddoperatoraddoperator' : 'modalTitleEditorOpt',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    // 设置搜索组件的属性，需要查找的项
    const searchColumns = [
        {
            name: 'OPERATOR_ID',
            label: 'tableTitleLoginName',
            col: 4,
            type: 'Input',
        },
        {
            name: 'OPERATOR_NAME',
            label: 'tableTitleOperator',
            col: 4,
            type: 'Input',
        },
    ];

    // 搜索方法
    const searchFinsh = async (val: any) => {
        setCurrent(1);
        setLoading(true);
        const params = {
            operatorId: val.OPERATOR_ID || '',
            operatorName: val.OPERATOR_NAME || '',
        };

        setUserQuery(params);
        await getUserList(1, ROWS, params);
    };

    const resetUserList = async () => {
        searchFinsh({
            OPERATOR_ID: '',
            OPERATOR_NAME: '',
        });
    };

    // 按钮列表
    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            async onClick () {
                openModel();
            },
        },
    ];

    useEffect(() => {
        setLoading(true);
        getUserList();
    }, []);

    return (
        <>
            <div className='main flex flexColumn'>
                <h4 className='title'>{Mes['menuTitleOperatorMgnt']}</h4>
                <SearchList
                    cRef={sRef}
                    columns={searchColumns}
                    onFinish={searchFinsh}
                    resetFn={resetUserList}
                    btnConfig={{
                        col: 4,
                        btnList: btnList,
                    }}
                />
                <div className='table flexH100'>
                    <Table
                        dataSource={tableData}
                        pagination={false}
                        columns={columns}
                        loading={loading}
                        rowKey='rn__'
                    />
                </div>
                <div className='pagetion'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <AddRowCom<void, any>
                cRef={cRef}
                saveData={saveData}
                formOption={formOpt}
                modelOpt={modelOpt}
                Mes={Mes}
            />
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    User: state.userInfo,
}))(UserListPage);
