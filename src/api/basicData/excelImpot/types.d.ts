type ExcelSchemeData = {
    CHECK_FAIL_ROWS: string;
    CHECK_SUCC_ROWS: string;
    CREATE_TIME: string;
    FILE_ID: string;
    FILE_TYPE: string;
    IMPORT_FAIL_ROWS: string;
    IMPORT_SUCC_ROWS: string;
    METER_GUID: string;
    METER_NO: string;
    NODE_NO: string;
    OPERATOR_GUID: string;
    SCHEME_NAME: string;
    STATUS: string;
    TOTAL_ROWS: string;
    rn__: number;
}

type ExcelSchemeList = {
    total: number;
    rows: ExcelSchemeData[];
}

type ExcelData = {
    CREATE_TIME: string;
    DST_NAME: string;
    FIELD_001: string;
    FIELD_002: string;
    FIELD_003: string;
    FIELD_004: string;
    FIELD_005: string;
    FIELD_006: string;
    FIELD_007: string;
    FIELD_008: string;
    FIELD_009: string;
    NODE_NAME: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SN: string;
}

type ExcelDataList = {
    total: number;
    rows: ExcelData[];
}

export {
    ExcelSchemeData, ExcelSchemeList, ExcelData, ExcelDataList,
};
