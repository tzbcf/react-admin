/**
 * 登陆页面
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Layout, Row, Col, Form, Button, Input, message, Modal } from 'antd';
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './index.less';
import Lang from 'src/components/common/language';
import FooterDom from 'src/components/footer';
import LOGO from 'src/assets/imgs/common/logo_login.png';
import { LangMessage } from 'src/store/common/language';
import { setUsername } from 'src/store/common/user';
import { RouterLocation } from 'src/router/types';
import { MENUTABS_DELETE_ALL, MenuObject } from 'src/store/common/menuTabs';
import {MD5} from 'crypto-js';
import { user } from 'src/api';
import UserTypes from 'src/api/user/type';
const { Footer, Content } = Layout;
const { confirm } = Modal;

import { showLoading, hideLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    locale: string;
    location: RouterLocation;
    dispatch: React.Dispatch<any>;
    menuTabs: MenuObject[];
};

type LoginForm = {
    userName: string;
    password: string;
}

type ModifyForm = {
    oldPwd: string;
    newPassword: string;
    twoNewPassword: string;
}

const Login: React.FC<Props> = (props) => {
    const { Mes, locale, location, dispatch, menuTabs } = props;
    // 判断是否是更改密码
    const type = !location.state?.username;
    const history = useHistory();

    // 重置确认弹窗
    const showConfirm = (username: string, code: number = 1005) => {
        confirm({
            title: Mes['titleLoginIsChangePassword'],
            icon: <ExclamationCircleOutlined />,
            content: code === 1005 ? Mes['textLoginRestPasswordHint'] : Mes['textLoginPasswordExpired'],
            okText: Mes['btnOkok'],
            cancelText: Mes['btnCancelcancel'],
            onOk () {
                history.push('/login', {username}); // 修改密码
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };
    // 表单提交方法
    // eslint-disable-next-line complexity
    const onFinish = async (values: LoginForm | ModifyForm) => {
        showLoading();
        try {
            if ('password' in values) { // 登陆提交
                if (!/^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(values.userName)) {
                    hideLoading();
                    return message.warn(Mes['hintRulesLoginNotLawful']);
                }
                const loginValues: UserTypes.Login = values;

                loginValues['request_locale'] = locale;

                loginValues.languageSet = locale;
                loginValues.password = values.password || MD5(values.password).toString();

                const res = await user.login(values);

                if ([ 1002, 1005 ].includes(res.code)) { // 1005密码需要重置，1002密码过期， 需要修改密码
                    showConfirm(values.userName, res.code);
                } else {
                    dispatch({
                        type: setUsername,
                        value: {
                            ip: res.ip,
                            sysType: res.sysType,
                            subName: res.subName,
                            sysUser: {
                                operatorName: res?.sysUser?.operatorName || '',
                                operatorId: res?.sysUser?.operatorId || '',
                                operatorGuid: res?.sysUser?.operatorGuid || '',
                                nodeNo: res?.sysUser?.nodeNo || '',
                                groupList: res?.sysUser?.groupList || '',
                                subSys: res?.sysUser?.subSys || '',
                                username: res?.sysUser?.operatorName || '',
                            },
                            sysRole: {
                                groupGuid: res?.sysRole?.groupGuid || '',
                                groupName: res?.sysRole?.groupName || '',
                            },
                        },
                    });
                    if (menuTabs.length > 1) {
                        dispatch({
                            type: MENUTABS_DELETE_ALL,
                            value: true,
                        });
                    }
                    history.push('/');
                }
            } else { // 提交修改密码
                if (values.newPassword !== values.twoNewPassword) {
                    hideLoading();
                    return message.warning(Mes['messageAlarmCpwdmegcpwdmeg']);
                }
                const modifyVal: any = {
                    ...values,
                    'username': location.state?.username || 'test02',
                    'password': values.newPassword || MD5(values.newPassword).toString(),
                    'oldPwd': values.oldPwd || MD5(values.oldPwd).toString(),
                };

                delete modifyVal.newPassword;
                delete modifyVal.twoNewPassword;
                const res = await user.setPassword(modifyVal);

                if (!res) {
                    message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
                    history.push('/login');
                } else {
                    message.error(res);
                }
            }
            hideLoading();
        } catch (e: any) {
            hideLoading();
            message.error(typeof e === 'string' ? e : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    const backLogin = () => {// 返回登陆
        history.push('/login');
    };

    return (
        <Layout className='loginLayout loginBg'>
            {/* 表单信息 */}
            <Content>
                <Row className='mb20'>
                    <Col offset='3'>
                        <img src={LOGO} alt='LOGO' />
                    </Col>
                </Row>
                <Row justify='center'>
                    <Col>
                        <img src='/static/images/login_03.png' className='leftBg' />
                    </Col>
                    <Col span='8' className='rightBox'>
                        <Row justify='center' className='mb24'>
                            <Col className='f20 colorBlack fontWightBold'>{Mes['titlePlatformName']}</Col>
                        </Row>
                        <Row justify='center'>
                            {
                                // 登陆
                                type ? (<Form
                                    name='normal_login'
                                    layout='vertical'
                                    className='loginForm'
                                    labelCol={{ span: 24 }}
                                    onFinish={onFinish}>
                                    <Form.Item
                                        label={Mes['titleUserName']}
                                        name='userName'
                                        className='mb18'
                                        rules={[
                                            { required: true },
                                            { min: 4 },
                                            { max: 16 },
                                            {
                                                validator: (_:any, value:any) => {
                                                    if (value.length >= 4 && value.length <= 16) {
                                                        return /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/.test(value) ? Promise.resolve() : Promise.reject(Mes['hintRulesLoginNotLawful']);
                                                    } else {
                                                        return Promise.resolve();
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Input size='middle' prefix={<UserOutlined className='site-form-item-icon' />} placeholder={Mes['titleUserName']} />
                                    </Form.Item>
                                    <Form.Item
                                        label={Mes['titlePassword']}
                                        name='password'
                                        className='mb18'
                                        rules={[ { required: true } ]}>
                                        <Input
                                            size='middle'
                                            prefix={<LockOutlined className='site-form-item-icon' />}
                                            type='password'
                                            placeholder={Mes['titlePassword']}
                                        />
                                    </Form.Item>
                                    <Form.Item className='mb18'>
                                        <Lang className='blackLang' />
                                    </Form.Item>
                                    <Form.Item className='mb0'>
                                        <Button type='primary' htmlType='submit' size='large' className='loginFormButton'>
                                            {Mes['titleLabelLoginoperateloginoperate']}
                                        </Button>
                                    </Form.Item>
                                </Form>)
                                    // 修改密码
                                    : (<Form
                                        name='changePassword'
                                        layout='horizontal'
                                        className='ChangeForm'
                                        preserve={false}
                                        labelCol={{ span: 8 }}
                                        onFinish={onFinish}>
                                        <Form.Item label={Mes['titleLabelOldPassword']} name='oldPwd' rules={[ { required: true} ]}>
                                            <Input autoComplete='new-password' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
                                        </Form.Item>
                                        <Form.Item label={Mes['titleLabelNewPassword']} name='newPassword' rules={[ { required: true } ]}>
                                            <Input autoComplete='new-password' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
                                        </Form.Item>
                                        <Form.Item label={Mes['titlelabelConfirmPassword']} name='twoNewPassword' rules={[ { required: true } ]}>
                                            <Input autoComplete='new-password' prefix={<LockOutlined className='site-form-item-icon' />} type='password' />
                                        </Form.Item>
                                        <Form.Item className='pt8' wrapperCol={{ offset: 8, span: 16 }}>
                                            <Button type='primary' htmlType='submit' className='mr10' >
                                                {Mes['btnUpdatePassword']}
                                            </Button>
                                            <Button onClick={backLogin}>
                                                {Mes['btnBackLogin']}
                                            </Button>
                                        </Form.Item>
                                    </Form>)
                            }
                        </Row>
                    </Col>
                </Row>
            </Content>
            <Footer className='antLangoutFooter'>
                <FooterDom />
            </Footer>
        </Layout>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    locale: state.langSwitch.locale,
    menuTabs: state.menuTabsDispose.menuTabs,
}))(Login);
