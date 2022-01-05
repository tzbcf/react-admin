/*
 * FileName : meterReadRate.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-08 16:00:22
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
import { LangMessage } from 'src/store/common/language';
import { Table, Pagination } from 'antd';
import SearchList, { SRef } from 'src/components/business/searchList';
import useFetchState from 'src/utils/useFetchState';
import { ColumnsType } from 'antd/es/table';
import { RatioListData, SchemetypeList } from 'src/api/AmiFunction/meterReadRate/type.d';
import EchartsPage from 'src/components/common/echarts';
import { CascaderData, OptGroupList, Options, nodeDataFormatCascader, abnormalFn, resCastOption } from 'src/utils/function';
import { BtnConfig } from 'src/components/common/btnList';
import queryString from 'query-string';
import { amiFunc } from 'src/api';
import moment from 'moment';
import { dateFormat, deepClone } from 'src/utils/utils';

type SearchValueObj = {
    nodeTree: string;
    destination: string;
    dates: string;
    'search_scheme': string;
    searchField: string;
    fieldValue: string;
    ratioOrNum: string;
    viewType: string;
};

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const formatMeterOpt = (data: SchemetypeList[]) => data.map((item:SchemetypeList) =>
    ({
        value: `${item.afn}`,
        name: `${item.afn_name}(${item.afn})`,
    }));

const MeterReadRateControl: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const fieldOpt = [
        {
            value: 'CST_NO',
            name: Mes['titleTableDcunodcuno'],
        },
        {
            value: 'CST_ADDR',
            name: Mes['titleTableDcuaddrdcuaddr'],
        },
    ];
    const ratioOpt = [
        {
            value: '0',
            name: 'Ratio',
        },
        {
            value: '1',
            name: 'Number',
        },
    ];
    const viewTypeOpt = [
        {
            value: '0',
            name: 'table',
        },
        {
            value: '1',
            name: 'chart',
        },
    ];
    const INITSEARCHVALUE = {
        nodeTree: '',
        destination: '',
        dates: '',
        'search_scheme': '',
        searchField: 'CST_NO',
        fieldValue: '',
        ratioOrNum: '0',
        viewType: '0',
    };
    const ROWS = 10;
    const chartOptInit = {
        xAxis: {
            type: 'category',
            data: [],
        },
        yAxis: {
            type: 'value',
            min: '0',
            max: '100',
        },
        series: [
            {
                data: [],
                type: 'bar',
            },
        ],
    };
    const [ tableData, setTableData ] = useFetchState<RatioListData[]>([]);
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<CascaderData[]>([]);
    // 线路下拉
    const [ lineOpt, setLineOpt ] = useFetchState<OptGroupList[]>([]);
    const [ schemeOpt, setSchemeOpt ] = useFetchState<Options[]>([]);
    const [ showView, setShowView ] = useFetchState<boolean>(false);
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ searchValue, setSearchValue ] = useFetchState<SearchValueObj>(INITSEARCHVALUE);
    const [ options, setOptions ] = useFetchState<any>(chartOptInit);
    // node节点发生变化时，dstId下拉需要发生变化
    const nodeChange = (val: string[]) => {
        abnormalFn(async () => {
            sRef.current?.setFieldsValue({
                destination: '',
            });
            const res = await amiFunc.meterReadRate.getDstListJson({
                subSysNo,
                nodeNo: val[val.length - 1],
            });

            sRef.current?.setFieldsValue({
                destination: res.length ? res[0].ID : '',
            });
            setLineOpt(resCastOption(res));
        });
    };

    const searchColumns = [
        {
            name: 'nodeTree',
            col: 4,
            type: 'Cascader',
            attr: {
                options: CascaderOpt,
                changeOnSelect: true,
                onChange: nodeChange,
                allowClear: false,
            },
        },
        {
            name: 'destination',
            col: 4,
            type: 'SelectGroup',
            options: lineOpt,
        },
        {
            name: 'dates',
            col: 4,
            type: 'TimePicker',
            attr: {
                showTime: false,
                defaultValue: moment(new Date().getTime() - 24 * 60 * 60 * 1000),
            },
        },
        {
            name: 'search_scheme',
            col: 4,
            type: 'Select',
            options: schemeOpt,
        },
        {
            name: 'searchField',
            col: 4,
            type: 'Select',
            options: fieldOpt,
        },
        {
            name: 'fieldValue',
            col: 4,
            type: 'Input',
        },
        {
            name: 'ratioOrNum',
            col: 4,
            type: 'RadioGroup',
            options: ratioOpt,
        },
        {
            name: 'viewType',
            col: 4,
            type: 'Select',
            options: viewTypeOpt,
        },
    ];

    const btnList: BtnConfig[] = [
        {
            type: 'TopOut',
            btnType: 'primary',
            title: Mes['btnExportexport'],
            async onClick () {
                const fromData = await sRef.current?.getFormData();
                const schemeRow = schemeOpt.find((v) => v.value === fromData.search_scheme);

                window.location.href = queryString.stringifyUrl({
                    url: '/v1/reading-ratio/export',
                    query: {
                        subSysNo: subSysNo,
                        searchField: fromData.searchField,
                        fieldValue: fromData.fieldValue,
                        searchNode: fromData.nodeTree[fromData.nodeTree.length - 1],
                        dstId: fromData.destination,
                        searchDate: fromData.dates,
                        SN_PROTOCOL_COMMAND: fromData.search_scheme,
                        commandName: schemeRow?.name,
                    },
                });
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            title: Mes['btnExporthalfmonthexporthalfmonth'],
            async onClick () {
                const fromData = await sRef.current?.getFormData();
                const schemeRow = schemeOpt.find((v) => v.value === fromData.search_scheme);

                window.location.href = queryString.stringifyUrl({
                    url: '/v1/reading-ratio/export-last-half-month',
                    query: {
                        subSysNo: subSysNo,
                        searchField: fromData.searchField,
                        fieldValue: fromData.fieldValue,
                        searchNode: fromData.nodeTree[fromData.nodeTree.length - 1],
                        dstId: fromData.destination,
                        searchDate: fromData.dates,
                        ratioOrNum: fromData.ratioOrNum,
                        SN_PROTOCOL_COMMAND: fromData.search_scheme,
                        commandName: schemeRow?.name,
                    },
                });
            },
        },
    ];

    const getTableData = (val: any, { page = 1, rows = ROWS }) => {
        abnormalFn(async () => {
            setShowView(!!parseInt(val.viewType || '', 10));
            const res = await amiFunc.meterReadRate.getRatioList({
                subSysNo,
                'sn_PROTOCOL_COMMAND': val['search_scheme'] || '',
                searchDate: val.dates,
                searchField: val.searchField,
                fieldValue: val.fieldValue,
                searchNode: val.nodeTree[val.nodeTree.length - 1],
                dstId: val.destination,
                page: page,
                rows: rows,
            });

            console.log(res);

            if (!parseInt(val.viewType, 10)) {
                setTableData(res.rows);
                setTableTotal(res.total);
                setCurrent(page);
            } else {
                const daily = deepClone<any>(chartOptInit);
                const xAxisData = res.rows.map((v) => v.CST_NAME);
                const seriesData = res.rows.map((v) => v.SUCCESS_RATIO * 100);

                daily.xAxis.data = xAxisData;
                daily.series[0].data = seriesData;
                setOptions(daily);
            }
        });
    };

    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getTableData(searchValue, { page, rows: ROWS });
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    const searchFinish = (val: any) => {
        setSearchValue(val);
        getTableData(val, { page: 1, rows: ROWS });
    };

    const tableColumns: ColumnsType<RatioListData> = [
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'DST_NAME',
            align: 'center',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NAME',
            align: 'center',
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            align: 'center',
        },
        {
            title: Mes['titleTableTotalmeternumtotalmeternum'],
            dataIndex: 'TOTAL_METER_NUM',
            align: 'center',
        },
        {
            title: Mes['titleTableDcumeternumdcumeternum'],
            dataIndex: 'CST_METER_NUM',
            align: 'center',
        },
        {
            title: Mes['titleTableValiddatavaliddata'],
            dataIndex: 'VALID_DATA_NUM',
            align: 'center',
            render (val: number) {
                return val || 0;
            },
        },
        {
            title: Mes['titleTableFaileddatafaileddata'],
            dataIndex: 'FAILED_DATA_NUM',
            align: 'center',
            render (val: number) {
                return val >= 0 ? val : 0;
            },
        },
        {
            title: Mes['titleTableDaliyratiodaliyratio'],
            dataIndex: 'SUCCESS_RATIO',
            align: 'center',
            render (val: number) {
                return val * 100 + '%';
            },
        },
    ];

    const getInitConfig = () => {
        abnormalFn(async () => {
            const resNodeTree = await amiFunc.abnormalMgnt.getNodeByLoginUser(subSysNo);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(resNodeTree, nodeTree, null, false);

            setCascaderOpt(nodeTree);
            const res = await Promise.all([
                amiFunc.meterReadRate.getDstListJson({
                    subSysNo,
                    nodeNo: nodeTree.length ? nodeTree[0].value : '',
                }),
                amiFunc.meterReadRate.getSchemetype(),
            ]);


            setLineOpt(resCastOption(res[0]));
            setSchemeOpt(formatMeterOpt(res[1]));
            setSearchValue({
                ...INITSEARCHVALUE,
                nodeTree: nodeTree[0]?.value || '',
                destination: res[0][0]?.ID || '',
                'search_scheme': res[1][0].afn || '',
                searchField: 'CST_NO',
                ratioOrNum: '0',
                viewType: '0',
            });
            sRef.current?.setFieldsValue({
                nodeTree: nodeTree.length ? [ nodeTree[0].value ] : [],
                destination: res[0][0]?.ID || '',
                'search_scheme': res[1][0].afn || '',
                searchField: 'CST_NO',
                ratioOrNum: '0',
                viewType: '0',
                dates: dateFormat('YYYY-MM-DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
            });
        });
    };

    useEffect(() => {
        getInitConfig();
    }, []);

    return (
        <div className='fullscreen flex flexColumn'>
            <SearchList
                columns={searchColumns}
                cRef={sRef}
                isReset={false}
                btnConfig={{
                    btnList: btnList,
                }}
                onFinish={searchFinish}
            />
            {!showView ? (
                <>
                    <div className='flexH100'>
                        <Table columns={tableColumns} dataSource={tableData} rowKey='rn__' pagination={false} />
                    </div>
                    <div className='page'>
                        <Pagination {...pagination} />
                    </div>
                </>
            ) : (
                <EchartsPage option={options} selectId='roteEchart' />
            )}
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterReadRateControl);
