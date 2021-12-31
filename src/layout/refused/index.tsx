/**
 * 404页面
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NoFound: React.FC = () => <Result
    status='404'
    title='404'
    subTitle='Sorry, the page you visited does not exist.'
    extra={<Button type='primary'>
        <Link to='/'>Back Home</Link>
    </Button>}
/>;

export default NoFound;
