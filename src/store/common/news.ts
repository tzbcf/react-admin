/**
 * FileName : news.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-07 16:37:54
 * Description :
 * -----
 * Last Modified: 2021-08-20 18:04:31
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


const initState = {
    newsShow: false,
};

export type INITSTATE = {
    newsShow: boolean
  }

export type ACTION = {
    type: string
    value: boolean
}

export const NEW_TOGGLE = 'new_toggle'; // 消息列表的展示与隐藏

/**
   * 右边消息的显示与隐藏；newShow为true时，显示，否则隐藏
   * @param {initState} state state
   * @param {ACTION} action action
   * @returns {state} state
   */
export const toggleNews = (state: INITSTATE = initState, action: ACTION) => {
    switch (action.type) {
        case NEW_TOGGLE:
            return {...state, newsShow: action.value};
        default:
            return state;
    }
};
