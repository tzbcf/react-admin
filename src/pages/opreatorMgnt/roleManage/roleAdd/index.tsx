/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-06-20 17:17:01
 * Description :
 * -----
 * Last Modified: 2021-06-20 18:42:34
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Tree } from 'antd';
const Details: React.FC = () => {
    const treeData = [
        {
            title: '0-0',
            key: '0-0',
            children: [
                {
                    title: '0-0-0',
                    key: '0-0-0',
                    children: [
                        { title: '0-0-0-0', key: '0-0-0-0' },
                        { title: '0-0-0-1', key: '0-0-0-1' },
                        { title: '0-0-0-2', key: '0-0-0-2' },
                    ],
                },
                {
                    title: '0-0-1',
                    key: '0-0-1',
                    children: [
                        { title: '0-0-1-0', key: '0-0-1-0' },
                        { title: '0-0-1-1', key: '0-0-1-1' },
                        { title: '0-0-1-2', key: '0-0-1-2' },
                    ],
                },
                {
                    title: '0-0-2',
                    key: '0-0-2',
                },
            ],
        },
        {
            title: '0-1',
            key: '0-1',
            children: [
                { title: '0-1-0-0', key: '0-1-0-0' },
                { title: '0-1-0-1', key: '0-1-0-1' },
                { title: '0-1-0-2', key: '0-1-0-2' },
            ],
        },
        {
            title: '0-2',
            key: '0-2',
        },
    ];

    return (
        <div>
            <h4>权限树</h4>
            <div className="pv10h20">
                <Tree
                    checkable
                    treeData={treeData}
                />
            </div>
        </div>
    );
};

export default Details;


