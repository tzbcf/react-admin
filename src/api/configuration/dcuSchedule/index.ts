/* eslint-disable camelcase */
import {get, post} from 'src/api/http';
import * as types from './types';
// import { TaskMess } from '../../types';

class DcuScheduleMgt {
    getDcuTypeList (): Promise<types.DcuType[]> {
        return get('/taskRule/getDcuTypeList', {});
    }

    getProtocolTypeList (dcuType:string, subSysNo:string): Promise<types.ProtocolType[]> {
        return get('/taskRule/getProtocolTypeListJson', {dcuType, subSysNo});
    }

    getCstTypeList (subSysNo:string): Promise<types.CstGroup[]> {
        return get('/taskRule/getGroupListJson', {subSysNo});
    }

    getTaskRuleList (page:number, rows:number, dcuType:string, period:string, protocolType:string, Group_id:string, subSysNo:string): Promise<types.TaskRuleList> {
        return get('/taskRule/getCfgTaskRuleList', {page, rows, dcuType, period, protocolType, Group_id, subSysNo});
    }

    getSettings (): Promise<string[]> {
        return get('/taskRule/getSetting', {});
    }

    saveSettings (params:any): Promise<string> {
        return post('/taskRule/saveSetting', params);
    }

    tryFtpConnection (params:any): Promise<string> {
        return post('/taskRule/tryFTPConn', params);
    }

    loadTaskRule (params:any): Promise<string> {
        return post('/taskRule/loadCfgTaskRule', params);
    }

    deleteTaskRule (params:any): Promise<string> {
        return post('/taskRule/delCfgTaskRule', params);
    }

    getCommandList (dcuType:string, commandType:string): Promise<types.CommandData[]> {
        return get('/taskRule/getCommandListJson', {dcuType, commandType});
    }

    getCommandTypeList (dcuType:string, snMeterType:string): Promise<types.CommandType[]> {
        return get('/taskRule/getCommandTypeListJson', {dcuType, snMeterType});
    }

    addTaskRule (params:any): Promise<string> {
        return post('/taskRule/addCfgTaskRule', params);
    }

    editTaskRule (params:any): Promise<string> {
        return post('/taskRule/editCfgTaskRule', params);
    }

    getCstList (page:number, rows:number, searchField:string, fieldValue:string, existFailTask:string, subSysNo:string): Promise<types.CstList> {
        return get('/taskRule/getCstList', {page, rows, searchField, fieldValue, existFailTask, subSysNo});
    }

    getLoadedTaskList (page:number, rows:number, cstType:string, cstId:string): Promise<types.LoadedTaskList> {
        return get('/taskRule/getLoadedTaskList', {page, rows, cstType, cstId});
    }
    resendFailTask (params:any): Promise<string> {
        return post('/taskRule/resendFailTask', params);
    }

    readDcuTaskRule (params:any): Promise<string> {
        return get('/taskRule/readCfgTaskRule', params);
    }

    getReadResult (cstid:string, taskId:string): Promise<types.ReadResult[]> {
        return get('/taskRule/getReadResult', {cstid, taskId});
    }

    getTaskMeterList (CLASSICAL_DETAIL_GUID:string): Promise<types.MeterData[]> {
        return get('/taskRule/getTaskMeterList', {CLASSICAL_DETAIL_GUID});
    }
}

export default new DcuScheduleMgt();
