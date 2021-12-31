import {get, post} from 'src/api/http';
import * as types from './types.d';
import { TaskMess } from '../../types';

class FeederMgt {
    feederList (data:types.FeederListParam): Promise<types.FeederDataList> {
        return get('/section/list', data);
    }

    feederListJson (subSysNo:string, searchNode:string): Promise<types.FeederDataJson[]> {
        return get('/section/getSectionList', {subSysNo, searchNode});
    }

    deleteFeeder (data: types.FeederSaveParam): Promise<TaskMess> {
        return post('/section/delete', data);
    }

    getMaxFeederNo (subSysNo:string): Promise<string> {
        return get('/section/getMaxSectionNo', {subSysNo});
    }

    addFeeder (data: types.FeederSaveParam): Promise<TaskMess> {
        return post('/section/add', data);
    }

    editFeeder (data: types.FeederSaveParam): Promise<TaskMess> {
        return post('/section/edit', data);
    }
}

export default new FeederMgt();
