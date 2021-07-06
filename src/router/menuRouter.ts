/**
 * 路由config配置
 */

import { RouterConfig } from './types';
import homePageRouterConfig from './config/homePage';
import opreateRoleRouterConfig from './config/opreatorMgnt';
import othersRouterConfig from './config/others';
import customerAndDevice from './config/customerAndDevice';
import amiFunction from './config/amiFunction';
import configuration from './config/configuration';
import collectReport from './config/collectReport';
import basicData from './config/basicData';

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
  ...customerAndDevice,
  ...amiFunction,
  ...configuration,
  ...collectReport,
  ...basicData,
  ...opreateRoleRouterConfig
];

routerConfig.others = othersRouterConfig;

export default routerConfig;
