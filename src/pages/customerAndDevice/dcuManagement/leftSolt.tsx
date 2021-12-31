/*
 * FileName : leftSolt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-18 14:28:32
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import { Row, Col, Select, Input } from 'antd';
import { customer } from 'src/api';
import useFetchState from 'src/utils/useFetchState';
import * as dcuMgntType from 'src/api/customer&Device/dcuMgnt/type';
const { Option } = Select;
const { Search } = Input;

type Props = {
    search: (key: string, val: string, cstType: dcuMgntType.CstTypeJsonData[]) => Promise<void>;
    facCode: string;
}

const LeftSolt: React.FC<Props> = (props) => {
    const { search, facCode } = props;
    const [ typeData, setTypeData ] = useFetchState<dcuMgntType.CstTypeJsonData[]>([]);
    const [ selectVal, setSelectalV ] = useFetchState<string>('');
    const getCstTypeJson = async () => {
        try {
            const cstTypeJson = await customer.dcuMgnt.getDcuTypeJson(facCode);

            setTypeData(cstTypeJson);
            setSelectalV(cstTypeJson[0]?.CST_TYPE || '');
            search('dcuModel', cstTypeJson[0]?.CST_TYPE || '', cstTypeJson);
        } catch (error: any) {
            console.error(error.toString());
        }
    };

    const cstTypeChange = (val: string) => {
        setSelectalV(val);
        search('dcuModel', val, typeData);
    };

    const dcuNoChange = (val: string) => {
        search('fieldValue', val, typeData);
    };

    useEffect(() => {
        getCstTypeJson();
    }, []);

    return (
        <Row gutter={24} align='middle' justify='start' className='leftSolt'>
            <Col span={6}>
                <Select value={selectVal} onChange={cstTypeChange}>
                    {
                        typeData.map((v) => (
                            <Option value={v.CST_TYPE} key={v.CST_TYPE}>{ v.CST_TYPE_NAME }</Option>
                        ))
                    }
                </Select>
            </Col>
            <Col span={6}>
                <Select defaultValue='CST_NO'>
                    <Option value='CST_NO'>Dcu No</Option>
                </Select>
            </Col>
            <Col span={6}>
                <Search allowClear onSearch={dcuNoChange} enterButton />
            </Col>
        </Row>
    );
};

export default LeftSolt;
