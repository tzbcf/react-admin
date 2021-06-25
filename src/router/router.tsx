/**
 * 路由封装
 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import AllCompontent from '../pages';
import routerConfig from './menuRouter';
import {RouterConfigBase, RouterConfig} from './types';
import RouterWrap from './routerWrap';

const Routers: React.FC = () => {
  const Router = (v: RouterConfigBase) => {
    const Component = v.component ;
    return (<Route
      key={v.key || v.route}
      path={v.route}
      render={(restProps: any) => {
        return (<RouterWrap {...{restProps, Com: Component, route: v}}  />)
      } }
    ></Route >)
  }
  const subRoute = (v: RouterConfig): any =>
    v.subs && v.subs.map((subR: RouterConfig) => (subR.subs ? subRoute(subR) : Router(subR)));
  const CreateRouter = (v: RouterConfig) => {
    return v.component ? Router(v) : subRoute(v);
  }
  const RouterList = (v: string) => routerConfig[v].default.map(CreateRouter);
  return (
    <Switch>
      {
        Object.keys(routerConfig).map((v: string)=>RouterList(v))
      }
      <Route render={() => <Redirect to='/404' />} />
    </Switch>
  )
}

export default Routers;
