/**
 * 侧边导航栏组件
 */
// eslint-disable-next-line no-use-before-define
import React, { Key, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import routerConfig from 'src/router/menuRouter';
import { RouterConfig } from 'src/router/types';
import { Menu, Layout } from 'antd';
import Icons from 'src/components/common/icon';
import { LangMessage } from 'src/store/common/language';
import { MENUTABS_ADD } from 'src/store/common/menuTabs';
import { common } from 'src/api';
import { MenuTree } from 'src/api/common/type';
import useFetchState from 'src/utils/useFetchState';
import {abnormalFn} from 'src/utils/function';
import './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

const MenuDom = (menuList: RouterConfig[], mes: LangMessage, addTabs: Function) =>
    <>
        {menuList.map((v: RouterConfig) => {
            if (v.subs && v.subs.length) {
                return (
                    <SubMenu key={v.key} title={mes[v.title]} icon={v.icon && React.createElement(Icons[v.icon])}>
                        {MenuDom(v.subs, mes, addTabs)}
                    </SubMenu>
                );
            }
            if (!v.isNoSub) {
                return (
                    <Menu.Item key={v.key} icon={v.icon && React.createElement(Icons[v.icon])}>
                        <Link
                            to={v.route || ''}
                            onClick={() => {
                                addTabs(v);
                            }}>
                            {mes[v.title]}
                        </Link>
                    </Menu.Item>
                );
            }
        })}
    </>;


// 菜单权限验证
// eslint-disable-next-line no-unused-vars
const verifyMenuPermission = (localMenu: RouterConfig[], roleMenu: MenuTree[]) => localMenu.filter((v: RouterConfig) => {
    if (v.key === 'others' || v.key === 'langManage' || v.requireAuth) {return v;}
    const item = roleMenu.find((o: MenuTree) => o.menuKey === v.key);

    if (item) {
        if (v.subs && v.subs.length && item.children && item.children.length) {
            v.subs = verifyMenuPermission(v.subs, item.children);
        }
        return v;
    }
});

interface Props {
    mes: LangMessage;
    dispatch: any;
}

const MenuNav = (props: Props) => {
    const { mes, dispatch } = props;

    const [ collapsed, setCollapsed ] = useFetchState<boolean>(true);
    const [ menuRouter, setMenuRouter ] = useFetchState<RouterConfig[]>([]);
    let menus: RouterConfig[] = [];

    Object.keys(routerConfig).map((key: string) => {
        menus = menus.concat(routerConfig[key]);
    });


    const rootSubmenuKeys = menus.map((v: RouterConfig) => v.key);

    const [ openKeys, setOpenKeys ] = useFetchState<string[]>([]);

    const onOpenChange = (keys: Key[]) => {
        const menuKeys: string[] = [];

        keys.forEach((v: Key) => typeof v === 'string' && menuKeys.push(v));
        const latestOpenKey: string = menuKeys.find((key: string) => openKeys.indexOf(key) === -1) || '';

        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(menuKeys);
        } else {
            setOpenKeys(latestOpenKey ? [ latestOpenKey ] : []);
        }
    };

    const addTabs = (v: RouterConfig) => {
        dispatch({
            type: MENUTABS_ADD,
            value: {
                key: v.key,
                title: v.title,
                route: v.route,
            },
        });
    };

    const handleEnter = () => {
        setCollapsed(false);
    };

    const handleLeave = () => {
        setCollapsed(true);
    };

    const userMenu = () => {
        abnormalFn(async () => {
            const res = await common.getMenuData();

            const menuList = verifyMenuPermission(menus, res);

            setMenuRouter(menuList);
        });
    };

    useEffect(() => {
        userMenu();
    }, []);

    return (
        <Sider
            style={{ width: !collapsed ? '300px' : '80px' }}
            collapsed={collapsed}
            id='menuNav'
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className={!collapsed ? 'menuOpenStyle' : ''}
        >
            <Menu mode='inline' openKeys={openKeys} onOpenChange={onOpenChange}>
                {MenuDom(menuRouter, mes, addTabs)}
            </Menu>
        </Sider>
    );
};

export default connect((state: any) => ({
    mes: state.langSwitch.message,
}))(MenuNav);
