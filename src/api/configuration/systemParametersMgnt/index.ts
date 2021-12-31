import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class SystemParamMgt {
    getSystemParam (page: number, rows:number): Promise<types.SystemParamList> {
        return get('/sysParam/getSystemPara', {page, rows});
    }

    getJavaParam (): Promise<any> {
        return get('/sysParam/getJavaEnvironmentPara', {});
    }

    getServerParam (): Promise<any> {
        return get('/sysParam/getServerPara', {});
    }

    setSystemParam (param:any): Promise<TaskMess> {
        return post('/sysParam/setSystemPara', param);
    }
}

export default new SystemParamMgt();
