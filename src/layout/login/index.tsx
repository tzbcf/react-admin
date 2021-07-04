/**
 * 登陆页面
 */
import React from 'react';
import { Layout, Row, Col, Form, Button, Checkbox, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import indexStyle from './index.module.less';
import Lang from 'src/components/common/language';
import FooterDom from 'src/components/footer';
import LOGO from 'src/assets/imgs/common/logo_login.png';
const { Header, Footer, Content } = Layout;
import { LangMessage } from 'src/store/common/language';
import user from 'src/api/user';

type Props = {
  Mes: LangMessage;
};

const Login: React.FC<Props> = props => {
  const { Mes } = props;
  // const history = useHistory();
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const res = await user.login(values);
    console.log('------', res);
    // history.push('/home/mdrHomePage');
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
        <Row justify='center' style={{ marginBottom: '40px' }}>
          <Col className='f34 colorBlack fontWightBold'>
            {Mes['platformName']}
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
              name='userName'
              rules={[{ required: true, message: Mes['ruleMessageUser'] }]}
            >
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder={Mes['userName']}
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{ required: true, message: Mes['ruleMessagePass'] }]}
            >
              <Input
                prefix={<LockOutlined className='site-form-item-icon' />}
                type='password'
                placeholder={Mes['password']}
              />
            </Form.Item>
            <Form.Item>
              <Row justify='space-between'>
                <Col>
                  <Form.Item name='remember' valuePropName='checked' noStyle>
                    <Checkbox>{Mes['rememberText']}</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <a className='login-form-forgot' href=''>
                    {Mes['forgotPassText']}
                  </a>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className={indexStyle.loginFormButton}
              >
                {Mes['loginBtnName']}
              </Button>
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

export default connect((state: any) => {
  return {
    Mes: state.langSwitch.message,
  };
})(Login);
