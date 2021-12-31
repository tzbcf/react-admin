/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-02 16:27:59
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type MeterlistParams = {
    afn: string;
    date: string;
    dstId: string;
	fieldValue: string;
	searchField: string;
	stationId: string;
    status: string;
    commandType: string;
    subsysNo: string;
}

export type MeterListData = {
    AFN_NAME: string;
    CHECK_POINT_NUM: string;
    CST_ADDR: string;
    CST_ID: string;
    DSTATUS: string;
    DST_ID: string;
    FREEZEN_VALUE: string;
    KEY: string;
    METER_ADDR: string;
    METER_NO: string;
    SN_METER: string;
    SN_METER_TYPE: string;
    SN_PROTOCOL_COMMAND_READ: string;
    SORT_GUID: string;
};

export type NodeByLoginUserData = {
    ID: string;
    NAME: string;
    PARENTID: string;
    level1: number;
};

export type MeterTypeList = {
    CST_TYPE: string;
    CST_TYPE_NAME: string;
}

export type TaskByMeterTypeData = {
    AFN: string;
    AFN_NAME: string;
    AFN_TYPE: string;
    COMMAND_TYPE: string;
}

export type SupDataParams = {
    meters: string;
    subsysNo: string;
    groupId: string;
}
