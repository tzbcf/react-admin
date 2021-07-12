// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Spin } from 'antd';

const ToLoad: React.FC = () =>
    <div>
        <Spin size='large' tip='loading...' />
    </div>;

export default ToLoad;
