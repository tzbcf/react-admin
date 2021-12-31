/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, Tree, Table, Input, Select, message, Modal, Form, Button, DatePicker} from 'antd';
import { basicData } from 'src/api';
import { InstoreDCUList, BatchNameJson, InstoreDCUData, DcuType, DcuAdd, DcuFactory } from 'src/api/basicData/dcuInWareHouse/types';
import { MaxBatchNo, QueryBatchCount} from 'src/api/basicData/meterInWareHouse/types';
import useFetchState from 'src/utils/useFetchState';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import moment from 'moment';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type TreeData = {
    title: string;
    key: string;
    children: BatchNameJson[];
}

let searchType = 'DB_DOT';
let batch = '';
let searchValue = '';
let dcuNos:string[] = [];

const DcuInWareHouse: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    // const { DirectoryTree } = Tree;
    const { Search } = Input;
    const { Option } = Select;

    const [ dcuList, setDcuList ] = useFetchState<InstoreDCUData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ batchList, setBatchList ] = useFetchState<TreeData[]>([]);
    const [ expandedList, setExpandedList ] = useFetchState<string[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const [ factoryList, setFactoryList ] = useFetchState<DcuFactory[]>([]);
    const [ typeList, setTypeList ] = useFetchState<DcuType[]>([]);
    // const [ dcuNo, setDcuNo ] = useFetchState<string>('');
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ isDcuAdd, setIsDcuAdd ] = useFetchState<boolean>(false);

    const cRef = useRef<CRef>();
    const cRef1 = useRef<CRef>();
    const [ form ] = Form.useForm();

    const getInstoreDcuList = (page: number = 1, rows: number = 20) => {
        setLoading(true);
        const params: any = {
            subSysNo: subSysNo,
            page: page,
            rows: rows,
            searchField: searchType,
            fieldValue: searchValue,
            batchNo: batch,
        };

        basicData.dcuInWareHouse.instoreDCUList(params).then((res:InstoreDCUList) => {
            setLoading(false);
            setCurrent(page);
            setTotal(res.total);
            setDcuList(res.rows);
        })
            .catch((error) => {
                message.error(error);
                setLoading(false);
            });
    };

    const getBatchList = () => {
        basicData.dcuInWareHouse.batchDCUList(subSysNo).then((res:BatchNameJson[]) => {
            if (res.length > 0) {
                const groups:any = res.find((v: BatchNameJson) =>
                    v.LEVEL1 === 0
                );

                setExpandedList([ groups.ID ]);
                let children: BatchNameJson[] = [];

                res.map((v: BatchNameJson) => {
                    if (v.NAME !== groups.NAME) {
                        v.key = v.ID;
                        v.title = v.NAME;
                        children.push(v);
                    }
                });
                let temp: TreeData = {
                    title: groups.NAME,
                    key: groups.ID,
                    children: children,
                };
                let batchs: TreeData[] = [ temp ];

                setBatchList(batchs);
            }
        })
            .catch((error) => {
                message.error(error);
            });
    };

    const getFactoryList = () => {
        basicData.dcuInWareHouse.dcuFactory(subSysNo).then((res:DcuFactory[]) => {
            setFactoryList(res);
        });
    };

    const getTypeList = (facCode:string) => {
        basicData.dcuInWareHouse.dcuType(facCode).then((res:DcuType[]) => {
            setTypeList(res);
        });
    };

    const editStatus = async (row: any): Promise<any> => {
        console.log(row);
        // const params: any = {
        //     ducNos: dcuNo,
        //     subSysNo: subSysNo,
        //     statusFlag: row.statusFlag,
        // };

        // basicData.dcuInWareHouse.saveDcuStatus(params).then(() => {
        //     message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
        //     setSelectedRowKeys([]);
        //     dcuNos = [];
        //     getInstoreDcuList();
        // })
        //     .catch((err) => {
        //         message.error(err);
        //     });
    };

    const editVersion = async (row: any): Promise<any> => {
        const params: any = {
            batchNo: row.batchNo,
            subSysNo: subSysNo,
            dcu_soft_version: row.dcu_soft_version,
            dcu_module_fw_version: row.dcu_module_fw_version,
            dcu_main_module_version: row.dcu_main_module_version,
        };

        basicData.dcuInWareHouse.saveBatchVersion(params).then(() => {
            message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            setSelectedRowKeys([]);
            dcuNos = [];
            getInstoreDcuList();
        })
            .catch((err) => {
                message.error(err);
            });
    };

    const onSelect = (keys: React.Key[]) => {
        batch = keys[0] + '';
        setSelectedRowKeys([]);
        dcuNos = [];
        getInstoreDcuList(1, 20);
    };

    const onSelectSearchType = (value:string) => {
        searchType = value;
    };

    const onSearch = (value: string) => {
        searchValue = value;
        setSelectedRowKeys([]);
        dcuNos = [];
        getInstoreDcuList(1, 20);
    };

    const changeSearch = (e: any) => {
        // console.log(e);
        searchValue = e.target.value;
    };

    const onSelectFactory = (value: string) => {
        form.setFieldsValue({
            dcu_meterType: '',
        });
        getTypeList(value);
    };

    const updateBatchName = () => {
        let type = form.getFieldValue('dcu_meterType');
        let date = form.getFieldValue('dcu_start_date');

        if (type && date) {
            let temp = moment(date).format('YYYY-MM-DD');

            let typeValue = typeList.filter((v: DcuType) => v.CST_TYPE === type)[0];

            const params: QueryBatchCount = {
                subSysNo: subSysNo,
                deviceType: type,
                pruduceDate: temp,
            };

            basicData.meterInWareHouse.batchCount(params).then((res: string) => {
                let batchName = typeValue.CST_TYPE_NAME + '-' + temp.split('-').join('') + '-' + (parseInt(res, 10) + 1);

                form.setFieldsValue({
                    batchName: batchName,
                });
            });

        }
    };

    const changeDate = () => {
        // form.setFieldsValue({
        //     start_date: timeString,
        // });
        updateBatchName();
    };

    const onChangeStartNo = () => {
        const value = form.getFieldValue('dcu_start_meter_no');

        let end = form.getFieldValue('dcu_end_meter_no');

        if (end) {
            let totalNum = parseInt(end, 10) - parseInt(value, 10) + 1;

            if (totalNum > 0) {
                form.setFieldsValue({
                    dcu_total_meter_num: totalNum,
                });
            }
        }
    };

    const onChangeEndNo = () => {
        const value = form.getFieldValue('dcu_end_meter_no');
        let start = form.getFieldValue('dcu_start_meter_no');

        if (start) {
            let totalNum = parseInt(value, 10) - parseInt(start, 10) + 1;

            if (totalNum > 0) {
                form.setFieldsValue({
                    dcu_total_meter_num: totalNum,
                });
            }
        }
    };


    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'IF_USED',
            width: 50,
            render (_: any, record: InstoreDCUData) {
                return (
                    <>
                        {record.IF_USED === '1' ? <span style={{ color: '#0000ff' }}>YES</span> : <span style={{ color: '#ff0000' }}>NO</span>}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
            width: 100,
        },
        {
            title: Mes['titleTableDcutypedcutype'],
            dataIndex: 'CST_TYPE_NAME',
        },
        {
            title: Mes['titleTableModuleversionmoduleversion'],
            dataIndex: 'MODULE_FW_VERSION',
            width: 100,
        },
        {
            title: Mes['titleTableSoftversionsoftversion'],
            dataIndex: 'SOFT_VERSION',
            width: 100,
        },
        {
            title: Mes['titleLabelMainmoduleversionmainmoduleversion'],
            dataIndex: 'MAIN_MODULE_VERSION',
            width: 100,
        },
        {
            title: Mes['titleTableBatchnobatchno'],
            dataIndex: 'BATCH_NO',
            width: 100,
        },
        {
            title: Mes['titleTableBatchnamebatchname'],
            dataIndex: 'DB_DOT',
        },
        {
            title: Mes['titleTableTblcaozuoyuantblcaozuoyuan'],
            dataIndex: 'OPERATOR_NAME',
            width: 150,
        },
        {
            title: Mes['titleLabelProducdateproducdate'],
            dataIndex: 'PRODUCE_DATE',
            width: 100,
            render (_: any, record: InstoreDCUData) {
                return (
                    <>
                        <span>{ record.PRODUCE_DATE.substr(0, 10)}</span>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'CREATE_TIME',
            width: 100,
            sorter: (a: InstoreDCUData, b: InstoreDCUData) => Date.parse(a.CREATE_TIME) - Date.parse(b.CREATE_TIME),
            render (_: any, record: InstoreDCUData) {
                return (
                    <>
                        <span>{ record.CREATE_TIME.substr(0, 10)}</span>
                    </>
                );
            },
        },

    ];

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            setSelectedRowKeys([]);
            dcuNos = [];
            getInstoreDcuList(page, pageSize);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: 20,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: InstoreDCUData[]) => {
            setSelectedRowKeys(keys);
            // meterIds = [];
            dcuNos = [];
            if (selectedRows.length > 0) {
                selectedRows.forEach((v:InstoreDCUData) => {
                    dcuNos.push(v.CST_NO);
                    // meterIds.push(v.METER_GUID_NO);
                });
            }
        },
    };

    const addOpt = [
        {
            type: 'Select',
            label: 'comboboxEnabledenabled',
            name: 'statusFlag',
            rules: [ { required: true } ],
            col: 20,
            options: [ { name: 'YES', value: '1' }, {name: 'NO', value: '0'} ],
        },

    ];

    const addOpt1 = [
        {
            type: 'Input',
            label: 'titleTableBatchnobatchno',
            name: 'batchNo',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                disabled: true,
            },
        },

        {
            type: 'Input',
            label: 'titleTableBatchnamebatchname',
            name: 'batchName',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                disabled: true,
            },
        },

        {
            type: 'Input',
            label: 'titleTableDcutypedcutype',
            name: 'dcuType',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                disabled: true,
            },
        },

        {
            type: 'Input',
            label: 'titleTableModuleversionmoduleversion',
            name: 'dcu_module_fw_version',
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Input',
            label: 'titleTableSoftversionsoftversion',
            name: 'dcu_soft_version',
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Input',
            label: 'titleLabelMainmoduleversionmainmoduleversion',
            name: 'dcu_main_module_version',
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

    ];

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 弹窗参数设置
    const modelOpt = {
        title: 'titleLabelEditedit',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 弹窗表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    const formOpt1 = {
        options: addOpt1,
        layout: layout,
    };

    const showDeleteConfirm = () => {
        if (dcuNos.length > 0) {
            Modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
                onOk () {
                    let nos = '';

                    dcuNos.forEach((v) => {
                        nos = nos + v + ',';
                    });
                    const params: any = {
                        dcuNos: nos,
                        subSysNo: subSysNo,
                    };

                    basicData.dcuInWareHouse.delDCU(params).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        dcuNos = [];
                        getInstoreDcuList();
                    })
                        .catch((err) => {
                            message.error(err);
                        });
                },
                onCancel () {
                    console.log('Cancel');
                },
            });
        } else {
            message.error(Mes['messageAlarmSelectrecordstoremoveselectrecordstoremove']);
        }
    };

    const showBatchDel = () => {
        if (batch !== '') {
            let isShow = true;

            batchList.map((v: TreeData) => {
                if (v.key === batch && v.children.length > 0) {
                    isShow = false;
                    message.error(Mes['messageAlarmPleaseselectsecondnodepleaseselectsecondnode']);
                    return;
                }
            });
            if (isShow) {
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
                    onOk () {
                        const params: any = {
                            batchNo: batch,
                            subSysNo: subSysNo,
                        };

                        basicData.dcuInWareHouse.delBatch(params).then(() => {
                            message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                            setSelectedRowKeys([]);
                            dcuNos = [];
                            getBatchList();
                            getInstoreDcuList();
                        })
                            .catch((err) => {
                                message.error(err);
                            });
                    },
                    onCancel () {
                        console.log('Cancel');
                    },
                });
            }
        } else {
            message.error(Mes['messageAlarmPleaseselectupdatenodepleaseselectupdatenode']);
        }
    };

    // const showEditStatus = () => {
    //     if (dcuNos.length > 0) {

    //         let val: any = {};
    //         let ids = '';

    //         dcuNos.forEach((v) => {
    //             ids = ids + v + ',';
    //         });
    //         setDcuNo(ids);
    //         // val = {
    //         //     statusFlag: item.IF_USED,
    //         // };
    //         cRef.current?.openModel(val);

    //     } else {
    //         setDcuNo('');
    //         message.error(Mes['messageConfirmPleasedcupleasedcu']);
    //     }

    // };

    const showEditVersion = () => {
        if (batch !== '') {
            let isShow = true;

            batchList.map((v: TreeData) => {
                if (v.key === batch && v.children.length > 0) {
                    isShow = false;
                    message.error(Mes['messageAlarmPleaseselectsecondnodepleaseselectsecondnode']);
                    return;
                }
            });
            if (isShow) {
                let data = dcuList.filter((v: InstoreDCUData) => v.BATCH_NO === batch)[0];

                let val: any = {
                    batchNo: data.BATCH_NO,
                    batchName: data.DB_DOT,
                    dcuType: data.CST_TYPE_NAME,
                    dcu_module_fw_version: data.MODULE_FW_VERSION !== 'null' ? data.MODULE_FW_VERSION : '',
                    dcu_soft_version: data.SOFT_VERSION !== 'null' ? data.SOFT_VERSION : '',
                    dcu_main_module_version: data.MAIN_MODULE_VERSION !== 'null' ? data.MAIN_MODULE_VERSION : '',
                };

                cRef1.current?.openModel(val);

            }

        } else {
            message.error(Mes['messageAlarmPleaseselectupdatenodepleaseselectupdatenode']);
        }

    };

    const showBatchAdd = () => {
        setModalTitle(Mes['btnMeteraddallmeteraddall']);
        basicData.meterInWareHouse.maxBatchNo(subSysNo).then((res:MaxBatchNo) => {
            if (res) {
                form.setFieldsValue({
                    batchNo: res.result,
                    dcu_meterFac: factoryList[0].FAC_CODE,
                });
                getTypeList(factoryList[0].FAC_CODE);
                setIsDcuAdd(false);
                setModalVisible(true);

            }
        });

    };

    const showDcuAdd = () => {
        if (selectedRowKeys.length > 0) {
            setModalTitle(Mes['titleLabelAddadd']);
            let selectedMeterNo = dcuNos[0];

            let selectedMeter:InstoreDCUData = dcuList.filter((v: InstoreDCUData) => v.CST_NO === selectedMeterNo)[0];

            let fac = selectedMeter.FACTORY_NO;
            let type = selectedMeter.CST_TYPE_CODE;

            getTypeList(fac);
            form.setFieldsValue({
                batchNo: selectedMeter.BATCH_NO,
                batchName: selectedMeter.DB_DOT,
                dcu_start_date: moment(selectedMeter.PRODUCE_DATE.substr(0, 10)),
                dcu_module_version: selectedMeter.MODULE_FW_VERSION,
                dcu_soft_version: selectedMeter.SOFT_VERSION,
                dcu_main_module_version: selectedMeter.MAIN_MODULE_VERSION,
                dcu_meterFac: fac,
                dcu_meterType: type,
            });

            setIsDcuAdd(true);
            setModalVisible(true);
        } else {
            message.error('Please select a DCU of existing batches');
        }
    };

    // 按钮事件
    const btnList: BtnConfig[] = [
        {
            type: 'BatchAdd',
            btnType: 'primary',
            title: Mes['btnMeteraddallmeteraddall'],
            onClick () {
                showBatchAdd();
            },
        },
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnTitleAdd'],
            onClick () {
                showDcuAdd();
            },
        },
        {
            type: 'BatchEdit',
            btnType: 'primary',
            title: Mes['btnMeterupdateeditstatusmeterupdateeditstatus'],
            onClick () {
                showEditVersion();
            },
        },
        {
            type: 'BatchDel',
            btnType: 'primary',
            title: Mes['btnMeterdelallmeterdelall'],
            onClick () {
                showBatchDel();
            },
        },
        // {
        //     type: 'Edit',
        //     btnType: 'primary',
        //     title: Mes['btnMetereditstatusmetereditstatus'],
        //     onClick () {
        //         showEditStatus();
        //     },
        // },
        {
            type: 'Del',
            btnType: 'primary',
            title: Mes['btnTitleDelete'],
            onClick () {
                showDeleteConfirm();
            },
        },

    ];

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = () => {
        form.validateFields().then((res) => {
            setSubmitLoading(true);
            let typeValue = typeList.filter((v: DcuType) => v.CST_TYPE === res.dcu_meterType)[0];
            let factory = factoryList.filter((v: DcuFactory) => v.FAC_CODE === res.dcu_meterFac)[0];

            const params: DcuAdd = {
                subSysNo: subSysNo,
                dcu_meter_batch_no: res.batchNo,
                batchAddFlag: isDcuAdd ? 'N' : 'Y',
                dcu_batch_name: res.batchName,
                dcu_meterFac: factory.FAC_CODE,
                dcu_meterFacName: factory.FAC_NAME,
                dcu_meterType: typeValue.CST_TYPE,
                dcu_meterTypeName: typeValue.CST_TYPE_NAME,
                dcu_start_meter_no: res.dcu_start_meter_no,
                dcu_end_meter_no: res.dcu_end_meter_no,
                dcu_start_date: moment(res.dcu_start_date).format('YYYY-MM-DD'),
                dcu_soft_version: res.dcu_soft_version ? res.dcu_soft_version : '',
                dcu_module_version: res.dcu_module_version ? res.dcu_module_version : '',
                dcu_main_module_version: res.dcu_main_module_version ? res.dcu_main_module_version : '',
                dcu_total_meter_num: res.dcu_total_meter_num,
            };

            basicData.dcuInWareHouse.addBatchDcu(params).then(() => {
                setSubmitLoading(false);
                setModalVisible(false);
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                setSelectedRowKeys([]);
                dcuNos = [];
                getInstoreDcuList();
                getBatchList();
            })
                .catch((err) => {
                    message.error(err);
                    // setModalVisible(false);
                    setSubmitLoading(false);
                });
        });

    };

    const onExpand = (expandedKeys:any[]) => {
        setExpandedList(expandedKeys);
    };

    useEffect(() => {
        getBatchList();
        getInstoreDcuList();
        getFactoryList();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title' style={{height: '50px'}}>
                <h4>{Mes['menuTitleDcuInWareHouse']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={20}>
                    <Col span={5}>
                        <Select defaultValue={searchType} style={{ width: '100%' }} onSelect={ onSelectSearchType}>
                            <Option value='BATCH_NO'>{ Mes['titleTableBatchnobatchno']}</Option>
                            <Option value='DB_DOT'>{ Mes['titleTableBatchnamebatchname']}</Option>
                            <Option value='CST_NO'>{ Mes['titleTableDcunodcuno']}</Option>
                        </Select>
                    </Col>
                    <Col span={5}><Search enterButton onSearch={ onSearch} onChange={ changeSearch}/></Col>
                    <Col span={10} className='flex flexBetween'>
                        <BtnList btnList={btnList} />

                    </Col>
                </Row>

                <Row gutter={20} style={{padding: 10}}>
                    <Col span={5} style={{border: '1px solid #ccc', height: tableHeight + 100, overflowY: 'auto'}}>
                        {/* <span>{Mes['titleTabBatchbatch']}</span> */}
                        <Tree
                            // defaultExpandAll={true}
                            // autoExpandParent={true}
                            onSelect={onSelect}
                            treeData={batchList}
                            expandedKeys={expandedList}
                            // height={tableHeight + 50}
                            onExpand={ onExpand}
                        />
                    </Col>
                    <Col span={18} style={{border: '1px solid #ccc', marginLeft: '5px', height: tableHeight + 100}}>
                        <Table columns={detailColumns} dataSource={dcuList} loading={loading} pagination={pagination} style={{ width: '100%' }} scroll={{y: tableHeight}}
                            size='small' rowKey='rn__' rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            onRow={(record) => ({
                                onClick: () => {
                                    let key = record.rn__;
                                    const rowsKeys = [ ...selectedRowKeys ];
                                    let index = rowsKeys.indexOf(key);

                                    if (index >= 0) {
                                        rowsKeys.splice(index, 1);
                                        dcuNos.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                        dcuNos.push(record.CST_NO);
                                    }
                                    setSelectedRowKeys(rowsKeys);
                                },
                            })}></Table>
                    </Col>
                </Row>

                <AddLangElment
                    cRef={cRef}
                    saveData={editStatus}
                    formOption={formOpt}
                    modelOpt={modelOpt}
                    Mes={Mes}
                />
                <AddLangElment
                    cRef={cRef1}
                    saveData={editVersion}
                    formOption={formOpt1}
                    modelOpt={modelOpt}
                    Mes={Mes}
                />

                <Modal visible={modalVisible}
                    title={modalTitle}
                    destroyOnClose
                    width={ 1000}
                    onCancel={handleCancel}
                    // afterClose={afterClose}
                    footer={[
                        <Button key='back' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
                        <Button key='submit' type='primary' onClick={handleOk} loading={ submitLoading}> { Mes['btnSubmit'] }</Button>,
                    ]}>
                    <Form
                        form={form}
                        name='langForm'
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        preserve={false}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name='batchNo' label={Mes['titleTableBatchnobatchno']} rules={[ { required: true } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='batchName' label={Mes['titleTableBatchnamebatchname']} rules={[ { required: true } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_meterFac' label={Mes['titleLabelDcufactorydcufactory']} rules={[ { required: true } ]}>
                                    <Select disabled={isDcuAdd} onSelect={ onSelectFactory}>
                                        {factoryList && factoryList.map((v: DcuFactory) => (<Option key={ v.FAC_CODE} value={ v.FAC_CODE}>{ v.FAC_NAME}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_meterType' label={Mes['titleTableDcutypedcutype']} rules={[ { required: true } ]}>
                                    <Select disabled={isDcuAdd} onSelect={ updateBatchName}>
                                        {typeList && typeList.map((v: DcuType) => (<Option key={ v.CST_TYPE} value={ v.CST_TYPE}>{ v.CST_TYPE_NAME}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} >
                                <Form.Item name='dcu_start_meter_no' label={Mes['titleLabelStartdcunostartdcuno']}
                                    rules={[ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                    <Input maxLength={15} onBlur={ onChangeStartNo}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12} >
                                <Form.Item name='dcu_end_meter_no' label={Mes['titleLabelEnddcunoenddcuno']}
                                    rules={[ { required: true, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                    <Input maxLength={15} onBlur={ onChangeEndNo}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_module_version' label={Mes['titleTableModuleversionmoduleversion']}>
                                    <Input maxLength={ 20} disabled={ isDcuAdd}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_soft_version' label={Mes['titleTableSoftversionsoftversion']}>
                                    <Input maxLength={ 20} disabled={ isDcuAdd}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_main_module_version' label={Mes['titleLabelMainmoduleversionmainmoduleversion']}>
                                    <Input maxLength={ 20} disabled={ isDcuAdd}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_total_meter_num' label={Mes['titleLabelTotaldcunumtotaldcunum']} rules={[ { required: true } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='dcu_start_date' label={Mes['titleLabelProducdateproducdate']} rules={[ { required: true } ]}>
                                    <DatePicker style={{ width: '100%' }} disabled={isDcuAdd} onChange={changeDate} format='YYYY-MM-DD'/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(DcuInWareHouse);
