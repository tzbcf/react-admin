/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:47:04
 * Description :
 * -----
 * Last Modified: 2021-07-03 19:47:59
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import { RouterConfig } from 'src/router/types';
import {lazy} from 'react';

const opreateRoleRouterConfig: RouterConfig[] = [
    {
        key: 'opreatorMgnt',
        title: 'opreatorMgnt',
        icon: 'TeamOutlined',
        subs: [
            {
                key: 'roleManage_list',
                route: '/home/roleManage/list',
                title: 'roleListTitle',
                icon: 'OrderedListOutlined',
                component: lazy(() => import('src/pages/opreatorMgnt/roleManage/roleList')),
            },
            {
                key: 'roleManage_add',
                route: '/home/roleManage/add',
                title: 'roleAddTitle',
                icon: 'UserAddOutlined',
                isNoSub: true,
                component: lazy(() => import('src/pages/opreatorMgnt/roleManage/roleAdd')),
            },
            {
                key: 'userManage_list',
                route: '/home/userManage/list',
                title: 'userListTitle',
                icon: 'OrderedListOutlined',
                component: lazy(() => import('src/pages/opreatorMgnt/userMange/userList')),
            },
        ],
    },
];

export default opreateRoleRouterConfig;
