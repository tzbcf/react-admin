// eslint-disable-next-line no-use-before-define
import React, { useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import TaskTab, { TRef } from './task';
import ConfigDcuArchiveTab from './configDcuArchive';


type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const ConfigDcuArchivePage: React.FC<Props> = (props) => {
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
                    <TabPane tab='Config DCU Archive' key='1'>
                        <ConfigDcuArchiveTab Mes={Mes} subSysNo={subSysNo} excuteTask={ excuteTask}/>
                    </TabPane>
                    <TabPane tab='DCU Task' key='2'>
                        <TaskTab Mes={Mes} cRef={ tRef}/>
                    </TabPane>


                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(ConfigDcuArchivePage);
