/* eslint-disable camelcase */
type BatchNameJson = {
    ID: string;
    LEVEL1: number;
    NAME: string;
    PARENTID: string;
    key: string;
    title: string;
}

type InstoreDCUData = {
    BATCH_NO: string;
    CREATE_TIME: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    CST_TYPE_CODE: string;
    CST_TYPE_NAME: string;
    DB_DOT: string;
    DB_FLAG: string;
    FACTORY_NO: string;
    IF_USED: string;
    MAIN_MODULE_VERSION: string;
    MODIFY_TIME: string;
    MODULE_FW_VERSION: string;
    PRODUCE_DATE: string;
    OPERATOR_NAME: string;
    SN_CST_TYPE: string;
    SOFT_VERSION: string;
    rn__: number;
}

type InstoreDCUList = {
    rows: InstoreDCUData[];
    total: number;
}

type DelDCUParams = {
    subSysNo: string;
    dcuNos: string;
}

type BatchParams = {
    subSysNo: string;
    batchNo: string;
}

type DcuFactory = {
    FAC_NAME: string;
    FAC_CODE: string;
}

type DcuType = {
    CST_TYPE_NAME: string;
    CST_TYPE: string;
}

interface UpdateDcuParams extends DelDCUParams {
    statusFlag: string;
}

interface UpdateBatchParams extends BatchParams {
    dcu_soft_version: string;
    dcu_module_fw_version: string;
    dcu_main_module_version: string;
}

type DcuAdd = {
    subSysNo: string;
    dcu_batch_name: string;
    batchAddFlag: string;
    dcu_meterFac: string;
    dcu_meterFacName: string;
    dcu_meterType: string;
    dcu_meterTypeName: string;
    dcu_start_meter_no: string;
    dcu_end_meter_no: string;
    dcu_start_date: string;
    dcu_soft_version: string;
    dcu_module_version: string;
    dcu_main_module_version: string;
    dcu_total_meter_num: string;
    dcu_meter_batch_no: string;
}

export {
    BatchNameJson,
    InstoreDCUData,
    InstoreDCUList,
    DelDCUParams,
    BatchParams,
    DcuFactory,
    DcuType,
    UpdateBatchParams,
    UpdateDcuParams,
    DcuAdd,
}
;
