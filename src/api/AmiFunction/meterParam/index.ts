/* eslint-disable camelcase */
/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-05 15:31:56
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import { ReturnPageData, TaskMess } from 'src/api/types';
import * as types from './type.d';
class MeterControl {
    getGroupList (data: types.GroupListParams): Promise<ReturnPageData<types.GroupListData>> {
        return post('/remote/meter/param/group-list', data);
    }
    getProgramList (programName: string): Promise<ReturnPageData<types.ProgramListData>> {
        return get('/remote/meter/param/program-list', { programName });
    }
    getMeterParamList (sn:string): Promise<types.MeterParamList[]> {
        return get('/remote/meter/param/list', { SN: sn });
    }
    getAreaList (): Promise<types.AreaListData[]> {
        return get('/remote/meter/param/area-list');
    }
    getSetting (): Promise<string[]> {
        return get('/remote/meter/param/setting');
    }
    getDeviceType (fileType:string): Promise<types.DeviceTypeList[]> {
        return get('/remote/meter/param/device-type', {fileType});
    }
    uploadFileImpl (data: types.SaveProgramParams): Promise<TaskMess> {
        return post('/remote/meter/param/upload-file-impl', data);
    }
    delFileImpl (data:types.DelFileImplParam): Promise<null> {
        return post('/remote/meter/param/del-file-impl', data);
    }
    upgradeFileIssued (data: types.UpgradeFileParams): Promise<types.UpgradeFileData> {
        return post('/remote/meter/param/upgrade-file-issued', data);
    }
    getTaskListAndStatusCount (data: types.TaskListParams):Promise<types.TaskListData> {
        return post('/remote/meter/param/task-list-status-count', data);
    }
    tryFTPConn (data: types.tryFTPConnParams): Promise<TaskMess> {
        return post('/remote/meter/param/try-ftp-conn', data);
    }
    resend (data: types.ResendParams): Promise<null> {
        return post('/remote/meter/param/resend', data);
    }
}

export default new MeterControl();
