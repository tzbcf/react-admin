/* eslint-disable camelcase */
type TransformData = {
    DST_ID: string;
    DST_NAME: string;
    DST_NO: string;
    DST_SPEC: string;
    MODIFY_NODE_NO: string;
    CREATE_TIME: string;
    DST_ADDR: string;
    NODE_NAME: string;
    NODE_NO: string;
    REL_ID: string;
    SECTION_ID: string;
    SECTION_NAME: string;
    SUB_SYS: string;
    rn__: number;
}

type TransformDataList = {
    total: number;
    rows: TransformData[];
}

type TransformParam = {
    node_no?: string;
    guid?: string;
    section_name?: string;
    section_id?: string;
    dst_spec?: string;
    subSysNo?: string,
    dst_no?: string,
    dst_name?: string,
    dst_addr?: string,
    loop?: string,
    dst_type?:string,
}

type QueryTransformList = {
    subSysNo: string,
    page: number,
    rows:number,
}

export type GetDstListParasm = {
    subSysNo: string;
    nodeNo: string;
    sectionId?: string;
}

export type GetDstListData = {
    GNAME: string;
    ID: string;
    NAME: string;
}

export {
    TransformData,
    TransformDataList,
    TransformParam,
    QueryTransformList,
};
