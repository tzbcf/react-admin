// eslint-disable-next-line no-use-before-define
import React, { useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import TaskTab, { TRef } from './task';
import AlarmConfigTab from './alarmConfig';
import AlarmValueTab from './alarmValue';
import useFetchState from 'src/utils/useFetchState';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const AlarmInfoPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { TabPane } = Tabs;
    const [ tabKey, setTabKey ] = useFetchState<string>('1');
    const tRef = useRef<TRef>();
    const changeTabs = (key: string) => {
        setTabKey(key);
    };

    const excuteTask = () => {
        setTabKey('2');
        tRef.current?.initSearch();
    };

    return (<>
        <div className='main' style={{height: '100%'}}>
            <div className='contnectControl tabWrap' style={{height: '100%'}}>
                <Tabs defaultActiveKey={tabKey} type='card' style={{ height: '100%' }} onChange={changeTabs} activeKey={ tabKey}>
                    <TabPane tab='Alarm Config' key='1'>
                        <AlarmConfigTab Mes={Mes} subSysNo={subSysNo} excuteTask={ excuteTask}></AlarmConfigTab>
                    </TabPane>
                    <TabPane tab='Alarm Task' key='2'>
                        <TaskTab Mes={Mes} cRef={ tRef}/>
                    </TabPane>

                    <TabPane tab='Alarm Value Config' key='3'>
                        <AlarmValueTab Mes={Mes} subSysNo={ subSysNo}></AlarmValueTab>
                    </TabPane>


                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(AlarmInfoPage);
