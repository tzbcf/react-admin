/*
 * FileName : showCensus.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-01 09:58:57
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
import { CensusRow, CensusData } from 'src/api/AmiFunction/netWorkMgnt/type.d';

import { Table} from 'antd';
import useFetchState from 'src/utils/useFetchState';

export type CensusCallBackFn = (page?:number) => Promise<CensusData>;

type Props = {
  Mes: LangMessage;
  data: CensusData;
  callback: CensusCallBackFn;
}
const ShowCensusDialog: React.FC<Props> = (props) => {
    const { Mes, data, callback } = props;
    const [ tableData, setTableData ] = useFetchState<CensusRow[]>(data.list);
    const [ total, setTotal ] = useFetchState<number>(data.sum);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const columns: ColumnsType<CensusRow> = [
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
            title: Mes['titleTableTransformertransformer'],
            dataIndex: 'dstName',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'cstNo',
        },
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'cstName',
        },
        {
            title: Mes['titleLabelMetersummetersum'],
            dataIndex: 'meterSum',
        },
        {
            title: Mes['titleLabelOnlinemetersumonlinemetersum	'],
            dataIndex: 'onlineSum',
        },
        {
            title: Mes['titleLabelOfflinemetersumofflinemetersum'],
            dataIndex: 'offlineSum',
        },
    ];

    // 分页配置
    const pagetion = {
        total: total,
        async onChange (page: number) {
            setLoading(true);
            if (typeof callback === 'function') {
                const res = await callback(page);

                setTableData(res.list);
                setTotal(res.sum);
                setCurrent(page);
            }
            setLoading(false);
        },
        current: current,
        pageSize: data.pageSize,
        showSizeChanger: false,
    };

    return (
        <div className='census'>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey='cstNo'
                loading={loading}
                pagination={pagetion}
            />
        </div>
    )


    ;
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(ShowCensusDialog);


