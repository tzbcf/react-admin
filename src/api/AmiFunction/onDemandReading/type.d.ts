/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-30 14:06:28
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type ProtocolListParams = {
    subsys: string;
    deviceType: string;
    deviceId: string;
    obis: string;
};

export type ProtocolDataList = {
    AFN: string;
    DATA_FORMAT: string | null;
    DATA_TYPE: string | null;
    DEFAULT_VALUE: string | null;
    FN: string;
    INPUT_PARAM_COUNT: string;
    MAX_VALUE: string | null;
    MIN_VALUE: string | null;
    NAME: string;
    NO: string;
    OUTPUT_PARAM_COUNT: string;
    PROTOCAL_BYTE_DESE_SN: string | null;
    RESULT_DATA_FORMAT: string;
    RESULT_DATA_TYPE: string;
    SCHEME_NAME: string;
    SN_PROTOCAL_COMMAND: string;
    TYPE: string;
    UNIT: string;
};
export type ProtocolData = {
    deviceTypeName: string;
    deviceTypeNo: string;
    flag: string;
    list: ProtocolDataList[];
    protocalNo: string;
};

export type SendProtocalByCstParams = {
    strlist: string;
    groupId: string;
    'func_type'?: string;
    subSysNo: string;
};

export type BatchSendCommon = {
    sn: string;
    taskId: string;
};

interface SendProtocalByCstList extends BatchSendCommon {
    createTime: string;
    status: string;
}

export type SendProtocalByCstData<T> = {
    flag: string;
    mes: string;
    mes2: string | null;
    list: T[];
};

export type BatchRefreshData = {
    flag: string;
    param1: string;
    param2: string;
    param3: string;
    param4: string;
    param5: string;
    param6: string;
};

export type ProtocalCommand = {
    cmdParameter: string;
    groupId: string;
    meterItems: string;
    remark: string;
};

export type ResultValParams = {
    taskId: string;
    result: string;
    isSuccess: string;
    completeTime: string;
}

export type ResultValData = {
    flag: boolean
    param1: string | null;
    param2: string | null;
    param3:string | null;
    param4: string | null;
    param5: string | null;
    param6: string | null;
}
