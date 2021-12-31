/*
 * FileName : noComMeterQuery.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-08 16:02:23
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchList, { SRef } from 'src/components/business/searchList';
import { LangMessage } from 'src/store/common/language';
import useFetchState from 'src/utils/useFetchState';
import { Table, Pagination } from 'antd';
import { NotCommunicatingMeterData } from 'src/api/AmiFunction/meterReadRate/type.d';
import { ColumnsType } from 'antd/es/table';
import { dateFormat } from 'src/utils/utils';
import {
    CascaderData,
    OptGroupList,
    nodeDataFormatCascader,
    abnormalFn,
    resCastOption,
} from 'src/utils/function';
import { amiFunc } from 'src/api';
import moment from 'moment';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    nodeNo: string;
}

const NoComMeterQuery: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;
    const sRef = useRef<SRef>();
    const ROWS = 10;
    const FORMAT = 'YYYY-MM-DD HH:mm';
    const todayStart = dateFormat(FORMAT, moment(new Date().getTime() - 24 * 60 * 60 * 1000));
    const todayEnd = dateFormat(FORMAT);
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    const [ lineOpt, setLineOpt ] = useFetchState<OptGroupList[]>([]);
    const [ tableData, setTableData ] = useFetchState<NotCommunicatingMeterData[]>([]);
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);

    const getData = ({ page = 1, rows = ROWS }) => {
        abnormalFn(async () => {
            const searchParam = await sRef.current?.getFormData();

            const resParams = {
                startDate: Array.isArray(searchParam.startDateTimeValue) ? searchParam.startDateTimeValue[0] : '',
                endDate: Array.isArray(searchParam.startDateTimeValue) ? searchParam.startDateTimeValue[1] : '',
                dstId: searchParam.dstId,
                sortOrder: 'asc',
                page,
                rows,
                subsys: subSysNo,
            };
            const res = await amiFunc.meterReadRate.getNotCommunicatingMeter(resParams);

            setCurrent(page);
            setTableTotal(res.total);
            setTableData(res.rows);
        });
    };

    const nodeChange = (val: string) => {
        abnormalFn(async () => {
            sRef.current?.setFieldsValue({
                dstId: '',
            });
            const res = await amiFunc.meterReadRate.getDstListJson({
                subSysNo,
                nodeNo: val[val.length - 1],
            });

            setLineOpt(resCastOption(res));
        });
    };

    const timeChange = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            startDateTimeValue: [ dateFormat(FORMAT, moment(dateStrings[0])), dateFormat(FORMAT, moment(dateStrings[1])) ],
        });
    };

    const searchColumns = [
        {
            name: 'startDateTimeValue',
            col: 7,
            type: 'DatePicker',
            attr: {
                showTime: { format: 'HH:mm' },
                format: FORMAT,
                defaultValue: [ moment(todayStart), moment(todayEnd) ],
                onChange: timeChange,
            },
        },
        {
            name: 'treeValue',
            col: 4,
            type: 'Cascader',
            attr: {
                options: CascaderOpt,
                changeOnSelect: true,
                onChange: nodeChange,
            },
        },
        {
            name: 'dstId',
            col: 4,
            type: 'SelectGroup',
            options: lineOpt,
        },
    ];

    const searchFinish = () => {
        getData({page: 1, rows: ROWS});
    };

    const tableColumns: ColumnsType<NotCommunicatingMeterData> = [
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'DST_NAME',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'CST_NAME',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'CREATE_TIME',
        },
    ];

    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getData({page, rows: ROWS});
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    const getInitConfig = () => {
        abnormalFn(async () => {
            const res = await Promise.all([
                amiFunc.abnormalMgnt.getNodeByLoginUser(subSysNo),
                amiFunc.meterReadRate.getDstListJson({
                    subSysNo,
                    nodeNo,
                }),
                amiFunc.meterReadRate.getSchemetype(),
            ]);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(res[0], nodeTree);

            setCascaderOpt(nodeTree);
            setLineOpt(resCastOption(res[1]));
            sRef.current?.setFieldsValue({
                treeValue: [ res[0][0].ID ],
                startDateTimeValue: [ todayStart, todayEnd ],
            });
            getData({ page: 1, rows: ROWS });
        });
    };

    useEffect(() => {
        getInitConfig();
    }, []);

    return (
        <div className='noComMeterQuery fullscreen'>
            <SearchList
                columns={searchColumns}
                cRef={sRef}
                onFinish={searchFinish}
                isReset={false} />
            <Table
                columns={tableColumns}
                dataSource={tableData}
                rowKey='rn__'
                className='flexH100'
                pagination={false}
            />
            <div className='page'>
                <Pagination {...pagination} />
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(NoComMeterQuery);

