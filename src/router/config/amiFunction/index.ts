/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-26 15:25:41
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { lazy } from 'react';
import { RouterConfig } from '../../types';

const amiFunctionRouterConfig: RouterConfig[] = [
    {
        key: 'AMI Function',
        title: 'menuTitleAmiFunction',
        icon: 'AuditOutlined',
        subs: [
            {
                key: 'Connect and Disconnect',
                title: 'menuTitleConnectAndDisconnect',
                route: '/home/amiFunction/connectAndDisconnect',
                component: lazy(() => import('src/pages/amiFunction/connectAndDisconnect')),
            },
            {
                key: 'Task Management',
                title: 'menuTitleTaskManagement',
                route: '/home/amiFunction/taskManagement',
                component: lazy(() => import('src/pages/amiFunction/taskManagement')),
            },
            {
                key: 'Firmware Upgrade',
                title: 'menuTitleFirmwareUpgrade',
                route: '/home/amiFunction/firmwareUpgrade',
                component: lazy(() => import('src/pages/amiFunction/firmwareUpgrade')),
            },
            {
                key: 'Device Monitoring',
                title: 'menuTitleDeviceMonitoring',
                route: '/home/amiFunction/deviceMonitoring',
                component: lazy(() => import('src/pages/amiFunction/deviceMonitoring')),
            },
            {
                key: 'Network Management',
                title: 'menuTitleNetworkManagement',
                route: '/home/amiFunction/networkManagement',
                component: lazy(() => import('src/pages/amiFunction/networkManagement')),
            },
            {
                key: 'On-Demand Reading',
                title: 'menuTitleOnDemandReading',
                route: '/home/amiFunction/onDemandReading',
                component: lazy(() => import('src/pages/amiFunction/onDemandReading')),
            },
            {
                key: 'Abnormal Management',
                title: 'menuTitleAbnormalManagement',
                route: '/home/amiFunction/abnormalManagement',
                component: lazy(() => import('src/pages/amiFunction/abnormalManagement')),
            },
            {
                key: 'Reading Success Rate',
                title: 'menuTitleMeterReadingSuccessRate',
                route: '/home/amiFunction/meterReadingSuccessRate',
                component: lazy(() => import('src/pages/amiFunction/meterReadingSuccessRate')),
            },
            {
                key: 'Meter Param',
                title: 'menuTitleMeterParam',
                route: '/home/amiFunction/meterParam',
                component: lazy(() => import('src/pages/amiFunction/meterParam')),
            },
        ],
    },
];

export default amiFunctionRouterConfig;
