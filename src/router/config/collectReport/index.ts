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

const collectReportRouterConfig: RouterConfig[] = [
    {
        key: 'collectReport',
        title: 'menuTitleCollectReport',
        icon: 'HomeOutlined',
        subs: [
            {
                key: 'dailyFrozenDataQuery',
                title: 'menuTitleDailyFrozenDataQuery',
                icon: 'HomeOutlined',
                route: '/home/collectReport/dailyFrozenDataQuery',
                component: lazy(() => import('src/pages/collectReport/dailyFrozenDataQuery'))
            },
            {
                key: 'dcuAlarmEvent',
                title: 'menuTitleDcuAlarmEvent',
                icon: 'HomeOutlined',
                route: '/home/collectReport/dcuAlarmEvent',
                component: lazy(() => import('src/pages/collectReport/dcuAlarmEvent'))
            },
            {
                key: 'lineLossQuery',
                title: 'menuTitleLineLossQuery',
                icon: 'HomeOutlined',
                route: '/home/collectReport/lineLossQuery',
                component: lazy(() => import('src/pages/collectReport/lineLossQuery'))
            },
            {
                key: 'loadProfileDataQuery',
                title: 'menuTitleLoadProfileDataQuery',
                icon: 'HomeOutlined',
                route: '/home/collectReport/loadProfileDataQuery',
                component: lazy(() => import('src/pages/collectReport/loadProfileDataQuery'))
            },
            {
                key: 'meterAlarmEvent',
                title: 'menuTitleMeterAlarmEvent',
                icon: 'HomeOutlined',
                route: '/home/collectReport/meterAlarmEvent',
                component: lazy(() => import('src/pages/collectReport/meterAlarmEvent'))
            },
            {
                key: 'monthlyFrozenDataQuery',
                title: 'menuTitleMonthlyFrozenDataQuery',
                icon: 'HomeOutlined',
                route: '/home/collectReport/monthlyFrozenDataQuery',
                component: lazy(() => import('src/pages/collectReport/monthlyFrozenDataQuery'))
            },
        ]
    },
]

export default collectReportRouterConfig;
