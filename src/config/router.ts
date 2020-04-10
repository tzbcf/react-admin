/**
 * FileName : router.ts
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-17 15:04:34
 * Description : 
 * -----
 * Last Modified: 2020-04-09 11:23:39
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */
import asyncComponent from '../components/async-component';
import Login from '../views/login';
import Page404 from '../views/404/index';
export default [
    {
        path: '/home',
        component: asyncComponent(() => import('../views/home')),
        childrens: [
            {
                path: '/home/articre',
                exact: true,
                name: '首页',
                component: asyncComponent(() => import('../components/articre'))
            },
            {
                path: '/home/details',
                exact: true,
                name: '详细',
                component: asyncComponent(() => import('../components/details'))
            }
        ]
    },
    {
        name: '登陆',
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        name: '通用',
        path: '/*',
        exact: true,
        component: Page404
    },
]