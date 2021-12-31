// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Form, Select, InputNumber } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import { configuration } from 'src/api';
import { MeterTypeData, MeterTypeList, UploadProgress } from 'src/api/configuration/lineLossAnalysis/types';
import moment from 'moment';
// import { UploadOutlined } from '@ant-design/icons';
import UploadModal, { URef } from 'src/components/business/uploadModal';
import { RcFile } from 'antd/es/upload/interface';
import { randomStr } from 'src/utils/utils';
import { UploadResult, excelUpload } from 'src/api/http';
import { hideLoading, showLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const LineLossAnalysis: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { Option } = Select;
    const sRef = useRef<SRef>();
    const uRef = useRef<URef>();
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ meterTypeList, setMeterTypeList ] = useFetchState<MeterTypeData[]>([]);
    // const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    // const [ fileList, setFileList ] = useFetchState<any[]>([]);
    // const [ uploadMsg, setUploadMsg ] = useFetchState<string>('');
    const format = 'YYYY-MM-DD HH:mm:ss';
    const [ form ] = Form.useForm();

    const getData = (type:string) => {
        setLoading(true);
        configuration.lineLossAnalysis.getMeterTypeList(type).then((v: MeterTypeList) => {
            form.resetFields();
            setMeterTypeList(v.rows);
            setLoading(false);
            let obj = {};

            for (let i = 0; i < v.rows.length;i++) {
                let meterType = v.rows[i];

                if (meterType.IS_ENABLE) {
                    obj['meterTypeObj_' + i] = meterType.GROUP_ID + '_' + meterType.CAPTURE_IDX;
                    obj['threshold_' + i] = meterType.THRESHOLD;
                    obj['operation_' + i] = meterType.COMMAND_TYPE;
                    obj['state_' + i] = meterType.IS_ENABLE;
                }
            }

            form.setFieldsValue(obj);
        })
            .catch((err) => {
                message.error(err);
                setLoading(false);
            });
    };

    const search = (data: any) => {
        console.log(data);
        getData(data.frozenType);
    };


    const detailColumns = [
        {
            dataIndex: 'SN_METER_TYPE_NAME',
            title: Mes['titleTableDevicetypedevicetype'],
        },
        {
            title: Mes['lineLossTableMetertypeobjmetertypeobj'],
            // dataIndex: 'meterTypeObj',
            render (_: any, record: MeterTypeData, index:number) {
                return (
                    <>
                        <Form.Item name={'meterTypeObj_' + index} rules={[ { required: true, message: 'Please select meterTypeObj!' } ]} noStyle>
                            <Select placeholder='please select'>
                                {record.meterTypeObj.length && record.meterTypeObj.map((v, i) =>
                                    (<Option key={i} value={v.GROUP_ID + '_' + v.CAPTURE_OBJ_INDEX}>{ v.AFN_NAME + '(' + v.CAPTURE_OBJ_OBIS + ')'}</Option>)
                                )}
                            </Select>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['titleLabelThresholdthreshold'],
            dataIndex: 'threshold',
            width: 200,
            render (_: any, record: MeterTypeData, index:number) {
                return (
                    <>
                        <Form.Item name={'threshold_' + index} rules={[ { required: true, message: 'Please input threshold!' } ]} initialValue='5' noStyle>
                            <InputNumber></InputNumber>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['lineLossTableOperationoperation'],
            dataIndex: 'operation',
            width: 200,
            render (_: any, record: MeterTypeData, index:number) {
                return (
                    <>
                        <Form.Item name={'operation_' + index} rules={[ { required: true, message: 'Please select operation!' } ]} noStyle>
                            <Select placeholder='please select'>
                                <Option value='1'>Switch off</Option>
                                <Option value='2'>Switch on</Option>
                                <Option value='3'>Open valve</Option>
                                <Option value='4'>Close valve</Option>
                            </Select>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'state',
            width: 200,
            render (_: any, record: MeterTypeData, index:number) {
                return (
                    <>
                        <Form.Item name={'state_' + index} rules={[ { required: true, message: 'Please select state!' } ]} noStyle>
                            <Select placeholder='please select'>
                                <Option value='0'>Disable</Option>
                                <Option value='1'>Enable</Option>
                            </Select>
                        </Form.Item>
                    </>
                );
            },
        },
    ];

    const selectForzenType = (value:string) => {
        sRef.current?.setFieldsValue({
            frozenType: value,
        });
        getData(value);
    };

    const changeDate = (dates: any, dateStrings: string) => {
        sRef.current?.setFieldsValue({
            startTime: moment(dateStrings, format),
        });
    };

    const saveLineLoss = async () => {
        let data = await sRef.current?.getFormData();

        if (!data.startTime) {
            message.warn(Mes['messageHintStarttimestarttime']);
            return;
        }
        let type = data.frozenType;
        let time = data.startTime.format(format);
        let formData = await form.validateFields();
        let params = [];

        for (let i = 0; i < meterTypeList.length; i++) {
            let meter = meterTypeList[i];
            let meterTypeValue = formData['meterTypeObj_' + i].split('_');

            // let meterTypeObj = meter.meterTypeObj.filter((v) => v.GROUP_ID === meterTypeValue[0] && v.CAPTURE_OBJ_INDEX === parseInt(meterTypeValue[1], 10));

            let obj = {
                IS_ENABLE: formData['state_' + i],
                COMMAND_TYPE: formData['operation_' + i],
                THRESHOLD: formData['threshold_' + i],
                GROUP_ID: meterTypeValue[0],
                CAPTURE_IDX: meterTypeValue[1],
                METER_TYPE: meter.METER_TYPE,
                SN: meter.SN,
                frozenType: type,
                startTime: time,
            };

            params.push(obj);
        }
        console.log(params);
        configuration.lineLossAnalysis.saveLineLoss(JSON.stringify(params)).then(() => {
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            getData(type);
        });
    };

    // const uploadProps = {
    //     onRemove: (file:any) => {

    //         const index = fileList.indexOf(file);
    //         const newFileList = fileList.slice();

    //         newFileList.splice(index, 1);
    //         setFileList(newFileList);

    //     },
    //     beforeUpload: (file: any) => {
    //         const list = [ ...fileList ];

    //         list.splice(0, list.length);
    //         list.push(file);
    //         setFileList(list);
    //         return false;
    //     },
    //     fileList,
    //     maxCount: 1,
    // };

    // const showImportModal = () => {
    //     setModalVisible(true);
    //     setFileList([]);
    //     setUploadMsg('');
    // };

    // const handleCancel = () => {
    //     setModalVisible(false);
    // };

    const startUpload = (fileId: string) => {
        configuration.lineLossAnalysis.startUpload(fileId).then(() => {
            let timer = setInterval(() => {
                configuration.lineLossAnalysis.getUploadProgress(fileId).then((res: UploadProgress) => {
                    let progress = (res.CUR_IDX / res.TOTAL_CNT) * 100 + '%';

                    console.log('progress', progress);
                    if (res.msg === 'success') {
                        message.success(res.msg);
                        // setModalVisible(false);
                        clearInterval(timer);
                        hideLoading();
                    } else if (res.msg) {
                        // setUploadMsg(res.msg);
                        message.info(res.msg);
                        clearInterval(timer);
                        hideLoading();
                    }
                });
            }, 500);
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const handleUpload = async (file: RcFile| null) => {
        if (!file) {
            message.warn('Excel file is not recognized');
            return;
        }
        const formData = new FormData();
        let fileId = randomStr(32);

        formData.append('uppath', fileId);
        // fileList.forEach((file) => {
        formData.append('file1', file);
        // });

        // You can use any AJAX library you like
        showLoading();
        excelUpload(formData).then((res: UploadResult) => {
            console.log(res);
            if (!res.hintMsg) {
                startUpload(fileId);
            } else {
                // setUploadMsg(res.hintMsg);
                message.info(res.hintMsg);
                hideLoading();
            }
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: Mes['btnUpup'],
            onClick () {
                // showImportModal();
                uRef.current?.openModel();
            },
        },
        {
            type: 'Save',
            btnType: 'primary',
            title: Mes['btnSavesave'],
            onClick () {
                saveLineLoss();
            },
        },
    ];

    // const uploadBtnList: BtnConfig[] = [
    //     {
    //         type: 'Export',
    //         btnType: 'primary',
    //         title: Mes['btnUploadupload'],
    //         onClick () {
    //             handleUpload();
    //         },
    //     },
    //     {
    //         type: 'Download',
    //         btnType: 'primary',
    //         title: Mes['btnTemplatetemplate'],
    //         onClick () {
    //             // const link = document.createElement('a');

    //             // link.style.display = 'none';
    //             // link.href = `${location.origin}/amr/excel/LineLossTemplate.xlsx`;

    //             // document.body.appendChild(link);
    //             // link.click();
    //             // document.body.removeChild(link);
    //             window.location.href = '/v1/amr/excel/LineLossTemplate.xlsx';
    //             // window.open(`${location.origin}/amr/excel/LineLossTemplate.xlsx`);
    //         },
    //     },
    // ];

    const downExcel = () => {
        window.location.href = '/v1/amr/excel/LineLossTemplate.xlsx';
    };

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const initConfig = () => {
        try {

            const searchList = [

                {
                    name: 'frozenType',
                    col: 4,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                        onSelect: selectForzenType,
                    },
                    options: [ {name: 'Daily billing profile', value: 'Daily'}, {name: 'Monthly billing profile', value: 'Monthly'} ],
                },

                {
                    name: 'startTime',
                    type: 'TimePicker',
                    col: 3,
                    attr: {
                        format: format,
                        style: { width: '100%' },
                        onChange: changeDate,
                    },
                },
            ];

            setSearchColumns(searchList);
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    frozenType: 'Monthly',
                });
            }, 500);

            getData('Monthly');
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    useEffect(() => {
        initConfig();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleLineLossAnalysis']}</h4>
            </div>
            <div className='pv10h20'>

                {
                    searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} isSearch={ false} btnConfig={ btnConfig}/>
                }
                <div id={'table'}>
                    <Form form={form}>
                        <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN_METER_TYPE_NAME' className='table' loading={loading} dataSource={meterTypeList}
                            pagination={ false}></Table>
                    </Form>
                </div>
            </div>
        </div>
        <UploadModal
            uRef={uRef}
            title={Mes['titleExcelimportexcelimport']}
            downEvent={downExcel}
            onfinish={handleUpload} />
        {/* <Modal visible={modalVisible}
            title={ Mes['titleExcelimportexcelimport']}
            destroyOnClose
            width={ 800}
            onCancel={handleCancel}
            // afterClose={afterClose}
            footer={[
                <Button key='back' onClick={handleCancel}>{ Mes['titleLabelCloseclose'] }</Button>,
            ]}>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Browse File</Button>
            </Upload>
            <div style={{margin: '10px'}}>
                <BtnList btnList={uploadBtnList} />
            </div>
            <span>{uploadMsg }</span>
        </Modal> */}
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(LineLossAnalysis);
