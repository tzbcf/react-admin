/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:47:04
 * Description :
 * -----
 * Last Modified: 2021-08-09 14:43:58
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import { RouterConfig } from 'src/router/types';
import {lazy} from 'react';

const opreateRoleRouterConfig: RouterConfig[] = [
    {
        key: 'Operator mgnt',
        title: 'menuTitleOpreatorMgnt',
        icon: 'TeamOutlined',
        subs: [
            {
                key: 'Role Management',
                route: '/home/roleManage/list',
                title: 'menuTitleRoleMgnt',
                component: lazy(() => import('src/pages/opreatorMgnt/roleManage')),
            },
            {
                key: 'Operator  Management',
                route: '/home/userManage/list',
                title: 'menuTitleOperatorMgnt',
                component: lazy(() => import('src/pages/opreatorMgnt/userMange')),
            },
        ],
    },
];

export default opreateRoleRouterConfig;
