/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-27 09:39:28
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import { get } from 'src/api/http';
import { ReturnData } from '../types';
import {FrozenRate} from './type';

class HomePage {
    getDcuCount () {
        return get('/home-page/dcu-count');
    }
    getMeterCount () {
        return get('/home-page/meter-count');
    }
    getDcuRelationMeters () {
        return get('/home-page/dcu-relation-meters');
    }
    getMeterTypeRelationMeters () {
        return get('/home-page/meter-type-relation-meters');
    }
    getDailyFrozenSuccessRate (): Promise<ReturnData<FrozenRate[]>> {
        return get('/home-page/daily-frozen-success-rate');
    }
    getMonthlyFrozenSuccessRate (): Promise<ReturnData<FrozenRate[]>> {
        return get('/home-page/monthly-frozen-success-rate');
    }
    getCurveFrozenSuccessRate (): Promise<ReturnData<FrozenRate[]>> {
        return get('/home-page/curve-frozen-success-rate');
    }
    getCustomers () {
        return get('/home-page/customers-count');
    }
    getQuickMenus () {
        return get('/common-box/func-list');
    }
}

export default new HomePage();


