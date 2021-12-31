import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class CommandConfig {
    getDeviceSubTypeList (deviceType:string): Promise<types.DeviceSubType[]> {
        return get('/command/getDeviceSubTypeList', {deviceType});
    }

    getCommandEditList (deviceTypeEdit:string, deviceSubTypeEdit:string, commandTypeEdit:string): Promise<types.CommandEditData[]> {
        return get('/command/getCommandEditList', {deviceTypeEdit, deviceSubTypeEdit, commandTypeEdit});
    }

    getCommandSchemeList (): Promise<types.CommandScheme[]> {
        return get('/command/getProtocolSchemeList', {});
    }

    getLeftCommandList (params:any): Promise<types.LeftCommandData[]> {
        return get('/command/getDisableCommandList', params);
    }

    getRightCommandList (params:any): Promise<types.RightCommandData[]> {
        return get('/command/getEnableCommandList', params);
    }

    saveCommandEdit (datas:any): Promise<TaskMess> {
        return post('/command/saveCommandEdit', datas);
    }

    saveCommand (datas:any): Promise<TaskMess> {
        return post('/command/saveSetting', datas);
    }

    startUpload (fileId:string): Promise<any> {
        return get('/command/startUploadExcelFile', {fileId});
    }

    getUploadProgress (fileId:string): Promise<types.UploadProgress> {
        return get('/command/getCurImportProgress', {fileId});
    }
}

export default new CommandConfig();
