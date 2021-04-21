import React from 'react';
import Routers from '../../router/router';
// import { Switch, Route } from 'react-router-dom';
// import MainIndex from '../../pages/main';

const Main: React.FC = () => {
    // const {route} = props;
    // console.log('-----', Routers)
    return (
        <>
        <div>我是主页</div>
        <Routers />
            {/* <Switch>
      <Route
        key='main'
        path='/home/index'
        exact={true}
                >
        <MainIndex />
      </Route>
    </Switch> */}
        </>
    )
}

export default Main;