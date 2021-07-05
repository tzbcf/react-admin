/**
 * FileName : http.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 22:34:16
 * Description : 
 * -----
 * Last Modified: 2021-07-04 19:14:10
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import axios from 'axios';
import store from 'src/store'
import {showLoading, hideLoading} from 'src/components/common/loding';

const Axios = axios.create({
    // baseURL: process.env.BASE_URL, // 设置请求的base url
    timeout: 20000, // 设置超时时长
})

Axios.interceptors.request.use(config=> {
        showLoading();
        console.log('store----',store);
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

Axios.interceptors.response.use(res=> {
        return res;
    },
    error => {
        Promise.reject(error);
    }
);

const get = (url: string = '', params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        })
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        })
        .finally(() => {
            hideLoading();
        })
    });
};

const post = (url: string= '', data = {} ) => {
    return new Promise((resolve, reject) => {
        axios.post(url, {
            data: data
        })
        .then(res => {
            resolve(res);
        })
        .catch(err => {
            reject(err);
        })
        .finally(() => {
            hideLoading();
        })
    })
};

export  {
    get,
    post
}

export default Axios;
