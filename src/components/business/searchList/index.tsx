// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Col, Row } from 'antd';
import type { Callbacks, Store } from 'rc-field-form/lib/interface';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import initFormConfig, { formOpt } from 'src/utils/initDynamicForm';
import useFetchState from 'src/utils/useFetchState';
import './index.less';

export type SRef = {
    getFormData (): Promise<any>;
    setFieldsValue (val: Object): void;
    resetFields (): void;
}

type BtnFormConfig = {
    col?: number;
    btnList?: BtnConfig[];
}

type Props = {
    columns: formOpt[];
    onFinish: Callbacks<any>['onFinish'];
    resetFn?: () => void|Promise<void>;
    initialValues?: Store;
    btnConfig?: BtnFormConfig;
    isI18n?: boolean; // 是否国际化
    cRef?: React.MutableRefObject<SRef | undefined>;
    isReset?: boolean;
    isSearch?: boolean;
};

const SearchList = (props: Props) => {
    const { cRef, columns = [], onFinish, initialValues, btnConfig, isI18n = true, isReset = true, isSearch = true, resetFn } = props;
    const Mes = useSelector((state: any) => state.langSwitch.message);
    const [ form ] = Form.useForm();
    const [ initVal, setInitVal ] = useFetchState<Object>({});
    const onReset = async () => {
        form.resetFields();
        if (Object.keys(initVal).length) {
            form.setFieldsValue(initVal);
        }
        if (typeof resetFn === 'function') {
            resetFn();
        }

    };

    const submit = (vals:any) => {

        onFinish && onFinish(vals);
    };

    // 暴露给父级调用的方法
    useImperativeHandle(cRef, () => ({
        async getFormData () {
            return await form.validateFields();
        },
        setFieldsValue (val: Object) {
            setInitVal(val);
            form.setFieldsValue(val);
        },
        resetFields () {
            form.resetFields();
            if (Object.keys(initVal).length) {
                form.setFieldsValue(initVal);
            }
        },
    }));

    return (
        <div className='searchForm'>
            <Form
                form={form}
                name='search-form'
                onFinish={submit}
                initialValues={initialValues}
            >
                <Row gutter={24} justify='start' wrap={true}>
                    {
                        initFormConfig(columns, Mes, isI18n)
                    }
                    <Col span={btnConfig?.col || 6}>
                        <Form.Item>
                            <Row justify='start' wrap={true}>
                                {isSearch && (<Button
                                    type='primary'
                                    style={{ marginRight: '8px' }}
                                    icon={<SearchOutlined />} htmlType='submit' title={Mes['btnTitleSearch']} />)}
                                {isReset && (<Button type='primary' icon={<UndoOutlined />} onClick={onReset}
                                    htmlType='button' style={{ marginRight: '8px' }} title={Mes['btnResetreset']}
                                />)}
                                {
                                    btnConfig?.btnList?.length && <div>
                                        <BtnList btnList={btnConfig.btnList || []} />
                                    </div>
                                }
                            </Row>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default SearchList;
// export default connect((state: any) => ({
//     Mes: state.langSwitch.message,
// }))(SearchList);
