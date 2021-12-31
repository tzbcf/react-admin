// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import NtpConfig from './ntpConfig';
import NtpTask from './ntpTask';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};
const NtpConfigPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { TabPane } = Tabs;

    return (<>
        <div className='main' style={{height: '100%'}}>
            {/* <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleCommandConfig']}</h4>
            </div> */}
            <div className='pv10h20' style={{height: '100%'}}>
                <Tabs defaultActiveKey='1' type='card' style={{height: '100%'}}>
                    <TabPane tab='NTP Config' key='1'>
                        <NtpConfig Mes={Mes} subSysNo={ subSysNo}/>
                    </TabPane>
                    <TabPane tab='Task' key='2'>
                        <NtpTask Mes={Mes}/>
                    </TabPane>

                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(NtpConfigPage);
