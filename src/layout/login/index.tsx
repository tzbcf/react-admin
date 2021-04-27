import React from 'react';
import { Layout, Row, Col, Form, Button, Checkbox, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import indexStyle from './index.module.less';
import Lang from 'src/components/common/language';
import FooterDom from 'src/components/footer';
import LOGO from 'src/assets/common/logo_login.png';
const { Header, Footer, Content } = Layout;


const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <Layout className={indexStyle.antLayout}>
      <Header className={indexStyle.antLayoutHeader}>
        <Lang />
      </Header>
      <Content>
        <Row justify='center'>
          <Col>
            <img src={LOGO} alt='LOGO' />
          </Col>
        </Row>
        <Row justify='center' style={{marginBottom:'40px'}}>
          <Col className='f34 colorBlack fontWightBold'>
            Overseas Integration Platform
          </Col>
        </Row>
        <Row justify='center'>
          <Form
            name='normal_login'
            className={indexStyle.loginForm}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name='username'
              rules={[
                { required: true, message: 'Please input your Username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Username'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder='Password'
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className='login-form-forgot' href=''>
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className={indexStyle.loginFormButton}
              >
                Log in
              </Button>
              Or <a href=''>register now!</a>
            </Form.Item>
          </Form>
        </Row>
      </Content>
      <Footer className={indexStyle.antLangoutFooter}>
        <FooterDom />
      </Footer>
    </Layout>
  );
};

export default Login;
