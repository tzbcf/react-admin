type MeterTypeObj = {
    AFN_NAME: string;
    SN: string;
    GROUP_NAME: string;
    GROUP_TYPE_NAME: string;
    GROUP_ID: string;
    CAPTURE_OBJ_INDEX: number;
    CAPTURE_OBJ_OBIS: string;
    METER_TYPE: string;
}
type MeterTypeData = {
    AFN_NAME: string;
    CAPTURE_PERIOD: string;
    FN_NAME: string;
    GROUP_NAME: string;
    METER_TYPE: string;
    SN_METER_TYPE_NAME: string;
    SN_PROTOCAL: string;
    SN_PROTOCOL_COMMAND: string;
    STATUS_FLAG: string;
    meterTypeObj: MeterTypeObj[];
    IS_ENABLE: string;
    COMMAND_TYPE: string;
    THRESHOLD: string;
    SN: string;
    GROUP_ID: string;
    CAPTURE_IDX: string;
}

type MeterTypeList = {
    rows: MeterTypeData[];
    total: number;
}

type UploadProgress = {
    msg: string;
    CUR_IDX: number;
    TOTAL_CNT: number;
}

export {
    MeterTypeData,
    MeterTypeList,
    MeterTypeObj,
    UploadProgress,
};
