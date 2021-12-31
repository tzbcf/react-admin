/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-06 16:38:23
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { get, post } from 'src/api/http';
import types from './type';
import { ReturnPageData, TaskListMess, TaskMess } from 'src/api/types.d';
class MeterMgnt {
    // 表计管理获取左边table数据
    getMeterLeft (data: types.MeterLeftParams): Promise<types.LeftMeterRows[]> {
        return post('/meter/left', data);
    }
    // 表计管理获取右边Table数据
    getMeterRight (data: types.MeterRightParams): Promise<types.RightMeterRows[]> {
        return get('/meter/right', data);
    }
    // 获取集中器类型
    getDcuType (deviceId:string): Promise<types.DcuTypeData[]> {
        return get(`/meter/device-type?deviceId=${deviceId}`);
    }
    // 保存表计
    saveSetting (data: types.SaveSettingParams): Promise<string> {
        return post('/meter/save-setting', data);
    }
    // 表计详情
    getMeterDetails (data:types.MetertDetailsParams): Promise<types.MeterDetailsData[]> {
        return post('/meter/meter-details', data);
    }
    // 获取表计分组
    getMeterGroup (): Promise<types.MeterGroupList[]> {
        return get('/meter/group-list-json');
    }
    // 获取分组表计清单数据
    getGroupMeterList (data: types.GroupMeterParams): Promise<ReturnPageData<types.GroupMeterList>> {
        return get('/meter/group-meters', data);
    }
    // 获取不属于分组表计清单数据
    getNoGroupMeterList (data: types.GroupMeterParams): Promise<ReturnPageData<types.GroupMeterList>> {
        return get('/meter/not-group-meters', data);
    }
    // 获取弹窗分组下拉
    getClassicalJson (subSysNo: string): Promise<types.ClassicalJsonData[]> {
        return get('/meter/sys-classical-json', {subSysNo});
    }
    // 保存新增分组
    saveGroupClassical (data: types.SaveClassicalParams): Promise<TaskListMess> {
        return post('/meter/save-group-meter', data);
    }
    // 保存表计左移右移数据
    saveGroupMeters (data: types.SaveGroupMetersParams): Promise<string> {
        return post('/meter/save-group-meters', data);
    }
    // 表计管理模板下载
    downTemplate () {
        return get('/meter/downTemplate');
    }
    // 验证表计地址
    isMeterAddRess (data: types.IsMeterAddressParams): Promise<TaskMess> {
        return get('/meter/is-meter-address', data);
    }
}

export default new MeterMgnt();
