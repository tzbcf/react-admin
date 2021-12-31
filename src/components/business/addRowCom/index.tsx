/*
 * FileName : addLang.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-26 15:32:13
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { Button, Modal, Form, Row, message } from 'antd';
import { LangMessage } from 'src/store/common/language';
import { FormProps } from 'antd/es/form/Form.d';
// import { randomStr } from 'src/utils/utils';
// import { connect } from 'react-redux';
import initFormConfig, { formOpt } from 'src/utils/initDynamicForm';
import useFetchState from 'src/utils/useFetchState';

export interface CRef {
    openModel(value?: any, title?:string): void; // 打开弹窗
    closeModel (): void; // 关闭弹窗
    setFieldsValue (value: any): void; // 设置值
    getFieldsValue (): Promise<any>; // 获取值，会检验表单
}

type ModelOptions = {
    title: string;
    width?: number;
    cancelText: string;
    okText: string;
    closable?: boolean;
    afterClose?: (() => void);
}

type Props<T, U> = {
    Mes: LangMessage; // 语言包
    cRef: React.MutableRefObject<CRef | undefined>; // 暴露给父级调用
    modelOpt: ModelOptions; // modal弹窗配置
    saveData (row: U): Promise<T>; // 表单保存
    validateMessages?: any; // 表单验证规则
    isI18n?: boolean; // 是否国际化
    handleConnectFunc?:()=> Promise<void>;
    formOption: { // 表单配置
        selectId?: string;
        layout?: FormProps;
        options: formOpt[];
    }
}

const layoutInit = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const AddRowCom = <T extends void = any, U extends Object = any>(props:Props<T, U>) => {
    const { cRef, saveData, Mes, modelOpt, formOption, validateMessages, isI18n = true, handleConnectFunc } = props;
    const { selectId, options, layout = layoutInit } = formOption;
    // modal弹窗
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    // 按钮loading
    const [ btnLoading, setBtnLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ form ] = Form.useForm();

    // 提交方法
    const handleOk = async () => {
        try {
            const res = await form.validateFields();

            setBtnLoading(true);
            await saveData(res).then(() => {
                setModalVisible(false);
                setBtnLoading(false);
            });
            console.log('-----s');
        } catch (error: any) {
            console.log(error);
            message.error(typeof error === 'string' ? error : Mes['messageErrorSavefailuresavefailure']);
            setBtnLoading(false);
        }
    };
    // 关闭方法
    const handleCancel = () => {
        if (!btnLoading) {
            setBtnLoading(false);
            setModalVisible(false);
        }
    };
    // 连接
    const handleConnect = async () => {
        try {
            setBtnLoading(true);
            if (typeof handleConnectFunc === 'function') {
                await handleConnectFunc();
            }
            setBtnLoading(false);
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageErrorTestconnectionfailtestconnectionfail']);
            setBtnLoading(false);
        }
    };

    // 暴露给父级调用的方法
    useImperativeHandle(cRef, () => ({
        openModel (values: any, title?:string) {
            setModalVisible(true);
            form.setFieldsValue(values);
            if (title) {
                setModalTitle(title);
            }
        },
        closeModel () {
            handleCancel();
        },
        setFieldsValue (value: any) {
            form.setFieldsValue(value);
        },
        async getFieldsValue () {
            return form.getFieldsValue();
        },
    }));

    return (
        <>
            <Modal
                visible={modalVisible}
                title={modalTitle ? modalTitle : Mes[modelOpt.title]}
                destroyOnClose
                width={modelOpt.width}
                closable={modelOpt.closable}
                onCancel={handleCancel}
                afterClose={modelOpt.afterClose}
                className='formModal'
                footer={[
                    handleConnectFunc && <Button key='connect' type='primary' loading={btnLoading} onClick={handleConnect}> {Mes['comboboxConnectionconnection']}</Button>,
                    <Button key='submit' type='primary' loading={btnLoading} onClick={handleOk}> { Mes[modelOpt.okText] }</Button>,
                    <Button key='back' loading={btnLoading} onClick={handleCancel}>{ Mes[modelOpt.cancelText] }</Button>,
                ]}
            >
                <Form
                    name='langForm'
                    {...layout}
                    form={form}
                    preserve={false}
                    validateMessages={validateMessages}
                    id={selectId}
                >
                    <Row gutter={24}>
                        {
                            // 针对配置进行解析，以及过滤无用配置
                            initFormConfig(options, Mes, isI18n)
                        }
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default AddRowCom;

// export default <T extends void = any, U extends Object = any>() => connect<any, any, Props<T, U>>((state: any) => ({
//     Mes: state.langSwitch.message,
// }))(AddRowCom);
