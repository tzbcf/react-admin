/**
 * 公共路由页面
 */
import { RouterConfig } from 'src/router/types';
import {lazy} from 'react';

const commonRouterConfig: RouterConfig[] = [
  {
    key: 'roleManage',
    title: 'roleTitle',
    icon: 'TeamOutlined',
    subs: [
      {
        key: 'roleManage_list',
        route: '/home/roleManage/list',
        title: 'roleListTitle',
        icon: 'OrderedListOutlined',
        component: lazy(() => import('src/pages/common/roleManage/roleList'))
      },
      {
        key: 'roleManage_add',
        route: '/home/roleManage/add',
        title: 'roleAddTitle',
        icon: 'UserAddOutlined',
        isNoSub: true,
        component: lazy(() => import('src/pages/common/roleManage/roleAdd'))
      }
    ]
  }
]

export default commonRouterConfig;