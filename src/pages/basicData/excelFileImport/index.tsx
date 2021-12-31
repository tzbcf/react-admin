// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Tabs } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import ExcelFileTab from './excelFile';
import ExcelDataTab from './excelData';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const ExcelFileImportPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { TabPane } = Tabs;
    const [ tabKey, setTabKey ] = useFetchState<string>('1');

    const changeTabs = (key: string) => {
        setTabKey(key);
    };

    return (<>
        <div className='main' style={{height: '100%'}}>
            <div className='contnectControl tabWrap' style={{height: '100%'}}>
                <Tabs defaultActiveKey={tabKey} type='card' style={{ height: '100%' }} onChange={changeTabs} activeKey={ tabKey}>
                    <TabPane tab='Excel File' key='1'>
                        <ExcelFileTab Mes={Mes} subSysNo={subSysNo }/>
                    </TabPane>
                    <TabPane tab='Excel Data' key='2'>
                        <ExcelDataTab Mes={Mes} subSysNo={subSysNo }/>
                    </TabPane>


                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(ExcelFileImportPage);
