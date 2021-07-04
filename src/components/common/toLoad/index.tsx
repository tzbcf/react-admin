import React from 'react';
import { Spin } from 'antd';

const ToLoad: React.FC = () => {
  return (
    <div>
      <Spin size='large' tip='loading...' />
    </div>
  )
}

export default ToLoad;