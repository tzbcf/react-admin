/* eslint-disable camelcase */

type BatchNameJson = {
    ID: string;
    LEVEL1: number;
    NAME: string;
    PARENTID: string;
    key: string;
    title: string;
}

type InstoreMeterData = {
    ASSET_NO: string;
    BATCH_NO: string;
    COMPOSE_NO: string;
    CUR_NO: string;
    DB_DOT: string;
    DB_FLAG: string;
    EA: string;
    ENCRYP_TYPE: string;
    IF_USED: string;
    MEDIA_MODEL: string;
    METER_GUID_NO: string;
    METER_MODEL_NAME: string;
    METER_MODEL_NO: string;
    METER_NO: string;
    METER_NO_LENGTH: string;
    METER_NO_MODE: string;
    MODIFY_NODE_NO: string;
    MODIFY_TIME: string;
    MODULE_FW_VERSION: string;
    NUM_TOKENS: string;
    OPERATE_DATE: string;
    OPERATOR_NAME: string;
    REMARK: string;
    SOFT_VERSION: string;
    VOL_NO: string;
    rn__: number;
}

type InstoreMeterList = {
    rows: InstoreMeterData[];
    total: number;
}

type InstoreMeterParams = {
    page: number;
    rows: number;
    subSysNo: string;
    searchField?: string;
    fieldValue?: string;
    batchNo?: string;
}

type DelMeterParams = {
    subSysNo: string;
    id: string;
}

type BatchParams = {
    subSysNo: string;
    batchNo: string;
}

type BatchData = {
    BATCH_NAME: string;
    BATCH_NO: string;
    DEVICE_TYPE: string;
    DEVICE_TYPE_NAME: string;
    FACTORY_CODE: string;
    FACTORY_NAME: string;
    MAIN_MODULE_VERSION: string;
    MODULE_VERSION: string;
    SOFT_VERSION: string;
}

type BatchList = {
    total: number;
    rows: BatchData[];
}

interface UpdateMeterParams extends DelMeterParams {
    statusFlag: string;
}

interface UpdateBatchParams extends BatchParams {
    soft_version: string;
    module_fw_version: string;
}

type MeterRegisterType = {
    MEDIA_MODEL: string;
    METER_MODEL_SYS_NO: string;
    METER_MODEL_NAME: string;
    METER_GUID_NO: string;
    FACTORY_NO: string;
}

type MeterFactory = {
    FACTORY_NAME: string;
    FACTORY_NO: string;
    FACTORY_SHORTNAME: string;
}

type MeterBaseType = {
    METER_BASE_NAME: string;
    SN: string;
}

type MaxBatchNo = {
    flag: string;
    result: string;
}

type MeterAdd = {
    subSysNo: string;
    meter_batch_no: string;
    batchAddFlag: string;
    batch_name: string;
    meterFac: string;
    meterFacName: string;
    meterSort: string;
    meterType: string;
    meterTypeName: string;
    start_sn: string;
    end_sn: string;
    start_date: string;
    meter_batch_mode: string;
    batch_len: string;
    EA: string;
    NumTokens: string;
    ComposeNo: string;
    soft_version: string;
    module_fw_version: string;
    encryptionType: string;
    meterNoMode: string;
    meterNoLength: string;
    meterNoList?: string;
    isCusomerInstore?: string;
}

type QueryBatchInfo = {
    subSysNo: string;
    batchNo: string;
}

type QueryMeterRegisterType = {
    subSysNo: string;
    baseType: string;
}

type QueryBatchCount = {
    subSysNo: string;
    deviceType: string;
    pruduceDate: string;
}

export {
    BatchNameJson,
    InstoreMeterData,
    InstoreMeterList,
    InstoreMeterParams,
    UpdateMeterParams,
    DelMeterParams,
    BatchParams,
    BatchData,
    BatchList,
    UpdateBatchParams,
    MeterRegisterType,
    MeterFactory,
    MeterBaseType,
    MaxBatchNo,
    MeterAdd,
    QueryBatchInfo,
    QueryMeterRegisterType,
    QueryBatchCount,
}
;
