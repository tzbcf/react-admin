import React, { useState } from 'react';
import MenuConfig, { RouterConfig } from '../../../router/menuRouter';
// import {RouterConfig } from '../../../router/router';
import { Menu, Button, Layout } from 'antd';
import  Icons  from '../../../components/common/icon';
const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuDom = (menuList: RouterConfig[]) => {
  return (<>
    {
      menuList.map((v: RouterConfig) => {
        console.log('1-----', v)
        if (!v.isNoSub && v.subs && v.subs.length) {
          return <SubMenu key={v.key} title={v.title} icon={React.createElement(Icons[v.icon])}>{ MenuDom (v.subs)}</SubMenu>
        }
        return <Menu.Item key={v.key} icon={React.createElement(Icons[v.icon])} >{ v.title}</Menu.Item>
      })
    }
  </>)
}

const MenuTabs = (props: { menu: any }) => {
  const [collapsed, setcollapsed] = useState(false);
  console.log('a-----', props);
  const toggleCollapsed = () => {
    setcollapsed(!collapsed);
  };
  return (
    <Sider
      style={{ width: collapsed ? '200px' : '80px' }}
      collapsed={collapsed}
    >
      <Button type='primary' onClick={toggleCollapsed}>
        测试
      </Button>
      <Menu
        mode='inline'
        inlineCollapsed={collapsed}
      >
        {
        MenuDom(MenuConfig.menus)
      }
      </Menu>
    </Sider>
  );
};

export default MenuTabs;
