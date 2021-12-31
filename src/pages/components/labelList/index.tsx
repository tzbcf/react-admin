/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-23 16:43:11
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React from 'react';
import LabelList, { LabeItem } from 'src/components/business/labelList';

const LabelListPage = () => {
    const list: LabeItem[] = [
        {
            label: 'Name',
            title: 'string',
        },
        {
            label: 'iphone',
            title: '123456788',
        },
        {
            label: 'email',
            title: '123456788',
        },
    ];

    return (
        <div style={{width: '400px', padding: '10px'}}>
            <LabelList list={list} wrapperCol={{labelCol: 7, titleCol: 14}} />
        </div>
    );
};

export default LabelListPage;

