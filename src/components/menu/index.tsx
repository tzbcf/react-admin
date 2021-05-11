import React from 'react';
import { connect } from 'react-redux';
import MenuConfig, { RouterConfig } from 'src/router/menuRouter';
// import {RouterConfig } from '../../../router/router';
import { Menu, Layout } from 'antd';
import Icons from 'src/components/common/icon';
import { LangMessage } from 'src/store/common/language';

const { Sider } = Layout;
const { SubMenu } = Menu;
// type MenuDomProps = {
//   menuList: RouterConfig[],
//   // m: LangMessage
// }
const MenuDom = (menuList: RouterConfig[], m: LangMessage ) => {
  // const { menuList } = props;
  return (<>
    {
      menuList.map((v: RouterConfig) => {
        if (!v.isNoSub && v.subs && v.subs.length) {
          return <SubMenu key={v.key} title={m[v.title]} icon={React.createElement(Icons[v.icon])}>{
            // <MenuDom menuList={v.subs} />
            MenuDom(v.subs, m)
          }</SubMenu>
        }
        return <Menu.Item key={v.key} icon={React.createElement(Icons[v.icon])} >{m[v.title]}</Menu.Item>
      })
    }
  </>)
}

type Props = {
  collapsed: boolean,
  message: LangMessage
}

const MenuTabs: React.FC<Props> = (props) => {
  const { collapsed, message : m } = props;
  return (
    <Sider
      style={{ width: props.collapsed ? '200px' : '80px' }}
      collapsed={collapsed}
    >
      <Menu
        mode='inline'
      >
        {
          // <MenuDom menuList={MenuConfig.menus} />
          MenuDom(MenuConfig.menus, m)
        }
      </Menu>
    </Sider>
  );
};

export default connect((state: any) => {
  return {
    collapsed: state.toggleCollapsed.collapsed,
    message: state.langSwitch.message
  }
})(MenuTabs);
