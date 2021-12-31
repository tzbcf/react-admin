type DCUAccountInfo = {
    CST_ADDR: string;
    CST_ID: string;
    INSTALLEDCOUNT: number;
    TOTALCOUNT: number;
    UNINSTALLEDCOUNT: number;
}

type MeterInfo = {
    CHECK_POINT_NUM: number;
    CST_ADDR: string;
    CST_ID: string;
    LOAD_METER_FLG: string;
    METER_ADDR: string;
    METER_GUID: string;
    METER_NO: string;
    PRODUCT_TYPE_NAME: string;
    SN_PROTOCAL: string;
}

type MeterList = {
    total: number;
    rows: MeterInfo[];
}

type OperationData = {
    CST_NO: string;
    METERS: number;
}

type OperationList = {
    total: number;
    rows: OperationData[];
}

type ParamInfo = {
    PROTOCAL_NAME: string;
    PARAMETER_VALUE: string;
}

type FileCompareResult = {
    PARAM_NAME: string;
    PARAM_VALUE: string;
}

export {
    DCUAccountInfo,
    MeterInfo,
    MeterList,
    OperationData,
    OperationList,
    ParamInfo,
    FileCompareResult,
};
