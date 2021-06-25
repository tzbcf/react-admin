/**
 * 侧边导航栏组件
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routerConfig from 'src/router/menuRouter';
import { RouterConfig } from 'src/router/types';
import { INITSTATE } from 'src/store/common/collapsed';
import { Menu, Layout } from 'antd';
import Icons from 'src/components/common/icon';
import { LangMessage } from 'src/store/common/language';

const { Sider } = Layout;
const { SubMenu } = Menu;
// type MenuDomProps = {
//   menuList: RouterConfig[],
//   // m: LangMessage
// }
const MenuDom = (menuList: RouterConfig[], msg: LangMessage ) => {
  // const { menuList } = props;
  return (<>
    {
      menuList.map((v: RouterConfig) => {
        if (!v.isNoSub && v.subs && v.subs.length) {
          return <SubMenu key={v.key} title={msg[v.title]} icon={React.createElement(Icons[v.icon])}>{
            // <MenuDom menuList={v.subs} />
            MenuDom(v.subs, msg)
          }</SubMenu>
        }
        return <Menu.Item key={v.key} icon={React.createElement(Icons[v.icon])} >
          <Link to={v.route}>{msg[v.title]}</Link>
        </Menu.Item>
      })
    }
  </>)
}

interface Props extends INITSTATE {
  message: LangMessage
}

const MenuTabs: React.FC<Props> = (props) => {
  const { collapsed, message: msg } = props;
  let menus:any = [];
  Object.keys(routerConfig).map((key: string) => {
    menus = menus.concat(routerConfig[key].default);
  });
  console.log('a------', menus)
  return (
    <Sider
      style={{ width: props.collapsed ? '200px' : '80px' }}
      collapsed={collapsed}
    >
      <Menu
        mode='inline'
      >
        {
          MenuDom(menus, msg)
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
