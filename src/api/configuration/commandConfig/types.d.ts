type DeviceSubType = {
    DEVICE_SUB_TYPE: string;
    DEVICE_SUB_TYPE_NAME: string;
}

type CommandEditData = {
    AFN: string;
    AFN_NAME: string;
    FN: string;
    SCALE: string;
    SN: string;
    UNIT: string;
}

type CommandScheme = {
    SCHEME_NAME: string;
}

type LeftCommandData = {
    L_AFN: string;
    L_AFN_NAME: string;
    L_FN: string;
    SN: string;
}

type RightCommandData = {
    R_AFN: string;
    R_AFN_NAME: string;
    R_FN: string;
    SN: string;
    SCHEME_NAME: string;
}

type UploadProgress = {
    msg: string;
    CUR_IDX: number;
    TOTAL_CNT: number;
}

export {
    DeviceSubType,
    CommandEditData,
    LeftCommandData,
    RightCommandData,
    CommandScheme,
    UploadProgress,
};
