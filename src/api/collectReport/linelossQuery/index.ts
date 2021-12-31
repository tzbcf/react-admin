import {post, get} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class LineLossQueryMgt {
    getLineLossDataList (params: any): Promise<types.LineLossList> {
        return post('/lineloss/getLineLossDataList', params);
    }

    getLineLossStatistics (params: any): Promise<types.LineLossStatistics> {
        return post('/lineloss/getLineLossStatistics', params);
    }

    sendCmd (groupId:string, frozenType:string): Promise<types.SendCmdResult> {
        return get('/lineloss/sendCmd', {groupId, frozenType});
    }

    computeLineloss (date:string, frozenType:string): Promise<TaskMess> {
        return get('/lineloss/computeLineloss', {date, frozenType});
    }

    disconnect (frozenType:string): Promise<TaskMess> {
        return get('/lineloss/disconnect', {frozenType});
    }

    getLineLossDetailList (params: any): Promise<types.LineLossList> {
        return get('/lineloss/getLineLossDataDetail', params);
    }
}

export default new LineLossQueryMgt();
