import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class AlarmConfig {
    getMeterModelList (): Promise<types.MeterModel[]> {
        return get('/event/getMeterModelNo', {});
    }

    getAlarmConfigList (page:number, rows:number, meterModelNo:string, alarmType:string, sortOrder:string): Promise<types.AlarmConfigList> {
        return get('/event/getAlarmConfig', {page, rows, meterModelNo, alarmType, sortOrder});
    }

    saveAlarmConfig (params:any): Promise<TaskMess> {
        return post('/event/saveAlarmConfig', params);
    }

    sendProtocalCommand (params:any): Promise<types.WebSocketMessage> {
        return post('/event/sendProtocalCommand', params);
    }


}

export default new AlarmConfig();
