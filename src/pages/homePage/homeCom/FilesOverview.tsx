/*
 * FileName : FilesOverview.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-19 16:25:03
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { message, Switch, Table } from 'antd';
import { homePage } from 'src/api';
import { TableOutlined } from '@ant-design/icons';
import useFetchState from 'src/utils/useFetchState';
import '../index.less';

type DataSource = {
  METER_COUNT: number;
  METER_REG_COUNT: number;
  CST_TYPE_NAME?: string;
  METER_MODEL_NAME?: string;
}

type TableData = {
    dcu: DataSource[];
    meter: DataSource[];
}

type resData = {
    data: DataSource[];
}

const tableData: TableData = {
    'dcu': [],
    'meter': [],
};

const FilesOverview = () => {

    const [ type, setType ] = useFetchState<boolean>(true);
    const [ columns, setColumns ] = useFetchState([
        {
            title: 'DCU Type',
            dataIndex: 'CST_TYPE_NAME',
            key: 'CST_TYPE_NAME',
        },
        {
            title: 'Meter Register Count',
            dataIndex: 'METER_COUNT',
            key: 'METER_COUNT',
        },
        {
            title: 'Meter Total Count',
            dataIndex: 'METER_REG_COUNT',
            key: 'METER_REG_COUNT',
        },
    ]);

    const [ loading, setLoading ] = useFetchState<boolean>(true);

    const [ dataSource, setDataSource ] = useFetchState<DataSource[]>([]);

    // 获取dcu关联表计统计数据
    const getDcuCountList = async () => {
        try {
            const res = await homePage.getDcuRelationMeters() as resData;

            tableData.dcu = res.data;
            setDataSource(res.data);
        } catch (e: any) {
            setDataSource([]);
            message.error(e.toString());
            console.error(e.toString());
        }
        setLoading(false);
    };

    // 获取表计关联数据
    const getMeterCountList = async () => {
        try {
            const res = await homePage.getMeterTypeRelationMeters() as resData;

            tableData.meter = res.data;
            setDataSource(res.data);
        } catch (e: any) {
            setDataSource([]);
            message.error(e.toString());
            console.error(e);
        }
        setLoading(false);
    };

    // table数据切换，展示dcu(true)还是Meter(false) 同时设置表头
    const SwitchClickEvent = (check: boolean) => {
        setType(check);
        setDataSource([]);
        setLoading(true);
        if (check) {
            setColumns([
                {
                    title: 'DCU Type',
                    dataIndex: 'CST_TYPE_NAME',
                    key: 'CST_TYPE_NAME',
                },
                {
                    title: 'Meter Register Count',
                    dataIndex: 'METER_REG_COUNT',
                    key: 'METER_REG_COUNT',
                },
                {
                    title: 'Meter Total Count',
                    dataIndex: 'METER_COUNT',
                    key: 'METER_COUNT',
                },
            ]);
            if (tableData.dcu.length) {
                setDataSource(tableData.dcu);
                setLoading(false);
            } else {
                getDcuCountList();
            }
        } else {
            setColumns([
                {
                    title: 'Meter Type',
                    dataIndex: 'METER_MODEL_NAME',
                    key: 'METER_MODEL_NAME',
                },
                {
                    title: 'Meter Register Count',
                    dataIndex: 'METER_REG_COUNT',
                    key: 'METER_REG_COUNT',
                },
                {
                    title: 'Meter Total Count',
                    dataIndex: 'METER_COUNT',
                    key: 'METER_COUNT',
                },
            ]);
            if (tableData.meter.length) {
                setDataSource(tableData.meter);
                setLoading(false);
            } else {
                getMeterCountList();
            }
        }
    };

    useEffect(() => {
        if (type) {
            getDcuCountList();
        } else {
            getMeterCountList();
        }
    }, []);

    return (
        <div className='FilesOverview'>
            <h5>
                <div>
                    <TableOutlined />
                    <span> Files overview</span>
                </div>
                <Switch checkedChildren='DCU' unCheckedChildren='Meter' defaultChecked onClick={SwitchClickEvent} />
            </h5>
            <div>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ y: 160 }}
                    rowKey={(record, index) => `${index}`}
                />
            </div>
        </div>
    );
};

export default FilesOverview;
