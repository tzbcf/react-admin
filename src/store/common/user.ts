/**
 * FileName : user.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-17 15:27:05
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import {ReturnUser} from 'src/api/user/type';
export const initState = {
    ip: '',
    sysType: '100068',
    subName: '',
    sysUser: {
        operatorName: '',
        operatorId: '',
        operatorGuid: '',
        nodeNo: '',
        groupList: '',
        subSys: '',
        username: '',
    },
    sysRole: {
        groupGuid: '',
        groupName: '',
    },
};

export type ACTION = {
  type: string;
  value: ReturnUser;
}

export const setUsername = 'SET_USERNAME'; // 消息列表的展示与隐藏

/**
 * 设置用户账户
 * @param {initState} state state
 * @param {ACTION} action action
 * @returns {state} state
 */
export const userInfo = (state: ReturnUser = initState, action: ACTION) => {
    switch (action.type) {
        case setUsername:
            return state = action.value;
        default:
            return state;
    }
};
