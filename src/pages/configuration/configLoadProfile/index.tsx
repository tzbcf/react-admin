/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-15 14:46:41
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
import ConfigureLoad from './configure';
import ConfigLoadTask from './task';
import './index.less';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

type Props = {
  Mes: LangMessage,
}
const ConfigLoadProfileControl: React.FC<Props> = (props) => {
    const { Mes } = props;


    return (
        <div className='contnectControl tabWrap' style={{height: '100%'}}>
            <Tabs defaultActiveKey='1' type='card'>
                <TabPane tab={Mes['titleTableConfigureprofileconfigureprofile']} key='1'>
                    <ConfigureLoad />
                </TabPane>
                <TabPane tab={Mes['titleTabTasktask']} key='2'>
                    <ConfigLoadTask />
                </TabPane>
            </Tabs>
        </div>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(ConfigLoadProfileControl);


