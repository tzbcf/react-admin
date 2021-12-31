/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-08-09 11:36:53
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { lazy } from 'react';
import { RouterConfig } from '../../types';

const homePageRouterConfig: RouterConfig[] = [
    {
        key: 'mdrHomePage',
        title: 'menuTitleMdrMain',
        route: '/home/mdrHomePage',
        icon: 'HomeOutlined',
        component: lazy(() => import('src/pages/homePage/mdrHomePage')),
    },
    {
        key: 'pvmsHomePage',
        title: 'menuTitlePvmsMain',
        route: '/home/pvmsHomePage',
        icon: 'HomeOutlined',
        component: lazy(() => import('src/pages/homePage/pvmsHomePage')),
    },
];

export default homePageRouterConfig;
