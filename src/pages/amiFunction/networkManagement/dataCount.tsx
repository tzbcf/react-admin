/*
 * FileName : dataCount.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-21 15:56:15
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { ColumnsType } from 'antd/es/table';
import { Table, Tabs} from 'antd';
import useFetchState from 'src/utils/useFetchState';
const { TabPane } = Tabs;

type RelayListRow = {
  no: string;
  layer: string;
  semaphore: string;
  childrenSum: number;
}

type HopListRow = {
  layer: string;
  meterSum: number;
  onlineMeterSum: number;
  offlineMeterSum: number;
  relaySum: number;
  onlineRelaySum: number;
  offlineRelaySum: number;
}

type SemaphoreListRow = {
  level: string;
  meterSum: number;
  onlineMeterSum: number;
  offlineMeterSum: number;
  relaySum: number;
  onlineRelaySum: number;
  offlineRelaySum: number;
}

export type DataCountObj = {
  relayList: RelayListRow[];
  hopList: HopListRow[];
  semaphoreList: SemaphoreListRow[];
}

type Props = {
  Mes: LangMessage;
  subSysNo: string;
  data: DataCountObj;
}
const DataCount: React.FC<Props> = (props) => {
    const { Mes, data } = props;
    const [ tabsKey, setTabsKey ] = useFetchState<string>('relayList');
    const [ tableData, setTableData ] = useFetchState<RelayListRow[]|HopListRow[]|SemaphoreListRow[]>(data.relayList);

    const RelayListColumns: ColumnsType<RelayListRow> = [
        {
            title: 'No.',
            dataIndex: 'index',
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: 'Relay Device No.',
            dataIndex: 'no',
        },
        {
            title: 'Hop',
            dataIndex: 'layer',
        },
        {
            title: 'Semaphore',
            dataIndex: 'semaphore',
        },
        {
            title: 'Belong To Device',
            dataIndex: 'childrenSum',
        },
    ];

    const HopeListColumns: ColumnsType<HopListRow> = [
        {
            title: 'No.',
            dataIndex: 'index',
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: 'Hop',
            dataIndex: 'layer',
        },
        {
            title: 'Meter',
            render (value:any, record:HopListRow) {
                return (<p>
                    <span>Sum: {record.meterSum}</span>
                    <span>Online: {record.onlineMeterSum}</span>
                    <span>Offline: {record.offlineMeterSum }</span>
                </p>);
            },
        },
        {
            title: 'Relay',
            render (value:any, record:HopListRow) {
                return (<p>
                    <span>Sum: {record.relaySum}</span>
                    <span>Online: {record.onlineRelaySum}</span>
                    <span>Offline: {record.offlineRelaySum }</span>
                </p>);
            },
        },
    ];

    const SemaphoreLisColumns: ColumnsType<SemaphoreListRow> = [
        {
            title: 'No.',
            dataIndex: 'index',
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: 'Semaphore Level',
            dataIndex: 'level',
        },
        {
            title: 'Meter',
            render (value:any, record:SemaphoreListRow) {
                return (<p>
                    <span>Sum: {record.meterSum}</span>
                    <span>Online: {record.onlineMeterSum}</span>
                    <span>Offline: {record.offlineMeterSum }</span>
                </p>);
            },
        },
        {
            title: 'Relay',
            dataIndex: 'index',
            render (value:any, record:SemaphoreListRow) {
                return (<p>
                    <span>Sum: {record.meterSum}</span>
                    <span>Online: {record.onlineMeterSum}</span>
                    <span>Offline: {record.offlineMeterSum }</span>
                </p>);
            },
        },
    ];

    // tabs切换
    const tabsCallback = (val: string) => {
        setTabsKey(val);
        setTableData(data[val]);
    };

    return (
        <Tabs
            type='card'
            activeKey={tabsKey}
            onChange={tabsCallback}>
            <TabPane tab={Mes['titleLabelRelayDevice']} key='relayList'>
                <Table
                    columns={RelayListColumns}
                    dataSource={tableData as RelayListRow[]}
                    rowKey={(record:RelayListRow, index?:number) => `${index}`}
                    pagination={{pageSize: 10}}
                />
            </TabPane>
            <TabPane tab={Mes['titleLabelMeterHops']} key='hopList'>
                <Table
                    columns={HopeListColumns}
                    dataSource={tableData as HopListRow[]}
                    rowKey={(record:HopListRow, index?:number) => `${index}`}
                    pagination={{pageSize: 10}}
                />
            </TabPane>
            <TabPane tab={Mes['titleLabelSemaphoresemaphore']} key='semaphoreList'>
                <Table
                    columns={SemaphoreLisColumns}
                    dataSource={tableData as SemaphoreListRow[]}
                    rowKey={(record:SemaphoreListRow, index?:number) => `${index}`}
                    pagination={{pageSize: 10}}
                />
            </TabPane>
        </Tabs>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(DataCount);


