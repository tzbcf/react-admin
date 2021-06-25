/**
 * 其他组件页面
 */

 import { RouterConfig } from '../../types';
//  import asnycComponent from 'src/components/common/asyncComponents';
import toLoad from 'src/components/common/toLoad';

 const othersRouterConfig: RouterConfig[] = [
  {
    key: 'main',
    title: 'mainTitle',
    icon: 'HomeOutlined',
    route: '/home/index',
    component: toLoad
  },
 ]

 export default othersRouterConfig;