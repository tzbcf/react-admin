/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-20 11:04:25
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { InputNumber, Input, Form } from 'antd';
import { LangMessage } from 'src/store/common/language';
interface EditableCellProps<T> extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: T;
    index: number;
    Mes: LangMessage;
  children: React.ReactNode;
}

const Index = <T extends Object=any>({
    editing,
    dataIndex,
    title,
    inputType,
    children,
    Mes,
    ...restProps
}:EditableCellProps<T>) => {
    const inputNode = inputType === 'number' ? <InputNumber title={title} /> : <Input title={title} />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[ {
                        required: true,
                        message: Mes['messageAlarmCannotbeemptycannotbeempty'],
                    } ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default Index;
