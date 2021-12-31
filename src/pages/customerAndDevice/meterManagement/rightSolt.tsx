/*
 * FileName : rightSolt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-07 09:40:28
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
import BtnList, { BtnConfig } from 'src/components/common/btnList';
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
    btnList: BtnConfig[];
};

const RightSolt: React.FC<Props> = (props) => {
    const { selectList, defaultValue, setChange, inputSearch, btnList } = props;

    return (
        <div className='rightSolt'>
            <div className='flexCenter'>
                <Select value={defaultValue} onChange={setChange}>
                    {selectList.map((v: DcuTypeSelect) => (
                        <Option value={v.value} key={v.value}>
                            {v.name}
                        </Option>
                    ))}
                </Select>
                <Search placeholder='Meter No' allowClear onSearch={inputSearch} enterButton />
            </div>
            <div>
                <BtnList btnList={btnList} />
            </div>
        </div>
    );
};

export default RightSolt;
