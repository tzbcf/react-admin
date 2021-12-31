/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 22:55:31
 * Description :
 * -----
 * Last Modified: 2021-07-12 22:19:00
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';

const showLoading = () => {
    const loading = document.getElementById('loading') as HTMLElement;

    if (!loading) {
        const dom = document.createElement('div');

        dom.setAttribute('id', 'loading');
        document.body.appendChild(dom);
        ReactDOM.render(<Spin tip='加载中...' size='large' />, dom);
    }
};

const hideLoading = (timeout = 0) => {
    setTimeout(() => {
        const loading = document.getElementById('loading') as HTMLElement;

        if (loading) {
            document.body.removeChild(loading);
        }
    }, timeout);
};

export { showLoading, hideLoading };
