// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Pagination } from 'antd';
const MainIndex = () =>
    <div>
        <Pagination defaultCurrent={1} total={50} showSizeChanger />
    </div>

  ;

export default MainIndex;
