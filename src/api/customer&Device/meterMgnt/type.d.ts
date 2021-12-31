/**
 * FileName : types.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-06 16:42:32
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type MeterRightParams = {
    subSysNo: string;
    meters: string;
    allToRight?: boolean;
    'L_Meter_No'?: string;
    'L_Meter_type'?: string;
    'R_Meter_type'?: string;
    'R_Meter_No'?: string;
    deviceId: string;
    DeviceType: string;
};

export interface MeterLeftParams extends MeterRightParams {
    page: number;
    rows: number;
}

export type LeftMeterRows = {
    DB_DOT: string;
    IS_LOCK: string;
    METER_GUID: string;
    METER_MODEL_NAME: string;
    METER_NO: string;
    isPrepend: string;
};

export interface RightMeterRows extends LeftMeterRows {
    CST_NAME: string;
}

export type DcuTypeData = {
    CST_TYPE_NAME: string;
    SN_METER_TYPE_NAME: string;
};

export type SaveSettingParams = {
    deviceId: string;
    leftMeterArrForTable: string;
    moveAllLeft: string;
    rightMeterArrForTable: string;
    subSysNo: string;
    updateMeterArry: string;
};

export type MetertDetailsParams = {
    meterRows: string;
    deviceId: string;
    subSysNo: string;
};

export type MeterDetailsData = {
    MeterGuid: string;
    data: string;
};

export type MeterGroupList = {
    GNAME: string;
    CLASSICAL_DETAIL_NAME: string;
    CLASSICAL_DETAIL_GUID: string;
};

export type GroupMeterList = {
    CLASSICAL_DETAIL_GUID: string;
    CLASSICAL_DETAIL_NAME: string;
    CST_ADDR: string;
    DST_ID: string;
    DST_NAME: string;
    METER_GUID: string;
    METER_NO: string;
};

export type GroupMeterParams = {
  'group_id': string;
  'dst_id'?: string;
  'meter_no'?: string;
  deviceAddr: string;
  subSysNo: string;
  page: number;
  rows: number;
}

export type ClassicalJsonData = {
    CLASSICAL_GUID: string;
    CLASSICAL_NAME: string;
}

export type SaveClassicalParams = {
    IsEnable: string;
    ClassicalDetailName: string;
    ClassicalDetailNo: string
    'sys_classical': string;
    subSysNo: string;
}

export type SaveGroupMetersParams = {
    classicalDetailGuid: string;
    leftRowList: string;
    rowList: string;
    subSysNo: string;
}

export type IsMeterAddressParams = {
    deviceId: string;
    subSysNo: string;
    ADDRESS: string;
    mguid: string;
}
