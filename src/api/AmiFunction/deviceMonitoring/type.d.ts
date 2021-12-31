/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-26 18:35:58
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type DcuOnlineStatusData = {
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    DST_ID: string;
    FRT_PARA: number;
    MDL_CCID: string;
    NODE_NAME: string;
    REGISTERED_DATE: string | number;
    SN: string;
    SUB_SYS: string;
    rn__: number;
};

export type DcuOnlineStatusParams = {
    fieldValue: string;
    page: number;
    rows: number;
    searchField: string;
    searchNode: string;
    subSysNo: string;
};

export type MeterOnlineStatusParams = {
    meterNo: string;
    meterStatus: string;
    page: number;
    rows: number;
    searchNode: string;
    subSysNo: string;
    phase: string;
};

export type MeterOnlineStatusData = {
    CST_NO: string;
    CT: number;
    CUR_LEVAL: string | null;
    CUSTOMER_NAME: string;
    CUSTOMER_NO: string;
    DST_NAME: string;
    METER_ADDR: string;
    METER_NO: string;
    NODE_NAME: string;
    PT: 1;
    SECTION_NAME: string;
    SN_METER: string;
    blankColumn: number;
    meterStatus: string;
    rn__: number;
};

export type DcuOnlineLogData = {
    CST_IP: string;
    CST_NO: string;
    CST_STATUS: string;
    ID: string;
    STATUS_DATE: string;
    STATUS_DATE_FF: number;
    STATUS_TIME: number|string;
    SUB_SYS: string;
    rn__: number;
};

export type DcuOnlineLogParams = {
    cstNo: string;
    endDate: string;
    startDate: string;
    page: number;
    rows: number;
};
