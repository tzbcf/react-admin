/* eslint-disable camelcase */
/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-27 15:40:56
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type CustomerType = '1' | '2';

export type CustomerListParam = {
    page?: number;
    rows?: number;
    subSysNo?: string;
    status?: string;
    queryField?: string;
    queryValue?: string;
    meterNo?: string;
    sqlSort?: string;
    sqlOrder?: string;
    searchNode?: string;
    customerType?: CustomerType;
};

export type CustomerListData = {
    ADDRESS: null | string;
    ADDRESS1: null | string;
    ADDRESS2: null | string;
    ADDRESS3: null | string;
    ADDRESS4: null | string;
    ARREAR_LPS: null | string;
    ARREAR_PRINCIPAL: null | string;
    ARREAR_VAT: null | string;
    BELONG_AREA_ID: null | string;
    BELONG_ID: null | string;
    CAR_NUMBER: null | string;
    CREATE_TIME: string;
    CUSTOMER_FLAG: string;
    CUSTOMER_ID: number;
    CUSTOMER_NAME: string;
    CUSTOMER_NO: string;
    CUSTOMER_PWD: null | string;
    CUSTOMER_STATUS: null | string;
    CUSTOMER_TYPE: string;
    CUST_GUID: string;
    DATE_OF_CONNECTION: null | string;
    DB_DOT: null | string;
    DB_FLAG: null | string;
    EMAIL: null | string;
    FATHER_NAME: null | string;
    GOVT_CUSTOMER_NAME: null | string;
    HOUSE_ID: null | string;
    HOUSE_NO: null | string;
    IS_BLOCK: null | string;
    IS_GOVT: null | string;
    LAYER_NO: null | string;
    LINKMAN: null | string;
    LOCATION: null | string;
    METER_NO: string;
    MOBIL_PHONE: null | string;
    MODIFY_NODE_NO: null | string;
    MODIFY_TIME: string;
    MOTHER_NAME: null | string;
    MP_NO: string;
    NATIONAL_ID: null | string;
    NODE_NAME: string;
    NODE_NO: string;
    OLD_ACCOUNT_NO: null | string;
    OLD_METER_NO: null | string;
    ONECARD_USER: string;
    OPERATE_DATE: string;
    OPERATOR_GUID: null | string;
    OPERATOR_ID: null | string;
    PHONE: null | string;
    REL_CUSTOMER_NO: null | string;
    REMARK: null | string;
    RESERVED_ONE: null | string;
    RESERVED_THREE: null | string;
    RESERVED_TWO: null | string;
    ROOM_ID: null | string;
    SEX: null | string;
    SPOUSE_NAME: null | string;
    SUB_SYS: string;
    TOTAL_REST: number;
    UNIT_NO: null | string;
};

export type UpdateCustomer = {
    building: string;
	cust_GUID:string;
	customer_address:string;
	customer_lxr: string;
	customer_name: string;
	customer_no: string;
	customer_phone: string;
	customer_remark: string;
	customer_sms_phone: string;
	floor: string;
	house: string;
	nodeId: string;
	subSysNo:string;
	unit: string;
}
