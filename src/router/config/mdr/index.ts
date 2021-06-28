/**
 * mdr系统业务页面
 */
import {lazy} from 'react';
import { RouterConfig } from '../../types';

const mdrRouterConfig: RouterConfig[] = [
  {
    key: 'main',
    title: 'mainTitle',
    icon: 'HomeOutlined',
    route: '/home/index',
    component: lazy(() => import('src/pages/mdr/main'))
  },
 ]

 export default mdrRouterConfig;