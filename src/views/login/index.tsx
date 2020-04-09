/*
 * FileName : login.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-04-01 17:19:34
 * Description : 
 * -----
 * Last Modified: 2020-04-09 11:15:58
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */


import React from 'react';
import './index.less';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { ADDUSERINFO} from '../../store/user';

export default class Login extends React.Component<any, {}> {
  constructor(props: any){
    super(props);
    console.log("----1-",this.props)
  }
  onFinish (values: any ) {
    console.log('Success:', values);
    store.dispatch({type: ADDUSERINFO, data: {
      user: values.username,
      password: values.password,
      }
    })
    console.log("------5", store.getState().user);
    this.props.history.push('/home/articre')
  }

  onFinishFailed (errorInfo: any ) {
    console.log('Failed:', errorInfo);
  }
  render () {
    return (
      <div className="container flex-center">
        <Form
          name="userInfo"
          initialValues={{ remember: true }}
          onFinish={this.onFinish.bind(this)}
          onFinishFailed={this.onFinishFailed}
          className="login-from"
        >
          <Form.Item>
            <h3 className="text-center">账号登陆</h3>
          </Form.Item>
          <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="www.baidu.com">忘记密码</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">登陆</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
