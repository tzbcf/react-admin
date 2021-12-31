/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-09 09:55:12
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle} from 'react';
import { message, Modal, Tabs } from 'antd';
import { Key } from 'rc-tree/es/interface';
import TerminalContent, { ItemType, DataItem } from './content';
import { MeterScheduleInfoData } from 'src/api/common/type';
import { ColumnsType } from 'antd/es/table';
import useFetchState from 'src/utils/useFetchState';
import { common } from 'src/api';
import { dateFormat } from 'src/utils/utils';
const { TabPane } = Tabs;

type DeviceType = 'meter' | 'dcu';

export interface CRef {
  openModel(type: DeviceType, id: string): Promise<void>;
  closeModel(): void;
}

type Props = {
  cRef: React.MutableRefObject<CRef | undefined>;
  width?: number;
}


type TabsListItemData = DataItem[] | MeterScheduleInfoData[];

type TabsListItem<T> = {
  name: string,
  key: string;
  type: ItemType;
  data: T[];
  colunms: ColumnsType<T>
}
// tab标签列表
const TABLIST = [
    {
        name: 'BaseInfo',
        key: '0',
        type: 'List' as ItemType,
        data: [] as any,
        colunms: [] as any,
    },
    {
        name: 'Schedule',
        key: '1',
        type: 'Table' as ItemType,
        data: [] as any,
        colunms: [] as any,
    },
    {
        name: 'Parameter',
        key: '2',
        type: 'List' as ItemType,
        data: [] as any,
        colunms: [] as any,
    },
];

const terminalData = {
    'meter': {
        tabsList: TABLIST,
    },
    'dcu': {
        tabsList: [
            ...TABLIST,
            {
                name: 'Log',
                key: '3',
                type: 'Table' as ItemType,
                data: [] as any,
                colunms: [] as any,
            },
        ],
    },
};
// Schedule处理
const SCHEDULECOLUNMS = [
    {
        title: 'Remark',
        dataIndex: 'REMARK',
    },
    {
        title: 'AFN',
        dataIndex: 'AFN',
    },
    {
        title: 'FN',
        dataIndex: 'FN',
    },
    {
        title: 'AFN Name',
        dataIndex: 'AFN_NAME',
    },
    {
        title: 'Read Mode',
        dataIndex: 'READ_MODE',
    },
    {
        title: 'Parameters',
        dataIndex: 'EXTRA_PARAMETERS',
    },
];
// DCU log展示数据
const LOGCOLUNMS = [
    {
        title: 'No',
        dataIndex: 'CST_NO',
    },
    {
        title: 'Ip',
        dataIndex: 'CST_IP',
    },
    {
        title: 'Status',
        dataIndex: 'CST_STATUS',
    },
    {
        title: 'Status Time',
        dataIndex: 'STATUS_TIME',
        render (_: any, record: any) {
            return (
                <>
                    <span>{ dateFormat('YYYY-MM-DD HH:mm:ss', new Date(parseInt(record.STATUS_TIME, 10)))}</span>
                </>);
        },
    },
];

// DCU AMI展示数据
const AMITYPE = {
    'Communication Address': 'CST_ADDR',
    'Security level': 'SECURITY_LEVEL',
    'Client Address': 'ClientAddr',
    'Meter Password': 'MeterPwd',
    'Whether to encrypt data': 'EncryptedData',
    'Safety rules': 'SecurityPolicy',
    'Client System Name': 'ClientTitle',
    'Master key': 'MKey',
    'Authentication key': 'AKey',
    'Encrypted key': 'EKey',
    'Broadcast E-key': 'DKey',
    'Dedicated key': 'BKey',
    'Private key': 'PSK',
};

// DCU INFO展示数据
const DCUINFO = {
    'CST_NAME': 'DCU Name',
    'CST_TYPE_NAME': 'DCU Type',
    'MTR_NUM': 'Max Load Meter Num',
    'CST_IP': 'DCU Ip',
    'DST_NAME': 'Transformer Name',
    'SECTION_NAME': 'Feeder Name',
    'NODE_NAME': 'Organization Name',
    'INSTORE_TIME': 'Instore Time',
    'CST_CREATE_TIME': 'DCU Create Time',
    'CST_ADDR': 'DCU Address',
    'CST_NO': 'DCU No',
    'CST_RMK': 'DCU Remark',
    'CST_TOTAL_COUNT': 'DCU Total',
    'CST_REGISTERED_COUNT': 'DCU Registered',
};

// Meter INFO展示数据
const METERINFO = {
    'ASSET_NO': 'Asset No',
    'CUSTOMER_NO': 'Customer No',
    'FAC_NAME': 'Fac Name',
    'CST_NAME': 'DCU Name',
    'METER_NO': 'Meter No',
    'MEASURE_POINT_NO': 'Measure Point No',
    'METER_MODEL_NAME': 'Meter Model Name',
    'DST_NAME': 'Transformer Name',
    'INSTORE_TIME': 'Instore Time',
    'NODE_NAME': 'Organization Name',
    'SECTION_NAME': 'Feeder Name',
};

const deviceTitle = {
    meter: 'Meter',
    dcu: 'DCU',
};

const TerminalInfo: React.FC<Props> = (props) => {
    const { cRef, width = 800 } = props;
    const [ tabsList, setTabsList ] = useFetchState<TabsListItem<TabsListItemData>[]>([]);

    const [ visible, setVisible ] = useFetchState<boolean>(false);
    const [ devicedType, setDevicedType ] = useFetchState<DeviceType>('meter');

    const callback = (key: Key) => {
        console.log('key------', key);
    };

    const getMeterInfoData = async (type: DeviceType, id: string): Promise<void> => {
        const list = terminalData[type].tabsList;
        const res = await Promise.all([
            common.getMeterBaseInfo({ METERNO: id }),
            common.getMeterScheduleInfo({ METERNO: id }),
            common.getMeterAMIInfo({ METERNO: id }),
        ]);
        // 基础数据处理
        const baseInfoObj = res[0][0];

        list[0].data = Object.keys(METERINFO).map((key: string) => ({
            label: METERINFO[key],
            value: baseInfoObj[key],
        }));

        list[1].colunms = SCHEDULECOLUNMS;
        list[1].data = res[1].map((v, i) => ({...v, key: i}));
        // parameter数据处理
        const dataList = res[2].dataList[0];
        const titleList = res[2].titleList;

        list[2].data = titleList.map((v, i) => ({
            label: v.PROTOCAL_NAME,
            value: dataList[i],
        }));
        setTabsList(list);
    };

    const getDcuInfoData = async (type: DeviceType, id: string) => {
        // 拿到tab
        const list = terminalData[type].tabsList;
        const res = await Promise.all([
            common.getDcuBaseData({ dcuGuid: id }),
            common.getDcuSchedule({ dcuGuid: id }),
            common.getDcuAmi({ dcuGuid: id }),
            common.getDcuLog({ dcuGuid: id }),
        ]);

        list[0].data = Object.keys(DCUINFO).map((key: string) => ({
            label: DCUINFO[key],
            value: res[0][0][key],
        }));
        list[1].colunms = SCHEDULECOLUNMS;
        list[1].data = res[1].map((v, i) => ({ ...v, key: i }));
        let titles: any[] = [];

        res[2].titleList.map((v) => {
            if (AMITYPE[v.PROTOCAL_NAME]) {
                titles.push(v);
            }
        });
        list[2].data = titles.map((v) => {
            if (v.ENUM_LIST.length > 0) {
                let values = v.ENUM_LIST.split('@');

                for (let i = 0; i < values.length; i++) {
                    let tmp = values[i].split(',');

                    let tmpValue = res[2].dataList[0][AMITYPE[v.PROTOCAL_NAME]] + '';

                    if (tmp[1] === tmpValue) {
                        return ({
                            label: v.PROTOCAL_NAME,
                            value: tmp[0],
                        });
                    }
                }
                return ({
                    label: v.PROTOCAL_NAME,
                    value: res[2].dataList[0][AMITYPE[v.PROTOCAL_NAME]],
                });
            } else {
                return ({
                    label: v.PROTOCAL_NAME,
                    value: res[2].dataList[0][AMITYPE[v.PROTOCAL_NAME]],
                });
            }
        });
        list[3].colunms = LOGCOLUNMS;
        list[3].data = res[3].map((v, i) => ({ ...v, key: i }));
        setTabsList(list);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    // 暴露给父级调用的方法
    useImperativeHandle(cRef, () => ({
        async openModel (type: DeviceType, id: string) {
            try {
                if (type === 'meter') {
                    await getMeterInfoData(type, id);
                } else if (type === 'dcu') {
                    await getDcuInfoData(type, id);
                }
                setDevicedType(type);
                setVisible(true);
            } catch (error: any) {
                message.error(error.toString());
            }
        },
        closeModel () {
            handleCancel();
        },
    }));

    return (
        <Modal
            title={deviceTitle[devicedType]}
            visible={visible}
            width={width}
            onCancel={handleCancel}
            footer={[]}
            className='terminalModal'
        >
            <Tabs defaultActiveKey='0' onChange={callback}>
                {
                    tabsList.map((v) => (
                        <TabPane tab={v.name} key={v.key}>
                            <TerminalContent<TabsListItemData> type={v.type} data={v.data} colunms={v.colunms} />
                        </TabPane>
                    ))
                }
            </Tabs>
        </Modal>
    );
};

export default TerminalInfo;
