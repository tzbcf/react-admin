/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-09-27 16:36:05
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import {lazy} from 'react';
import { RouterConfig } from '../../types';

const customerAndDeviceRouterConfig: RouterConfig[] = [
    {
        key: 'Customer&Device',
        title: 'menuTitleCustomerAndDevice',
        icon: 'ClusterOutlined',
        subs: [
            {
                key: 'DCU Management',
                title: 'menuTitleDcuManagement',
                route: '/home/customerAndDevice/dcuManagement',
                component: lazy(() => import('src/pages/customerAndDevice/dcuManagement')),
            },
            {
                key: 'Meter Management',
                title: 'menuTitleMeterManagement',
                route: '/home/customerAndDevice/meterManagement',
                component: lazy(() => import('src/pages/customerAndDevice/meterManagement')),
            },
            {
                key: 'Customer Management',
                title: 'menuTitleCustomerManagement',
                route: '/home/customerAndDevice/customerManagement',
                component: lazy(() => import('src/pages/customerAndDevice/customerManagement')),
            },

            {
                key: 'MeasurePoint Management',
                title: 'menuTitleMeasurePointManagement',
                route: '/home/customerAndDevice/measurePointManagement',
                component: lazy(() => import('src/pages/customerAndDevice/measurePointMgnt')),
            },
        ],
    },
];

export default customerAndDeviceRouterConfig;
