import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class DataDefinitionMgt {
    classificationList (params:types.ClassificationParams): Promise<types.ClassificationList> {
        return post('/classification/getClassificationList', params);
    }

    classificationTypeList (): Promise<types.ClassificationType[]> {
        return get('/classification/getClassificationType');
    }

    classificationDetailList (params:types.ClassificationParams): Promise<types.ClassificationDetailList> {
        return post('/classification/getClassificationDetailList', params);
    }

    addClassification (params:types.AddClassification): Promise<TaskMess> {
        return post('/classification/addClassification', params);
    }

    updateClassification (params:types.AddClassification): Promise<TaskMess> {
        return post('/classification/updateClassification', params);
    }

    addClassificationDetail (params:types.AddClassificationDetail): Promise<TaskMess> {
        return post('/classification/addClassificationDetail', params);
    }

    updateClassificationDetail (params:types.AddClassificationDetail): Promise<TaskMess> {
        return post('/classification/updateClassificationDetail', params);
    }

    delClassificationDetail (params:any): Promise<TaskMess> {
        return post('/classification/delClassificationDetail', params);
    }

}
export default new DataDefinitionMgt();
