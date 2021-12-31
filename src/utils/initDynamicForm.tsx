/*
 * FileName : initForm.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-29 11:13:19
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

/**
 * 表单配置生成
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Rule } from 'rc-field-form/es/interface';
import { LangMessage } from 'src/store/common/language';
import { Form, Input, Select, DatePicker, Space, Col, Cascader, Upload, Button, Radio, Checkbox, TreeSelect } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const { Option, OptGroup } = Select;
// const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;

export type valueArr = {
    label?: string;
    value: string;
    name: string;
    children?: valueArr[]
}

export type SelectOpt = {
    value: string;
    name: string;
}

type HtmlAttr = {
    name: string;
    options?: SelectOpt[];
    attr?: Object;
    rules?: Rule[];
}

type GroupOpt = {
    Select?: HtmlAttr;
    Input?: HtmlAttr;
}

type TreeData = {
    value: string;
    title: string;
    children?: TreeData[];
}

export type formOpt = {
     type: string;
     label?: string;
     name: string;
     attr?: any; // 如果为Cascader下拉框options放这 object
     rules?: Rule[];
     col: number;
     options?: valueArr[]; // 如果是select下拉框，必须有
    groupOpt?: GroupOpt;
    treeOpt?: TreeData[];
    formItem?: Object; // Form.Item的配置属性
    slot?: React.ReactNode;
}

const initFormConfig = (columns: formOpt[], Mes: LangMessage, isI18n: boolean = false) =>
    // eslint-disable-next-line complexity
    columns.length && columns.map((v: formOpt, i: number) => {
        let element: React.ReactNode| null = null;

        switch (v.type) {
            case 'Input':
                element = <Input {...v.attr} />;
                break;
            case 'Select':
                element = (
                    <Select {...v.attr}>
                        {v.options?.map((opt: any, j: number) => (
                            <Option key={j} value={opt.value}>
                                {opt.name}
                            </Option>
                        ))}
                    </Select>
                );
                break;
            case 'DatePicker':
                element = (
                    <Space direction='vertical' size={12}>
                        <RangePicker showTime {...v.attr} />
                    </Space>
                );
                break;
            case 'RangePicker':
                element = (
                    <Space direction='vertical' size={12}>
                        <RangePicker {...v.attr}/>
                    </Space>
                );
                break;
            case 'TimePicker':
                element = (
                    <Space direction='vertical' size={12}>
                        <DatePicker showTime {...v.attr} />
                    </Space>
                );
                break;
            case 'InputGroup':
                element = (
                    <Input.Group className='flex'>
                        <Form.Item
                            name={[ v.name, v?.groupOpt?.Select?.name || '' ]}
                            rules={v?.groupOpt?.Select?.rules}
                        >
                            <Select {...v?.groupOpt?.Select?.attr}>
                                {
                                    v?.groupOpt?.Select?.options?.map((opt: any, j: number) => (
                                        <Option key={j} value={opt.value}>
                                            {opt.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={[ v.name, v?.groupOpt?.Input?.name || '' ]}
                            rules={v?.groupOpt?.Input?.rules}
                        >
                            <Input {...v?.groupOpt?.Input?.attr} />
                        </Form.Item>
                    </Input.Group>
                );
                break;
            case 'Cascader':
                element = (
                    element = <Cascader {...v.attr} />
                );
                break;
            case 'SelectGroup':
                element = (
                    <Select {...v.attr}>
                        {
                            v.options && v.options.map((item) => (
                                <OptGroup key={item.value} label={item.label ? item.label : item.name}>
                                    {
                                        item.children?.map((o) => (
                                            <Option value={ o.value} key={o.value}>{ o.name }</Option>
                                        ))
                                    }
                                </OptGroup>
                            ))
                        }
                    </Select>
                );
                break;
            case 'SelectTree':
                element = (
                    <TreeSelect treeDefaultExpandAll {...v.attr} treeData={ v.treeOpt}>
                        {/* {v.treeOpt && v.treeOpt.map((item) => (
                            <TreeNode value={item.key} title={item.title} key={item.key}>
                                {item.children && item.children.map((child) => (
                                    <TreeNode value={child.key} title={child.title} key={child.key}>
                                        { child.children && child.children.map((row) => (
                                            <TreeNode value={row.key} title={row.title} key={row.key}>
                                            </TreeNode>
                                        ))}
                                    </TreeNode>
                                ))}
                            </TreeNode>
                        ))
                        } */}
                    </TreeSelect>
                    // <Select {...v.attr} dropdownRender={() => (
                    //     <div>
                    //         <Tree
                    //             defaultExpandAll={true}
                    //             autoExpandParent={true}
                    //             treeData={v.treeOpt}
                    //             {...v.attr}
                    //         />
                    //     </div>
                    // )}></Select>
                );
                break;
            case 'UploadText':
                element = (
                    <Upload {...v.attr}>
                        <Button icon={<UploadOutlined />}>{Mes['btnTextClicktoUpload']}</Button>
                    </Upload>
                );
                break;
            case 'RadioGroup':
                element = (
                    <Radio.Group {...v.attr}>
                        {v.options?.map((opt: any, j: number) => (
                            <Radio key={j} value={opt.value}>
                                {opt.name}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
                break;
            case 'CheckboxGroup':
                element = (
                    <Checkbox.Group {...v.attr} />
                );
                break;
            default:
                element = null;
                break;
        }
        if (v.type === 'Slot') {
            return (v.slot);
        }
        if (element) {
            return (
                <Col span={v.col || 12} key={i}>
                    <Form.Item
                        name={v.name}
                        label={isI18n ? (v.label ? Mes[v.label] : '') : (v.label || '')}
                        {...v.formItem}
                        rules={v.rules}>
                        {element}
                    </Form.Item>
                </Col>
            );
        }
    }).filter((v) => v);

export default initFormConfig;
