import {get} from 'src/api/http';
import * as types from './types';

class OpreatorOnlineMgt {
    getOpreatorList (subSys: string, nodeId:string): Promise<types.OpreatorData[]> {
        return get('/domain/getOperator', {subSys, nodeId});
    }

    getOpreatorOnline (nodeId: string, operatorId:string): Promise<types.OpreatorOnlineData[]> {
        return get('/domain/getOperatorOnline', {nodeId, operatorId});
    }

    offline (operatorId:string): Promise<string> {
        return get('/domain/offline', { operatorId});
    }

}

export default new OpreatorOnlineMgt();
