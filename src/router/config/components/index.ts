/**
 * 其他组件页面
 */
import {lazy} from 'react';
import { RouterConfig } from '../../types';

const comRouterConfig: RouterConfig[] = [
    {
        key: 'compontent',
        title: 'menuTitleCompontent',
        icon: 'ToolOutlined',
        requireAuth: true,
        subs: [
            {
                key: 'compontentLoad',
                title: 'menuTitleToLoad',
                route: '/home/compontent/toload',
                requireAuth: true,
                component: lazy(() => import('src/components/common/toLoad')),
            },
            {
                key: 'compontentSearchList',
                title: 'menuTitleSearchList',
                route: '/home/compontent/searchList',
                requireAuth: true,
                component: lazy(() => import('src/pages/components/searchList')),
            },
            {
                key: 'device_tree',
                route: '/home/compontent/deviceTree',
                title: 'menuTitleDeviceTree',
                requireAuth: true,
                component: lazy(() => import('src/pages/components/deviceTree')),
            },
            {
                key: 'labelList',
                route: '/home/compontent/labelList',
                title: 'menuTitleLabelList',
                requireAuth: true,
                component: lazy(() => import('src/pages/components/labelList')),
            },
            {
                key: 'taskPage',
                route: '/home/compontent/taskPage',
                title: 'menuTitleTaskList',
                requireAuth: true,
                component: lazy(() => import('src/pages/components/task')),
            },
            {
                key: 'TransferPage',
                route: '/home/compontent/transfer',
                title: 'menuTitleTransferPage',
                requireAuth: true,
                component: lazy(() => import('src/pages/components/transfer')),
            },
        ],
    },
];

export default comRouterConfig;
