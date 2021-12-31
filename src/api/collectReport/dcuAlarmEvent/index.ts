import {post, get} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class DcuAlarmEventMgt {
    getDcuAlarmEventList (params: any): Promise<types.DcuAlarmEventList> {
        return get('/event/device-event-datas', params);
    }

    updateAlarmStatus (params: any, random:string): Promise<TaskMess> {
        return post(`/event/update-alarm-status?random=${random}`, params);
    }
}

export default new DcuAlarmEventMgt();
