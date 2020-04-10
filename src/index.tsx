/*
 * FileName : index.tsx
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-03-17 15:37:15
 * Description : 
 * -----
 * Last Modified: 2020-04-10 11:03:27
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
