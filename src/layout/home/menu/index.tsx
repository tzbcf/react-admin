import React from 'react';
import { connect } from 'react-redux'
import MenuConfig, { RouterConfig } from '../../../router/menuRouter';
// import {RouterConfig } from '../../../router/router';
import { Menu, Layout } from 'antd';
import Icons from '../../../components/common/icon';
import { COLLAPSED_TOGGLE } from '../../../store/common/collapsed';
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

const MenuTabs = (props: any) => {
  console.log('-------MenuTabs', props)
  setTimeout(() => {
  console.log('-------MenuTabsssss', props.dispatch({type: COLLAPSED_TOGGLE, value:true}))
  }, 3000)

  // const [collapsed, setcollapsed] = useState(false);
  // const toggleCollapsed = () => {
  //   setcollapsed(!collapsed);
  // };
  return (
    <Sider
      style={{ width: props.collapsed ? '200px' : '80px' }}
      collapsed={props.collapsed}
    >
      <Menu
        mode='inline'
        inlineCollapsed={props.collapsed}
      >
        {
        MenuDom(MenuConfig.menus)
      }
      </Menu>
    </Sider>
  );
};

export default connect((state: any) => {
  console.log('----connect-',state )
  return {
    collapsed: state.toggleCollapsed.collapsed
  }
})(MenuTabs);
