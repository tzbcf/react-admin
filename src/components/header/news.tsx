/*
 * FileName : news.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-07 16:11:35
 * Description : 
 * -----
 * Last Modified: 2021-07-08 11:24:02
 * Modified By : 
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { CloseOutlined } from '@ant-design/icons';
import { NEW_TOGGLE } from 'src/store/common/news';
import { Select } from 'antd';
import './news.less';
const { Option } = Select;

type Props = {
    mes: LangMessage;
    dispatch: any;
}

const News: React.FC<Props> = (props) => {
    const { mes, dispatch } = props;
    const newsClose = () => {
        dispatch({
            type: NEW_TOGGLE,
            value: false
        })
    }
    return (
        <div id='news'>
            <div className='flexCenter flexBetween pv10h20'>
                <div>
                    <span className='pr10'>{mes['newsTitleAlarmInfo']}</span>
                    <i className='count'>0</i>
                </div>
                <div>
                    <Select defaultValue='ALL' className='pr10'> 
                        <Option value='ALL'>ALL</Option>
                        <Option value='Meter'>Meter</Option>
                        <Option value='DCU'>DCU</Option>
                    </Select>
                    <CloseOutlined onClick={()=> newsClose()} />
                </div>
            </div>
        </div>
    )
};

export default connect((state: any) => {
    return {
      mes: state.langSwitch.message
    }
  })(News);




