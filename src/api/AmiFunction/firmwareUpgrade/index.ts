/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-19 15:42:51
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { get, post } from 'src/api/http';
import * as types from './type';
import {TaskMess} from 'src/api/types.d';

class FirmwareUpgrade {
    getProgramList (programName:string): Promise<types.ProgramsData> {
        return get('/remote-upgrade/programs', {
            programName,
            page: 1,
            rows: 1000,
        });
    }
    getDeviceType (type:string): Promise<types.DeviceTypeData[]> {
        return get('/remote-upgrade/device-types', {fileType: type});
    }
    getSetting ():Promise<string[]> {
        return get('/remote-upgrade/get-setting');
    }
    getDevicepgradeInfo (data: types.UpgradeInfoParams): Promise<types.UpgradeInfoData> {
        return get('/remote-upgrade/device-upgrade-Info', {
            cstid: '',
            node: '',
            ...data,
        });
    }
    getAreaList ():Promise<types.AreaListData[]> {
        return get('/remote-upgrade/areas');
    }
    delFileImpl (data: types.DeleteFilesParams): Promise<TaskMess> {
        return post('/remote-upgrade/del-program', data);
    }
    getGroupList (data: types.GroupListParams): Promise<types.GroupListData> {
        return get('/remote-upgrade/groups', data);
    }
    getTaskListAndStatusCount (data: types.TaskListParams): Promise<types.TaskData<types.TaskList>> {
        return get('/remote-upgrade/tasks-statistics', data);
    }
    uploadFileImpl (data: types.UploadFileParams):Promise<TaskMess> {
        return post('/remote-upgrade/save-program', data);
    }
    upgradeFileToDcuNew (data: types.UpgradeDcuNewParams): Promise<types.UpgradeDcuNewData> {
        return post('/remote-upgrade/upgrade-file-dcu-new', {
            cstid: '',
            fieldValue: '',
            node: '',
            searchField: '',
            sortName: '',
            sortOrder: '',
            strlist: '',
            ...data,
        });
    }
    upgradeResend (data: types.UpgradeResendParams): Promise<TaskMess> {
        return post('/remote-upgrade/resend', data);
    }
    upgradeReset (data: types.UpgradeResendParams): Promise<TaskMess> {
        return post('/remote-upgrade/reset', data);
    }
    tryFTPConn (data: types.FTPConnParams): Promise<TaskMess> {
        return get('/remote-upgrade/ftp-connect', data);
    }
}

export default new FirmwareUpgrade();
