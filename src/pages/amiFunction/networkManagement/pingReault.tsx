/*
 * FileName : pingReaultType.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-30 16:29:01
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import useFetchState from 'src/utils/useFetchState';
import { LangMessage } from 'src/store/common/language';
import { ColumnsType } from 'antd/es/table';
import { PingResultRow } from 'src/api/AmiFunction/netWorkMgnt/type.d';
import { abnormalFn } from 'src/utils/function';
import {amiFunc} from 'src/api';
import {Table, Tabs} from 'antd';
const { TabPane } = Tabs;

type Props = {
  Mes: LangMessage;
}
const PingReaultDialog: React.FC<Props> = (props) => {
    const { Mes } = props;
    const ROWS = 10;
    // table数据
    const [ tableData, setTableData ] = useFetchState<PingResultRow[]>([]);
    // 总数
    const [ total, setTotal ] = useFetchState<number>(0);
    // 当前分页
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 类型，true为dcu,false为meter
    const [ type, setType ] = useFetchState<string>('DCU');
    // table 头部
    const columns: ColumnsType<PingResultRow> = [
        {
            title: Mes['titleTableXuhaoxuhao'],
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: type === 'DCU' ? Mes['titleTableDcunodcuno'] : Mes['titleTableMeternometerno'],
            dataIndex: 'noList',
            render (value) {
                if (Array.isArray(value)) {
                    return value.map((v) => (<span key={v}>{ v }</span>));
                }
            },
        },
        {
            title: Mes['titleTableTblzhuangtaitblzhuangtai'],
            render (value, record) {
                let rate = parseInt((record.success * 100 / record.total).toFixed(0), 10);

                rate = isFinite(rate) ? rate : 0;
                if (record.complete === record.total) {
                    return (<p>
                        <span>complete:</span>
                        <i>{ rate > 0 ? `${rate}%` : '0%' }</i>
                    </p>);
                }
                return (<span>executing</span>);
            },
        },
        {
            title: Mes['titleTableResultresult'],
            render (value, record) {
                let hesTotalTime: string|number = '';

                if (record.pingActualTotalTime) {
                    hesTotalTime = record.pingActualTotalTime;
                } else {
                    hesTotalTime = new Date(record.endTime).getTime() - new Date(record.startTime).getTime();
                }
                return (<ul>
                    <li>
                        <span className='label'>group id:</span>
                        <span className='value'>{ record.groupId }</span>
                    </li>
                    <li>
                        <span className='label'>ping total count:</span>
                        <span className='value'>{ record.total }</span>
                    </li>
                    <li>
                        <span className='label'>success:</span>
                        <span className='value'>{ record.success }</span>
                    </li>
                    <li>
                        <span className='label'>hes start time:</span>
                        <span className='value'>{ record.startTime }</span>
                    </li>
                    <li>
                        <span className='label'>actual total time:</span>
                        <span className='value'>{ hesTotalTime }</span>
                    </li>
                </ul>);
            },
        },
    ];

    const getData = async (page:number = 1, pingType:string = type) => {
        abnormalFn(async () => {
            const res = await amiFunc.netWorkMgnt.pingResult({
                pingType: pingType === 'DCU' ? 1 : 2,
                page: page,
            });

            setCurrent(page);
            setTotal(res.sum);
            setTableData(res.list);
        });
    };

    const typeChange = (val: string) => {
        console.log('-----', val);
        setType(val);
        getData(1, val);
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            getData(page);
        },
        current: current,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    useEffect(() => {
        getData();
    }, []);

    return (<>

        <Tabs
            type='card'
            activeKey={type}
            onChange={typeChange}>
            <TabPane tab={Mes['titleTableDcudcu']} key='DCU'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    rowKey='groupId'
                    pagination={pagination}
                />
            </TabPane>
            <TabPane tab={Mes['titleLabelMetermeter']} key='meter'>
                <Table
                    columns={columns}
                    dataSource={tableData}
                    rowKey='groupId'
                    pagination={pagination}
                />
            </TabPane>
        </Tabs>
    </>);

};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(PingReaultDialog);

