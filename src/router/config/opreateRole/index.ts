/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:47:04
 * Description : 
 * -----
 * Last Modified: 2021-07-03 19:47:59
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


 import { RouterConfig } from 'src/router/types';
 import {lazy} from 'react';
 
 const opreateRoleRouterConfig: RouterConfig[] = [
   {
     key: 'roleManage',
     title: 'roleTitle',
     icon: 'TeamOutlined',
     subs: [
       {
         key: 'roleManage_list',
         route: '/home/roleManage/list',
         title: 'roleListTitle',
         icon: 'OrderedListOutlined',
         component: lazy(() => import('src/pages/opreateRole/roleManage/roleList'))
       },
       {
         key: 'roleManage_add',
         route: '/home/roleManage/add',
         title: 'roleAddTitle',
         icon: 'UserAddOutlined',
         isNoSub: true,
         component: lazy(() => import('src/pages/opreateRole/roleManage/roleAdd'))
       }
     ]
   }
 ]
 
 export default opreateRoleRouterConfig;