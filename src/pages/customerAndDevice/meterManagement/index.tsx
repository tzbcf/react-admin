// eslint-disable-next-line no-use-before-define
import React, {useRef} from 'react';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import MeterMatch from './meterMatch';
import MeterGroup from './meterGroup';
import bus from 'src/utils/eventBus';
import useFetchState from 'src/utils/useFetchState';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const MeterMgnt: React.FC = () => {
    const cRef = useRef<CRef>();
    const [ defaultVal, setDefaultVal ] = useFetchState<string>('1');

    const onNodeCheck = (row: any) => {
        bus.emit('nodeCheck', row);
    };

    const callback = (key:string) => {
        cRef.current?.clearCheckedKeys();
        setDefaultVal(key);
    };

    return (
        <div className='deviceWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} cRef={cRef} />
            </div>
            <div className='wrapRight'>
                <Tabs defaultActiveKey={defaultVal} onChange={callback}>
                    <TabPane tab='Meter Match' key='1'>
                        <MeterMatch />
                    </TabPane>
                    <TabPane tab='Meter Group Mgnt' key='2'>
                        <MeterGroup />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};


export default MeterMgnt;
