/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-28 15:32:48
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { get, post } from 'src/api/http';
import types from './type.d';
import {ReturnPageData, TaskMess} from 'src/api/types';
class CustomerMgnt {
    getCustomerList (data: types.CustomerListParam): Promise<ReturnPageData<types.CustomerListData>> {
        return get('/customer/list', data);
    }
    updateCustomer (data:types.UpdateCustomer):Promise<TaskMess> {
        return post('/customer/update', data);
    }
}


export default new CustomerMgnt();
