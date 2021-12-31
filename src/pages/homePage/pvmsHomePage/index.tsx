/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-03 19:38:21
 * Description :
 * -----
 * Last Modified: 2021-07-22 15:27:56
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Pagination } from 'antd';
const MainIndex: React.FC = () =>
    <div>
        <Pagination defaultCurrent={1} total={50} showSizeChanger />
    </div>

  ;

export default MainIndex;


