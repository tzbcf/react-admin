/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-07-06 09:57:17
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import {lazy} from 'react';
import { RouterConfig } from '../../types';

const configurationRouterConfig: RouterConfig[] = [
    {
        key: 'configuration',
        title: 'menuTitleConfiguration',
        icon: 'HomeOutlined',
        subs: [
            {
                key: 'configDcuArchive',
                title: 'menuTitleConfigDcuArchive',
                icon: 'HomeOutlined',
                route: '/home/configuration/configDcuArchive',
                component: lazy(() => import('src/pages/configuration/configDcuArchive')),
            },
            {
                key: 'dcuSchedule',
                title: 'menuTitleDcuSchedule',
                icon: 'HomeOutlined',
                route: '/home/configuration/dcuSchedule',
                component: lazy(() => import('src/pages/configuration/dcuSchedule')),
            },
            {
                key: 'commandConfig',
                title: 'menuTitleCommandConfig',
                icon: 'HomeOutlined',
                route: '/home/configuration/commandConfig',
                component: lazy(() => import('src/pages/configuration/commandConfig')),
            },
            {
                key: 'meterTypeParameters',
                title: 'menuTitleMeterTypeParameters',
                icon: 'HomeOutlined',
                route: '/home/configuration/meterTypeParameters',
                component: lazy(() => import('src/pages/configuration/meterTypeParameters')),
            },
            {
                key: 'NTPConfig',
                title: 'menuTitleNTPConfig',
                icon: 'HomeOutlined',
                route: '/home/configuration/NTPConfig',
                component: lazy(() => import('src/pages/configuration/NTPConfig')),
            },
            {
                key: 'configLoadProfile',
                title: 'menuTitleConfigLoadProfile',
                icon: 'HomeOutlined',
                route: '/home/configuration/configLoadProfile',
                component: lazy(() => import('src/pages/configuration/configLoadProfile')),
            },
            {
                key: 'activityCalender',
                title: 'menuTitleActivityCalender',
                icon: 'HomeOutlined',
                route: '/home/configuration/activityCalender',
                component: lazy(() => import('src/pages/configuration/activityCalender')),
            },
            {
                key: 'lineLossAnalysis',
                title: 'menuTitleLineLossAnalysis',
                icon: 'HomeOutlined',
                route: '/home/configuration/lineLossAnalysis',
                component: lazy(() => import('src/pages/configuration/lineLossAnalysis')),
            },
            {
                key: 'opreatorOnlineMgnt',
                title: 'menuTitleOpreatorOnlineMgnt',
                icon: 'HomeOutlined',
                route: '/home/configuration/opreatorOnlineMgnt',
                component: lazy(() => import('src/pages/configuration/opreatorOnlineMgnt')),
            },
            {
                key: 'systemParametersMgnt',
                title: 'menuTitleSystemParametersMgnt',
                icon: 'HomeOutlined',
                route: '/home/configuration/systemParametersMgnt',
                component: lazy(() => import('src/pages/configuration/systemParametersMgnt')),
            },
            {
                key: 'alarmInfoConfig',
                title: 'menuTitleAlarmInfoConfig',
                icon: 'HomeOutlined',
                route: '/home/configuration/alarmInfoConfig',
                component: lazy(() => import('src/pages/configuration/alarmInfoConfig')),
            },
            {
                key: 'specialDays',
                title: 'menuTitleSpecialDays',
                icon: 'HomeOutlined',
                route: '/home/configuration/specialDays',
                component: lazy(() => import('src/pages/configuration/specialDays')),
            },
        ],
    },
];

export default configurationRouterConfig;
