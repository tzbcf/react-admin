type LineLossStatistics = {
    checkMeterCount: number;
    checkMeterSum: number;
    clientMeterCount: number;
    clientMeterSum: number;
};

type SendCmdResult = {
    lineLossDate: string;
    taskNum: number;
};

type LineLossData = {
    CHECK_CAPTURE_DATA?: string;
    CHECK_METER_NO?: string;
    CLIENT_CAPTURE_DATA?: string;
    CREATE_DATE?: string;
    FROZEN_TYPE?: string;
    METER_ADDR?: string;
    METER_NO?: string;
    SN?: string;
    SN_CAPTURE_DATA?: string;
    SN_CHECK_METER?: string;
    SN_DEVICE?: string;
    SN_METER?: string;
    rn__?: number;
    CHECK_CST_NO?: string;
    CST_ADDR?: string;
    CST_NO?: string;
    CST_ID?: string;
    DIFF_CAPTURE_DATA?: string;
    METER_COUNT?: string;
    CHECK_METER_COUNT?: string;
    CLIENT_COUNT?: string;
    CLIENT_METER_COUNT?: string;
}

type LineLossList = {
    total: number;
    rows: LineLossData[];
}

export {
    LineLossStatistics,
    SendCmdResult,
    LineLossData,
    LineLossList,
};
