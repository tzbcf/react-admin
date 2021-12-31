/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-08-06 14:27:36
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import {lazy} from 'react';
import { RouterConfig } from '../../types';

const basicDataRouterConfig: RouterConfig[] = [
    {
        key: 'Basic Data',
        title: 'menuTitleBasicData',
        icon: 'AppstoreAddOutlined',
        subs: [
            {
                key: 'Organizational Structure',
                title: 'menuTitleOrganizationalStructure',
                route: '/home/basicData/organizationalStructure',
                component: lazy(() => import('src/pages/basicData/organizationalStructure/index')),
            },
            {
                key: 'Feeder Management',
                title: 'menuTitleFeederManagement',
                route: '/home/basicData/feederManagement',
                component: lazy(() => import('src/pages/basicData/feederManagement')),
            },
            {
                key: 'Transformer Management',
                title: 'menuTitleTransformerManagement',
                route: '/home/basicData/transformerManagement',
                component: lazy(() => import('src/pages/basicData/transformerManagement')),
            },
            {
                key: 'Meter in Warehouse',
                title: 'menuTitleMeterInWareHouse',
                route: '/home/basicData/meterInWareHouse',
                component: lazy(() => import('src/pages/basicData/meterInWareHouse')),
            },
            {
                key: 'DCU in Warehouse',
                title: 'menuTitleDcuInWareHouse',
                route: '/home/basicData/dcuInWareHouse',
                component: lazy(() => import('src/pages/basicData/dcuInWareHouse')),
            },
            // {
            //     key: 'Excel File Import',
            //     title: 'menuTitleExcelFileImport',
            //     route: '/home/basicData/excelFileImport',
            //     component: lazy(() => import('src/pages/basicData/excelFileImport')),
            // },
            {
                key: 'Data Definition',
                title: 'menuTitleDataDefinition',
                route: '/home/basicData/dataDefinition',
                component: lazy(() => import('src/pages/basicData/dataDefinition')),
            },
            {
                key: 'Command Scheme',
                title: 'menuTitleCommandScheme',
                route: '/home/basicData/commandScheme',
                component: lazy(() => import('src/pages/basicData/commandScheme')),
            },
        ],
    },
];

export default basicDataRouterConfig;
