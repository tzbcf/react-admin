// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Form, Input, Select, Button, DatePicker, Space, Col, Row } from 'antd';
import type { Callbacks } from 'rc-field-form/lib/interface';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { deepClone } from 'src/utils/utils';
import indexLess from './index.module.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

type Props = {
    message: LangMessage;
    columns: any[];
    onFinish: Callbacks<any>['onFinish'];
};

const CreateColumns = (props: any) => {
    const { v } = props;
    let element: React.ReactNode = <span></span>;

    switch (v.type) {
        case 'Input':
            element = <Input {...v.props} />;
            break;
        case 'Select':
            element = (
                <Select {...v.props}>
                    {v.options.map((opt: any, j: number) => (
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
                    <RangePicker showTime />
                </Space>
            );
            break;
        case 'SelectInput':
            element = (
                <div className={indexLess.selectInput}>
                    <Select defaultValue='zhCN' style={{width: 'auto'}}>
                        <Option value='zhCN'>中文</Option>
                        <Option value='esUS'>英语</Option>
                        <Option value='esES'>西班牙</Option>
                    </Select>
                    <Input style={{ width: '100%', flex: 1 }} />
                </div>
            );
            break;
        default:
            element = <span></span>;
            break;
    }
    return <div>{element}</div>;
};

const SearchList = (props: Props) => {
    const { message: mes, columns = [], onFinish } = props;
    const [ expand, setExpand ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const onReset = () => {
        form.resetFields();
    };

    const getFields = () => {
        const countList = deepClone(columns);
        let countArr = expand ? countList : columns.length > 6 ? countList.splice(0, 6) : countList;

        return countArr.map((v: any, i: number) => (
            <Col span={6} key={i} className='pv0h8'>
                <Form.Item name={v.name} label={v.label} rules={v.rules}>
                    <CreateColumns v={v} />
                </Form.Item>
            </Col>
        ));
    };

    return (
        <div className={indexLess.searchForm}>
            <h4>{mes.compontentTitleSearchList}</h4>
            <Form form={form} name='search-form' onFinish={onFinish}>
                <Row justify='start'>
                    {getFields()}
                    <Col span='6' className='pv0h8'>
                        <Form.Item>
                            <Button type='primary' htmlType='submit'>
                                {mes.commonBtnSearch}
                            </Button>
                            <Button htmlType='button' onClick={onReset} style={{ margin: '0 8px' }}>
                                {mes.commonBtnReset}
                            </Button>
                            {columns.length > 6 && (
                                <a
                                    style={{ fontSize: 12 }}
                                    onClick={() => {
                                        setExpand(!expand);
                                    }}>
                                    {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                                </a>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default connect((state: any) => ({
    message: state.langSwitch.message,
}))(SearchList);
