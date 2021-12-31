type CstData = {
    rn__: number;
    SecurityPolicy: string;
    SECURITY_LEVEL: number;
    SN_CST_TYPE: string;
    SECTION_NAME: string;
    PSK: string;
    OPERATION: string;
    ONLINESTATUS: string;
    NTP_STATUS: string;
    NTP_SERVER_PORT: string;
    NTP_SERVER_ADDRESS: string;
    NTP_KEY: string;
    NTP_AUTHEN_TYPE: string;
    NODE_NAME: string;
    DST_NAME: string;
    DST_ID: string;
    CST_TYPE_NAME: string;
    CST_NO: string;
    CST_NAME: string;
    CST_ID: string;
    CST_ADDR: string;
    NTP_AUTHEN_TYPE: string;
}

type CstList = {
    total: number;
    rows: CstData[];
}

type NtpParam = {
    NTP_AUTHEN_TYPE: string;
    NTP_ENABLE: string;
    NTP_SERVER_ADDRESS: string;
    NTP_SERVER_PORT: string;
    SN: string;
}

type TaskGroup = {
    GROUP_NAME: string;
    GROUP_ID: string;
}

type TaskData = {
    BUILD_DATE: string;
    CST_NAME: string;
    IS_EXECUTED: string;
    IS_SUCCESS: string;
    METER_NO: string;
    PARAMETERS: string;
    RETURN_DATA: string;
    FUNC_TYPE: string;
    SN: string;
    rn__: number;
}

type TaskList = {
    total: number;
    rows: TaskData[];
}

export {
    CstData,
    CstList,
    NtpParam,
    TaskGroup,
    TaskList,
    TaskData,
};
