/**
 * 业务上层布局组件
 */
import React from 'react';
import Routers from 'src/router/router';
import Menu from 'src/components/menu';
import HeaderDom from 'src/components/header';
import FooterDom from 'src/components/footer';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const Main: React.FC = () => {
  return (
    <Layout>
      <Header>
        <HeaderDom />
      </Header>
      <Layout>
        <Menu />
        <Layout>
          <Content className='p20'>
            <Routers />
          </Content>
          <Footer>
            <FooterDom />
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
