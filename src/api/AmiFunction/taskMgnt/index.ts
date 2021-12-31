/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-01 15:49:24
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { post } from 'src/api/http';
import * as types from './type';
import {ReturnPageData, TaskMess} from 'src/api/types.d';

class TaskMgnt {
    getMeterList (data: types.MeterListActionParams): Promise<ReturnPageData<types.MeterListActionList>> {
        return post('/task/meter-list', data);
    }
    getOperatorList (data:types.OperateListParams): Promise<types.OperateListData[]> {
        return post('/task/operator-list', data);
    }
    stopTask (data:types.TaskStopParams):Promise<TaskMess> {
        return post('/task/stop', data);
    }
    changePriority (data: types.TaskPriorityParams): Promise<TaskMess> {
        return post('/task/change-priority', data);
    }
    setExucuteTime (data:types.TaskSetExucuteTimeParams): Promise<TaskMess> {
        return post('/task/set-execute-time', data);
    }
}


export default new TaskMgnt();
