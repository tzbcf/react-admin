// eslint-disable-next-line no-use-before-define
import React from 'react';
import DcuMgnt from './dcuMgnt';
import DcuGroupMgnt from './dcuGroupMgnt';
import useFetchState from 'src/utils/useFetchState';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const DcuManagement: React.FC = () => {
    const [ defaultVal, setDefaultVal ] = useFetchState<string>('1');
    const callback = (key:string) => {
        setDefaultVal(key);
    };

    return (
        <div className='dcuMain'>
            <Tabs defaultActiveKey={defaultVal} onChange={callback}>
                <TabPane tab='DCU Management' key='1'>
                    <DcuMgnt />
                </TabPane>
                <TabPane tab='DCU Group Mgnt Management' key='2'>
                    <DcuGroupMgnt />
                </TabPane>
            </Tabs>
        </div>
    );
};


export default DcuManagement;
