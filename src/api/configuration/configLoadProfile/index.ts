import {get, post} from 'src/api/http';
import * as types from './type';
// import { TaskMess } from '../../types';

class ConfigLoadProfile {
    getDeviceTypeList (captureType:string, subSysNo:string): Promise<types.DeviceTypeData[]> {
        return get('/capture/meter-type-list', {captureType, subSysNo});
    }

    getByMeterTypeList (captureType:string, meterModel:string): Promise<types.ByMeterTypeData[]> {
        return get('/capture/by-meter-type-list', {captureType, meterModel});
    }

    getDCUTypeList (subSysNo:string): Promise<types.DCUTypeData[]> {
        return post(`/capture/dcu-types?subSysNo=${subSysNo}`);
    }

    getMeterObjectFileList (params:any): Promise<types.MeterObjectFileList> {
        return post('/capture/meter-object-file-list', params);
    }

    getCaptureObjectList (params:any): Promise<types.CaptureObjectList> {
        return post('/capture/capture-object-list', params);
    }

    getGroupList (subSysNo:string): Promise<types.GroupData[]> {
        return get('/capture/group-list', {subSysNo});
    }

    getExcuteCommandResultList (params:any): Promise<types.ExcuteCommandResultList> {
        return post('/capture/execute-command-result', params);
    }

    resendCommand (subSysNo:string, groupId:string): Promise<types.ReturnResult> {
        return get('/capture/resend-protocal-command', {subSysNo, groupId});
    }

    getGroupList2 (subSysNo:string, groupId:string): Promise<types.GroupList> {
        return get('/capture/group-list2', {subSysNo, groupId});
    }

    batchSendCaptureByMeterType (params:any): Promise<string> {
        return post('/capture/batch-send-capture-by-meter-type', params);
    }

    sendCommand (params:any): Promise<types.SendCommandResult> {
        return post('/capture/send-protocal-command', params);
    }

    stopCaptureObject (params:any): Promise<string> {
        return post('/capture/stop-capture-object', params);
    }

    getProtocolItemList (params:any): Promise<types.ProtocolItem[]> {
        return post('/capture/protocol-item-list', params);
    }

    getCaptureItemList (params:any): Promise<types.CaptureObjectList> {
        return post('/capture/capture-item-list', params);
    }

    getClockClass (params:any): Promise<types.CaptureObjectData[]> {
        return post('/capture/clock-class', params);
    }

    getMeterTypeObObjectTypeList (params:any): Promise<types.CaptureObjectData[]> {
        return post('/capture/meter-type-object-type-list', params);
    }

    saveCaptureObjectList (params:any): Promise<string> {
        return post('/capture/save-capture-object-list', params);
    }

}

export default new ConfigLoadProfile();
