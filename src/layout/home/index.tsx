import React from 'react';
import Routers from 'src/router/router';
// import MenuConfig from '../../router/menuRouter';
import Menu from 'src/components/menu';
import HeaderDom from 'src/components/header';
import FooterDom from 'src/components/footer';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const Main: React.FC = () => {
  return (
    <Layout>
      <Menu />
      <Layout>
        <Header>
          <HeaderDom />
        </Header>
        <Content>
          <Routers />
        </Content>
        <Footer>
          <FooterDom />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
