type DcuAlarmEvent = {
    rn__: number;
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    CST_TYPE: string;
    DEVICE_TYPE: string;
    DST_ADDR: string;
    DST_ID: string;
    DST_NAME: string;
    DST_NO: string;
    EVENT_CONTENT: string;
    EVENT_DESC: string;
    IS_IMPORTANT_EVENT: string;
    NODE_NAME: string;
    NODE_NO: string;
    OCCUR_DATETIME: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SECTION_NO: string;
    SN: string;
    SN_DEVICE: string;
    STATION_ID: string;
    STATUS: string;
    STATUS_DESC: string;
}

type DcuAlarmEventList = {
    total: number;
    rows: DcuAlarmEvent[];
}

export {
    DcuAlarmEvent,
    DcuAlarmEventList,
};
