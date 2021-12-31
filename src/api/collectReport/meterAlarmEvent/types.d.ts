type MeterModeNo = {
    METER_MODEL_NAME: string;
    METER_MODEL_NO: string;
}

type MeterAlarmOption = {
    WORD_NAME: string;
    WORD_NAME_EN: string;
    WORD_SEQ: string;
}

type MeterAlarmEvent = {
    BIT_LEN: number;
    CHECK_POINT_NUM: string;
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CUSTOMER_NAME: string;
    DST_NAME: string;
    JLD_GUID: string;
    METER_ADDR: string;
    METER_GUID: string;
    METER_NO: string;
    OCCUR_DATETIME: string;
    REGISTER_TIME: string;
    SN: string;
    STATUS: string;
    WORD_NAME: string;
    WORD_NAME_EN: string;
    WORD_SEQ: string;
}

type MeterAlarmEventList = {
    total: number;
    rows: MeterAlarmEvent[];
}

export {
    MeterModeNo,
    MeterAlarmOption,
    MeterAlarmEvent,
    MeterAlarmEventList,
};
