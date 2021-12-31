// eslint-disable-next-line no-use-before-define
import React, { useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { message, Tabs } from 'antd';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import SchemeProfile, { ARef} from './schemeProfile';
import SeasonProfile, { BRef} from './seasonProfile';
import WeekProfile, { CRef} from './weekProfile';
import DayProfile, { DRef} from './dayProfile';
import TaskTab, { TRef} from './task';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const ActivityCalendarPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { TabPane } = Tabs;
    const [ tabKey, setTabKey ] = useFetchState<string>('1');
    const tRef = useRef<TRef>();
    const dRef = useRef<DRef>();
    const cRef = useRef<CRef>();
    const bRef = useRef<BRef>();
    const aRef = useRef<ARef>();
    // 按钮事件
    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnTitleAdd'],
            onClick () {
                if (tabKey === '4') {
                    dRef.current?.showAddDialog();
                }
                if (tabKey === '3') {
                    cRef.current?.showAddDialog();
                }
                if (tabKey === '2') {
                    bRef.current?.showAddDialog();
                }
                if (tabKey === '1') {
                    aRef.current?.showAddDialog();
                }
                if (tabKey === '5') {
                    message.warn(Mes['messageHintPleasegotothedesignatedtabpleasegotothedesignatedtab']);
                }
            },
        },
        {
            type: 'Edit',
            btnType: 'primary',
            title: Mes['btnTitleEditor'],
            onClick () {
                if (tabKey === '4') {
                    dRef.current?.showEditDialog();
                }
                if (tabKey === '3') {
                    cRef.current?.showEditDialog();
                }
                if (tabKey === '2') {
                    bRef.current?.showEditDialog();
                }
                if (tabKey === '1') {
                    aRef.current?.showEditDialog();
                }
                if (tabKey === '5') {
                    message.warn(Mes['messageHintPleasegotothedesignatedtabpleasegotothedesignatedtab']);
                }
            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            title: Mes['btnTitleDelete'],
            onClick () {
                if (tabKey === '4') {
                    dRef.current?.showDelDialog();
                }
                if (tabKey === '3') {
                    cRef.current?.showDelDialog();
                }
                if (tabKey === '2') {
                    bRef.current?.showDelDialog();
                }
                if (tabKey === '1') {
                    aRef.current?.showDelDialog();
                }
                if (tabKey === '5') {
                    message.warn(Mes['messageHintPleasegotothedesignatedtabpleasegotothedesignatedtab']);
                }
            },
        },
        {
            type: 'Start',
            btnType: 'primary',
            title: Mes['btnExecuteexecute'],
            onClick () {
                if (tabKey === '1') {
                    aRef.current?.excute();
                } else {
                    message.warn(Mes['messageHintPleasegotothedesignatedtabpleasegotothedesignatedtab']);
                }
            },
        },
        {
            type: 'Restart',
            btnType: 'primary',
            title: Mes['btnBtnresendbtnresend'],
            onClick () {
                if (tabKey === '5') {
                    tRef.current?.resend();
                } else {
                    message.warn(Mes['messageHintPleasegotothedesignatedtabpleasegotothedesignatedtab']);
                }
            },
        },


    ];

    const changeTabs = (key: string) => {
        setTabKey(key);
    };

    const excuteTask = () => {
        setTabKey('5');
        tRef.current?.initSearch();
    };

    return (<>
        <div className='main' style={{height: '100%'}}>
            <div className='flexCenter flexBetween' style={{height: '5%'}}>
                <BtnList btnList={btnList} />
            </div>
            <div className='contnectControl tabWrap' style={{height: '95%'}}>
                <Tabs defaultActiveKey={tabKey} type='card' style={{ height: '95%' }} onChange={changeTabs} activeKey={ tabKey}>
                    <TabPane tab='Scheme Profile' key='1'>
                        <SchemeProfile Mes={Mes} subSysNo={subSysNo} aRef={aRef} excuteTask={ excuteTask}/>
                    </TabPane>
                    <TabPane tab='Season Profile' key='2'>
                        <SeasonProfile Mes={Mes} subSysNo={subSysNo} cRef={ bRef}/>
                    </TabPane>

                    <TabPane tab='Week Profile' key='3'>
                        <WeekProfile Mes={Mes} subSysNo={subSysNo} cRef={ cRef}/>
                    </TabPane>

                    <TabPane tab='Day Profile' key='4'>
                        <DayProfile Mes={Mes} subSysNo={ subSysNo} cRef={ dRef}/>
                    </TabPane>

                    <TabPane tab='Task' key='5'>
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
}))(ActivityCalendarPage);
