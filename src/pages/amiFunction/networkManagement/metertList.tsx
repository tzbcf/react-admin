/*
 * FileName : metertList.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-07 14:05:12
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
import { LangMessage } from 'src/store/common/language';
import { ColumnsType } from 'antd/es/table';
import { ToMeterListRow } from 'src/api/AmiFunction/netWorkMgnt/type.d';
import { abnormalFn } from 'src/utils/function';
import { Table} from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { amiFunc } from 'src/api';


type Props = {
  Mes: LangMessage;
  subSysNo: string;
  dcuNo: string;
}
const MeterListDialog: React.FC<Props> = (props) => {
    const { Mes, dcuNo } = props;
    const [ data, setData ] = useFetchState<ToMeterListRow[]>([]);
    const [ tableData, setTableData ] = useFetchState<ToMeterListRow[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const columns: ColumnsType<ToMeterListRow> = [
        {
            title: Mes['titleTableXuhaoxuhao'],
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'sectionName',
        },
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'transformerName',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'dcuNo',
        },
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'dcuName',
        },
        {
            title: Mes['titleTableMeteraddrmeteraddr'],
            dataIndex: 'meterAddr',
        },
    ];

    const getData = () => {
        abnormalFn(async () => {
            setLoading(true);

            const res = await amiFunc.netWorkMgnt.getBelongToMeterList(dcuNo);

            if (res.sum && res.list.length) {
                setData(res.list);
                setTableData(res.list.slice(0, res.pageSize));
                setTotal(res.sum);
                setLoading(false);
            }

        });
    };

    // 分页配置
    const pagetion = {
        total: total,
        async onChange (page: number, pageSize:number = 10) {
            setLoading(true);
            setTableData(data.slice((page - 1) * pageSize, page * pageSize));
            setCurrent(page);
            setLoading(false);
        },
        current: current,
        pageSize: 10,
        showSizeChanger: false,
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='census'>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey='meterAddr'
                pagination={pagetion}
                loading={loading}
            />
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterListDialog);


