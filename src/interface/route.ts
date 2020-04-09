/**
 * FileName : route.ts
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-18 12:51:43
 * Description : 
 * -----
 * Last Modified: 2020-04-08 16:31:21
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */


export interface Router {
    path: string;
    name?: string;
    exact?: boolean;
    component: Function;
    childrens?: Router[];
    redirect?: string;
}

export interface PropsRouter {
  Routers: Router[];
}