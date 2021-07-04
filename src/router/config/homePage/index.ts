/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description : 
 * -----
 * Last Modified: 2021-07-03 19:49:54
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


 import {lazy} from 'react';
 import { RouterConfig } from '../../types';
 
const homePageRouterConfig: RouterConfig[] = [
    {
        key: 'mdrHomePge',
        title: 'mainTitle',
        icon: 'HomeOutlined',
        route: '/home/mdrHomePage',
        component: lazy(() => import('src/pages/homePage/mdrHomePage'))
    },
    {
        key: 'pvmsHomePge',
        title: 'mainTitle',
        icon: 'HomeOutlined',
        route: '/home/pvmsHomePage',
        component: lazy(() => import('src/pages/homePage/pvmsHomePage'))
    }
]

export default homePageRouterConfig;
