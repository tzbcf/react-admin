import React from 'react';
import { connect } from 'react-redux';
import MenuConfig, { RouterConfig } from 'src/router/menuRouter';
// import {RouterConfig } from '../../../router/router';
import { Menu, Layout } from 'antd';
import Icons from 'src/components/common/icon';
import { INITSTATE } from 'src/store/common/collapsed';
const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuDom = (menuList: RouterConfig[]) => {
  return (<>
    {
      menuList.map((v: RouterConfig) => {
        if (!v.isNoSub && v.subs && v.subs.length) {
          return <SubMenu key={v.key} title={v.title} icon={React.createElement(Icons[v.icon])}>{ MenuDom (v.subs)}</SubMenu>
        }
        return <Menu.Item key={v.key} icon={React.createElement(Icons[v.icon])} >{ v.title}</Menu.Item>
      })
    }
  </>)
}

interface Props extends INITSTATE {}

const MenuTabs: React.FC<Props> = (props) => {
  const { collapsed } = props;
  return (
    <Sider
      style={{ width: props.collapsed ? '200px' : '80px' }}
      collapsed={collapsed}
    >
      <Menu
        mode='inline'
      >
        {
        MenuDom(MenuConfig.menus)
      }
      </Menu>
    </Sider>
  );
};

export default connect((state: any) => {
  return {
    collapsed: state.toggleCollapsed.collapsed
  }
})(MenuTabs);
