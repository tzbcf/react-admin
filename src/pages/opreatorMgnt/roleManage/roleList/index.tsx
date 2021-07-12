/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-06-20 17:17:08
 * Description :
 * -----
 * Last Modified: 2021-07-08 19:29:47
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal } from 'antd';
import { LangMessage } from 'src/store/common/language';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

type Props = {
    mes: LangMessage
}
const roleList: React.FC<Props> = (props) => {
    const { mes } = props;

    const editor = (item: any) => {
        console.log('item------', item);
    };

    const showDeleteConfirm = (item: any) => {
        console.log('item------', item);
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk () {
                console.log('OK');
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const columns = [
        {
            title: mes.commonTitleSequence,
            dataIndex: 'rn_',
        },
        {
            title: `${mes.roleManageTitleRole} ${mes.commonTitleName}`,
            dataIndex: 'GROUP_NAME',
        },
        {
            title: mes.commonTitleRemark,
            dataIndex: 'REMARK',
        },
        {
            title: mes.roleManageTitleGlobalMaintenance,
            dataIndex: 'GLOBE_MODIFY_FLAG',
            render (_: any, record: any) {
                return (
                    <span>{ parseInt(record.GLOBE_MODIFY_FLAG, 10) ? mes.commonTextYes : mes.commonTextNo}</span>
                );
            },
        },
        {
            title: `${mes.commonTitleCreate}${mes.commonTitleTime}`,
            dataIndex: 'CRETE_TIME',
            render (_: any, record: any) {
                return (
                    <span>{ record.CRETE_TIME.split(' ')[0] }</span>
                );
            },
        },
        {
            title: mes.commonTitleOperate,
            dataIndex: 'operate',
            width: 200,
            render (_: any, record: any) {
                return (
                    <>
                        <Button type="primary" onClick={() => editor(record)}>{ mes.commonBtnEtitor }</Button>
                        <Button type="default" className="ml10" onClick={() => showDeleteConfirm(record)} danger>{ mes.commonBtnDelete }</Button>
                    </>
                );
            },
        },
    ];
    const pagination = {
        total: 2,
    };
    const data = [
        {
            rn_: 1,
            GROUP_NAME: 'test',
            REMARK: '测试',
            GLOBE_MODIFY_FLAG: '1',
            CRETE_TIME: '2020-10-10 19:10:10',
        },
        {
            rn_: 2,
            GROUP_NAME: 'admin',
            REMARK: 'amin',
            GLOBE_MODIFY_FLAG: '0',
            CRETE_TIME: '2020-10-10 19:20:10',
        },
    ];

    return (
        <div className="main">
            <div className="list">
                <div className="flexCenter flexBetween title">
                    <h4>{ `${mes.roleManageTitleRole}${mes.commonTitleList}` }</h4>
                    <Button type="primary">{ mes.commonBtnAdd }</Button>
                </div>
                <div className="pv10h20">
                    <Table dataSource={data} pagination={pagination} columns={columns} />
                </div>
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    mes: state.langSwitch.message,
}))(roleList);


