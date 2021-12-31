/**
 * FileName : index.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-28 16:39:36
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export interface SystemVersion {
    PARAMETER_KEY: string;
    PARAMETER_VALUE: string;
}

export interface GetAlarmList {
    ALARM_TYPE: string;
    DEVICE_ADDRESS: string;
    DEVICE_NO: string;
    DEVICE_TYPE: string;
    OCCUR_DATETIME: string|number;
    SN: string;
    STATUS: string;
}

export interface updateAlarm {
    guid: string;
    alarmType: string;
}

export interface MenuTree {
    id: string;
    menuKey: string;
    text: string;
    children?: MenuTree[];
}

export interface DeviceTreeParams {
    page: number;
    rows: number;
    level: number | string;
    searchField: string;
    fieldValue: string;
    deviceStatus: string;
}

export type DeviceChildData = {
    CST_ID: string;
    address: string;
    deviceGuid: string;
    deviceId: string;
    deviceModel: string;
    deviceName: string;
    deviceNo: string;
    metermodelno: string;
    nodeType: string;
    parentId: string;
    protocalType: string;
    typeAbbr: string;
};

export type DeviceTreeRows = {
    CST_ADDR: string;
    CST_ID: string;
    TYPE_ABBR: string;
    address: string;
    // eslint-disable-next-line camelcase
    cst_name: string;
    // eslint-disable-next-line camelcase
    cst_no: string;
    deviceGuid: string;
    deviceId: string;
    deviceModel: string;
    deviceName: string;
    deviceNo: string;
    nodeType: string;
    onlineStatus: string;
    parentId: string;
    rn__: string;
    children?: DeviceChildData[];
};

export interface DeviceTreeData {
    offlineTotal: number;
    onlineTotal: number;
    rows: DeviceTreeRows[];
    total: number;
}

export type DeviceChildParams = {
    id: string;
    nodeType: string;
    chiledNodeType: string;
};

export type MeterInfoParams = {
    METERNO: string;
    METERADDRESS?: string;
    METERGUID?: string;
};

export type MeterScheduleInfoData = {
    Remark: string;
    AFN: string;
    AFN_NAME: string;
    FN: string;
    Parameters: string;
    READ_MODE: string;
};

export type MeterBaseInfoData = {
    ASSET_NO: string;
    CST_NAME: string;
    CUSTOMER_NO: string;
    DST_NAME: string;
    FAC_NAME: string;
    INSTORE_TIME: string;
    MEASURE_POINT_NO: string;
    METER_MODEL_NAME: string;
    METER_NO: string;
    NODE_NAME: string;
    SECTION_NAME: string;
};

export type MeterAMIInfoDataList = string | number;
export type MeterAMIInfoDataTitleList = {
    CST_TYPE_NAME: string;
    ENUM_LIST: string;
    PROTOCAL_NAME: string;
    XU_HAO: string;
};

export type MeterAMIInfoData = {
    dataList: MeterAMIInfoDataList[][];
    titleList: MeterAMIInfoDataTitleList[];
};

export type DCUAmiParams = {
    dcuAddress?: string;
    dcuName?: string;
    dcuGuid: string;
};

export type DCUBaseData = {
    CST_ADDR: string;
    CST_CREATE_TIME: string;
    CST_ID: string;
    CST_IP: string | null;
    CST_NAME: string;
    CST_NO: string;
    CST_REGISTERED_COUNT: number;
    CST_RMK: string;
    CST_TOTAL_COUNT: number;
    CST_TYPE_NAME: string;
    DST_NAME: string;
    INSTORE_TIME: string;
    NODE_NAME: string;
    SECTION_NAME: string;
};

type DCUAmiDataList = {
  AKey: string;
  BKey: string;
  CST_ADDR: string;
  ClientAddr: string;
  ClientTitle: string;
  DKey: string;
  EKey:string;
  EncryptedData: string;
  MKey: string;
  MeterPwd: string;
  PSK: string;
  SECURITY_LEVEL: number;
  SecurityPolicy: string;
}

export type DCUAmiData = {
  dataList: DCUAmiDataList[];
  titleList: MeterAMIInfoDataTitleList[]
}

export type DCULogData = {
  CST_IP: string;
  CST_NO: string;
  CST_STATUS: string;
  STATUS_TIME: string;
}

export type MeterNodeByDcuIdParams = {
    dcuId: string;
    nodeType: string;
}

export type NodeByLoginUserData = {
    ID: string;
    NAME: string;
    PARENTID: string;
    level1: number;
};
