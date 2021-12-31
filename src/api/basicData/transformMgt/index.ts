import {get, post} from 'src/api/http';
import * as types from './type';
import { TaskMess } from '../../types';

class TransformMgt {
    transformList (subSysNo: string, page: number, rows: number, searchNode:string, feederId:string, transformerId:string): Promise<types.TransformDataList> {

        return get('/dst/list', {subSysNo, page, rows, transformerId, searchNode, feederId});
    }

    deleteTransform (data: types.TransformParam): Promise<TaskMess> {
        return post('/dst/delete', data);
    }

    getMaxTransformNo (subSysNo:string): Promise<string> {
        return get('/dst/getMaxDstNo', {subSysNo});
    }

    addTransform (data: types.TransformParam): Promise<TaskMess> {
        return post('/dst/add', data);
    }

    editTransform (data: types.TransformParam): Promise<TaskMess> {
        return post('/dst/edit', data);
    }
    getDstList (data: types.GetDstListParasm): Promise<types.GetDstListData[]> {
        return get('/dst/getDstList', data);
    }
}
export default new TransformMgt();
