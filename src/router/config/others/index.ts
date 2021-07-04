/**
 * 其他组件页面
 */
import {lazy} from 'react';
import { RouterConfig } from '../../types';

 const othersRouterConfig: RouterConfig[] = [
  {
    key: 'compontent',
    title: 'compontentTitle',
    icon: 'HomeOutlined',
    subs: [
      {
        key: 'compontentLoad',
        title: 'compontentTitleLoad',
        route: '/home/compontent/toload',
        icon: 'LoadingOutlined',
        component: lazy(() => import('src/components/common/toLoad'))
      },
      {
      key: 'compontentSearchList',
      title: 'compontentTitleSearchList',
      route: '/home/compontent/searchList',
      icon: 'FileSearchOutlined',
      component: lazy(() => import('src/pages/others/searchList'))
    }
  ]
  },
  {
    key: 'table',
    title: 'tableTitle',
    route: '/table',
    icon: 'TableOutlined',
    subs: [
      {
        key: 'table_list',
        route: '/home/table/list',
        title: 'tableList',
        icon: 'UnorderedListOutlined',
        component: lazy(()=> import('src/pages/others/table/list'))
      },
      {
        key: 'table_detail',
        route: '/home/table/detail',
        title: 'tableDetail',
        icon: 'CopyOutlined',
        isNoSub: true,
        component: lazy(()=> import('src/pages/others/table/details'))
      }
    ]
  }
 ]

 export default othersRouterConfig;