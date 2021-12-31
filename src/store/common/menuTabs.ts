/*
 * FileName : menuTabs
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-07 09:49:05
 * Description :
 * -----
 * Last Modified: 2021-07-07 09:49:20
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { deepClone } from 'src/utils/utils';

const initState = {
    menuTabs: [ {
        key: 'mdrHomePage',
        title: 'menuTitleMdrMain',
        route: '/home/mdrHomePage',
    } ],
};

export type MenuObject = {
    key: string,
    title: string,
    route: string
}

export type MenuList = {
    menuTabs: MenuObject[],
}

type ACTION = {
    type: string,
    value: MenuObject
}

export const MENUTABS_ADD = 'add_menutabs'; // 添加菜单tabs

export const MENUTABS_DELETE = 'delete_menutabs'; // 删除菜单tabs

export const MENUTABS_DELETE_OTHERS = 'delete_others_menutabs'; // 删除其他tabs

export const MENUTABS_DELETE_ALL = 'delete_all_menutabs'; // 删除所有菜单


/**
 *  菜单标签
 * @param {initState} state state
 * @param {ACTION} action action
 * @returns {state} state
 */
export const menuTabsDispose = (state: MenuList = initState, action: ACTION) => {
    const {menuTabs} = state;
    const list = deepClone(menuTabs);

    switch (action.type) {
        case MENUTABS_ADD: { // 添加菜单tabs, 下面逻辑=》不存在就添加,存在就不变
            const tabs = list.find((v: MenuObject) => v.key === action.value.key);

            if (tabs) {
                return state;
            }
            list.push(action.value);
            return { ...state, menuTabs: list };
        }
        case MENUTABS_DELETE: { // 删除菜单tabs，下面逻辑=》 不存在不动，存在就删除, 首页不删除
            const tabs = list.find((v: MenuObject) => v.key === action.value.key && !action.value.key.includes('HomePage'));

            if (tabs) {
                const tabsList = list.filter((v: MenuObject) => v.key !== action.value.key);

                return { ...state, menuTabs: tabsList};
            }
            return state;
        }
        case MENUTABS_DELETE_OTHERS: {
            const tabs = list.find((v: MenuObject) => v.key === action.value.key);
            let tabsList = [];

            if (tabs) {
                tabsList = list.filter((v: MenuObject) => v.key === action.value.key || v.key.includes('HomePage'));

            } else {
                tabsList = list.filter((v: MenuObject) => !v.key.includes('HomePage'));
            }
            return { ...state, menuTabs: tabsList};
        }
        case MENUTABS_DELETE_ALL: {
            const tabsList = list.filter((v: MenuObject) => v.key.includes('HomePage'));

            return { ...state, menuTabs: tabsList};
        }
        default:
            return state;
    }
};
