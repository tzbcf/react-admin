import {get, post} from 'src/api/http';
import * as types from './types';

class MeterAlarmEventMgt {
    getMeterAlarmEventList (params: any): Promise<types.MeterAlarmEventList> {
        return post('/event/meter-alarm-datas', params);
    }

    getMeterModelNos (): Promise<types.MeterModeNo[]> {
        return get('/event/getMeterModelNo');
    }

    getMeterAlarmOptions (meterModelNo:string): Promise<types.MeterAlarmOption[]> {
        return get('/event/getAlarmOptions', {meterModelNo});
    }

}

export default new MeterAlarmEventMgt();
