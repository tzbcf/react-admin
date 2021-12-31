type SystemParamData = {
    PARAMETER_DESCRIPTION: string;
    PARAMETER_KEY: string;
    PARAMETER_NAME: string;
    PARAMETER_VALUE: string;
    SN: string;
    rn__: number;
}

type SystemParamList = {
    rows: SystemParamData[];
    total: number;
}

export {
    SystemParamData,
    SystemParamList,
};
