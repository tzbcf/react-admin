import React from 'react';
import Login from '../layout/login';
import NoFound from '../layout/nofound';
import home from '../layout/home';
import List from '../pages/list';
import Details from '../pages/details';
import { Route,Switch } from 'react-router-dom';

export interface RouterConfig {
    key: string;
    path:string;
    component: React.FC<any>;
    exact?: boolean;
    strict?: boolean;
    children?: RouterConfig[];
};

const renderRoutes = (routes:RouterConfig[], extraProps = {}, switchProps = {}) => routes ? (
  <Switch {...switchProps}>
    {routes.map((route, i) => (
      <Route
        key={route.key || i}
        path={route.path}
        exact={route.exact}
        strict={route.strict}
        render={(props: any) => <route.component {...props} {...extraProps} route={route} />}
      />
    ))}
  </Switch>
) : null

const routerConfig: RouterConfig[] = [
    {
        key: 'page_login',
        path: '/login',
        exact: true,
        component: Login
    },
    {
      key: 'page_layout',
      path: '/home',
      component: home,
      children: [
        {
          key: 'page_layout_list',
          path: '/home/list',
          exact: true,
          component: List
        },
        {
          key: 'page_layout_details',
          path: '/home/details',
          exact: true,
          component: Details
        }
      ]
    },
    {
      key: 'page_noFound',
      path: '/404',
      exact: true,
      component: NoFound
    },
];

export {
    renderRoutes,
    routerConfig
}