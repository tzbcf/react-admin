// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'antd';
import { LangMessage } from 'src/store/common/language';
type Props = {
  mes: LangMessage
}

const UserList = (props: Props) => {
    const { mes } = props;

    const editor = (item: any) => {
        console.log('-------', item);
    };
    const showDeleteConfirm = (item: any) => {
        console.log('-------', item);
    };
    const resetPassword = (item: any) => {
        console.log('-------', item);
    };

    const columns = [
        {
            title: mes.commonTitleSequence,
            dataIndex: 'rn_',
        },
        {
            title: mes.commonTitleStatus,
            dataIndex: 'CLOSE_FLAG',
            render (_: any, record: any) {
                return (
                    <span>{ parseInt(record.CLOSE_FLAG, 10) === 1 ? mes.commonTextEnable : mes.commonTextDisable}</span>
                );
            },
        },
        {
            title: `${mes.loginBtnName}${mes.commonTitleName}`,
            dataIndex: 'OPERATOR_ID',
        },
        {
            title: mes.userManageTitleOperator,
            dataIndex: 'OPERATOR_NAME',
        },
        {
            title: `${mes.roleManageTitlerole}${mes.commonTitleName}`,
            dataIndex: 'GROUP_NAME',
        },
        {
            title: `${mes.commonTitleOperate}${mes.commonTitleType}`,
            dataIndex: 'DB_DOT',
            render (_: any, record: any) {
                let valueStr: string = '';

                switch (parseInt(record.DB_DOT, 10)) {
                    case 0:
                        valueStr = mes.commonTextWeb;
                        break;
                    case 1:
                        valueStr = mes.commonTextDealer;
                        break;
                    case 2:
                        valueStr = mes.commonTextDealerOperator;
                        break;
                    default:
                        valueStr = record.DB_DOT;
                }
                return (
                    <span>{ valueStr }</span>
                );
            },
        },
        {
            title: `${mes.commonTitleOrganization}${mes.commonTitleName}`,
            dataIndex: 'NODE_NAME',
        },
        {
            title: `${mes.commonTitleCreate}${mes.commonTitleTime}`,
            dataIndex: 'CREATE_TIME',
            render (_: any, record: any) {
                return (
                    <span>{ record.CREATE_TIME.split(' ')[0] }</span>
                );
            },
        },
        {
            title: mes.commonTitleOperate,
            dataIndex: 'operate',
            render (_: any, record: any) {
                return (
                    <>
                        <Button type="primary" onClick={() => editor(record)}>{ mes.commonBtnEtitor }</Button>
                        <Button type="default" className="ml10" onClick={() => showDeleteConfirm(record)} danger>{ mes.commonBtnDelete }</Button>
                        <Button type="default" className="ml10" onClick={() => resetPassword(record)} danger>{ `${mes.commonBtnReset}${mes.password}` }</Button>
                    </>
                );
            },
        },
    ];
    const pagination = {
        total: 1,
    };
    const data = [
        {
            rn_: 1,
            CLOSE_FLAG: '1',
            OPERATOR_ID: 'admin',
            OPERATOR_NAME: 'administrator',
            GROUP_NAME: 'MDR ADMIN',
            DB_DOT: '111',
            NODE_NAME: 'MDR SYSTEM',
            CREATE_TIME: '2019-12-10 10:10:11',
        },
    ];

    return <div className="main">
        <div className="flexCenter flexBetween title">
            <h4>{ mes.userListTitle }</h4>
            <Button type="primary">{ mes.commonBtnAdd }</Button>
        </div>
        <div className="pv10h20">
            <Table dataSource={data} pagination={pagination} columns={columns} />
        </div>
    </div>;
};


export default connect((state: any) => ({
    mes: state.langSwitch.message,
}))(UserList);
