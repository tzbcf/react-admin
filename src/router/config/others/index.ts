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
        component: lazy(() => import('src/components/common/searchList'))
     }
    ]
  },
 ]

 export default othersRouterConfig;