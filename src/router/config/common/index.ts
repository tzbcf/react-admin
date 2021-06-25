/**
 * 公共路由页面
 */
import asnycComponent from 'src/components/common/asyncComponents';
import { RouterConfig } from '../../types';


const commonRouterConfig: RouterConfig[] = [
  {
    key: 'roleManage',
    title: 'roleTitle',
    route: '/roleManage',
    icon: 'TeamOutlined',
    subs: [
      {
        key: 'roleManage_list',
        route: '/home/roleManage/list',
        title: 'roleListTitle',
        icon: 'OrderedListOutlined',
        component: asnycComponent('src/pages/common/roleManage/roleList')
      },
      {
        key: 'roleManage_add',
        route: '/home/roleManage/add',
        title: 'roleAddTitle',
        icon: 'UserAddOutlined',
        isNoSub: true,
        component: asnycComponent('src/pages/common/roleManage/roleAdd')
      }
    ]
  }
]

export default commonRouterConfig;