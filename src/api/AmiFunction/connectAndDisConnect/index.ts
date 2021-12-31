/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-23 11:03:50
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { post, get } from 'src/api/http';
import * as types from './type';
import {TaskMess, TaskResult} from 'src/api/types.d';

class RemoteControl {
    getMeterList (data:types.MeterListParams): Promise<types.MeterListData> {
        return post('/remote-control/meters', data);
    }
    stateSynchronous (data:types.StateSynchronousParams): Promise<TaskMess> {
        return post('/remote-control/state-synchronous', data);
    }
    getTaskGroupByRemark (data: types.TaskGroupModuleParmas): Promise<types.TaskGroupModuleData[]> {
        return get('/random-read/task-group-by-module', data);
    }
    gettaskList (data:types.TaskListParams): Promise<types.TaskListData> {
        return get('/random-read/task-list', data);
    }
    getTaskListGroup (data: types.TaskListGroupParams): Promise<types.TaskListData> {
        return get('/random-read/task-list-by-group', data);
    }
    resetTask (data:types.ResetTaskParams):Promise<TaskMess> {
        return post('/random-read/reset-task', data);
    }
    confirmUser (data: types.ConfirmUserParms): Promise<TaskMess> {
        return post('/remote-control/confirm-user', data);
    }
    getGuid ():Promise<TaskMess> {
        return get('/remote-control/guid');
    }
    sendCmdByMeter (data:types.SendCmdByMeterParams):Promise<TaskMess> {
        return post('/remote-control/send-cmd-by-meter', data);
    }
    getMeterByTask (taskId:string): Promise<TaskResult> {
        return get(`/remote-control/meter-by-taskid?taskId=${taskId}`);
    }
}

export default new RemoteControl();
