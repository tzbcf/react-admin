import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './layout/home';
import Login from './layout/login';
import Nofound from './layout/nofound';
import './App.css';

const App = () => {
  return (
    <Switch>
        <Route exact path='/' render={() => <Redirect to='/home/index' push />} />
        <Route path='/home' component={Home} />
        <Route path='/404' component={Nofound} />
        <Route path='/login' component={Login} />
        <Route component={Nofound} />
    </Switch>
  );
}

export default App;
