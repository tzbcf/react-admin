/**
 * pvms系统业务页面
 */
import {lazy} from 'react';
import { RouterConfig } from '../../types';

const pvmsRouterConfig: RouterConfig[] = [
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
          component: lazy(()=> import('src/pages/pvms/table/list'))
        },
        {
          key: 'table_detail',
          route: '/home/table/detail',
          title: 'tableDetail',
          icon: 'CopyOutlined',
          isNoSub: true,
          component: lazy(()=> import('src/pages/pvms/table/details'))
        }
      ]
    },
 ]

 export default pvmsRouterConfig;