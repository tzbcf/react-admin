/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-08 15:34:26
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import MeterReadRate from './meterReadRate';
import NoComMeterQuery from './noComMeterQuery';
import './index.less';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

type Props = {
  Mes: LangMessage,
}
const MeterReadControl: React.FC<Props> = (props) => {
    const { Mes } = props;


    return (
        <div className='contnectControl tabWrap'>
            <Tabs>
                <TabPane tab={Mes['titleTabMeterreadingratemeterreadingrate']} key='1'>
                    <MeterReadRate />
                </TabPane>
                <TabPane tab={Mes['tabsTitleNoComMeterQuery']} key='2'>
                    <NoComMeterQuery />
                </TabPane>
            </Tabs>
        </div>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(MeterReadControl);
