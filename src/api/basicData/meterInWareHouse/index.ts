import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class InstoreMeterMgt {
    instoreMeterList (params:any): Promise<types.InstoreMeterList> {
        return post('/stsinstore/getInstoreMeterList', params);
    }

    batchList (subSysNo:string): Promise<types.BatchNameJson[]> {
        return get('/stsinstore/batchNameJson', {subSysNo});
    }

    saveMeterStatus (params:types.UpdateMeterParams): Promise<TaskMess> {
        return post('/stsinstore/saveMeterStatus', params);
    }

    delMeter (params:types.DelMeterParams): Promise<TaskMess> {
        return post('/stsinstore/delInstore', params);
    }

    batchInfo (params:types.QueryBatchInfo): Promise<types.BatchList> {
        return get('/stsinstore/getBatchInfo', params);
    }

    saveBatchVersion (params:types.UpdateBatchParams): Promise<TaskMess> {
        return post('/stsinstore/batchUpdateMeter', params);
    }

    delBatch (params:types.BatchParams): Promise<TaskMess> {
        return post('/stsinstore/delInstoreByBatchNo', params);
    }

    maxBatchNo (subSysNo:string): Promise<types.MaxBatchNo> {
        return get('/stsinstore/getMaxBatchNo', {subSysNo});
    }

    meterBaseType (subSysNo:string): Promise<types.MeterBaseType[]> {
        return get('/iframe/getMeterBaseType', {subSysNo});
    }

    meterRegisterType (data:types.QueryMeterRegisterType): Promise<types.MeterRegisterType[]> {
        return get('/iframe/getMeterRegisterType', data);
    }

    meterFactory (subSysNo:string): Promise<types.MeterFactory[]> {
        return get('/iframe/getMeterFactory', {subSysNo});
    }

    batchCount (data:types.QueryBatchCount): Promise<string> {
        return get('/stsinstore/getBatchCount', data);
    }

    addBatchMeter (params:types.MeterAdd): Promise<TaskMess> {
        return post('/stsinstore/batchAddMeterNo', params);
    }
}
export default new InstoreMeterMgt();
