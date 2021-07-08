/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-07-06 09:26:33
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


 import {lazy} from 'react';
 import { RouterConfig } from '../../types';

const customerAndDeviceRouterConfig: RouterConfig[] = [
    {
        key: 'customerAndDevice',
        title: 'menuTitleCustomerAndDevice',
        icon: 'HomeOutlined',
        subs: [
            {
                key: 'dcuManagement',
                title: 'menuTitleDcuManagement',
                icon: 'HomeOutlined',
                route: '/home/customerAndDevice/dcuManagement',
                component: lazy(() => import('src/pages/customerAndDevice/dcuManagement'))
            },
            {
                key: 'meterManagement',
                title: 'menuTitleMeterManagement',
                icon: 'HomeOutlined',
                route: '/home/customerAndDevice/meterManagement',
                component: lazy(() => import('src/pages/customerAndDevice/meterManagement'))
            },
            {
                key: 'customerManagement',
                title: 'menuTitleCustomerManagement',
                icon: 'HomeOutlined',
                route: '/home/customerAndDevice/customerManagement',
                component: lazy(() => import('src/pages/customerAndDevice/customerManagement'))
            },

            {
                key: 'measurePointManagement',
                title: 'menuTitleMeasurePointManagement',
                icon: 'HomeOutlined',
                route: '/home/customerAndDevice/measurePointManagement',
                component: lazy(() => import('src/pages/customerAndDevice/measurePointManagement'))
            },
        ]
    },
]

export default customerAndDeviceRouterConfig;
