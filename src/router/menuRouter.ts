/**
 * 路由config配置
 */

import { RouterConfig } from './types';
import homePageRouterConfig from './config/homePage';
import opreateRoleRouterConfig from './config/opreatorMgnt';
import comRouterConfig from './config/components';
import customerAndDevice from './config/customerAndDevice';
import amiFunction from './config/amiFunction/index';
import configuration from './config/configuration';
import collectReport from './config/collectReport';
import basicData from './config/basicData';
import others from './config/others';

const routerConfig: {
  menus: RouterConfig[] | [],
  others: RouterConfig[] | [],
  com: RouterConfig[] | [],
  [index: string]: any;
} = {
    menus: [],
    others: [],
    com: [],
};

routerConfig.menus = [
    ...homePageRouterConfig,
    ...customerAndDevice,
    ...amiFunction,
    ...configuration,
    ...collectReport,
    ...basicData,
    ...opreateRoleRouterConfig,
];

routerConfig.com = comRouterConfig;
routerConfig.others = others;
export default routerConfig;
