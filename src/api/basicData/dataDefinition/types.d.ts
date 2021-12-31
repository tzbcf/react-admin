/* eslint-disable camelcase */
type ClassificationType = {
    CLASSICAL_GUID: string;
    CLASSICAL_NAME: string;

}

type ClassificationData = {
    rn__: number;
    CLASSICAL_CODE: string;
    CLASSICAL_GUID: string;
    CLASSICAL_NAME: string;
}

type ClassificationList = {
    total: number;
    rows: ClassificationData[];
}

type ClassificationDetail = {
    rn__: number;
    CLASSICAL_DETAIL_CODE: string;
    CLASSICAL_DETAIL_GUID: string;
    CLASSICAL_DETAIL_NAME: string;
    CLASSICAL_GUID: string;
    IS_ENABLE: string;

}

type ClassificationDetailList = {
    total: number;
    rows: ClassificationDetail[];
}

type ClassificationParams = {
    subSysNo: string;
    page: number;
    rows: number;
    queryValue?: string;
}

type AddClassification = {
    subSysNo?: string;
    classification_name: string;
    classification_no: string;
    classification_guid?: string;
}

type AddClassificationDetail = {
    code_no: string;
    code_name: string;
    classification_detail_guid?: string;
    is_enable: string;
    classificationGuid?: string;
}

export {
    ClassificationType,
    ClassificationData,
    ClassificationList,
    ClassificationDetail,
    ClassificationDetailList,
    ClassificationParams,
    AddClassification,
    AddClassificationDetail,
};
