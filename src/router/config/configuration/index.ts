/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-08-06 14:16:50
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import {lazy} from 'react';
import { RouterConfig } from '../../types';

const configurationRouterConfig: RouterConfig[] = [
    {
        key: 'Configuration',
        title: 'menuTitleConfiguration',
        icon: 'SettingOutlined',
        subs: [
            {
                key: 'Config DCU Archive',
                title: 'menuTitleConfigDcuArchive',
                route: '/home/configuration/configDcuArchive',
                component: lazy(() => import('src/pages/configuration/configDcuArchive')),
            },
            {
                key: 'DCU Schedule',
                title: 'menuTitleDcuSchedule',
                route: '/home/configuration/dcuSchedule',
                component: lazy(() => import('src/pages/configuration/dcuSchedule')),
            },
            {
                key: 'Command Config',
                title: 'menuTitleCommandConfig',
                route: '/home/configuration/commandConfig',
                component: lazy(() => import('src/pages/configuration/commandConfig')),
            },
            {
                key: 'Meter Type Parameters',
                title: 'menuTitleMeterTypeParameters',
                route: '/home/configuration/meterTypeParameters',
                component: lazy(() => import('src/pages/configuration/meterTypeParameters')),
            },
            {
                key: 'NTP Config',
                title: 'menuTitleNTPConfig',
                route: '/home/configuration/NTPConfig',
                component: lazy(() => import('src/pages/configuration/NTPConfig')),
            },
            {
                key: 'Configure Load Profile',
                title: 'menuTitleConfigLoadProfile',
                route: '/home/configuration/configLoadProfile',
                component: lazy(() => import('src/pages/configuration/configLoadProfile')),
            },
            {
                key: 'Activity Calender',
                title: 'menuTitleActivityCalender',
                route: '/home/configuration/activityCalender',
                component: lazy(() => import('src/pages/configuration/activityCalender')),
            },
            {
                key: 'Line Loss Analysis',
                title: 'menuTitleLineLossAnalysis',
                route: '/home/configuration/lineLossAnalysis',
                component: lazy(() => import('src/pages/configuration/lineLossAnalysis')),
            },
            {
                key: 'Operator Online Mgnt',
                title: 'menuTitleOpreatorOnlineMgnt',
                route: '/home/configuration/opreatorOnlineMgnt',
                component: lazy(() => import('src/pages/configuration/opreatorOnlineMgnt')),
            },
            {
                key: 'System Parameters Mgnt',
                title: 'menuTitleSystemParametersMgnt',
                route: '/home/configuration/systemParametersMgnt',
                component: lazy(() => import('src/pages/configuration/systemParametersMgnt')),
            },
            {
                key: 'Alarm Info Config',
                title: 'menuTitleAlarmInfoConfig',
                route: '/home/configuration/alarmInfoConfig',
                component: lazy(() => import('src/pages/configuration/alarmInfoConfig')),
            },
            {
                key: 'Special Days',
                title: 'menuTitleSpecialDays',
                route: '/home/configuration/specialDays',
                component: lazy(() => import('src/pages/configuration/specialDays')),
            },
        ],
    },
];

export default configurationRouterConfig;
