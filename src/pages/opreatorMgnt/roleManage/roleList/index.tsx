/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-06-20 17:17:08
 * Description :
 * -----
 * Last Modified: 2021-06-20 18:34:53
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import React from 'react';
import { Table, Form, Button, Input } from 'antd';
const Details: React.FC = () => {
    const [form] = Form.useForm();

    const columns = [
        {
            title: '序列',
            dataIndex: 'key',
            key: 'key',
          },
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '关联帐户数',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
          },
          {
            title: '创建人',
            dataIndex: 'createUser',
            key: 'createUser',
          },
    ];
    const pagination = {
        total: 40,
        showQuickJumper: true,
        showSizeChanger: true
    };
    const data = [
        {
            key: '1',
            name: '超级管理员',
            count: '1',
            createTime: '2021-06-20 10:10:10',
            createUser: 'magina'
        },
        {
            key: '2',
            name: '超级管理员',
            count: '1',
            createTime: '2021-06-20 10:10:10',
            createUser: 'magina'
        },
        {
            key: '3',
            name: '超级管理员',
            count: '1',
            createTime: '2021-06-20 10:10:10',
            createUser: 'magina'
        }
    ];
    const onReset = () => {
        form.resetFields();
    }
    return (
        <div className='main'>
            <div className='search'>
                <h4>数据筛选</h4>
                <div className='pv10h20'>
                    <Form form={form}   layout='inline'>
                        <Form.Item
                             name='name'
                             label='角色名'
                            >
                            <Input style={{width:'200px'}} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
                            <Button htmlType='submit' type='primary'>
                            Submit
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
                            <Button htmlType='button' onClick={onReset}>
                            Reset
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className='list'>
                <h4>角色列表</h4>
                <Table dataSource={data} pagination={pagination} columns={columns} />
            </div>
        </div>
    )
}

export default Details;




