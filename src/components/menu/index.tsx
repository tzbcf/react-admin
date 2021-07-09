/**
 * 侧边导航栏组件
 */
import React, {useState, Key} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routerConfig from 'src/router/menuRouter';
import { RouterConfig } from 'src/router/types';
import { INITSTATE } from 'src/store/common/collapsed';
import { Menu, Layout } from 'antd';
import Icons from 'src/components/common/icon';
import { LangMessage } from 'src/store/common/language';
import { MENUTABS_ADD } from 'src/store/common/menuTabs';

const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuDom = (menuList: RouterConfig[], msg: LangMessage, addTabs: Function ) => {
  return (<>
    {
      menuList.map((v: RouterConfig) => {
        if (v.subs && v.subs.length) {
          return <SubMenu key={v.key} title={msg[v.title]} icon={React.createElement(Icons[v.icon])}>{
            MenuDom(v.subs, msg, addTabs)
          }</SubMenu>
        }
        if (!v.isNoSub) {
          return <Menu.Item key={v.key} icon={React.createElement(Icons[v.icon])} >
            <Link to={v.route} onClick={() => {addTabs(v)}}>{msg[v.title]}</Link>
          </Menu.Item>
        }
      })
    }
  </>)
}

interface Props extends INITSTATE {
  message: LangMessage,
  dispatch: any
}

const MenuNav: React.FC<Props> = (props) => {
  const { collapsed, message: msg, dispatch } = props;

  let menus:RouterConfig[] = [];
  Object.keys(routerConfig).map((key: string) => {
    menus = menus.concat(routerConfig[key]);
  });

  const rootSubmenuKeys = menus.map((v: RouterConfig) => v.key);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const onOpenChange = (keys: Key[]) => {
    const menuKeys: string[] = [];
    keys.forEach((v: Key) => typeof v === 'string' && menuKeys.push(v));
    const latestOpenKey: string = menuKeys.find((key: string) =>  openKeys.indexOf(key) === -1) || '';
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(menuKeys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const addTabs = (v: RouterConfig) => {
    dispatch({
      type: MENUTABS_ADD,
      value: {
        key: v.key,
        title: v.title,
        route: v.route
      }
    })
  }

  return (
    <Sider
      style={{ width: props.collapsed ? '200px' : '80px', overflowY: 'auto' }}
      collapsed={collapsed}
    >
      <Menu
        mode='inline'
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {
          MenuDom(menus, msg, addTabs)
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
})(MenuNav);
