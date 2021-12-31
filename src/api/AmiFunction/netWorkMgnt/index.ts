/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-30 18:52:07
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { post } from 'src/api/http';
import types from './type';

class NetWorkMgnt {
    pingResult (data:types.PingResultParams): Promise<types.PingResultData> {
        return post('/network-management/ping-result', data);
    }
    getLinkTimes (data: types.LinkTimesParams): Promise<string[]|null> {
        return post('/network-management/link-times', data);
    }
    initData (data: types.InitDataParams): Promise<types.InitDataList> {
        return post('/network-management/init-data', data);
    }
    getCensus (data:types.CensusParams): Promise<types.CensusData> {
        return post('/network-management/census', data);
    }
    getPhaseCensus (data: types.PhaseCensusParams): Promise<types.PhaseCensusData> {
        return post('/network-management/phase-census', data);
    }
    getMeterList (data: types.MeterListParams): Promise<types.InitDataList> {
        return post('/network-management/meter-list', data);
    }
    getBelongToMeterList (dcuNo:string): Promise<types.ToMeterListData> {
        return post(`/network-management/belong-to-meter-list?dcuNo=${dcuNo}`);
    }
    exePing (data: types.ExePingParams): Promise<types.ExePingData> {
        return post('/network-management/exe-ping', data);
    }
    getMeterHistoryData (data: types.HistoryDataParams): Promise<types.HistoryData> {
        return post('/network-management/meter-history-data', data);
    }
}

export default new NetWorkMgnt();
