/*
 * FileName : dcuMonitoring.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-28 15:21:31
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
import { DcuOnlineStatusData, DcuOnlineLogData } from 'src/api/AmiFunction/deviceMonitoring/type';
import { ColumnsType } from 'antd/es/table';
import { Table, Pagination, message, Button, Modal } from 'antd';
import { nodeDataFormatCascader, CascaderData } from 'src/utils/function';
import { dateFormat } from 'src/utils/utils';
import { amiFunc, common } from 'src/api';
import moment from 'moment';
import { PageSizeType } from 'src/api/types.d';
import { FileSearchOutlined } from '@ant-design/icons';

type SearchObj = {
  searchNode: string[];
  searchField: string;
  fieldValue: string;
}
type Props = {
  Mes: LangMessage;
  subSysNo: string;
}
const DCUmonitoring: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const msRef = useRef<SRef>();
    const ROWS = 10;
    const LOGROWS = 6;
    const STARTTIME = dateFormat('YYYY-MM-DD HH:mm', moment(new Date().getTime() - 24 * 60 * 60 * 1000));
    const ENDTIME = dateFormat('YYYY-MM-DD HH:mm');
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    const [ CascaderOpt, setCascaderOpt ] = useFetchState<DataNode[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ tableData, setTableData ] = useFetchState<DcuOnlineStatusData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ visible, setVisible ] = useFetchState<boolean>(false);
    const [ taskLogList, setTaskLogList ] = useFetchState<DcuOnlineLogData[]>([]);
    const [ logDcuRows, setLogDcuRows ] = useFetchState<DcuOnlineStatusData | null>(null);
    const [ logTimeDate, setLogTimeDate ] = useFetchState<string[]>([]);
    const [ logTotal, setLogTotal ] = useFetchState<number>(0);
    const [ logCurrent, setLogCurrent ] = useFetchState<number>(1);
    const [ logLoding, setLogLoding ] = useFetchState<boolean>(false);
    const [ initSearchObj, setInitSearchObj ] = useFetchState<SearchObj>({
        searchNode: [],
        searchField: '',
        fieldValue: '',
    });
    const [ searchObj, setSearchObj ] = useFetchState<SearchObj>({
        searchNode: [],
        searchField: '',
        fieldValue: '',
    });

    const getDcuOnlineStatus = async (val: SearchObj = searchObj, pages: PageSizeType = INITPAGE) => {
        setLoading(true);
        try {
            const res = await amiFunc.deviceMonitor.getDcuOnlineStatus({
                subSysNo,
                ...pages,
                searchNode: val.searchNode[val.searchNode.length - 1] || '',
                searchField: val.searchField || '',
                fieldValue: val.fieldValue || '',
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
            value: 'CST_NO(online)',
            name: 'DCU No(online)',
        },
        {
            value: 'CST_NAME(online)',
            name: 'DCU Name(online)',
        },
        {
            value: 'CST_NO(offline)',
            name: 'DCU No(offline)',
        },
        {
            value: 'CST_NAME(offline)',
            name: 'DCU Name(offline)',
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
            name: 'searchField',
            col: 4,
            rules: [ { required: true } ],
            attr: {},
            options: dcuOnline,
        },
        {
            name: 'fieldValue',
            col: 4,
            type: 'Input',
        },
    ];

    // 弹窗时间变化事件
    const changeDate = (dates: any, dateStrings: string[]) => {
        msRef.current?.setFieldsValue({
            timeDate: [ moment(dateStrings[0], 'YYYY-MM-DD HH:mm'), moment(dateStrings[1], 'YYYY-MM-DD HH:mm') ],
        });
    };
    // 弹窗搜索组件
    const modalSearchColumns = [
        {
            type: 'RangePicker',
            name: 'timeDate',
            col: 14,
            rules: [ { required: true } ],
            attr: {
                onChange: changeDate,
                showTime: { format: 'HH:mm' },
                format: 'YYYY-MM-DD HH:mm',
                defaultValue: [ moment(STARTTIME), moment(ENDTIME) ],
            },
        },
    ];

    // 搜索方法
    const searchFinsh = async (val: any) => {
        setSearchObj(val);
        getDcuOnlineStatus(val, INITPAGE);
    };

    // 获取集中器日志
    const getDcuLog = async (timeArr: string[] = logTimeDate, pages?: PageSizeType, row?:DcuOnlineStatusData) => {
        setLogLoding(true);
        try {
            const res = await amiFunc.deviceMonitor.getDcuOnlineLog({
                cstNo: row?.CST_ADDR || logDcuRows?.CST_ADDR || '',
                page: pages?.page || current,
                rows: pages?.rows || LOGROWS,
                startDate: timeArr[0],
                endDate: timeArr[1],
            });

            setLogCurrent(pages?.page || 1);
            setLogTotal(res.total);
            setTaskLogList(res.rows);
        } catch (error: any) {
            console.error(error);
            message.error(`${error}`);
        }
        setLogLoding(false);
    };

    const queryLog = (val: DcuOnlineStatusData) => {
        msRef.current?.resetFields();
        setTaskLogList([]);
        setLogTotal(0);
        setLogCurrent(1);
        setLogDcuRows(val);
        setVisible(true);
        setLogTimeDate([ STARTTIME, ENDTIME ]);
        getDcuLog([ STARTTIME, ENDTIME ], {page: 1, rows: LOGROWS}, val);
    };


    const tableColumns:ColumnsType<DcuOnlineStatusData> = [
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
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
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
        },
        {
            title: Mes['titleTableOnlinetimeonlinetime'],
            dataIndex: 'REGISTERED_DATE',
            render (text: string | number) {
                try {
                    if (typeof text === 'string' && text.includes('T')) {
                        return text.replace('T', ' ');
                    } else if (typeof text === 'number') {
                        return dateFormat('YYYY-MM-DD', new Date(text));
                    } else {
                        return '';
                    }
                } catch (error) {
                    return '';
                }

                // if (text && text.includes('T')) {
                //     return text.replace('T', ' ');
                // }
            },
        },
        {
            title: Mes['titleTableDcustatusdcustatus'],
            dataIndex: 'MDL_CCID',
            render (text: string) {
                if (text) {
                    return Mes['titleTableStatusonlinestatusonline'];
                } else {
                    return Mes['titleTableStatusofflinestatusoffline'];
                }
            },
        },
        {
            title: Mes['titleTableViewlogviewlog'],
            render (text:string, record: DcuOnlineStatusData) {
                return (<Button
                    type='primary'
                    onClick={() => queryLog(record)}
                    icon={<FileSearchOutlined />}
                    title={Mes['titleTableViewlogviewlog']}
                ></Button>);
            },
        },
    ];

    const logColumns: ColumnsType<DcuOnlineLogData> = [
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableDcuipdcuip'],
            dataIndex: 'CST_IP',
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'CST_STATUS',
            render (text: string) {
                if (parseInt(text, 10) === 2) {
                    return Mes['titleTableStatusonlinestatusonline'];
                } else {
                    return Mes['titleTableStatusofflinestatusoffline'];
                }
            },
        },
        {
            title: Mes['titleTableStatustimestatustime'],
            dataIndex: 'STATUS_TIME',
            render (value: string | number) {
                if (typeof value === 'number') {
                    return dateFormat('YYYY-MM-DD HH:mm:ss', new Date(value));
                }
                return value;
            },
        },
    ];

    // 分页配置
    const pagetion = {
        total: total,
        onChange (page: number) {
            getDcuOnlineStatus(searchObj, {page, rows: ROWS});
        },
        current: current,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 获取用户地区树
    const getNodeByLoginUser = async () => {
        try {
            const nodeRes = await common.getNodeByLoginUser(subSysNo);
            let nodeTree: CascaderData[] = [];

            nodeDataFormatCascader(nodeRes, nodeTree);
            let searchNode:string[] = [];

            if (nodeTree.length) {
                searchNode = [ nodeTree[0].value ];
            }
            setCascaderOpt(nodeTree);
            const initObj = {
                searchField: 'CST_NO(online)',
                searchNode: searchNode,
                fieldValue: '',
            };

            setInitSearchObj(initObj);
            setSearchObj(initObj);
            sRef.current?.setFieldsValue(initObj);
            getDcuOnlineStatus(initObj);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };


    // 分页日志
    const logPagetion = {
        total: logTotal,
        onChange (page: number) {
            getDcuLog(logTimeDate, {page, rows: LOGROWS});
        },
        current: logCurrent,
        pageSize: LOGROWS,
        showSizeChanger: false,
    };

    // 弹窗搜索方法
    const modalSearchFinsh = async (val: any) => {
        console.log('=-=', val);
        const timeArr = [ dateFormat('YYYY-MM-DD HH:mm', moment(val.timeDate[0])), dateFormat('YYYY-MM-DD HH:mm', moment(val.timeDate[1])) ];

        setLogTimeDate(timeArr);
        getDcuLog(timeArr);
    };

    // 重置搜索条件
    const initSearch = () => {
        setSearchObj(initSearchObj);
        getDcuOnlineStatus(initSearchObj, INITPAGE);
    };

    useEffect(() => {
        if (!CascaderOpt.length) {
            getNodeByLoginUser();
        }
    }, []);

    return (
        <>
            <div className='dcuMonitoring flex flexColumn'>
                <div className='wrap flex flexColumn'>
                    <SearchList
                        cRef={sRef}
                        columns={searchColumns}
                        resetFn={initSearch}
                        onFinish={searchFinsh}
                    />
                    <div className='table' style={{padding: '0 12px'}}>
                        <Table
                            dataSource={tableData}
                            columns={tableColumns}
                            pagination={false}
                            loading={loading}
                            rowKey='rn__' />
                    </div>
                    <div className='page'>
                        <Pagination {...pagetion} />
                    </div>
                </div>
            </div>
            <Modal
                title={Mes['titleTableLoginfologinfo']}
                visible={visible}
                width={600}
                onCancel={handleCancel}
                footer={[
                    <Button key='CLose' onClick={handleCancel}>CLose</Button>,
                ]}
            >
                <div className='logListBody'>
                    <SearchList
                        cRef={msRef}
                        columns={modalSearchColumns}
                        onFinish={modalSearchFinsh}
                        isReset={false}
                        initialValues={{
                            timeDate: [ moment(STARTTIME), moment(ENDTIME) ],
                        }}
                    />
                    <Table
                        columns={logColumns}
                        dataSource={taskLogList}
                        rowKey='rn__'
                        loading={logLoding}
                        pagination={false}
                    />
                    <Pagination {...logPagetion} className='mt10' />
                </div>
            </Modal>
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(DCUmonitoring);

