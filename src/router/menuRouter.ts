/**
 * 路由config配置
 */

import { RouterConfig } from './types';
const routerConfig: {
  mdrRouter: RouterConfig[] | [],
  pvmsRouter: RouterConfig[] | [],
  common: RouterConfig[] | [],
  others: RouterConfig[] | [],
  [index: string]: any;
} = {
  mdrRouter: [],
  pvmsRouter: [],
  common: [],
  others: []
};
routerConfig.common = require('./config/common').default;
routerConfig.others = require('./config/others').default;
switch (process.env.PROJECT_TYPE) {
  case 'MDR':
    routerConfig.mdrRouter = require('./config/mdr').default;
    break;
  case 'PVMS':
    routerConfig.pvmsRouter = require('./config/pvms').default;
    break;
  default:
    routerConfig.mdrRouter = require('./config/mdr').default;
    routerConfig.pvmsRouter = require('./config/pvms').default;
    break;
}
export default routerConfig;
// const menuConfig: {
//   menus: RouterConfig[];
//   others: RouterConfig[] | [];
//   [index: string]: any;
// } = {
//   menus: [
//     {
//       key: 'main',
//       title: 'mainTitle',
//       icon: 'HomeOutlined',
//       route: '/home/index',
//       component: 'Main'
//     },
//     {
//       key: 'table',
//       title: 'tableTitle',
//       route: '/table',
//       icon: 'TableOutlined',
//       subs: [
//         {
//           key: 'table_list',
//           route: '/home/table/list',
//           title: 'tableList',
//           icon: 'UnorderedListOutlined',
//           component: 'Table_List'
//         },
//         {
//           key: 'table_detail',
//           route: '/home/table/detail',
//           title: 'tableDetail',
//           icon: 'CopyOutlined',
//           isNoSub: true,
//           component: 'Table_Detail'
//         }
//       ]
//     },
//     {
//       key: 'roleManage',
//       title: 'roleTitle',
//       route: '/roleManage',
//       icon: 'TeamOutlined',
//       subs: [
//         {
//           key: 'roleManage_list',
//           route: '/home/roleManage/list',
//           title: 'roleListTitle',
//           icon: 'OrderedListOutlined',
//           component: 'Role_List'
//         },
//         {
//           key: 'roleManage_add',
//           route: '/home/roleManage/add',
//           title: 'roleAddTitle',
//           icon: 'UserAddOutlined',
//           isNoSub: true,
//           component: 'Role_Add'
//         }
//       ]
//     }
//   ],
//   others: []
// };

// export default menuConfig;
