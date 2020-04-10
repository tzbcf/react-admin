/**
 * FileName : index.ts
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-04-01 18:02:04
 * Description : 
 * -----
 * Last Modified: 2020-04-07 16:09:21
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

import { createStore, combineReducers } from "redux";
import { user } from "./user";

// 全局你可以创建多个reducer 在这里统一在一起
const rootReducers = combineReducers({user})
// 全局就管理一个store
export const store = createStore(rootReducers)
