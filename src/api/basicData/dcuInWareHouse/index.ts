/* eslint-disable camelcase */
import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class InstoreDCUMgt {
    instoreDCUList (params: any): Promise<types.InstoreDCUList> {
        return post('/stsinstore/getInstoreDCUList', params);
    }

    batchDCUList (subSysNo: string): Promise<types.BatchNameJson[]> {
        return get('/stsinstore/dcuBatchNameJson', { subSysNo });
    }

    delDCU (params:types.DelDCUParams): Promise<TaskMess> {
        return post('/stsinstore/delDcuInstore', params);
    }

    delBatch (params:types.BatchParams): Promise<TaskMess> {
        return post('/stsinstore/delDcuInstoreByBatchNo', params);
    }

    dcuFactory (subSysNo:string): Promise<types.DcuFactory[]> {
        return get('/stsinstore/getCstFacJson', {subSysNo});
    }

    dcuType (fac_code:string): Promise<types.DcuType[]> {
        return get('/stsinstore/getCstTypeJson', {fac_code});
    }

    saveDcuStatus (params:types.UpdateDcuParams): Promise<TaskMess> {
        return post('/stsinstore/saveDcuStatus', params);
    }

    saveBatchVersion (params:types.UpdateBatchParams): Promise<TaskMess> {
        return post('/stsinstore/batchUpdateDcu', params);
    }

    addBatchDcu (params:types.DcuAdd): Promise<TaskMess> {
        return post('/stsinstore/batchAddDcuNo', params);
    }
}
export default new InstoreDCUMgt();
