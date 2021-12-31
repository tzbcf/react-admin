// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Toload from 'src/components/common/toLoad';
import 'antd/dist/antd.less';
import 'src/utils/style/index.less';
import 'font-awesome/css/font-awesome.css';
store.subscribe(() =>
    console.log('subscribe-', store.getState())
);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={<Toload />} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
