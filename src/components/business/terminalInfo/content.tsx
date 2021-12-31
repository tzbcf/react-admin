/*
 * FileName : content.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-09 10:52:13
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { List, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import './index.less';
export type ItemType = 'List' | 'Table';
export type DataItem = {
    label: string;
    value: string | number;
};
type Props<T> = {
    type: ItemType;
    data: T[];
    colunms?: ColumnsType<T>;
    key?: string;
};

const TerminalContent = <T extends Object = any>(props: Props<T>) => {
    const { type, data, colunms, key = 'key' } = props;

    if (type === 'List') {
        return (
            <List
                size='large'
                className='terminal'
                dataSource={data as any[]}
                split={true}
                grid={{
                    column: 2,
                }}
                renderItem={(item, index) => (
                    <List.Item key={index}>
                        <span className='label' title={item.label}>
                            {item.label}:
                        </span>
                        <span className='value' title={item.value}>
                            {item.value}
                        </span>
                    </List.Item>
                )}
            />
        );
    }
    if (type === 'Table') {
        return <Table columns={colunms} dataSource={data as T[]} rowKey={key} />;
    }
    return null;
};

export default TerminalContent;
