/**
 * 业务上层布局组件
 */
import React from 'react';
import Routers from 'src/router/router';
import Menu from 'src/components/menu';
import { connect } from 'react-redux';
import HeaderDom from 'src/components/header';
import MenuTabs from 'src/components/menu/menuTabs';
import News from 'src/components/header/news';
import { Layout } from 'antd';
import indexStyle from './index.module.less';

const { Header, Content } = Layout;

type Props = {
  newsShow: boolean
}

const Main: React.FC<Props> = (props) => {
  const { newsShow } = props; 
  return (
    <Layout>
      <Header className={indexStyle.header}>
        <HeaderDom />
      </Header>
      <Layout>
        <Menu />
        <Layout className='positionRelative'>
          <div className={indexStyle.layoutContent}>
            <MenuTabs />
            <Content className={`${indexStyle.routerContent} p20`}>
              <Routers />
            </Content>
          </div>
          {
            newsShow && <News />
          }
        </Layout>
      </Layout>
    </Layout>
  );
};

export default connect((state: any) => {
  return {
    newsShow: state.toggleNews.newsShow
  }
})(Main);
