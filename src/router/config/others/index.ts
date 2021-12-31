/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-21 10:42:12
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import {lazy} from 'react';
import { RouterConfig } from '../../types';

const othersRouterConfig: RouterConfig[] = [
    {
        key: 'others',
        title: 'menuTitleOthers',
        icon: 'AppstoreOutlined',
        subs: [
            // {
            //     key: 'otherNoAccess',
            //     title: 'menuTitleNoAccess',
            //     route: '/home/noAccess',
            //     component: lazy(() => import('src/layout/refused/noAccess')),
            // },
            // {
            //     key: 'serviceException',
            //     title: 'menuTitleServiceExcep',
            //     route: '/home/serviceException',
            //     component: lazy(() => import('src/layout/refused/serviceException')),
            // },
            {
                key: 'langManage',
                route: '/home/langManage/list',
                title: 'menuTitleLangManage',
                component: lazy(() => import('src/pages/others/langManage/index')),
            },
        ],
    },
];

export default othersRouterConfig;
