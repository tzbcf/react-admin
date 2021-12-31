/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-06 16:39:35
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import meterMgnt from './meterMgnt/index';
import dcuMgnt from './dcuMgnt';
import customerMgnt from './customerMgnt';
import measurePoint from './measurePointMgnt';

export default {
    meterMgnt,
    dcuMgnt,
    customerMgnt,
    measurePoint,
};
