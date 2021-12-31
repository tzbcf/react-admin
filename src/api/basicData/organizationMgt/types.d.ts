/* eslint-disable camelcase */
type OrganizationData = {
    id: string;
    level: string;
    limit: string;
    name: string;
    parentId: string;
    remark: string;
    sgcNo: string;
    alarmMsgValue: string;
    composeNo: string;
    children: OrganizationData[];
}

type OrganizationParams = {
    node_No?: string;
    subSysNo?: string,
    node_Name?: string,
    father_Node_No?: string,
    is_Sale?: string,
    remark?: string,
    is_Dept?: string,
    limit?: string,
    limitMin?: string,
    alarmMsgValue?: string,
    sys_no?: string,
    selectComposeNo?: string,
    encryptType_id?: string,
    selectDKGA?: string,
    compose_no?:string,
}

type OrganizationJson = {
    ID: string;
    FATHER_NODE_NO: string;
    COMPOSE_NO: string;
    NAME: string;
    DKGA: string;
    ENCRYPT_TYPE: string;
    SGC_NO: string;
    ALARM_MSG_VALUE: string;
}

type SGCData = {
    KMF_ID: string;
    MODULE_ID: string;
    SGC_NO: string;
    KEY_REGNO: string;
    SGC_NAME: string;
    SGC_TYPE: string;
    KEY_KRN: string;
    KEY_KEN: string;
    DKGA: string;
    KEY_BDTDATE: string;
    KEY_BDTTIME: string;
    KEY_VALUE: string;
}

type SGCDataList = {
    total: number;
    rows: SGCData[];
}

export {
    OrganizationData,
    OrganizationParams,
    OrganizationJson,
    SGCData,
    SGCDataList,
};
