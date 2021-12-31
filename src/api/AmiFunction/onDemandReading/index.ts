/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-09 09:57:37
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { get, post } from 'src/api/http';
import * as types from './type';
import { TaskMess } from 'src/api/types';
import { DeviceChildParams, DeviceChildData} from 'src/api/common/type';
class OnReading {
    getProtocolList (query: types.ProtocolListParams): Promise<types.ProtocolData> {
        return get('/random-read/protocol-list', query);
    }
    sendProtocalByCst (data: types.SendProtocalByCstParams): Promise<types.SendProtocalByCstData<types.SendProtocalByCstList>> {
        return post('/random-read/send-protocal-command-by-cst', data);
    }
    batchSendCommond (data: types.SendProtocalByCstParams): Promise<types.SendProtocalByCstData<types.BatchSendCommon>> {
        return post('/random-read/batch-repeat-send-command', data);
    }
    batchRefresh (strlist:string): Promise<types.BatchRefreshData[]> {
        return post('/random-read/batch-refresh', {strlist});
    }
    clearTaskStatus (strlist: string):Promise<TaskMess> {
        return post('/random-read/clear-task-status', {strlist});
    }
    createReadeExcel (strlist: string):Promise<TaskMess> {
        return post('/random-read/create-random-read-excel', {strlist});
    }
    sendProtocalCommand (data:types.ProtocalCommand): Promise<TaskMess> {
        return post('/random-read/send-protocal-command', data);
    }
    getDeviceTreeChildNode (data: DeviceChildParams): Promise<DeviceChildData[]|null> {
        return get('/random-read/device-tree-child-node', data);
    }
    getResultValue (data: types.ResultValParams): Promise<types.ResultValData> {
        return post('/random-read/result-value', data);
    }
}

export default new OnReading();
