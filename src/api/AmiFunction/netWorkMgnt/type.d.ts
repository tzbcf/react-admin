/**
 * FileName : type.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-30 16:31:44
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type PingResultParams = {
    pingType: number;
    page: number;
};

export type PingResultRow = {
    complete: number;
    deviceNo: string | null;
    deviceType: string | null;
    endTime: string;
    groupId: string;
    hesEndTime: string | null;
    hesStartTime: string | null;
    noList: string[];
    pingActualTotalTime: string;
    serialNo: string | null;
    startTime: string;
    status: string | null;
    success: number;
    total: number;
};

export type PingResultData = {
    pageSize: 10;
    sum: 0;
    list: PingResultRow[];
};

export type LinkTimesParams = {
    cstIds: string;
    startDay: string;
    endDay: string;
};

export type InitDataParams = {
    time: string;
    cstIds: string;
};

export type InitDataEdgesRows = {
    id: string | null;
    nodeType: string | null;
    source: string;
    target: string;
};

export type InitDataNodesRow = {
    hideLabel: string;
    id: string;
    label: string;
    meterAddr: string | null;
    meterGuid: string | null;
    meterId: string | null;
    name: string | null;
    no: string;
    nodeType: number;
    phase: string | null;
    semaphore: string | null;
};

export type InitDataList = {
    edges: InitDataEdgesRows[];
    maxNodes: null;
    nodes: InitDataNodesRow[];
};

export type CensusParams = {
    time: string;
    cstIds: string;
    page: number;
    dataSumFlag: number;
};

export type CensusRow = {
    cstName: string;
    cstNo: string;
    dstName: string;
    meterSum: number;
    offlineSum: number;
    onlineSum: number;
    sectionName: string;
};

export type CensusData = {
    list: CensusRow[];
    pageSize: number;
    sum: number;
};

export type PhaseCensusParams = {
    time: string;
    subsys: string;
    nodeNo: string;
    cstIds: string;
    page: number;
};

export type PhaseCensusRow = {
    cstName: string | null;
    cstNo: string | null;
    dstId: string;
    dstName: string;
    meterSum: number;
    offlineSum: number | null;
    onlineSum: number;
    phase: string | null;
    sectionName: string;
};

export type PhaseCensusData = {
    list: PhaseCensusRow[];
    pageSize: number;
    sum: number;
};

export type MeterListParams = {
    time: string;
    cstIds: string;
};

export type ToMeterListRow = {
    createTime: string | null;
    dcuName: string;
    dcuNo: string;
    meterAddr: string;
    phase: string | null;
    sectionName: string;
    semaphore: string | null;
    transformerName: string;
};

export type ToMeterListData = {
    list: [];
    pageSize: number;
    sum: number;
};

export type ExePingParams = {
    id: string;
    nodeType: number;
    groupId: string;
    no: string;
    count: number;
    size: number;
}

export type ExePingData = {
    result: number;
    sn: string;
    taskId: string;
}

export type HistoryDataParams = {
    meterAddr: string;
    startDay: string;
    endDay: string;
}

export type HistoryDataRow = {
    time: string;
    value: number;
}

export type HistoryData = {
    sum: number;
    pageSize: number;
    list: HistoryDataRow[] | null;
}
