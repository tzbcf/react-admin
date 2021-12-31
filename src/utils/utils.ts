import moment, {Moment} from 'moment';
type Clone<T> = {
    [K in keyof T]: T[K];
};

export const deepClone = <T extends object = any>(target: Clone<T>):T => {
    // 定义一个变量
    let result: any = {};
    // 如果当前需要深拷贝的是一个对象的话

    if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]));
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target;
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
    // 返回最终结果
    return result;
};

export const fullScreen = ():void => {
    const element: any = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
};

export const exitFullscreen = ():void => {
    const doc: any = document;

    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    }
};

export const randomStr = (num: number = 32): string => {
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789';
    let unid = '';

    for (let i = 0; i < num; i++) {
        unid += str.charAt(Math.floor(Math.random() * str.length));
    }
    return unid;
};

export const dateFormat = (str = 'YYYY MM DD h:mm:ss', data: Date|Moment = new Date()): any => moment(data).format(str);

export const jsonIntersection = (arr: any[], list: any[], key: any) => arr.filter((v) => list.some((n) => {
    if (typeof v[key] !== undefined && typeof n[key] !== undefined) {
        return v[key] === n[key];
    }
}));

// 计算分页
export const arrPaging = (data: any[], page: number, pageSize: number) => data.slice((page - 1) * pageSize, pageSize * page);

export const IsEmptyObejct = (obj: Object = {}) => {
    const arr = Object.keys(obj);

    return arr.length;
};

// 判断是否为IP
export const IsIp = (value:string) => {
    const regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    return regexp.test(value);
};

import { useCallback, useEffect, useRef } from 'react';
type Debounce = {
    fn: Function;
    timer: null | any;
}

/**
 * 防抖
 * @param fn 函数
 * @param delay 时间
 * @param dep 监控对象
 * @returns 返回一个防抖函数
 */

export const useDebounce = (fn:Function, delay:number, dep = []) => {
    const { current } = useRef<Debounce>({ fn, timer: null });

    useEffect(function () {
        current.fn = fn;
    }, [ fn ]);

    return useCallback(function f (...args) {
        if (current.timer) {
            clearTimeout(current.timer);
        }
        current.timer = setTimeout(() => {
            current.fn.call(this, ...args);
        }, delay);
    }, dep);
};

export const useThrottle = (fn:Function, delay:number, dep = []) => {
    const { current } = useRef<Debounce>({ fn, timer: null });

    useEffect(function () {
        current.fn = fn;
    }, [ fn ]);

    return useCallback(function f (...args) {
        if (!current.timer) {
            current.timer = setTimeout(() => {
                delete current.timer;
            }, delay);
            current.fn.call(this, ...args);
        }
    }, dep);
};
