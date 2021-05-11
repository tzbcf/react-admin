import React from 'react';
import { Pagination } from 'antd';
const MainIndex = () => {
  return (
    <div>
      <Pagination defaultCurrent={1} total={50} showSizeChanger />
    </div>
  )
}
export default MainIndex;