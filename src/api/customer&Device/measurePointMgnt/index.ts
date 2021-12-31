/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-29 14:40:09
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import types from './type';
import { ReturnPageData, TaskMess } from 'src/api/types.d';
class MeasurePointMgnt {
    getMeasurePointList (data:types.MeasurePointInfoParams): Promise<ReturnPageData<types.MeasurePointInfoData>> {
        return get('/measure-point/list', data);
    }
    updateMeasurePoint (data: types.UpdateMeasurePointParams): Promise<TaskMess> {
        return post('/measure-point/update', data);
    }
}

export default new MeasurePointMgnt();
