/*
 * FileName : RightSolt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-18 14:36:27
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React from 'react';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { Row, Col, Select, Input } from 'antd';
import useFetchState from 'src/utils/useFetchState';
const {Option} = Select;
const { Search } = Input;

type Props = {
    btnList: BtnConfig[];
    search: (key: string, val: string) => Promise<void>;
}

const DcuTypeList = [
    {
        value: 'CST_NO',
        name: 'Dcu No',
    },
    {
        value: 'CST_ADDR',
        name: 'Dcu Address',
    },
    {
        value: 'CST_NAME',
        name: 'Dcu Name',
    },
];

const RightSolt: React.FC<Props> = (props) => {
    const { btnList, search } = props;
    const [ dcuType, setDcuType ] = useFetchState<string>('CST_NO');

    const dcuTypeChange = (val: string) => {
        setDcuType(val);
        search('searchField', val);
    };

    const dcuNoChange = (val:string) => {
        search('fieldValue', val);
    };

    return (
        <Row gutter={24} align='middle' justify='start' className='rightSolt'>
            <Col span={6}>
                <Select value={dcuType} onChange={dcuTypeChange}>
                    {
                        DcuTypeList.map((v) => (
                            <Option value={v.value} key={v.value}>{ v.name}</Option>
                        ))
                    }
                </Select>
            </Col>
            <Col span={6}>
                <Search allowClear onSearch={dcuNoChange} enterButton />
            </Col>
            <Col span={6}>
                <BtnList btnList={btnList} />
            </Col>
        </Row>
    );
};

export default RightSolt;
