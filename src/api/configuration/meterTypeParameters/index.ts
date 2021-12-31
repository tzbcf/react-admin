import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class MeterTypeParamMgt {
    getMeterBaseParam (subSysNo: string, meterType:string): Promise<types.MeterTypeParam[]> {
        return get('/meterparam/getMeterDocParamByMeterModelNo', {subSysNo, meterType});
    }

    getMeterPrepayParam (subSysNo: string, meterType:string): Promise<types.MeterTypeParam[]> {
        return get('/meterparam/getPrepayParamByMeterModelNo', {subSysNo, meterType});
    }

    getAMIParam (subSysNo: string, meterType:string): Promise<types.MeterTypeParam[]> {
        return get('/meterparam/getMeterMeasurePointParamByMeterModelNo', {subSysNo, meterType});
    }

    getOperateId (meterType:string): Promise<string> {
        return get('/meterparam/getOperateId', {meterType});
    }

    updateMeterParamter (param:any): Promise<TaskMess> {
        return post('/meterparam/updateMeterTemplateParamter', param);
    }
}

export default new MeterTypeParamMgt();
