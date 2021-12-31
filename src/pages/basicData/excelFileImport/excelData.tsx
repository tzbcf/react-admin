/* eslint-disable no-use-before-define */
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import { message, Table, Modal } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import { basicData } from 'src/api';
import { ExcelSchemeData, ExcelSchemeList, ExcelData, ExcelDataList } from 'src/api/basicData/excelImpot/types';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const ExcelDataTab: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const sRef = useRef<SRef>();
    const sRef1 = useRef<SRef>();

    const [ selectedBaseRow, setSelectedBaseRow ] = useFetchState<any[]>([]);
    const [ baseTotal, setBaseTotal ] = useFetchState<number>(0);
    const [ baseCurrent, setBaseCurrent ] = useFetchState<number>(0);
    const [ baseLoading, setBaseLoading ] = useFetchState<boolean>(false);
    const [ schemeList, setSchemeList ] = useFetchState<ExcelSchemeData[]>([]);

    const [ selectedDetailRow, setSelectedDetailRow ] = useFetchState<any[]>([]);
    const [ detailTotal, setDetailTotal ] = useFetchState<number>(0);
    const [ detailCurrent, setDetailCurrent ] = useFetchState<number>(0);
    const [ detailLoading, setDetailLoading ] = useFetchState<boolean>(false);
    const [ dataList, setDataList ] = useFetchState<ExcelData[]>([]);

    const ROWS = 10;

    const getSchemeList = (page: number = 1) => {
        sRef1.current?.getFormData().then((data) => {
            setBaseLoading(true);
            basicData.excelImpotMgt.getSchemeList(page, ROWS, subSysNo, data.schemeName).then((res:ExcelSchemeList) => {
                setSchemeList(res.rows);
                setBaseLoading(false);
                setBaseCurrent(page);
                setBaseTotal(res.total);
            })
                .catch((err) => {
                    message.error(err);
                    setBaseLoading(false);
                });
        });

    };

    const getDataList = (page: number = 1, fileId: string) => {
        sRef1.current?.getFormData().then((data) => {
            setDetailLoading(true);
            basicData.excelImpotMgt.getExcelDataList(page, ROWS, subSysNo, fileId, data.checkStatus, data.searchField, data.fieldValue).then((res:ExcelDataList) => {
                setDetailLoading(false);
                setDetailTotal(res.total);
                setDataList(res.rows);
                setDetailCurrent(page);
            })
                .catch((err) => {
                    message.error(err);
                    setDetailLoading(false);
                });
        });
    };

    const baseColumns = [
        {
            title: Mes['titleTableSchemenameschemename'],
            dataIndex: 'SCHEME_NAME',
        },
        {
            title: Mes['titleTableDeductionschemetypedeductionschemetype'],
            dataIndex: 'FILE_TYPE',
            render (_: any, record: ExcelSchemeData) {
                if (record.FILE_TYPE === '1') {return (<span>Customer&Meter</span>);}
                if (record.FILE_TYPE === '2') {return (<span>集中器key</span>);}
                if (record.FILE_TYPE === '3') {return (<span>集中器分组</span>);}
                if (record.FILE_TYPE === '4') {return (<span>表计key</span>);}
                if (record.FILE_TYPE === '5') {return (<span>表计分组</span>);}
                if (record.FILE_TYPE === '6') {return (<span>导入obis项</span>);}
                if (record.FILE_TYPE === '7') {return (<span>计量点信息导入</span>);}
            },
        },
        {
            title: Mes['titleTableUpgradestatusupgradestatus'],
            dataIndex: 'STATUS',
            render (_: any, record: ExcelSchemeData) {
                if (record.STATUS === '0') {return (<span>Uploaded files</span>);}
                if (record.STATUS === '1') {return (<span>Loading data</span>);}
                if (record.STATUS === '2') {return (<span>Data loaded</span>);}
                if (record.STATUS === '3') {return (<span>Checking data</span>);}
                if (record.STATUS === '4') {return (<span>Check data completed</span>);}
                if (record.STATUS === '5') {return (<span>Importing data</span>);}
                if (record.STATUS === '6') {return (<span>Import data completed</span>);}
            },
        },
        {
            title: 'Total Rows',
            dataIndex: 'TOTAL_ROWS',
        },
        {
            title: 'Check Failed Rows',
            dataIndex: 'CHECK_FAIL_ROWS',
        },
        {
            title: 'Check Successful Rows',
            dataIndex: 'CHECK_SUCC_ROWS',
        },
        {
            title: 'Import Failed Rows',
            dataIndex: 'IMPORT_FAIL_ROWS',
        },
        {
            title: 'Import Successful Rows',
            dataIndex: 'IMPORT_SUCC_ROWS',
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'CREATE_TIME',
            render (_: any, record: ExcelSchemeData) {
                return (<span>{ record.CREATE_TIME ? record.CREATE_TIME.substr(0, 19) : ''}</span>);
            },
        },
    ];

    const baseSearchList = [
        {
            name: 'schemeName',
            type: 'Input',
            col: 4,
            attr: {
                style: { width: '100%' },
                placeholder: 'Scheme Name',
            },
        },
    ];

    const baseSearch = (data: any) => {
        console.log('a-----', data);
        getSchemeList(1);
    };

    const detailColumns = [
        {
            dataIndex: 'FIELD_097',
            title: Mes['comboboxCheckstatuscheckstatus'],
        },
        {
            title: Mes['comboboxCheckresultcheckresult'],
            dataIndex: 'FIELD_098',
        },
        {
            title: Mes['comboboxCreatestatuscreatestatus'],
            dataIndex: 'FIELD_099',
        },
        {
            title: Mes['comboboxCreateresultcreateresult'],
            dataIndex: 'FIELD_100',
        },
        {
            title: Mes['titleTableStationnamestationname'],
            dataIndex: 'NODE_NAME',
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
        },
        {
            title: Mes['titleTableTransformertransformer'],
            dataIndex: 'DST_NAME',
        },
        {
            title: Mes['titleTableCustomernocustomerno'],
            dataIndex: 'FIELD_001',
        },
        {
            title: Mes['titleTableGridcustomernamegridcustomername'],
            dataIndex: 'FIELD_002',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'FIELD_003',
        },
        {
            title: Mes['titleTableGridpricenamegridpricename'],
            dataIndex: 'FIELD_004',
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'FIELD_006',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_TIME',
        },
    ];

    const detailSearchList = [
        {
            name: 'checkStatus',
            type: 'Select',
            col: 4,
            options: [ { name: 'All', value: '' }, { name: 'Check Ok', value: 'FIELD_097,1' }, { name: 'Check Failure', value: 'FIELD_097,0' },
                { name: 'Create Success', value: 'FIELD_099,1' }, { name: 'Create Failure', value: 'FIELD_099,0' } ],
            attr: {
                style: { width: '100%' },
            },
        },
        {
            name: 'searchField',
            type: 'Select',
            col: 4,
            options: [ { name: 'All', value: '' }, { name: 'Customer No', value: 'FIELD_001' }, { name: 'Meter No', value: 'FIELD_002' }, {name: 'DCU No', value: 'FIELD_003'} ],
            attr: {
                style: { width: '100%' },
            },
        },
        {
            name: 'fieldValue',
            type: 'Input',
            col: 4,
            attr: {
                style: { width: '100%' },
            },
        },
    ];

    const btnList1: BtnConfig[] = [
        {
            type: 'Del',
            btnType: 'primary',
            title: 'Check',
            async onClick () {
                if (selectedBaseRow.length > 0) {
                    const selectedScheme = schemeList.filter((v) => v.FILE_ID === selectedBaseRow[0])[0];

                    if (selectedScheme.STATUS === '3') {
                        message.warn('This scheme is being checked!Cannot delete.');
                        return;
                    }
                    if (selectedScheme.STATUS === '5') {
                        message.warn('This scheme is being imported!Cannot delete.');
                        return;
                    }
                    Modal.confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['messageConfirmDelexceldelexcel'],
                        onOk () {
                            basicData.excelImpotMgt.deleteScheme({ fileId: selectedBaseRow[0], subSysNo }).then(() => {
                                getSchemeList();
                                message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                            });
                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                }
            },
        },
    ];

    const btnConfig1 = {
        col: 4,
        btnList: btnList1,
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Install',
            btnType: 'primary',
            title: 'Check',
            async onClick () {
                if (selectedBaseRow.length > 0) {
                    const selectedScheme = schemeList.filter((v) => v.FILE_ID === selectedBaseRow[0])[0];

                    if (parseInt(selectedScheme.STATUS, 2) < 2) {
                        message.warn('Please load excel data!');
                        return;
                    }
                    if (selectedScheme.STATUS === '3') {
                        message.warn('This scheme is being checked!Please try again later.');
                        return;
                    }
                    if (selectedScheme.STATUS === '5') {
                        message.warn('This scheme is being imported! The check operation cannot be performed.');
                        return;
                    }
                    if (selectedScheme.STATUS === '6') {
                        message.warn('This scheme was imported! The check operation cannot be performed.');
                        return;
                    }
                    if (parseInt(selectedScheme.TOTAL_ROWS, 10) < 1) {
                        message.warn('This scheme has no data!');
                        return;
                    }
                } else {
                    message.warn('Please select a scheme');
                }
            },
        },
        {
            type: 'Start',
            btnType: 'primary',
            title: 'Excute',
            async onClick () {
                console.log('11111');
            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const detailSearch = (data: any) => {
        console.log('a-----', data);
        if (selectedBaseRow.length > 0) {
            getDataList(1, selectedBaseRow[0]);
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedBaseRow,
        onChange: (keys: React.Key[], selectedRows: ExcelSchemeData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedBaseRow(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
                getDataList(1, selectedRows[0].FILE_ID);
            //     selectedRows.forEach((v:CstData) => {
            //         meterNos.push(v.METER_NO);
            //         meterIds.push(v.METER_GUID_NO);
            //     });
            }
        },
    };

    const detailSelection = {
        selectedRowKeys: selectedDetailRow,
        onChange: (keys: React.Key[], selectedRows: ExcelData[]) => {
            if (keys.length > 0) {
                let key = keys[keys.length - 1];

                keys = [ key ];
            }
            setSelectedDetailRow(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
            //     selectedRows.forEach((v:CstData) => {
            //         meterNos.push(v.METER_NO);
            //         meterIds.push(v.METER_GUID_NO);
            //     });
            }
        },
    };

    const basePagination = {
        total: baseTotal,
        onChange (page: number) {
            // sRef1.current?.getFormData().then((data) => {
            getSchemeList(page);
            // });

        },
        current: baseCurrent,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const detailPagination = {
        total: detailTotal,
        onChange (page: number) {
            getDataList(page, selectedBaseRow[0]);

        },
        current: detailCurrent,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const initConfig = async () => {
        sRef1.current?.setFieldsValue({
            checkStatus: '',
            searchField: '',
        });
        getSchemeList(1);
    };

    useEffect(() => {
        initConfig();
    }, []);

    return (
        <>
            <div>
                {
                    baseSearchList.length && <SearchList cRef={sRef} columns={baseSearchList} onFinish={baseSearch} isReset={false} btnConfig={ btnConfig1}/>
                }
            </div>
            <div id={'table'}>
                <Table columns={baseColumns} style={{ width: '100%' }} rowKey='FILE_ID' className='table' loading={baseLoading} dataSource={schemeList} pagination={basePagination}
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            let key = record.FILE_ID;
                            const rowsKeys = [ ...selectedBaseRow ];
                            let index = rowsKeys.indexOf(key);

                            if (index >= 0) {
                                rowsKeys.splice(index, 1);
                            } else {
                                rowsKeys.splice(0, rowsKeys.length);
                                rowsKeys.push(key);
                            }
                            setSelectedBaseRow(rowsKeys);
                            getDataList(1, key);
                        },
                    })}></Table>
            </div>

            <div>
                {
                    detailSearchList.length && <SearchList cRef={sRef1} columns={detailSearchList} onFinish={detailSearch} isReset={false} btnConfig={ btnConfig}/>
                }
            </div>
            <div id={'table'}>
                <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' loading={detailLoading} dataSource={dataList}
                    pagination={ detailPagination} rowSelection={{
                        type: 'checkbox',
                        ...detailSelection,
                    }}
                    onRow={(record) => ({
                        onClick: () => {
                            let key = record.SN;
                            const rowsKeys = [ ...selectedDetailRow ];
                            let index = rowsKeys.indexOf(key);

                            if (index >= 0) {
                                rowsKeys.splice(index, 1);
                            } else {
                                rowsKeys.splice(0, rowsKeys.length);
                                rowsKeys.push(key);
                            }
                            setSelectedDetailRow(rowsKeys);
                        },
                    })}></Table>
            </div>
        </>
    );
};

export default ExcelDataTab;
