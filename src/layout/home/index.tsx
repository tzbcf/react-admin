import React from 'react';
import Routers from '../../router/router';
// import MenuConfig from '../../router/menuRouter';
import Menu from './menu';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const Main: React.FC = () => {
  return (
    <Layout>
      <Sider>
        <Menu />
      </Sider>
      <Layout>
        <Header>我是头部</Header>
        <Content>
          <Routers />
        </Content>
        <Footer>我是底部</Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
