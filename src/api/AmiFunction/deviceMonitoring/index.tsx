/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-28 15:49:54
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import {post} from 'src/api/http';
import * as types from './type';
import {ReturnPageData} from 'src/api/types.d';

class DeviceMonitor {
    getDcuOnlineStatus (data: types.DcuOnlineStatusParams): Promise<ReturnPageData<types.DcuOnlineStatusData>> {
        return post('/dcu-online-status/list', data);
    }
    getMeterOnlineStatus (data: types.MeterOnlineStatusParams): Promise<ReturnPageData<types.MeterOnlineStatusData>> {
        return post('/dcu-online-status/meter-online', data);
    }
    getDcuOnlineLog (data: types.DcuOnlineLogParams):Promise<ReturnPageData<types.DcuOnlineLogData>> {
        return post('/dcu-online-status/log', data);
    }
}

export default new DeviceMonitor();
