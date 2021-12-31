/*
 * FileName : meterMonitoring.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-28 15:21:50
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import SearchList, { SRef } from 'src/components/business/searchList';
import useFetchState from 'src/utils/useFetchState';
import { DataNode} from 'rc-cascader/es/interface';
import { MeterOnlineStatusData } from 'src/api/AmiFunction/deviceMonitoring/type';
import { ColumnsType } from 'antd/es/table';
import { Table, Pagination, message } from 'antd';
import { nodeDataFormatCascader, CascaderData } from 'src/utils/function';
import { amiFunc, user } from 'src/api';
import { PageSizeType } from 'src/api/types.d';
type SearchObj = {
  searchNode: string[];
  meterStatus: string;
    meterNo: string;
    phase: string;
}
type Props = {
  Mes: LangMessage;
  subSysNo: string;
}
const MeterMonitoring: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const ROWS = 10;
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<DataNode[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ tableData, setTableData ] = useFetchState<MeterOnlineStatusData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ initSearchObj, setInitSearchObj ] = useFetchState<SearchObj>({
        searchNode: [],
        meterStatus: '',
        meterNo: '',
        phase: '0',
    });
    const [ searchObj, setSearchObj ] = useFetchState<SearchObj>({
        searchNode: [],
        meterStatus: '',
        meterNo: '',
        phase: '0',
    });

    const getMeterOnlineStatus = async (val: SearchObj = searchObj, pages: PageSizeType = INITPAGE) => {
        setLoading(true);
        try {
            const res = await amiFunc.deviceMonitor.getMeterOnlineStatus({
                subSysNo,
                ...pages,
                searchNode: val.searchNode[val.searchNode.length - 1] || '',
                meterStatus: val.meterStatus || '',
                meterNo: val.meterNo || '',
                phase: val.phase || '0',
            });

            setTableData(res.rows);
            setCurrent(pages.page);
            setTotal(res.total);
            console.log('a----', res);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
        setLoading(false);
    };
    const dcuOnline = [
        {
            value: 'All',
            name: 'All',
        },
        {
            value: '0',
            name: 'Offline',
        },
        {
            value: '1',
            name: 'Online',
        },
    ];
    const phaseOpt = [
        {
            value: 'all',
            name: 'All',
        },
        {
            value: '0',
            name: 'Unknown',
        },
        {
            value: '1',
            name: 'Phase A',
        },
        {
            value: '2',
            name: 'Phase B',
        },
        {
            value: '3',
            name: 'Phase A&B',
        },
        {
            value: '4',
            name: 'Phase C',
        },
        {
            value: '5',
            name: 'Phase A&C',
        },
        {
            value: '6',
            name: 'Phase B&C',
        },
        {
            value: '7',
            name: 'Phase A&B&C',
        },
    ];
    // 设置搜索组件的属性，需要查找的项
    const searchColumns = [
        {
            type: 'Cascader',
            name: 'searchNode',
            rules: [ { required: true } ],
            col: 4,
            attr: {
                options: CascaderOpt,
                changeOnSelect: true,
            },
        },
        {
            type: 'Select',
            name: 'meterStatus',
            col: 4,
            rules: [ { required: true } ],
            attr: {},
            options: dcuOnline,
        },
        {
            type: 'Select',
            name: 'phase',
            col: 4,
            rules: [ { required: true } ],
            attr: {},
            options: phaseOpt,
        },
        {
            name: 'meterNo',
            col: 4,
            type: 'Input',
            att: {
                placeholder: 'Meter No',
            },
        },
    ];

    // 搜索方法
    const searchFinsh = async (val: any) => {
        setSearchObj(val);
        getMeterOnlineStatus(val, INITPAGE);
    };

    const tableColumns:ColumnsType<MeterOnlineStatusData> = [
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableCustomernocustomerno'],
            dataIndex: 'CUSTOMER_NO',
        },
        {
            title: Mes['titleLabelPhasephase'],
            dataIndex: 'CUR_LEVAL',
        },
        {
            title: Mes['tableTitleLongitude'],
            dataIndex: 'CT',
            render (text: string) {
                if (!text || text === null) {
                    return Mes['messageAlarmCannotbeemptycannotbeempty'];
                } else {
                    return text;
                }
            },
        },
        {
            title: Mes['tableTitleLatitude'],
            dataIndex: 'PT',
            render (text: string) {
                if (text) {
                    return Mes['messageAlarmCannotbeemptycannotbeempty'];
                } else {
                    return text;
                }
            },
        },
        {
            title: Mes['titleTableDcustatusdcustatus'],
            dataIndex: 'meterStatus',
            render (text: string) {
                if (parseInt(text, 10)) {
                    return Mes['titleTableStatusonlinestatusonline'];
                } else {
                    return Mes['titleTableStatusofflinestatusoffline'];
                }
            },
        },
    ];

    // 分页配置
    const pagetion = {
        total: total,
        onChange (page: number) {
            getMeterOnlineStatus(searchObj, {page, rows: ROWS});
        },
        current: current,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 重置搜索条件
    const initSearch = () => {
        setSearchObj(initSearchObj);
        getMeterOnlineStatus(initSearchObj, INITPAGE);
    };

    // 获取用户地区树
    const getNodeByLoginUser = async () => {
        try {
            const nodeRes = await user.userNodeTree(subSysNo);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(nodeRes, nodeTree);
            setCascaderOpt(nodeTree);
            const initObj = {
                meterStatus: 'All',
                searchNode: [ nodeTree[0].value ],
                meterNo: '',
                phase: 'all',
            };

            setInitSearchObj(initObj);
            setSearchObj(initObj);
            sRef.current?.setFieldsValue(initObj);
            getMeterOnlineStatus(initObj);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    useEffect(() => {
        if (!CascaderOpt.length) {
            getNodeByLoginUser();
        }
    }, []);

    return (
        <div className='dcuMonitoring flex flexColumn'>
            <div className='wrap flex flexColumn'>
                <SearchList
                    cRef={sRef}
                    columns={searchColumns}
                    onFinish={searchFinsh}
                    resetFn={initSearch}
                />
                <div className='table' style={{padding: '0 12px'}}>
                    <Table
                        dataSource={tableData}
                        columns={tableColumns}
                        pagination={false}
                        loading={loading}
                        rowKey='SN' />
                </div>
                <div className='page'>
                    <Pagination {...pagetion} />
                </div>
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterMonitoring);


