/**
 * FileName : cal.ts
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-04-01 18:02:55
 * Description : 
 * -----
 * Last Modified: 2020-04-08 15:50:57
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

interface UserInfo {
    user: string;
    password: string;
}

interface ReduxState {
    userinfo: UserInfo
}

interface Action {
    type: string,
    data:  UserInfo,
}

const initData = {
    userinfo: {
        user: '',
        password: '',
    }
}
export const ADDUSERINFO = "ADDUSERINFO"

const user = (state: ReduxState = initData, action: Action,  ) => {
    switch (action.type) {
        case ADDUSERINFO:
            state.userinfo = action.data;
            return state;
        default:
            return state;
    }
}

export {user}