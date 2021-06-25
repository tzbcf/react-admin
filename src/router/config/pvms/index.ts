/**
 * pvms系统业务页面
 */
//  import asnycComponent from 'src/components/common/asyncComponents';
import toLoad from 'src/components/common/toLoad';

 import { RouterConfig } from '../../types';
 console.log('get-----pvms-----router');

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
          component:toLoad
        },
        {
          key: 'table_detail',
          route: '/home/table/detail',
          title: 'tableDetail',
          icon: 'CopyOutlined',
          isNoSub: true,
          component: toLoad
        }
      ]
    },
 ]

 export default pvmsRouterConfig;