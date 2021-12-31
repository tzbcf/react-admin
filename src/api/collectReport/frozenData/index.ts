import {post} from 'src/api/http';
import * as types from './types';

class FrozenDataMgt {
    dailyFrozenDataQuery (params: any): Promise<types.FrozenDataList> {
        return post('/frozenData/getDayFrozenDataList', params);
    }

    monthlyFrozenDataQuery (params: any): Promise<types.FrozenDataList> {
        return post('/frozenData/getMonthFrozenDataList', params);
    }
}

export default new FrozenDataMgt();
