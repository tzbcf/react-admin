/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-23 16:30:38
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Row, Col } from 'antd';
import './index.less';
export type LabeItem = {
  label: string;
  title: string;
}

type Props = {
    list: LabeItem[];
    wrapperCol?: {
        labelCol: number;
        titleCol: number;
    };
    border?: boolean; // 是否要边框
    itemCol?: number;
}

const LabelList: React.FC<Props> = (props) => {
    const { list, itemCol = 12, border = true, wrapperCol = { labelCol: 2, titleCol: 8 }} = props;

    return (
        <Row gutter={24} align='middle' className='labelList' style={{border: border ? '1px solid black' : ''}}>
            {
                list.map((item: LabeItem, i: number) => (
                    <Col span={itemCol} key={i}>
                        <Row gutter={24} align='middle'>
                            <Col className='label' span={wrapperCol.labelCol}>{ item.label }:</Col>
                            <Col className='text' span={wrapperCol.titleCol}>{ item.title }</Col>
                        </Row>
                    </Col>
                ))
            }
        </Row>
    );
};

export default LabelList;


