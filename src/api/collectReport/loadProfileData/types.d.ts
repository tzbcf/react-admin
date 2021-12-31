/* eslint-disable camelcase */
type MeterType = {
    ID: string;
    NAME: string;
}

type SchemeData = {
    FN: string;
    afn: string;
    afn_name: string;
    command_type: string;
    sn: string;
}

type TitleData = {
    capture_obj_index: string;
    afn_name: string;
    remark: string;
}

type LoadProfileData = {
    allRows: TitleData[];
    total: number;
    rows: any[];
}

export {
    MeterType,
    SchemeData,
    TitleData,
    LoadProfileData,
};
