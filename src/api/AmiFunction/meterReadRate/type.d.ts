/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-08 16:25:32
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type NotCommunicatingMeterData = {
    CREATE_TIME: string;
    CST_NAME: string;
    CST_NO: string;
    DST_NAME: string;
    DST_NO: string;
    METER_ADDR: string;
    METER_NO: string;
    rn__: number;
};

export type RatioListData = {
    CST_ADDR: string;
    CST_ID: string;
    CST_METER_NUM: number;
    CST_NAME: string;
    CST_NO: string;
    CST_TYPE: string;
    DST_ID: string;
    DST_NAME: string;
    DST_NO: string;
    FAILED_DATA_NUM: number;
    FROZEN_DATE: string;
    LOAD_METER_NUM: number;
    NODE_NAME: string;
    NODE_NO: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SUB_SYS: string;
    SUCCESS_RATIO: number;
    TOTAL_METER_NUM: number;
    VALID_DATA_NUM: number;
    rn__: number;
};

export type RatioListParam = {
    page: number;
    rows: number;
    sn_PROTOCOL_COMMAND: string;
    searchDate: string;
    searchField: string;
    fieldValue: string;
    searchNode: string;
    dstId: string;
    subSysNo: string;
};

export type SchemetypeList = {
    afn: string;
    afn_name: string;
};

export type DstLsitParam = {
    nodeNo: string;
    subSysNo: string;
}

export type NotCommunicatingMeterParam = {
    dstId: string;
	endDate: string;
	page: number;
	rows: number;
	startDate: string;
	subsys: string;
}
