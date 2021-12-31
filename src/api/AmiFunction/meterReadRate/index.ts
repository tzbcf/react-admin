/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-08 16:30:40
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import * as types from './type.d';
import { ReturnPageData } from 'src/api/types';
import { GetDstListData } from 'src/api/basicData/transformMgt/type';
class MeterReadRate {
    getSchemetype (): Promise<types.SchemetypeList[]> {
        return get('/reading-ratio/scheme-type');
    }
    getRatioList (data: types.RatioListParam): Promise<ReturnPageData<types.RatioListData>> {
        return post('/reading-ratio/list', data);
    }
    getDstListJson (data: types.DstLsitParam): Promise<GetDstListData[]> {
        return get('/reading-ratio/dst-list-json', data);
    }
    getNotCommunicatingMeter (data: types.NotCommunicatingMeterParam): Promise<ReturnPageData<types.NotCommunicatingMeterData>> {
        return post('/reading-ratio/not-communication-meter', data);
    }
    exportSuccessRateExcelFile (data:any) {
        return get('/reading-ratio/export', data);
    }
}

export default new MeterReadRate();
