type MeterModel = {
    METER_MODEL_NAME: string;
    METER_MODEL_NO: string;
}

type AlarmConfigData = {
    BIT_LEN: number;
    SN: string;
    STATUS_DEFINE_EMUN: string;
    WORD_NAME: string;
    WORD_SEQ: number;
    rn__: string;
}

type AlarmConfigList = {
    total: number;
    rows: AlarmConfigData[];
}

type WebSocketMessage = {
    flag: boolean;
    mess: string;
}

export {
    MeterModel,
    AlarmConfigData,
    AlarmConfigList,
    WebSocketMessage,
};
