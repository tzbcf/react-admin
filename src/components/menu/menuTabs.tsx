/*
 * FileName : menuTabs.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-06 11:32:09
 * Description :
 * -----
 * Last Modified: 2021-10-13 18:23:35
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { MenuObject, MENUTABS_DELETE, MENUTABS_DELETE_OTHERS, MENUTABS_DELETE_ALL } from 'src/store/common/menuTabs';
import { useHistory } from 'react-router-dom';
import { useCacheDispatch } from 'react-keepalive-router';
import { Tag, Dropdown, Menu } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import './index.less';

type Props = {
    mes: LangMessage;
    menuTabList: MenuObject[];
    dispatch: any;
};

const getRouterIndex = (tabList:MenuObject[], currentRouter:MenuObject): number => {
    let routeIndex:number = 0;

    tabList.forEach((v, i) => {
        if (v.key === currentRouter.key) {
            routeIndex = i;
        }
    });
    return routeIndex;
};

const MenuTabs = (props: Props) => {
    const { menuTabList, mes, dispatch } = props;
    const cacheDispatch = useCacheDispatch();
    const [ currentRouter, setCurrentRouter ] = useFetchState<MenuObject | object>({});
    const history = useHistory();

    const routeLink = (v: MenuObject) => {
        history.push(v.route);
    };

    const closeTabs = (v: MenuObject) => {
        const routerIndex = getRouterIndex(menuTabList, v);

        dispatch({
            type: MENUTABS_DELETE,
            value: v,
        });
        routeLink(menuTabList[routerIndex - 1]);
        cacheDispatch({ type: 'reset', payload: [ v.key ]});
    };


    const mouseTabs = (v: MenuObject) => {
        setCurrentRouter(v);
    };

    // 关闭当前标签，回到上一层标签
    const menuClose = () => {
        if ('key' in currentRouter) {
            const routerIndex = getRouterIndex(menuTabList, currentRouter);

            dispatch({
                type: MENUTABS_DELETE,
                value: currentRouter,
            });
            routeLink(menuTabList[routerIndex - 1]);
            cacheDispatch({ type: 'reset', payload: [ currentRouter.key ]});
        }
    };

    const menuCloseOthers = () => {
        if ('key' in currentRouter) {
            const tablist: string[] = menuTabList.map((v) => {
                if (v.key !== currentRouter.key) {
                    return v.key;
                }
            }).filter((v) => v) as string[];

            cacheDispatch({ type: 'reset', payload: tablist});
            dispatch({
                type: MENUTABS_DELETE_OTHERS,
                value: currentRouter,
            });
        }
    };

    const menuCloseAll = () => {
        const homeRoute = menuTabList.find((v) => v.key.includes('HomePage')) as MenuObject;

        dispatch({
            type: MENUTABS_DELETE_ALL,
            value: currentRouter,
        });
        routeLink(homeRoute);
        cacheDispatch({ type: 'reset'});
    };

    const menu = (
        <Menu>
            <Menu.Item key='1' onClick={menuClose}>Close</Menu.Item>
            <Menu.Item key='2' onClick={menuCloseOthers}>Close Others</Menu.Item>
            <Menu.Item key='3' onClick={menuCloseAll}>Close All</Menu.Item>
        </Menu>
    );

    return (
        <div id='menuTabs'>
            <ul className='content'>
                {menuTabList.map((v: MenuObject) =>
                    <li
                        key={v.key}
                        className='menuBg'
                        onMouseEnter={() => mouseTabs(v)}
                    >
                        <Dropdown
                            overlay={menu}
                            trigger={[ 'contextMenu' ]}>
                            <Tag
                                closable={ !v.key.includes('HomePage') }
                                onClose={() => closeTabs(v)}
                                onClick={() => {
                                    routeLink(v);
                                }}>
                                {mes[v.title]}
                            </Tag>
                        </Dropdown>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default connect((state: any) => ({
    mes: state.langSwitch.message,
    menuTabList: state.menuTabsDispose.menuTabs,
}))(MenuTabs);
