/*
 * FileName : pingDialog.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-07 18:18:31
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
// import { abnormalFn } from 'src/utils/function';
import { Form, Row, Col, Input, Button, Select } from 'antd';
// import useFetchState from 'src/utils/useFetchState';
// import { amiFunc } from 'src/api';
const { Option } = Select;

export type NodeVal = {
    no: string;
    nodeType: number;
    id: string;
}

export interface WsNodeVal extends NodeVal {
    groupId: string;
    count: string;
    size: string;
}

export type callbackFn = () => void;

export type PingForm = {
    pingSize: string;
    pingCount: string;
}

export type SendFn = (row: PingForm, value:NodeVal)=> void;


type Props = {
    Mes: LangMessage;
    subSysNo: string;
    callback: callbackFn;
    sendFn: SendFn;
    value: NodeVal;
};

const PingDialog: React.FC<Props> = (props) => {
    const { Mes, callback, sendFn, value } = props;

    // const [ count, setCount ] = useFetchState<number|string>('');
    const [ form ] = Form.useForm();
    const onFinish = async (row: PingForm) => {
        console.log('a----', row);
        await sendFn(row, value);
        callback();
    };

    const handleClose = () => {
        callback();
    };

    const handleChangeCount = (values: any) => {
        const val = values?.target?.value;

        if (!val.length) {
            return form.setFieldsValue({
                pingCount: '',
            });
        }
        const allReg = /^[1-9]{1}/;

        if (!allReg.test(val)) {
            return form.setFieldsValue({
                pingCount: '',
            });
        }
        const reg = /^[0-9]$/;
        let count = '';

        for (const item of val) {
            console.log(item);
            if (reg.test(item)) {
                count += item;
            }
        }
        return form.setFieldsValue({
            pingCount: count,
        });
    };

    return (
        <Form
            name='pingInfo'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            form={form}
            className='pingDialog'
            initialValues={{
                pingSize: '32',
                pingCount: '3',
            }}>
            <Row className='pingDialog' gutter={24}>
                <Col span={24}>
                    <Form.Item label={Mes['labelTitlePingCount']} name='pingCount'>
                        <Input maxLength={4} onChange={handleChangeCount} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label={Mes['labelTitlePingSize']} name='pingSize'>
                        <Select style={{ width: '100%' }}>
                            <Option value='32'>32</Option>
                            <Option value='1024'>1024</Option>
                            <Option value='1550'>1550</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item wrapperCol={{ offset: 16, span: 8 }} className='mb0'>
                                <Button type='primary' htmlType='submit' size='middle'>
                                    {Mes['messageSuccessConfirmconfirm']}
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className='mb0'>
                                <Button type='primary' htmlType='button' size='middle' onClick={handleClose}>
                                    {Mes['titleLabelCloseclose']}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(PingDialog);
