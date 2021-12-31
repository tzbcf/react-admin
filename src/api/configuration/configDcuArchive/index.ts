import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class ConfigDcuArchive {
    getDcuAccountInfo (dcuId:string, subSysNo:string, random:string): Promise<types.DCUAccountInfo[]> {
        return get(`/loadingfiles/getDCUAccountInfo?${random}`, {dcuId, subSysNo});
    }

    getMeterListByDcu (page:number, rows:number, dcuId:string, subSysNo:string): Promise<types.MeterList> {
        return get('/loadingfiles/getMeterListByDcuId', {page, rows, dcuId, subSysNo});
    }

    getOperationList (page: number, rows: number, subSysNo: string, operation: string, dstId:string): Promise<types.OperationList> {
        return get('/loadingfiles/operationList', {page, rows, subSysNo, operation, dstId});
    }

    getLoadingResult (groupid:string): Promise<string[]> {
        return get('/loadingfiles/getLoadingFileResult', {groupid});
    }

    refreshMeterList (strlist:string): Promise<types.MeterList> {
        return get('/loadingfiles/refreshList', {strlist});
    }

    getCstParamInfo (cstid:string, mguid:string): Promise<types.ParamInfo[]> {
        return get('/loadingfiles/getCstProtocalParamInfo', {cstid, mguid});
    }

    operationAll (params:any): Promise<TaskMess> {
        return post('/loadingfiles/operationAll', params);
    }

    installArchive (params:any): Promise<TaskMess> {
        return post('/loadingfiles/install', params);
    }

    uninstallArchive (params:any): Promise<TaskMess> {
        return post('/loadingfiles/uninstall', params);
    }

    resetArchive (params:any): Promise<TaskMess> {
        return post('/loadingfiles/reset', params);
    }

    sendReadCommand (params:any): Promise<string> {
        return post('/loadingfiles/sendReadCmd', params);
    }

    fileCompare (params:any): Promise<types.FileCompareResult[]> {
        return post('/loadingfiles/fileCompare', params);
    }

}

export default new ConfigDcuArchive();
