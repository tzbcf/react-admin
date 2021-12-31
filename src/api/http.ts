/**
 * FileName : http.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 22:34:16
 * Description :
 * -----
 * Last Modified: 2021-12-07 15:21:18
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import axios from 'axios';
// import qs from 'qs';
// import { showLoading, hideLoading } from 'src/components/common/loding';
import {store} from 'src/store/index';
const pending = new Map();
const Axios = axios.create({
    baseURL: '/v1', // 设置请求的base url /wasion-overseas-mdr-dist
    timeout: 600000, // 设置超时时长
    withCredentials: true,
});
const CancelToken = axios.CancelToken;

const cancelAxios = (url: string) => { // 取消请求
    if (pending.has(url)) {
        pending.get(url).func();
        pending.delete(url);
    }
};

Axios.interceptors.request.use((config) => {
    // showLoading();
    config.headers.version = '2.0';
    config.headers.username = store.getState().userInfo.username || '';
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (config.url && pending.has(config.url)) { // 是否已经在请求
        cancelAxios(config.url as string); // 取消请求
    } else { // 添加进入请求队列
        config.cancelToken = new CancelToken((c) => pending.set(config.url, { func: c }));
    }
    return Promise.resolve(config);
},
(error) => {
    Promise.reject(error);
});

// eslint-disable-next-line complexity
Axios.interceptors.response.use((res) => {
    cancelAxios(res.config.url as string); // 请求完成，取消请求
    if (res.status >= 500) {
        // location.href = '/500';
        return Promise.reject('');
    }
    // code为0，请求正常且成功
    if (res.status === 200 && typeof res.data.code === 'number' && !res.data.code) {
        return Promise.resolve(res.data.data);
    }
    // 1002密码失效，1005密码需要重置，1006账号密码被修改需要重新登录
    if (res.status === 200 && typeof res.data.code === 'number' && res.data.code === 1006) {
        location.href = '/login';
        return Promise.reject('');
    }
    if (res.status === 200 && typeof res.data.code === 'number' && (res.data.code === 1005 || res.data.code === 1002)) {
        return Promise.resolve({code: res.data.code});
    }
    if (res.status === 200 && res.config.url?.includes('excelUpload')) { // 上传成功时没有code返回。针对上传特殊处理
        return Promise.resolve('');
    }
    return Promise.reject(res.data.message ? res.data.message : '请求异常');
},
(error) => {
    console.log('Axios-error', error);
    // location.href = '/500';
    return Promise.reject(error.toString());
});

export type UploadResult = {
    hintMsg: string;
    TotalSize: number;
    Status: string;
}

const get = <T=any>(url: string = '', params = {}): Promise<T> => Axios.get(url, {params: params});

const post = <T = any>(url: string = '', data = {}): Promise<T> => Axios.post(url, data);

const excelUpload = (data:FormData): Promise<UploadResult> => Axios.post('/excelUpload', data);

export {
    get,
    post,
    excelUpload,
};

export default Axios;
