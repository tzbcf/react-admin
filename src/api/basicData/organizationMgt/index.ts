import {get, post} from 'src/api/http';
import * as types from './types.d';
import { TaskMess, BasePage } from '../../types';

class OrganizationMgt {
    getOrganizationList (): Promise<types.OrganizationData[]> {
        return get('/files/nodes/getUnitNetsByNodeList');
    }
    deleteOrganization (data: types.OrganizationParams): Promise<TaskMess> {
        return post('/files/nodes/delUnitNet', data);
    }
    addOrganization (data: types.OrganizationParams): Promise<TaskMess> {
        return post('/files/nodes/addUnitNet', data);
    }
    editOrganization (data: types.OrganizationParams): Promise<TaskMess> {
        return post('/files/nodes/editUnitNet', data);
    }
    getOrganizationJson (nodeId:string): Promise<types.OrganizationJson[]> {
        return get('/files/nodes/getJsonNodesByNodeId', { nodeId });
    }
    getKMFList (page: number = 1, rows: number = 99): Promise<types.SGCDataList> {
        const params: BasePage = {
            page: page,
            rows: rows,
        };

        return get('/mgrToken/getKmfList', params);
    }
    getSGCList (page: number = 1, rows: number = 99): Promise<types.SGCDataList> {
        const params: BasePage = {
            page: page,
            rows: rows,
        };

        return get('/stsinstore/getSgcList', params);
    }
}

export default new OrganizationMgt();
