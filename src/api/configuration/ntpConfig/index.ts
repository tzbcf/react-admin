/* eslint-disable max-params */
import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class NtpConfigMgt {
    getCstList (page:number, rows:number, subSysNo: string, searchField:string, fieldValue:string, status:string, sortOrder:string, sortName:string): Promise<types.CstList> {
        return get('/devicentp/getCstList', {subSysNo, page, rows, searchField, fieldValue, status, sortOrder, sortName});
    }

    getNtpParam (): Promise<types.NtpParam[]> {
        return get('/devicentp/getNtpParam', {});
    }

    saveNtpParam (params:any): Promise<TaskMess> {
        return post('/devicentp/saveNtpParam', params);
    }

    sendCommand (params:any): Promise<TaskMess> {
        return post('/devicentp/sendCommand', params);
    }

    getReadResult (params:any): Promise<TaskMess> {
        return post('/devicentp/getReadResultValue', params);
    }

    getTaskGroup (startDate:string, endDate:string, taskType:string): Promise<types.TaskGroup[]> {
        return get('/random-read/task-group-by-module', {startDate, endDate, taskType});
    }

    getTaskList (page:number, rows:number, groupId: string, meterNo:string, sortOrder:string, parameters:string, sqlOrder:string): Promise<types.TaskList> {
        return get('/random-read/task-list-by-group', {groupId, page, rows, meterNo, sortOrder, parameters, sqlOrder});
    }

    resetTask (params:any): Promise<TaskMess> {
        return post('/random-read/reset-task', params);
    }

}

export default new NtpConfigMgt();
