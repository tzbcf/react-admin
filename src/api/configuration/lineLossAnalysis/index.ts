import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class LineLossAnalysis {
    getMeterTypeList (frozenType:string): Promise<types.MeterTypeList> {
        return get('/lineloss/getMeterTypeObejct', {frozenType});
    }

    saveLineLoss (datas:string): Promise<TaskMess> {
        return post('/lineloss/saveLineLossScheme', {datas});
    }

    startUpload (fileId:string): Promise<any> {
        return get('/lineloss/startUploadExcelFile', {fileId});
    }

    getUploadProgress (fileId:string): Promise<types.UploadProgress> {
        return get('/lineloss/getCurImportProgress', {fileId});
    }
}

export default new LineLossAnalysis();
