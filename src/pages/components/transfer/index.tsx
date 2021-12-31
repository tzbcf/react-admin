/* eslint-disable camelcase */
/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-30 14:32:21
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef} from 'react';
import TransferTable, {PaginationConfig, CRef, arrFormat} from 'src/components/business/transfer';
import { ColumnsType } from 'antd/es/table';
import { Input, Select, Row, Col } from 'antd';
import { Key } from 'antd/es/table/interface';
import './index.less';
const { Option } = Select;

interface LeftMeterRows {
    DB_DOT: string;
    IS_LOCK: string;
    METER_GUID: string;
    METER_MODEL_NAME: string;
    METER_NO: string;
    isPrepend: string;
}

interface RightMeterRows extends LeftMeterRows {
    CST_NAME: string;
}

const leftData = {
    // eslint-disable-next-line max-len
    'rows': [ { 'METER_GUID': '77f2dc90f18164031428714332168890', 'METER_NO': '0024000223412', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' }, { 'METER_GUID': '77f2dc90ec8164031428497694728890', 'METER_NO': '0024000223404', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' }, { 'METER_GUID': '77f2dc90e68164031428248739848890', 'METER_NO': '0024000223396', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' }, { 'METER_GUID': '77f2dc90dd8164031427873792008890', 'METER_NO': '0024000223370', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' }, { 'METER_GUID': '77f2dc90d88164031427669483528890', 'METER_NO': '0024000223362', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' }, { 'METER_GUID': '77f2dc90d38164031427455918088890', 'METER_NO': '0024000223354', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'L', 'IS_LOCK': 'Uninstall' } ],
    'total': 6,
};
const rightData = {
    // eslint-disable-next-line max-len
    rows: [ { 'CST_NAME': '07315572', 'METER_GUID': '79412fbe398399291669136465924389', 'METER_NO': '0000011223344', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210506-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7aa3fc42ba8648959197199196164389', 'METER_NO': '0002493000057', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210714-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc90cd8164031427206471688890', 'METER_NO': '0024000223347', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc90e28164031428087930888890', 'METER_NO': '0024000223388', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc90f68164031428933222408890', 'METER_NO': '0024000223420', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc90fa8164031429107138568890', 'METER_NO': '0024000223438', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc90ff8164031429299896328890', 'METER_NO': '0024000223446', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91048164031429516165128890', 'METER_NO': '0024000223453', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91088164031429672304648890', 'METER_NO': '0024000223461', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc910d8164031429886648328890', 'METER_NO': '0024000223479', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91118164031430047088648890', 'METER_NO': '0024000223487', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91168164031430270935048890', 'METER_NO': '0024000223495', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc911b8164031430479585288890', 'METER_NO': '0024000223503', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc911f8164031430648463368890', 'METER_NO': '0024000223511', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91248164031430848102408890', 'METER_NO': '0024000223529', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc91288164031431014481928890', 'METER_NO': '0024000223537', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '77f2dc912d8164031431222804488890', 'METER_NO': '0024000223545', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210302-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '78484e50e28224157534252277768890', 'METER_NO': '002493000044', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210317-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '78484edb198224159018336460808890', 'METER_NO': '002493000045', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210317-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7861f0b3d08242196084758446088890', 'METER_NO': '002493000046', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210312-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7861f0b3d78242196085049384968890', 'METER_NO': '002493000047', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210312-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7861f0b3dd8242196085310095368890', 'METER_NO': '002493000048', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210312-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '799d6f40178464205481295872004389', 'METER_NO': '002493000055', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210524-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7a3cbca8bb8576304564105748484389', 'METER_NO': '002493000056', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210524-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' }, { 'CST_NAME': '07315572', 'METER_GUID': '7a126baca98546527082633420804389', 'METER_NO': '002493000059', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210616-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Uninstall' }, { 'CST_NAME': '07315572', 'METER_GUID': '783df7c8c88216882803458007048890', 'METER_NO': '002693000051', 'DB_DOT': 'DLMS UDPCLIENT 1METER-20210317-1', 'METER_MODEL_NAME': 'DLMS UDPCLIENT 1METER', 'isPrepend': 'R', 'IS_LOCK': 'Installed' } ],
    total: 26,
};
const getMeterData = (params: any, type: boolean) => new Promise((resolve) => {
    setTimeout(() => {
        if (type) {
            resolve(leftData);
        } else {
            resolve(rightData);
        }
    }, 1500);
});

const LeftSolt = () => (
    <Row className='leftSolt' gutter={24}>
        <Col span={6}>
            <Select>
                <Option value='1'>DCU</Option>
                <Option value='2'>Meter</Option>
            </Select>
        </Col>
        <Col span={6}>
            <Input placeholder='please' />
        </Col>
    </Row>
);

const RightSolt = () => (
    <Row className='rightSolt' gutter={24}>
        <Col span={8}>
            <Input placeholder='please' />
        </Col>
    </Row>
);

const TransferPage = () => {
    const cRef = useRef<CRef>();
    const deviceIdName = '07315572';
    const leftColumns: ColumnsType<LeftMeterRows> = [
        {
            title: 'Meter No',
            dataIndex: 'METER_NO',
            width: 120,
        },
        {
            title: 'Meter Type',
            dataIndex: 'METER_MODEL_NAME',
        },
        {
            title: 'Batch Name',
            dataIndex: 'DB_DOT',
            ellipsis: true,
        },
    ];
    const rightColums: ColumnsType<RightMeterRows> = [
        {
            title: 'DCU Name',
            dataIndex: 'CST_NAME',
            width: 120,
        },
        {
            title: 'Meter No',
            dataIndex: 'METER_NO',
        },
        {
            title: 'Meter Type',
            dataIndex: 'METER_MODEL_NAME',
            ellipsis: true,
        },
        {
            title: 'State',
            dataIndex: 'IS_LOCK',
        },
    ];

    const leftGetData = async (page: PaginationConfig): Promise<any> => {
        const params = {
            L_Meter_No: '',
            L_Meter_type: '',
            R_Meter_type: '',
            R_Meter_No: '',
            subSysNo: '100068',
            deviceId: '77f2d5a9a38164012452423147528890',
            meters: '',
            DeviceType: '',
            allToRight: false,
        };

        return await getMeterData({...params, ...page}, true);
    };

    const rightGetData = async (page: PaginationConfig): Promise<any> => {
        const params = {
            L_Meter_No: '',
            L_Meter_type: '',
            R_Meter_type: '',
            R_Meter_No: '',
            subSysNo: '',
            deviceId: '77f2d5a9a38164012452423147528890',
            meters: '',
            DeviceType: '',
            allToRight: false,
        };

        return await getMeterData({...params, ...page}, false);
    };

    const btnR = () => {
        console.log('-----btnR');
    };

    const btnL = () => {
        const leftList = cRef.current?.getLeftTableData() as any[];
        const rightList = cRef.current?.getRightTableData() as any[];
        const leftSelectedRowKeys = cRef.current?.getLeftSelectKeysList() as Key[];
        const rightSelectedRowKeys = cRef.current?.getRightSelectKeysList() as Key[];
        const residueData = arrFormat(leftList, leftSelectedRowKeys, 'METER_NO');

        cRef.current?.setLeftData({rows: residueData, total: residueData.length});
        cRef.current?.setLeftSelectKeysList([]);
        const deletData = arrFormat(leftList, leftSelectedRowKeys, 'METER_NO', false).map((v) => {
            v.CST_NAME = deviceIdName;
            return v;
        });

        cRef.current?.setRightData({rows: [ ...deletData, ...rightList ], total: [ ...deletData, ...rightList ].length});
        cRef.current?.setRightSelectKeysList([ ...leftSelectedRowKeys, ...rightSelectedRowKeys ]);
    };

    return (
        <div className='transferPage'>
            <div className='container'>
                <TransferTable
                    rowKey={'METER_NO'}
                    leftColumns={leftColumns}
                    rightColums={rightColums}
                    leftGetData={leftGetData}
                    rightGetData={rightGetData}
                    LeftSolt={LeftSolt}
                    scrollY={500}
                    cRef={cRef}
                    btnEvent={{
                        btnL: btnL,
                        btnR: btnR,
                    }}
                    RightSolt={RightSolt}
                />
            </div>
        </div>
    );
};

export default TransferPage;
