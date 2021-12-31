/*
 * FileName : noAccess
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-21 10:39:57
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NoAccessPage = () => (<Result
    status='403'
    title='403'
    subTitle='Sorry, you are not authorized to access this page.'
    extra={<Button type='primary'>   <Link to='/'>Back Home</Link> </Button>}/>);

export default NoAccessPage;

