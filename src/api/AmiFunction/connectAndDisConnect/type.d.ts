/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-17 10:58:19
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type SelectedMeterList = {
    SN: string;
    METER_NO: string;
    CST_ADDR: string;
    METER_ADDR: string;
    CHECK_POINT_NUM: string;
    LAST_STATE: string;
    CST_ID: string;
    METER_GUID: string;
    METER_MODEL_NO: string;
    SN_METER_TYPE: string;
    SN_PROTOCAL: string;
    SN_STATUS?: string;
};

export type MeterListParams = {
    subSysNo: string;
    rowsList: string;
    page: number;
    rows: number;
};

export type MeterListData = {
    total: number;
    rows: SelectedMeterList[];
};

export type StateSynchronousParams = {
    cstStr: string;
    groupId: string;
    meterStr: string;
    subSysNo: string;
};

export type TaskGroupModuleParmas = {
    taskType: string;
    startDate: string;
    endDate: string;
};

export type TaskGroupModuleData = {
    GROUP_ID: string;
    GROUP_NAME: string;
};

export type TaskListParams = {
    page: number;
    rows: number;
    subSysNo: string;
    groupId: string;
}

export type TaskListGroupParams = {
    page: number;
    rows: number;
    sortName: string;
    sortOrder: string;
    groupId: string;
    meterNo: string;
    parameters: string;
};

export type TaskListRows = {
    AFN: string;
    AFN_NAME: string;
    BUILD_DATE: string;
    CST_NAME: string;
    CUSTOMER_NAME: string;
    CUSTOMER_NO: string;
    FUNC_TYPE: string | null;
    IS_EXECUTED: string;
    IS_SUCCESS: string;
    METER_NO: string;
    PARAMETERS: string;
    RETURN_DATA: string | null;
    SN: string;
    rn__: number;
};

export type TaskListData = {
    total: number;
    rows: TaskListRows[];
};

export type ResetTaskParams = {
    taskIds: string;
    groupId: string;
}

export type ConfirmUserParms = {
    pwd: string;
}

export type SendCmdByMeterParams = {
    subSysNo: string;
    xmldata: string;
}
