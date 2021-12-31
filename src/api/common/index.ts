/*
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-28 16:35:59
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get, post } from 'src/api/http';
import * as types from './type.d';

class Common {
    // 获取系统版本号相关信息
    getSystemVersion (): Promise<{data: types.SystemVersion[]}> {
        return get('/home-page/system-version');
    }
    getTodayAlarmData (type: string): Promise<types.GetAlarmList[]> {
        return get(`/event/today-alarm-data?alarmType=${type}`);
    }
    getAlarmDataSum (type: string): Promise<number[]> {
        return get(`/event/alarm-data-sum?alarmType=${type}`);
    }
    updateAlarmStatus (data: types.updateAlarm) {
        return post('/event/update-alarm-status', data);
    }
    // 获取菜单数据
    getMenuData (subno:string = '10'): Promise<types.MenuTree[]> {
        return get(`/home-page/menu-tree-syn?id=&rootIcon=&netIcon=&dstIcon=&roomIcon=&subno=${subno}`);
    }
    // 获取设备树相关数据
    getDeviceTree (data: types.DeviceTreeParams): Promise<types.DeviceTreeData> {
        return get(`/common-box/init-device-tree?page=${data.page}&rows=${data.rows}&level=${data.level}&searchField=${data.searchField}&fieldValue=${data.fieldValue}&deviceStatus=${data.deviceStatus}`);
    }
    // 设备树获取子节点数据
    getDeviceChildNode (data: types.DeviceChildParams): Promise<types.DeviceChildData[]> {
        return get(`/common-box/device-tree-child-node?id=${data.id}&nodeType=${data.nodeType}&chiledNodeType=${data.chiledNodeType}`);
    }
    // 表计schedule数据
    getMeterScheduleInfo (data:types.MeterInfoParams): Promise<types.MeterScheduleInfoData[]> {
        return get(`/device-info/meter-schedule?meterNo=${data.METERNO}&meterAddress=${data.METERADDRESS}&meterGuid=${data.METERGUID}`);
    }
    // 表计基础数据
    getMeterBaseInfo (data: types.MeterInfoParams): Promise<types.MeterBaseInfoData[]> {
        return get(`/device-info/meter-base?meterNo=${data.METERNO}&meterAddress=${data.METERADDRESS}&meterGuid=${data.METERGUID}`);
    }
    // 表计ami数据
    getMeterAMIInfo (data:types.MeterInfoParams): Promise<types.MeterAMIInfoData> {
        return get(`/device-info/meter-ami?meterNo=${data.METERNO}&meterAddress=${data.METERADDRESS}&meterGuid=${data.METERGUID}`);
    }
    // 获取集中器AMI信息
    getDcuAmi (data: types.DCUAmiParams):Promise<types.DCUAmiData> {
        return get('/device-info/dcu-ami', data);
    }
    // 获取集中器baseData数据
    getDcuBaseData (data: types.DCUAmiParams): Promise<types.DCUBaseData[]> {
        return get('/device-info/dcu-base', data);
    }
    // 获取集中器log信息
    getDcuLog (data: types.DCUAmiParams):Promise<types.DCULogData[]> {
        return get('/device-info/dcu-log', data);
    }
    // 获取集中器schedule信息
    getDcuSchedule (data: types.DCUAmiParams): Promise<types.MeterScheduleInfoData[]> {
        return get('/device-info/dcu-schedule', data);
    }
    getMeterNodeByDcuId (data:types.MeterNodeByDcuIdParams): Promise<types.DeviceChildData[]|null> {
        return get('/common-box/meter-nod-eby-dcuid', data);
    }
    getNodeByLoginUser (subSysNo:string): Promise<types.NodeByLoginUserData[]> {
        return get('/iframe/node-login-user?subSysNo=' + subSysNo);
    }
}

export default new Common();
