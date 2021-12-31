/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-17 10:07:09
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type ProgramsList = {
  ACTIVE_TIME: string;
  Create_Time: string;
  DEVICE_MODEL:string;
  DEVICE_MODEL_NAME:string;
  FTP_Port: string;
  File_Name: string;
  File_Type: string;
  Ftp_Path: string;
  IDENTIFIER: string;
  IP_Address: string;
  Password: string;
  Program_Name: string;
  RETRANS_TIMES: string;
  SN: string;
  UPGRADE_TYPE: string;
  User_Name: string;
  VERSION: string;
  rn__: number;
}

export type ProgramsData = {
  rows: [];
  total: number;
}

export type DeviceTypeData = {
  NAME: string;
  NO: string;
}

export type UpgradeInfoParams = {
  subSysNo: string;
  deviceModel: string;
  fileType: string;
  programName: string;
  area: string;
  sortGuid: string;
}

export type UpgradeInfoData = {
  dstName: string;
  failCount: number;
  lastCreationTime: string;
  sucessCount: number;
  totalCount: number;
}

export type AreaListData = {
  ID: string;
  NAME: string;
}

export type DeleteFilesParams = {
  rowsList: string;
  subSysNo: string;
}

export type GroupListParams = {
  startDate: string;
  endDate: string;
  sortName: string;
  sortOrder: string;
  programName: string;
}

export type GroupListRows = {
  GROUP_ID: string;
  GROUP_NAME: string;
  OPERATOR: string;
  PROGRAM_NAME: string;
  START_TIME: string;
  UPGRADE_TYPE: string;
  create_time: string;
}

export type GroupListData = {
  rows: GroupListRows[];
  total: number;
}

export type TaskListParams = {
  page: number
  rows: number
  sortOrder: string;
  groupId: string;
  status: string;
  subSysNo: string;
}

export type TaskList = {
  BUILD_DATE: string;
  COMPLETION_DATE: number;
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
  METER_ADDR: string;
  METER_GUID: string;
  METER_NO: string;
  NODE_NAME: string;
  NODE_NO: string;
  PSN: string;
  RETURN_DATA: string;
  SECTION_NAME: string;
  SN_CST_TYPE: string;
  UPGRADE_STATUS: string;
  UPGRADE_TYPE: string;
}

export type TaskData<T> ={
  SuccessCount: number;
  failCount: number;
  readyCount: number;
  unfinished: number;
  upgradeTime: number;
  upgradingCount: number;
  rows: T[];
  total: number;
}

export type UploadFileParams = {
  'deviceModel': string;
	'deviceModelName': string;
	'fileName': string;
	'fileType': string;
	'ftpIpAddress': string;
	'ftpIpPort': string;
	'ftpUserName': string;
	'ftpUserPwd': string;
	'identifier': string;
	'programName': string;
	'retransTimes': string;
	'subSysNo': string;
	'upgradeType': string;
	'version': string;
}

export type UpgradeDcuNewParams = {
  programList: string;
  deviceModel: string;
  fileType: string;
  programName: string;
  area: string;
  sortGuid: string;
  subSysNo: string;
}

export type UpgradeDcuNewData = {
  flag: string;
  mes: string;
}

export type UpgradeResendParams = {
  strlist: string;
  subSysNo: string;
}

export type FTPConnParams = {
  ftpIpAddress: string;
  ftpUserName: string;
  ftpUserPwd: string;
}
