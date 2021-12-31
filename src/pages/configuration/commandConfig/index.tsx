// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import CommandState from './commandStatus';
import CommandEdit from './commandEdit';

type Props = {
    Mes: LangMessage;
};
const CommandConfigPage: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { TabPane } = Tabs;

    return (<>
        <div className='main' style={{height: '100%'}}>
            {/* <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleCommandConfig']}</h4>
            </div> */}
            <div className='pv10h20' style={{height: '100%'}}>
                <Tabs defaultActiveKey='1' type='card' style={{height: '100%'}}>
                    <TabPane tab='Command Enable/Disable' key='1'>
                        <CommandState Mes={ Mes}/>
                    </TabPane>
                    <TabPane tab='Command Edit' key='2'>
                        <CommandEdit Mes={ Mes}/>
                    </TabPane>

                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
}))(CommandConfigPage);
