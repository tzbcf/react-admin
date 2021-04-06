import React from 'react';
import {renderRoutes, RouterConfig} from '../../router/router';
interface Children {
    children: RouterConfig[];
}
interface Props{
    route: Children
}
const Main: React.FC<Props> = (props) => {
    const {route} = props;
    return (
        <>
            <div>我是主页</div>
            {
                renderRoutes(route.children)
            }
        </>
    )
}

export default Main;