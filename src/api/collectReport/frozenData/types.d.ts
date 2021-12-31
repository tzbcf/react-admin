type FrozenData = {
    rn__: number;
    CHECK_POINT_NUM: string;
    CST_ADDR: string;
    CUSTOMER_NAME: string;
    DST_ID: string;
    FREEZEN_DATE: string;
    FREEZEN_VALUE: string;
    GROUP_ID: string;
    METER_NO: string;
    MODIFY_NODE_NO: string;
    POWER_FACTOR: string;
    REGISTER_TIME: string;
}

type FrozenDataList = {
    total: number;
    rows: FrozenData[];
}

export {
    FrozenData,
    FrozenDataList,
}
;
