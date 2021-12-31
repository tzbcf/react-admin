/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:42:41
 * Description :
 * -----
 * Last Modified: 2021-08-10 18:39:26
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


import {lazy} from 'react';
import { RouterConfig } from '../../types';

const collectReportRouterConfig: RouterConfig[] = [
    {
        key: 'Collect Reportc',
        title: 'menuTitleCollectReport',
        icon: 'BarChartOutlined',
        subs: [
            {
                key: 'Load Profile Data Query',
                title: 'menuTitleLoadProfileDataQuery',
                route: '/home/collectReport/loadProfileDataQuery',
                component: lazy(() => import('src/pages/collectReport/loadProfileDataQuery')),
            },
            {
                key: 'Daily Frozen Data Query',
                title: 'menuTitleDailyFrozenDataQuery',
                route: '/home/collectReport/dailyFrozenDataQuery',
                component: lazy(() => import('src/pages/collectReport/dailyFrozenDataQuery')),
            },
            {
                key: 'Monthly Frozen Data Query',
                title: 'menuTitleMonthlyFrozenDataQuery',
                route: '/home/collectReport/monthlyFrozenDataQuery',
                component: lazy(() => import('src/pages/collectReport/monthlyFrozenDataQuery')),
            },
            {
                key: 'Device Alarm Query',
                title: 'menuTitleMeterAlarmEvent',
                route: '/home/collectReport/meterAlarmEvent',
                component: lazy(() => import('src/pages/collectReport/meterAlarmEvent')),
            },
            {
                key: 'Device Event Query',
                title: 'menuTitleDcuAlarmEvent',
                route: '/home/collectReport/dcuAlarmEvent',
                component: lazy(() => import('src/pages/collectReport/dcuAlarmEvent')),
            },
            {
                key: 'Line Loss Query',
                title: 'menuTitleLineLossQuery',
                route: '/home/collectReport/lineLossQuery',
                component: lazy(() => import('src/pages/collectReport/lineLossQuery')),
            },
        ],
    },
];

export default collectReportRouterConfig;
