type DcuType = {
    CST_TYPE: string;
    CST_TYPE_NAME: string;
    SN: string;
    SN_PROTOCAL: string;
}

type ProtocolType = {
    AFN: string;
    AFN_NAME: string;
}

type CstGroup = {
    CLASSICAL_DETAIL_GUID: string;
    CLASSICAL_DETAIL_NAME: string;
    GNAME: string;
}

type TaskRuleData = {
    AFN: string;
    AFN_NAME: string;
    CLASSICAL_DETAIL_NAME: string;
    CST_TYPE: string;
    CST_TYPE_NAME: string;
    EXTRA_PARAMETERS: string;
    FN_NAME: string;
    GROUP_GUID: string;
    IS_ENALBE: string;
    READ_MODE: string;
    REMARK: string;
    RULE_NAME: string;
    SN: string;
    SN_COMMAND: string;
    SN_METER_TYPE: string;
    SN_METER_TYPE_NAME: string;
    SN_PROTOCAL: string;
    STICK: number;
    rn__: number;
}

type TaskRuleList = {
    total: number;
    rows: TaskRuleData[];
}

type CommandData = {
    FN_NAME: string;
    SN: string;
}

type CommandType = {
    AFN: string;
    AFN_NAME: string;
    SN: string;
    SN_METER_TYPE: string;
}

type CstData = {
    CST_ADDR: string;
    CST_ID: string;
    CST_NAME: string;
    CST_NO: string;
    CST_PWD: string;
    CST_RMK: string;
    CST_TYPE: string;
    CST_TYPE_NAME: string;
    DB_DOT: string;
    FACTORY_NO: string;
    LOADED_STATUS: string;
    LOADED_TIME: number;
    SN_CST_TYPE: string;
    rn__: number;
}

type CstList = {
    total: number;
    rows: CstData[];
}

type LoadedTaskData = {
    AFN: string;
    AFN_NAME: string;
    CLASSICAL_DETAIL_GUID: string;
    CLASSICAL_DETAIL_NAME: string;
    EXTRA_PARAMETERS: string;
    FN: string;
    READ_MODE: string;
    REMARK: string;
    SN_METER_TYPE: string;
    rn__: number;
}

type LoadedTaskList = {
    total: number;
    rows: LoadedTaskData[];
}

type ReadResult = {
    AFN: string;
    DB_DOT: string;
    EXTRA_PARAMETERS: string;
    READ_MODE: string;
    SN: string;
}

type MeterData = {
    METER_NO: string;
}

export {
    CstGroup,
    DcuType,
    ProtocolType,
    TaskRuleData,
    TaskRuleList,
    CommandData,
    CommandType,
    CstData,
    CstList,
    LoadedTaskData,
    LoadedTaskList,
    ReadResult,
    MeterData,
};
