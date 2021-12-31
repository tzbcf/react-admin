/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-06-20 17:17:08
 * Description :
 * -----
 * Last Modified: 2021-12-14 16:52:50
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, message, Pagination } from 'antd';
import { LangMessage } from 'src/store/common/language';
import { ExclamationCircleOutlined, PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import AddRole, { CRef } from './addRole';
import { user } from 'src/api';
import { RoleListRow } from 'src/api/user/type';
import useFetchState from 'src/utils/useFetchState';
// import { deepClone } from 'src/utils/utils';
const { confirm } = Modal;

type Props = {
    Mes: LangMessage;
};
const sysParmas = {
    sysNo: '10',
    company: '0068',
};
const roleList = (props: Props) => {
    const { Mes } = props;
    const cRef = useRef<CRef>();

    // 设置分页的当前页数
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 设置table获取数据Loadin
    const [ loading, setLoading ] = useFetchState<boolean>(true);
    // 设置table数据
    const [ tabelData, setTableData ] = useFetchState<RoleListRow[]>([]);
    // 设置分页的值
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    // 打开弹窗按钮loading
    const [ addBtnLoading, setAddBtnLoading ] = useFetchState<boolean>(false);
    const editor = (item: any) => {
        cRef.current?.openModel(item);
    };

    const getUserList = async (page = 1, rows = 10) => {
        try {
            const res = await user.getRoleList({
                ...sysParmas,
                page,
                rows,
            });

            setCurrent(page);
            setTableData(res.rows);
            setTableTotal(res.total);
            setLoading(false);
        } catch (e:any) {
            message.error(e.toString());
        }
    };

    const deleteRow = async (row: RoleListRow) => {
        try {
            await user.deletRole(row.GROUP_GUID);
            message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
            await getUserList();
        } catch (error: any) {
            message.error(error.toString());
        }

    };

    const showDeleteConfirm = (item: RoleListRow) => {
        confirm({
            title: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk () {
                deleteRow(item);
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const openAddModel = async () => {
        setAddBtnLoading(true);
        await cRef.current?.openModel();
        setAddBtnLoading(false);

    };

    const columns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 50,
        },
        {
            title: Mes['titleLabelRolenamerolename'],
            dataIndex: 'GROUP_NAME',
            width: 300,
        },
        {
            title: Mes['titleLabelRemarkremark'],
            dataIndex: 'REMARK',
            width: 300,
        },
        {
            title: Mes['titleLabelWeihuweihu'],
            dataIndex: 'GLOBE_MODIFY_FLAG',
            width: 200,
            render (_: any, record: any) {
                return <span>{parseInt(record.GLOBE_MODIFY_FLAG, 10) ? Mes['titleTableYesyes'] : Mes['titleTableNono']}</span>;
            },
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'CREATE_TIME',
            sorter: (a: RoleListRow, b: RoleListRow) => Date.parse(a.CREATE_TIME) - Date.parse(b.CREATE_TIME),
            render (_: any, record: any) {
                return <span>{record.CREATE_TIME.split(' ')[0]}</span>;
            },
        },
        {
            title: Mes['titleTableOperatoroperator'],
            dataIndex: 'operate',
            width: 200,
            render (_: any, record: any) {
                return (
                    <>
                        <Button
                            type='primary'
                            onClick={() => editor(record)}
                            title={Mes['btnTitleEditor']}
                            icon={<FormOutlined/>}
                        ></Button>
                        <Button
                            type='default'
                            className='ml10'
                            onClick={() => showDeleteConfirm(record)} danger
                            title={Mes['btnTitleDelete']}
                            icon={<DeleteOutlined/>}
                        ></Button>
                    </>
                );
            },
        },
    ];
    const pagination = {
        total: tableTotal,
        async onChange (page: number, pageSize?: number) {
            setLoading(true);
            await getUserList(page, pageSize);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: 10,
        showSizeChanger: false,
    };

    const submitFinish = () => {
        getUserList();
    };

    useEffect(() => {
        setLoading(true);
        getUserList();
    }, []);

    return (
        <div id='roleMgnt'>
            <div className='list flex flexColumn flexH100'>
                <div className='flexCenter flexBetween title'>
                    <h4>{ Mes['menuTitleRoleMgnt'] }</h4>
                    <Button type='primary' loading={addBtnLoading} icon={<PlusOutlined/>} title={Mes['titleLabelAddroleaddrole']} onClick={openAddModel}></Button>
                </div>
                <div className='pv10h20 flexH100'>
                    <Table
                        dataSource={tabelData}
                        pagination={false}
                        columns={columns}
                        loading={loading}
                        rowKey='rn__' />
                </div>
                <Pagination {...pagination} />
            </div>
            <AddRole cRef={cRef} onFinish={submitFinish} />
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(roleList);
