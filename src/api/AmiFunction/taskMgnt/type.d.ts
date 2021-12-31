/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-18 18:55:18
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


export type MeterListActionList = {
  AFN: string;
  AFN_NAME: string;
  BUILD_DATE: string;
  COMMAND_PRIORITY: number;
  COMPLETION_DATE: string;
  CST_ADDR: string;
  Execute_date: string;
  GROUP_ID: string;
  IS_EXECUTED: string;
  METER_ADDR: string;
  METER_NO: string;
  OPERATOR_NAME: string;
  RETURN_DATA: string;
  SN: string;
}

export type MeterListActionParams = {
  afn: string;
  dcuIds: string;
  endDateTime: string;
  excuteStatus: string;
  excuteResult: string;
  meterIds: string;
  operator: string;
  page: number;
  rows: number;
  sortName: string;
  sortOrder: string;
  startDateTime: string;
  taskType: string;
  subsysNo: string;
}

export type OperateListParams = {
  dcuIds: string;
  endDateTime: string;
  excuteStatus: string;
  excuteResult: string;
  meterIds: string;
  startDateTime: string;
  taskType: string;
}

export type OperateListData = {
  text: string;
  value: string;
}

export type TaskStopParams = {
  taskIdList: string;
  taskType: string;
}

export interface TaskPriorityParams extends TaskStopParams {
  priorityValue: string;
}

export interface TaskSetExucuteTimeParams extends TaskStopParams {
  planDateTime: string;
}
