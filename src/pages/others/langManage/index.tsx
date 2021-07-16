/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-13 16:42:47
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Table, Button } from 'antd';
import SearchList from 'src/components/common/searchList';

const LangManage = () => {
    const searchColumns = [
        {
            name: 'key',
            label: '属性名',
            type: 'Input',
        },
        {
            name: 'name',
            label: '语言搜索',
            type: 'SelectInput',
        },
    ];

    const searchFinsh = (list:any) => {
        console.log('-----', list);
    };

    const pagination = {
        total: 2,
    };

    const tableList = [
        {
            title: '序号',
            dataIndex: 'sn',
        },
        {
            title: '属性名',
            dataIndex: 'key',
        },
        {
            title: '中文',
            dataIndex: 'zhCN',
        },
        {
            title: '西班牙语',
            dataIndex: 'esES',
        },
        {
            title: '英语',
            dataIndex: 'esUS',
        },
        {
            title: '使用次数',
            dataIndex: 'count',
        },
    ];

    const data = [
        {
            sn: 1,
            key: 'userName',
            zhCN: '用户名',
            esUS: 'username',
            esES: 'Nombre de usuario',
            count: 2,
        },
        {
            sn: 2,
            key: 'password',
            zhCN: '密码',
            esUS: 'La contraseña',
            esES: 'password',
            count: 2,
        },
    ];

    return (
        <div>
            <SearchList columns={ searchColumns } onFinish={ searchFinsh } />
            <div style={{background: '#fff', marginTop: '20px'}}>
                <div className='flexCenter flexBetween title'>
                    <h4>语言列表</h4>
                    <div>
                        <Button type='primary'>添加</Button>
                        <Button style={{margin: '0 10px'}}>导出</Button>
                        <Button type='text' danger>导入</Button>
                    </div>
                </div>
                <Table columns={tableList} pagination={pagination} dataSource={ data } className='pv0h20' />
            </div>
        </div>
    );
};

export default LangManage;
