/**
 * FileName : user.js
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-04 20:02:03
 * Description : 
 * -----
 * Last Modified: 2021-07-04 20:46:43
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


 import Mock from 'mockjs';

 const data = Mock.mock('mock',{
    '/login':{
        code: 0,
        data: {
          token: 'absadka'  
        },
        message: 'ok'
    }
 });

 export {
    data
 }