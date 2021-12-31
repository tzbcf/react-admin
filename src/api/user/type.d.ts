/* eslint-disable camelcase */
/**
 * FileName : types.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-04 19:14:49
 * Description :
 * -----
 * Last Modified: 2021-09-06 10:37:46
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// 登陆
type Login = {
    userName: string;
    password: string;
    // eslint-disable-next-line camelcase
    request_locale?: string;
    languageSet?: string;
};

type SysUser = {
    operatorName: string;
    operatorId: string;
    operatorGuid: string;
    nodeNo: string;
    groupList: string;
    subSys: string;
    username: string;
}

type SysRole = {
    groupGuid: string;
    groupName: string;
}

type ReturnUser = {
    ip: string;
    sysType: string;
    subName: string;
    sysUser: SysUser;
    sysRole: SysRole;
}

type SetPassword = {
    oldPwd: string;
    password: string;
    username: string;
}

// 用户信息创建编辑
type UserParams = {
    sys_no: string;
    company_no: string;
    role_id: string;
    name: string;
    zname: string;
    status: number;
    statusOld: string;
    dbDot: string;
    phone: string;
    email: string;
    remark: string;
    subSysNo: string;
    node_no: string;
    role_id: string;
};

interface EditorUserParams extends UserParams{
    guid: string;
}

// 重置密码
type RestPwdParams = {
    guid: string;
    date: string;
    subSysNo: string;
};

// 删除用户
type DeleteUserParams = {
    guid: string;
};

// 用户列表参数
type UserListParams = {
    sysNo: string;
    subSysNo: string;
    page: number;
    rows: number;
    operatorId: string;
    operatorName: string;
};

type UserInfo = {
    CLOSE_FLAG: string;
    COM_NAME: string;
    COM_NO: string;
    CREATE_TIME: string;
    DB_DOT: string;
    EMAIL: string | null;
    GROUP_GUID: string;
    GROUP_NAME: string;
    MODIFY_NODE_NO: string;
    NODE_NAME: string;
    NODE_NO: string;
    OPERATOR_GUID: string;
    OPERATOR_ID: string;
    OPERATOR_NAME: string;
    PASSWORD: string;
    PHONE: string | null;
    SEX: string | null;
    SUB_NAME: string;
    SUB_NO: string;
    SUB_SYS: string;
    rn__: number;
};

type UserList = {
    total: number;
    rows: UserInfo[];
};

type RoleListQuery = {
    page: number;
    rows: number;
    sysNo: string;
    company: string;
};

type RoleListRow = {
    CREATE_TIME: string;
    GLOBE_MODIFY_FLAG: string;
    GLOBE_SELECT_FLAG: string;
    GROUP_GUID: string;
    GROUP_NAME: string;
    MODIFY_NODE_NO: string;
    NODE_NAME: string;
    NODE_NO: string;
    REMARK: string;
    SUB_NAME: string;
    SUB_NO: string;
    SUB_SYS: string;
    rn__: number;
};

type RoleListData = {
    total: number;
    rows: RoleListRow[];
};

type AddRoleParams = {
    sys_no: string;
    company_no: string;
    role_name: string;
    role_rmk: string;
    allupdate: string;
    allupdate_box?: string;
    subSysNo: string;
    meanu_no: string;
    meanu_no_commonUsed: string;
    oper_no?: string;
}

interface EditorRoleParams extends AddRoleParams {
    guid: string;
}

type curMenu = {
    NO: string;
}

interface menusList extends curMenu {
    NAME: string;
    PNO: string;
    menuKey: string;
}

type UserRoleList = {
    GROUP_GUID: string;
    GROUP_NAME: string;
}

type UserNode = {
    ID: string;
    NAME: string;
    PARENTID: string;
    level1: number;
}

export {
    Login,
    RestPwdParams,
    DeleteUserParams,
    UserParams,
    UserListParams,
    UserList,
    UserInfo,
    RoleListQuery,
    RoleListData,
    RoleListRow,
    AddRoleParams,
    menusList,
    curMenu,
    EditorRoleParams,
    UserRoleList,
    UserNode,
    EditorUserParams,
    SetPassword,
    ReturnUser,
};
