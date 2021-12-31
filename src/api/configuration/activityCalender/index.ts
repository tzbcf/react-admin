import {get, post} from 'src/api/http';
import * as types from './types';
import { TaskMess } from '../../types';

class ActivityCalenderMgt {
    getSchemeProfile (page:number, rows:number, subSysNo:string): Promise<types.SchemeProfileList> {
        return get('/calender/getSchemeProfileList', {page, rows, subSysNo});
    }

    getSeasonProfile (page:number, rows:number, subSysNo:string): Promise<types.SeasonProfileList> {
        return get('/calender/getSeasonProfileList', {page, rows, subSysNo});
    }

    getWeekProfile (page:number, rows:number, subSysNo:string): Promise<types.WeekProfileList> {
        return get('/calender/getWeekProfileList', {page, rows, subSysNo});
    }

    getDayProfile (page:number, rows:number, subSysNo:string): Promise<types.DayProfileList> {
        return get('/calender/getDayProfileList', {page, rows, subSysNo});
    }

    getDayProfileById (dayId:string, subSys:string): Promise<types.DayProfileData[]> {
        return get('/calender/getDayProfileEditList', {dayId, subSys});
    }

    getDayIds (subSysNo:string): Promise<types.DayProfileData[]> {
        return get('/calender/getDayIdList', {subSysNo});
    }

    getWeekProfileById (weekName:string, subSys:string): Promise<types.WeekProfileData[]> {
        return get('/calender/getEditWeekProfileById', {weekName, subSys});
    }

    getWeekNames (subSysNo:string): Promise<types.WeekProfileData[]> {
        return get('/calender/getWeekNameList', {subSysNo});
    }

    getSeasonProfileBySN (schemeSn:string, subSys:string): Promise<types.SeasonProfileData[]> {
        return get('/calender/getSeasonSelectListBySn', {schemeSn, subSys});
    }

    addSchemeProfile (params:any): Promise<TaskMess> {
        return post('/calender/addSchemeProfile', params);
    }

    editSchemeProfile (params:any): Promise<TaskMess> {
        return post('/calender/editSchemeProfile', params);
    }

    addSeasonProfile (params:any): Promise<TaskMess> {
        return post('/calender/addSeasonProfile', params);
    }

    editSeasonProfile (params:any): Promise<TaskMess> {
        return post('/calender/editSeasonProfile', params);
    }

    addWeekProfile (params:any): Promise<TaskMess> {
        return post('/calender/addWeekProfile', params);
    }

    editWeekProfile (params:any): Promise<TaskMess> {
        return post('/calender/editWeekProfile', params);
    }

    addDayProfile (params:any): Promise<TaskMess> {
        return post('/calender/addDayProfile', params);
    }

    editDayProfile (params:any): Promise<TaskMess> {
        return post('/calender/editDayProfile', params);
    }

    delelteProfile (params:any): Promise<TaskMess> {
        return post('/calender/deleteProfile', params);
    }

    sendProtocalCommand (params:any): Promise<types.WebSocketMessage> {
        return post('/random-read/send-protocal-command', params);
    }
}

export default new ActivityCalenderMgt();
