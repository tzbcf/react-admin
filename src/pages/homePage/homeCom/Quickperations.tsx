/*
 * FileName : Quickperations.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-19 15:43:42
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { message } from 'antd';
import { Link } from 'react-router-dom';
import { homePage } from 'src/api';
import routerConfig from 'src/router/menuRouter';
import { RouterConfig } from 'src/router/types';
import { QuickMenuIcon } from 'src/components/common/icon/customIcon';
import useFetchState from 'src/utils/useFetchState';
import '../index.less';

type QuickRoutes = {
  key: string;
  title: string;
  route: string;
}

type QuickMenu = {
    MODULE_NAME: string;
    MODULE_NO: string;
    URL_LINK: string;
    menuKey: string;
}

const QuickMenuFormat = (localMenu: RouterConfig[], quickMenu: QuickMenu[], routeList: QuickRoutes[]): void => localMenu.forEach((v: RouterConfig) => {
    if (v.subs && v.subs.length) {
        QuickMenuFormat(v.subs, quickMenu, routeList);
    } else {
        const item = quickMenu.find((o: QuickMenu) => o.menuKey === v.key);

        if (item) {
            routeList.push({
                key: v.key,
                title: item.MODULE_NAME,
                route: v.route || '',
            }) ;
        }
    }
});

const QuickOperations = () => {
    const [ routerList, setRouterList ] = useFetchState<QuickRoutes[]>([]);
    let menus: RouterConfig[] = [];

    Object.keys(routerConfig).map((key: string) => {
        menus = menus.concat(routerConfig[key]);
    });
    const getQuickMenu = async () => {
        try {
            const res = await homePage.getQuickMenus();
            let routeList: QuickRoutes[] = [];

            QuickMenuFormat(menus, res, routeList);

            setRouterList(routeList);
        } catch (error: any) {
            message.error(error?.toString());
        }
    };

    useEffect(() => {
        getQuickMenu();
    }, []);

    return (
        <div className='QuickOperations'>
            <h5>
                <div>
                    <QuickMenuIcon style={{marginRight: '3px'}} />
                    Quick Operations
                </div>
            </h5>
            <ul>
                {
                    routerList.length ? routerList.map((v: QuickRoutes, i: number) => {
                        if (i < 6) {
                            return <li key={v.key}>
                                <Link to={v.route}> {v.title} </Link>
                            </li>;
                        }
                    }) : null
                }
            </ul>
        </div>
    );
};

export default QuickOperations;
