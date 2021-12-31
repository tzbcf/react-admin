/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-27 16:36:18
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


export type MeasurePointInfoParams = {
  page: number
  rows: number
  custName:string;
  sectionName:string;
  meterNo:string;
  measurepointNo:string;
  sqlSort: string;
  sqlOrder: string;
  status: string;
}

export type MeasurePointInfoData = {
  ADDRESS: string;
  CUSTOMER_NAME: string;
  CUSTOMER_NO: string;
  JLD_GUID: string;
  METER_NO:string;
  MODIFY_TIME: string;
  OPERATE_DATE: string;
  REMARK: string;
  SECTION_NAME: string;
}

export type UpdateMeasurePointParams = {
  address: string;
	'customer_NAME': string;
	'jld_GUID': string;
	'meter_NO': string;
	remark: string;
}
