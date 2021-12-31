/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-22 14:19:05
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import types from './type.d';
import { ReturnPageData, TaskMess } from 'src/api/types.d';
class DcuMgnt {
    // 获取集中器工厂json
    getDcuFacJson (): Promise<types.CstFacJsonData[]> {
        return get('/cst/dcu-fac-json');
    }
    // 获取集中器类型Json
    getDcuTypeJson (facCode: string = ''): Promise<types.CstTypeJsonData[]> {
        return get('/cst/dcu-type-json', {facCode});
    }
    // 获取集中器左边table数据
    getLeftCstList (data: types.LeftCstListParams): Promise<ReturnPageData<types.InactiveDcuList>> {
        return get('/cst/inactive-dcus', data);
    }
    // 获取集中器管理右边table数据
    getRightCstList (data: types.LeftCstListParams): Promise<ReturnPageData<types.CstList>> {
        return get('/cst/receiving-dcus', data);
    }
    // 批量保存
    saveBatchCst (data: types.SaveBatchCstParams) {
        return post('/cst/batch-save', data);
    }
    // 获取不是分组的集中器
    getNoGroupCst (data: types.GroupCstParams) {
        return get('/cst/not-group-dcus', data);
    }
    // 获取分组的集中器
    getGroupCst (data: types.GroupCstParams) {
        return get('/cst/group-dcus', data);
    }
    // 分组保存
    saveGroupList (data: types.SaveGroupListData) {
        return post('/cst/save-dcu-group', data);
    }
    // 验证dcu是否重复
    isDcuRepeat (data: types.IsDcuRepParams): Promise<TaskMess> {
        return get('/cst/is-dcu', data);
    }
}

export default new DcuMgnt();
