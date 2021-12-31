/* eslint-disable camelcase */
type FeederData = {
    rn_: number;
    CREATE_TIME: string;
    NODE_NAME: string;
    REMARK: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SECTION_NO: string|'0';
    FEDR_SPEC: string;
    MODIFY_NODE_NO: string;
}

type FeederDataJson = {
    GNAME: string;
    ID: string;
    NAME: string;
    NODE_NO: string;
}

type FeederListParam = {
    page: number;
    rows: number;
    subSysNo: string;
    searchNode: string;
    feederId: string;
}

type FeederDataList = {
    total: number;
    rows: FeederData[];
}

type FeederSaveParam = {
    node_no?: string;
    remark?: string;
    guid?: string;
    section_name?: string;
    section_no?: string;
    fedr_spec?: string;
    subSysNo?:string,
}

export {
    FeederData,
    FeederDataList,
    FeederListParam,
    FeederSaveParam,
    FeederDataJson,
};
