import React from 'react';
import Routers from './config/router';
import {Switch, BrowserRouter} from 'react-router-dom';
import RouterWithSubRouter from './lib/routerWithSubRouters';
import { Provider } from 'react-redux';
import {store} from './store';
import './app.less';
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
