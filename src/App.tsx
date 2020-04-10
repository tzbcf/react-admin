/*
 * FileName : App.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-04-10 11:12:56
 * Description : 
 * -----
 * Last Modified: 2020-04-10 11:26:13
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

import React from 'react';
import Routers from './config/router';
import {Switch, BrowserRouter} from 'react-router-dom';
import RouterWithSubRouter from './lib/routerWithSubRouters';
import { Provider } from 'react-redux';
import {store} from './store';
import './App.css';
window.store = store;
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          {
            RouterWithSubRouter(Routers)
          }
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
