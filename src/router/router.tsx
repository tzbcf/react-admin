/**
 * 路由封装
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { KeepaliveRouterSwitch, KeepaliveRoute } from 'react-keepalive-router';
import routerConfig from './menuRouter';
import { RouterConfigBase, RouterConfig } from './types';
import RouterWrap from './routerWrap';
const Routers: React.FC = () => {
    const Router = (v: RouterConfigBase) => {
        const Component = v.component;

        return <KeepaliveRoute cacheId={v.key} key={v.key || v.route} path={v.route} render={(restProps: any) => <RouterWrap {...{ restProps, Com: Component, route: v }} />}></KeepaliveRoute>;
    };
    const subRoute = (v: RouterConfig): any => v.subs && v.subs.map((subR: RouterConfig) => subR.subs ? subRoute(subR) : Router(subR));
    const CreateRouter = (v: RouterConfig) => v.component ? Router(v) : subRoute(v);
    const RouterList = (v: string) => routerConfig[v].map(CreateRouter);

    return (
        <KeepaliveRouterSwitch >
            {Object.keys(routerConfig).map((v: string) => RouterList(v))}
            <Route render={() => <Redirect to='/404' />} />
        </KeepaliveRouterSwitch>
    );
};

export default Routers;
