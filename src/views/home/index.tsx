/*
 * FileName : home.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-17 15:01:09
 * Description : 
 * -----
 * Last Modified: 2020-04-09 11:17:48
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

import React from 'react';
import Header from '../../components/header/index';
import {Switch}  from 'react-router-dom';
import RouterWithSubRouter from '../../lib/routerWithSubRouters';
import { PropsRouter } from "../../interface/route";

interface State {
  a: number
}

export default class Home extends React.Component<PropsRouter, State> {
  constructor(props:PropsRouter) {
    super(props);
    console.log("-------aaa", store.getState().user)
    this.state={
      a: 1
    }
  }
  render () {
    return (
      <div>
        <Header name="哈哈哈哈" />
        我是Home
        <Switch>
          {
            RouterWithSubRouter(this.props.Routers)
          }
        </Switch>
      </div>
    )
  }
}



