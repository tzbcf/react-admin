type SchemeProfileData = {
    ACTIVE_DATE_TIME: string;
    SCHEME_NAME: string;
    SCHEME_SN: string;
    rn__: number;
}

type SchemeProfileList = {
    total: number;
    rows: SchemeProfileData[];
}

type SeasonProfileData = {
    CREATE_TIME: string;
    SEASON_SN: string;
    SEASON_TABLE_NAME: string;
    START_TIME: string;
    WEEK_NAME: string;
    REMARK: string;
    rn__: number;
}

type SeasonProfileList = {
    total: number;
    rows: SeasonProfileData[];
}

type WeekProfileData = {
    CREATE_TIME: string;
    WEEK_NAME: string;
    WEEK_SN: string;
    FR: string;
    MO: string;
    SA: string;
    SU: string;
    TH: string;
    TU: string;
    WE: string;
    rn__: number;
}

type WeekProfileList = {
    total: number;
    rows: WeekProfileData[];
}

type DayProfileData = {
    CREATE_TIME?: string;
    rn__?: number;
    DAY_GROUP_SN?: string;
    DAY_IDX?: string;
    DAY_TIME_BUCKET_NO: string;
    SCRIPT_LOGICAL_NAME: string;
    SCRIPT_SELECTOR: string;
    START_TIME?: string;
}

type DayProfileList = {
    total: number;
    rows: DayProfileData[];
}

type WebSocketMessage = {
    flag: boolean;
    mess: string;
}

export {
    SchemeProfileData,
    SchemeProfileList,
    SeasonProfileData,
    SeasonProfileList,
    WeekProfileList,
    WeekProfileData,
    DayProfileData,
    DayProfileList,
    WebSocketMessage,
};
