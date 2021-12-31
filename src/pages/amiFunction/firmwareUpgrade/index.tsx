// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import RemoteUpgrade from './remoteUpgrade';
import QueryResult from './queryResult';
import useFetchState from 'src/utils/useFetchState';
import { Tabs } from 'antd';
import './index.less';
const { TabPane } = Tabs;

type Props = {
  Mes: LangMessage,
}
const FirmwareUpgrade: React.FC<Props> = (props) => {
    const { Mes } = props;
    const [ activeKey, setActiveKey ] = useFetchState<string>('1');
    // 控制结果页数据展示
    const [ queryFlag, setQueryFlag ] = useFetchState<boolean>(false);
    const handleTabsChange = (val: string, flag?: boolean) => {
        if (flag) {
            setQueryFlag(true);
        }
        if (parseInt(val, 10) === 1) {
            setQueryFlag(false);
        }
        setActiveKey(val);
    };

    return (
        <div className='firmwareUpgrade tabWrap'>
            <Tabs activeKey={activeKey} onChange={handleTabsChange}>
                <TabPane tab={Mes['titleTabRemoteupgraderemoteupgrade']} key='1'>
                    <RemoteUpgrade tabsChange={handleTabsChange} />
                </TabPane>
                <TabPane tab={Mes['titleLabelIdqueryresultidqueryresult']} key='2'>
                    <QueryResult flag={queryFlag} />
                </TabPane>
            </Tabs>
        </div>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(FirmwareUpgrade);
