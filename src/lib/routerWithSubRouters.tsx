/*
 * FileName : router
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-18 12:50:04
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

import { Router } from "../interface/route";
import { Route } from "react-router-dom";
import React from "react";

const RouterWithSubRouter = (Routers: Router[]) => {
  return (
    Routers.map((route: Router,index: number) => (
          <Route
            path={route.path}
            key={index}
            render={props => (
              // pass the sub-routes down to keep nesting
              <route.component {...props} Routers={route.childrens} />
            )}
          />
    ))
  );
}
export default RouterWithSubRouter
