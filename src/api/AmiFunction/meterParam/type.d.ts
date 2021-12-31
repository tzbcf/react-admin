/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-05 15:33:17
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type MeterParamList = {
    AttributeMethod: string;
    Class: string;
    Obis: string;
    Parameter: string;
    ServiceType: string;
    Value: string;
};

export type GroupListParams = {
    startDate: string;
    endDate: string;
    programName: string;
    sortName: string;
    sortOrder: string;
};

export type GroupListData = {
    GROUP_ID: string;
    create_time: number;
    START_TIME: string;
    OPERATOR: string;
    GROUP_NAME: string;
    PROGRAM_NAME: string;
    UPGRADE_TYPE: string;
};

export type ProgramListData = {
    rn__: number;
    SN: string;
    Program_Name: string;
    UPGRADE_TYPE: string;
    File_Type: string;
    DEVICE_MODEL: string;
    DEVICE_MODEL_NAME: string;
    ACTIVE_TIME: string;
    IDENTIFIER: string;
    VERSION: string;
    IP_Address: string;
    FTP_Port: string;
    User_Name: string;
    Password: string;
    Ftp_Path: string;
    File_Name: string;
    Create_Time: string;
};

export type SaveProgramParams = {
    activeDate: string;
    deviceModel: string;
    deviceModelName: string;
    fileName: string;
    fileType: string;
    ftpIpAddress: string;
    ftpIpPort: string;
    ftpUserName: string;
    ftpUserPwd: string;
    programName: string;
    subSysNo: string;
};

export type AreaListData = {
    ID: string;
    NAME: string;
};

export type DeviceTypeList = {
    NO: string;
    NAME: string;
};

export type UpgradeFileParams = {
    area: string;
    groupId: string;
    param: string;
    programList: string;
    strlist: string;
    subSysNo: string;
};

export type UpgradeFileData = {
    flag: string;
    list: string[];
    mes: string;
    mes2: string | null;
};

export type TaskListParams = {
    page: number;
    rows: number;
    sortOrder: string;
    groupId: string;
    status: string;
    subSysNo: string;
};

export type TaskListRow = {
    BUILD_DATE: string;
    COMPLETION_DATE: string;
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    CST_PWD: string;
    CST_RMK: string;
    CST_TYPE: string;
    CST_TYPE_NAME: string;
    DST_ID: string;
    DST_NAME: string;
    FACTORY_NO: string;
    GROUP_ID: string;
    GROUP_NAME: string;
    METER_GUID: string;
    METER_NO: string;
    NODE_NAME: string;
    NODE_NO: string;
    PARAMETERS: string;
    PSN: string;
    RETURN_DATA: string;
    ROW: number;
    SECTION_NAME: string;
    SN_CST_TYPE: string;
    SN_TASK: string;
    UPGRADE_STATUS: string;
    UPGRADE_TYPE: string;
    rn__: number;
    seqNo: number;
};

export type TaskListData = {
    SuccessCount: number;
    failCount: number;
    readyCount: number;
    total: number;
    unfinished: number;
    upgradeTime: string;
    upgradingCount: number;
    rows: TaskListRow[];
};

export type tryFTPConnParams = {
    ftpIpAddress: string[];
	ftpUserName: string;
	ftpUserPwd: string;
	subSysNo: string;
}

export type DelFileImplParam = {
    subSysNo: string;
    rowsList: string;
}

export type ResendParams = {
    strlist: string;
    subSysNo: string;
    groupId: string;
}
