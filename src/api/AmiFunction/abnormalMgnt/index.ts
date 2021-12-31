/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-04 11:14:12
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import types from './type.d';
import {TaskResult} from 'src/api/types';

class AbnormalMgnt {
    getNodeByLoginUser (subSysNo:string): Promise<types.NodeByLoginUserData[]> {
        return get('/iframe/node-login-user?subSysNo=' + subSysNo);
    }
    getMeterTypeList (dsit:string = ''): Promise<types.MeterTypeList[]> {
        return get('/abnormal/meter-type-list?dsit=' + dsit);
    }
    getTaskByMeterType (meterType:string = ''): Promise<types.TaskByMeterTypeData[]> {
        return get('/abnormal/task-meter-type?cstType=' + meterType);
    }
    getMeterList (data: types.MeterlistParams): Promise<types.MeterListData[]> {
        return post('/abnormal/meter2-list', data);
    }
    supplementaryData (data: types.SupDataParams): Promise<TaskResult> {
        return post('/abnormal/supplementary-data', data);
    }
}

export default new AbnormalMgnt();
