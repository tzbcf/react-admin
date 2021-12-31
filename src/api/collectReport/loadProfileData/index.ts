import {get, post} from 'src/api/http';
import * as types from './types';

class LoadProfileDataMgt {
    getMeterTypeList (subSysNo: string): Promise<types.MeterType[]> {
        return get('/schemereport/getMeterTypeList', {subSysNo});
    }

    getSchemeList (subSysNo: string, meterType:string): Promise<types.SchemeData[]> {
        return get('/schemereport/getSchemeList', {subSysNo, meterType});
    }

    getDataList (params:any): Promise<types.LoadProfileData> {
        return post('/schemereport/getListByDataType', params);
    }
}

export default new LoadProfileDataMgt();
