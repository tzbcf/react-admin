/*
 * FileName : leftSolt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-07 09:40:19
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Input, Select } from 'antd';
// import { customer } from 'src/api';
// import bus from 'src/utils/eventBus';
import './index.less';
const { Option } = Select;
const { Search } = Input;

type DcuTypeSelect = {
    value: string;
    name: string;
};

type Props = {
    selectList: DcuTypeSelect[];
    defaultValue: string;
    setChange: (val: string) => void;
    inputSearch: (val: string) => void;
};

const LeftSolt: React.FC<Props> = (props) => {
    const { selectList, defaultValue, setChange, inputSearch } = props;

    return (
        <div className='leftSolt'>
            <div>
                <Select style={{ width: '210px' }} value={defaultValue} onChange={setChange}>
                    {selectList.map((v: DcuTypeSelect) => (
                        <Option value={v.value} key={v.value}>
                            {v.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <div>
                <Search placeholder='Meter No' allowClear onSearch={inputSearch} enterButton />
            </div>
        </div>
    );
};

export default LeftSolt;
