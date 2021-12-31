/*
 * FileName : page500.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-21 10:49:22
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
    status='500'
    title='500'
    subTitle='Sorry, something went wrong.'
    extra={<Button type='primary'> <Link to='/'>Back Home</Link> </Button>}/>);

export default NoAccessPage;


