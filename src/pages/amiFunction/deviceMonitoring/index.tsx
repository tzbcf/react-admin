// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
// import useFetchState from 'src/utils/useFetchState';
import DcuMonitoring from './dcuMonitoring';
// import MeterMonitoring from './meterMonitoring';
import {Tabs} from 'antd';
import './index.less';
const { TabPane } = Tabs;

type Props = {
  Mes: LangMessage,
}
const DeviceMonitoring: React.FC<Props> = (props) => {
    const { Mes } = props;

    return (
        <div className='deviceMonitoring tabWrap'>
            <Tabs>
                <TabPane tab={Mes['menuTitleDcuMonitoring']} key='1'>
                    <DcuMonitoring />
                </TabPane>
                {/* <TabPane tab={Mes['menuTitleMeterMonitoring']} key='2'>
                    <MeterMonitoring />
                </TabPane> */}
            </Tabs>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(DeviceMonitoring);
