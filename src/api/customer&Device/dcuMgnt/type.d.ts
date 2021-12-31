/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-18 14:06:29
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type InactiveDcuList = {
    BATCH_NO: string;
    CREATETIME: string;
    CREATE_TIME: string;
    CST_ADDR: string | null;
    CST_ID: string;
    CST_NAME: string | null;
    CST_NO: string;
    CST_PWD: string | null;
    CST_RMK: string | null;
    CST_TYPE_CODE: string;
    CST_TYPE_NAME: string;
    DB_DOT: string;
    DB_FLAG: string;
    DST_ID: string | null;
    FACTORY_NO: string;
    IF_USED: string;
    MAIN_MODULE_VERSION: string;
    MODIFY_TIME: string | null;
    MODULE_FW_VERSION: string;
    OPERATOR_NAME: string;
    PRODUCE_DATE: string;
    REMARK: string;
    SN: string;
    SN_CST_TYPE: string | null;
    SOFT_VERSION: string;
    SUB_SYS: string;
    blankColumn: number;
    isPrepend: string;
    rn__: number;
};

export type CstList = {
    AKey: string;
    Archive_Count: number;
    BKey: string;
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    CST_PWD: string;
    CST_RMK: string;
    CST_TYPE: string;
    CST_TYPE_CODE: string;
    CST_TYPE_NAME: string;
    ClientAddr: string;
    ClientTitle: string;
    DB_DOT: string;
    DB_FLAG: string;
    DKey: string;
    DST_ID: string;
    DST_NAME: string;
    EKey: string;
    EncryptedData: string;
    FACTORY_NO: string;
    FAC_NAME: string;
    MKey: string;
    MeterPwd: string;
    NODE_NAME: string;
    NODE_NO: string;
    PSK: string;
    SECTION_NAME: string;
    SECURITY_LEVEL: number;
    SN_CST_TYPE: string;
    SecurityPolicy: string;
    isPrepend: string;
    modify_time: string;
};

export type CstGroupMeterList = {
    CLASSICAL_DETAIL_GUID: string;
    CLASSICAL_DETAIL_NAME: string;
    CST_ADDR: string;
    CST_ID: string;
    DST_ID: string;
    DST_NAME: string;
};

export type CstTypeJsonData = {
    CST_TYPE: string;
    CST_TYPE_NAME: string;
}

export type CstFacJsonData = {
    FAC_CODE: string;
    FAC_NAME: string;
}

export type LeftCstListParams = {
    page: number;
    rows: number;
    subSysNo: string;
    nodeNo: string;
    searchField?: string;
    fieldValue?: string;
    dcus?: string;
    sortName?: string;
    sortOrder?: string;
    cstId?: string;
}

export type SaveBatchCstParams = {
    updateRowsList: string;
    saveRowsList: string;
    delList: string;
    subSysNo: string;
}

export type GroupCstParams = {
    page: number;
    rows: number;
    dstId: string;
    groupId: string;
    deviceAddr: string;
}

export type SaveGroupListData = {
    rowList: string;
    leftRowList: string;
    classicalDetailGuid: string;
}

export type IsDcuRepParams = {
    subSysNo: string;
    cst_name: string;
    cst_addr: string;
    cst_id: string;
}
