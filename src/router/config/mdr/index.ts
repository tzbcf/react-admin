/**
 * mdr系统业务页面
 */
// import asnycComponent from 'src/components/common/asyncComponents';
import toLoad from 'src/components/common/toLoad';
import { RouterConfig } from '../../types';
console.log('get-----mdr-----router');
 const mdrRouterConfig: RouterConfig[] = [
  {
    key: 'main',
    title: 'mainTitle',
    icon: 'HomeOutlined',
    route: '/home/index',
    component: toLoad
  },
 ]

 export default mdrRouterConfig;