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

const amiFunctionRouterConfig: RouterConfig[] = [
    {
        key: 'amiFunction',
        title: 'menuTitleAmiFunction',
        icon: 'HomeOutlined',
        subs: [
            {
                key: 'abnormalManagement',
                title: 'menuTitleAbnormalManagement',
                icon: 'HomeOutlined',
                route: '/home/amiFunction/abnormalManagement',
                component: lazy(() => import('src/pages/amiFunction/abnormalManagement'))
            },
            {
                key: 'connectAndDisconnect',
                title: 'menuTitleConnectAndDisconnect',
                icon: 'HomeOutlined',
                route: '/home/amiFunction/connectAndDisconnect',
                component: lazy(() => import('src/pages/amiFunction/connectAndDisconnect'))
          },
          {
            key: 'dcuMonitoring',
            title: 'menuTitleDcuMonitoring',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/dcuMonitoring',
            component: lazy(() => import('src/pages/amiFunction/dcuMonitoring'))
          },
          {
            key: 'firmwareUpgrade',
            title: 'menuTitleFirmwareUpgrade',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/firmwareUpgrade',
            component: lazy(() => import('src/pages/amiFunction/firmwareUpgrade'))
          },
          {
            key: 'meterParam',
            title: 'menuTitleMeterParam',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/meterParam',
            component: lazy(() => import('src/pages/amiFunction/meterParam'))
          },
          {
            key: 'meterReadingSuccessRate',
            title: 'menuTitleMeterReadingSuccessRate',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/meterReadingSuccessRate',
            component: lazy(() => import('src/pages/amiFunction/meterReadingSuccessRate'))
          },
          {
            key: 'networkManagement',
            title: 'menuTitleNetworkManagement',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/networkManagement',
            component: lazy(() => import('src/pages/amiFunction/networkManagement'))
          },
          {
            key: 'onDemandReading',
            title: 'menuTitleOnDemandReading',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/onDemandReading',
            component: lazy(() => import('src/pages/amiFunction/onDemandReading'))
          },
          {
            key: 'taskManagement',
            title: 'menuTitleTaskManagement',
            icon: 'HomeOutlined',
            route: '/home/amiFunction/taskManagement',
            component: lazy(() => import('src/pages/amiFunction/taskManagement'))
          }
        ]
    },
]

export default amiFunctionRouterConfig;
