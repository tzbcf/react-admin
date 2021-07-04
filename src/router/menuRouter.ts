/**
 * 路由config配置
 */

import { RouterConfig } from './types';
import homePageRouterConfig from './config/homePage';
import opreateRoleRouterConfig from './config/opreateRole';
import othersRouterConfig from './config/others';
const routerConfig: {
  menus: RouterConfig[] | [],
  others: RouterConfig[] | [],
  [index: string]: any;
} = {
  menus: [],
  others: []
};

routerConfig.menus = [
  ...homePageRouterConfig,
  ...opreateRoleRouterConfig
];

routerConfig.others = othersRouterConfig;

export default routerConfig;
