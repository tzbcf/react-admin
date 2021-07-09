/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-07-06 10:14:08
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


 import {lazy} from 'react';
 import { RouterConfig } from '../../types';

const basicDataRouterConfig: RouterConfig[] = [
    {
        key: 'basicData',
        title: 'menuTitleBasicData',
        icon: 'HomeOutlined',
        subs: [
              {
                  key: 'organizationalStructure',
                  title: 'menuTitleOrganizationalStructure',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/organizationalStructure',
                  component: lazy(() => import('src/pages/basicData/organizationalStructure'))
              },
              {
                  key: 'feederManagement',
                  title: 'menuTitleFeederManagement',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/feederManagement',
                  component: lazy(() => import('src/pages/basicData/feederManagement'))
              },
              {
                  key: 'transformerManagement',
                  title: 'menuTitleTransformerManagement',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/transformerManagement',
                  component: lazy(() => import('src/pages/basicData/transformerManagement'))
              },
              {
                  key: 'meterInWareHouse',
                  title: 'menuTitleMeterInWareHouse',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/meterInWareHouse',
                  component: lazy(() => import('src/pages/basicData/meterInWareHouse'))
              },
              {
                  key: 'dcuInWareHouse',
                  title: 'menuTitleDcuInWareHouse',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/dcuInWareHouse',
                  component: lazy(() => import('src/pages/basicData/dcuInWareHouse'))
              },
              {
                  key: 'excelFileImport',
                  title: 'menuTitleExcelFileImport',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/excelFileImport',
                  component: lazy(() => import('src/pages/basicData/excelFileImport'))
              },
              {
                  key: 'dataDefinition',
                  title: 'menuTitleDataDefinition',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/dataDefinition',
                  component: lazy(() => import('src/pages/basicData/dataDefinition'))
              },
              {
                  key: 'commandScheme',
                  title: 'menuTitleCommandScheme',
                  icon: 'HomeOutlined',
                  route: '/home/basicData/commandScheme',
                  component: lazy(() => import('src/pages/basicData/commandScheme'))
              },
        ]
    },
]

export default basicDataRouterConfig;
