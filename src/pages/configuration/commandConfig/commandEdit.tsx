/* eslint-disable react/display-name */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Input, message, Table, Select, Row, Col, Form, Pagination} from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { DeviceSubType, CommandEditData, UploadProgress } from 'src/api/configuration/commandConfig/types';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
// import { SearchOutlined } from '@ant-design/icons';
import UploadModal, { URef } from 'src/components/business/uploadModal';
import { RcFile } from 'antd/es/upload/interface';
import { randomStr } from 'src/utils/utils';
import { UploadResult, excelUpload } from 'src/api/http';
import { hideLoading, showLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
};
let commandList: CommandEditData[] = [];
let commandAllList: CommandEditData[] = [];
const CommandEditTab: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { Option } = Select;
    const { Search } = Input;
    const [ form ] = Form.useForm();
    const uRef = useRef<URef>();
    const ROWS = 10;
    const [ commandEditList, setCommandEditList ] = useFetchState<CommandEditData[]>([]);
    const [ deviceTypeList, setDeviceTypeList ] = useFetchState<DeviceSubType[]>([]);
    const [ deviceType, setDeviceType ] = useFetchState<string>('Meter');
    const [ subType, setSubType ] = useFetchState<string>('');
    const [ commmandType, setCommandType ] = useFetchState<string>('Reading');
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    // const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    // const [ fileList, setFileList ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ searchValue, setSearchValue ] = useFetchState<string>('');
    // const [ uploadMsg, setUploadMsg ] = useFetchState<string>('');

    const changeSearchValue = (e:any) => {
        setSearchValue(e.target.value);
    };

    const search = () => {
        let filters = commandAllList.filter((v) => v['AFN_NAME'].toLowerCase().includes(searchValue.toLowerCase()) || v['AFN'].toLowerCase().includes(searchValue.toLowerCase()) ||
            v['SCALE'].toLowerCase().includes(searchValue.toLowerCase()) || v['FN'].toLowerCase().includes(searchValue.toLowerCase()) || v['UNIT'].toLowerCase().includes(searchValue.toLowerCase()));

        commandList = filters;
        let list = filters.slice(0, ROWS);

        form.resetFields();
        setCommandEditList(list);
        setCurrent(1);
        setTotal(filters.length);
        if (list.length > 0) {
            let obj = {};

            list.map((v: CommandEditData, index: number) => {
                obj['Name_' + index] = v.AFN_NAME;
                obj['Code_' + index] = v.AFN;
                obj['Scale_' + index] = v.SCALE;
                obj['Unit_' + index] = v.UNIT;
            });

            form.setFieldsValue(obj);
        }
    };

    // 根据值过滤table的行数据
    // const handleSearch = (selectedKeys: any, confirm: any, dataIndex: string) => {
    //     confirm();
    //     let filters:CommandEditData[] = [];

    //     if (selectedKeys.length > 0) {
    //         filters = commandAllList.filter((v) => v[dataIndex].toLowerCase().includes(selectedKeys[0].toString().toLowerCase()));
    //     } else {
    //         filters = commandAllList;
    //     }
    //     commandList = filters;
    //     let list = filters.slice(0, ROWS);

    //     form.resetFields();
    //     setCommandEditList(list);
    //     setCurrent(1);
    //     setTotal(filters.length);
    //     if (list.length > 0) {
    //         let obj = {};

    //         list.map((v: CommandEditData, index: number) => {
    //             obj['Name_' + index] = v.AFN_NAME;
    //             obj['Code_' + index] = v.AFN;
    //             obj['Scale_' + index] = v.SCALE;
    //             obj['Unit_' + index] = v.UNIT;
    //         });

    //         form.setFieldsValue(obj);
    //     }
    // };

    // 设置table行的搜索过滤属性
    // const getColumnSearchProps = (dataIndex:string) => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm}: any) => (
    //         <div style={{ padding: 8 }}>
    //             <Search
    //                 placeholder='Search'
    //                 value={selectedKeys[0]}
    //                 onChange={(e) => setSelectedKeys(e.target.value ? [ e.target.value ] : [ '' ])}
    //                 onSearch={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //                 style={{ marginBottom: 8, display: 'block' }}
    //                 enterButton
    //             />
    //         </div>
    //     ),
    //     filterIcon: (filtered:boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //     onFilter: (value: any, record: CommandEditData) =>
    //         // console.log(value, record[dataIndex]);
    //         record[dataIndex]
    //             ? record[dataIndex].toString().toLowerCase()
    //                 .includes(value.toLowerCase())
    //             : ''
    //     ,
    // });

    const baseColumns = [
        {
            dataIndex: 'AFN_NAME',
            title: 'Name',
            editable: true,
            // ...getColumnSearchProps('AFN_NAME'),
            render (_: any, record: CommandEditData, index:number) {
                return (
                    <>
                        <Form.Item name={'Name_' + index} noStyle required>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: 'Code',
            dataIndex: 'AFN',
            editable: true,
            // ...getColumnSearchProps('AFN'),
            render (_: any, record: CommandEditData, index:number) {
                return (
                    <>
                        <Form.Item name={'Code_' + index} noStyle required>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: 'Scale',
            dataIndex: 'SCALE',
            editable: true,
            // ...getColumnSearchProps('SCALE'),
            width: 200,
            render (_: any, record: CommandEditData, index:number) {
                return (
                    <>
                        <Form.Item name={'Scale_' + index} noStyle>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: 'Sub Code',
            dataIndex: 'FN',
            width: 150,
            // ...getColumnSearchProps('FN'),
        },
        {
            title: 'Unit',
            dataIndex: 'UNIT',
            editable: true,
            // ...getColumnSearchProps('UNIT'),
            width: 200,
            render (_: any, record: CommandEditData, index:number) {
                return (
                    <>
                        <Form.Item name={'Unit_' + index} noStyle>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },
    ];

    const getCommandEditList = (device: string, sub: string, command: string) => {
        setLoading(true);
        setSearchValue('');
        configuration.commandConfig.getCommandEditList(device, sub, command).then((res) => {
            setLoading(false);
            form.resetFields();
            commandAllList = res.filter((v) => v.AFN);
            commandList = commandAllList;
            let list = commandList.slice(0, ROWS);

            setCommandEditList(list);
            setTotal(commandList.length);
            setCurrent(1);
            if (list.length > 0) {
                let obj = {};

                list.map((v: CommandEditData, index: number) => {
                    obj['Name_' + index] = v.AFN_NAME;
                    obj['Code_' + index] = v.AFN;
                    obj['Scale_' + index] = v.SCALE;
                    obj['Unit_' + index] = v.UNIT;
                });

                form.setFieldsValue(obj);
            }
        })
            .catch((err) => {
                message.error(err);
                setLoading(false);
            });
    };

    const getDeviceTypeList = (device:string) => {
        configuration.commandConfig.getDeviceSubTypeList(device).then((res) => {
            setDeviceTypeList(res);
            if (res.length > 0) {
                setSubType(res[0].DEVICE_SUB_TYPE);
                getCommandEditList(device, res[0].DEVICE_SUB_TYPE, commmandType);
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 保存编辑后的属性
    const saveCommandEdit = async () => {
        let formData = await form.validateFields();
        let datas: any[] = [];
        let isScale = true;

        commandEditList.map((v: CommandEditData, index: number) => {
            let scale = formData['Scale_' + index];

            if (scale !== '1' && scale !== '-10' && scale !== '-100' && scale !== '-1000' && scale !== '-10000' && scale !== '-100000' &&
            scale !== '10' && scale !== '100' && scale !== '1000' && scale !== '10000' && scale !== '100000' && scale !== '1000000') {
                isScale = false;
            }
            let obj = {
                EDIT_AFN_NAME: formData['Name_' + index],
                EDIT_AFN: formData['Code_' + index],
                EDIT_FN: v.FN,
                EDIT_SN: v.SN,
                EDIT_SCALE: formData['Scale_' + index],
                EDIT_UNIT: formData['Unit_' + index],
            };

            datas.push(obj);
        });

        if (!isScale) {
            message.error('Scale must be -10,-100,-1000,-10000,-100000,1,10,100,1000,10000,100000,1000000');
            return;
        }

        let params = {
            commandsnlistedit: JSON.stringify(datas),
            deviceTypeEDIT: deviceType,
            deviceSubTypeEDIT: subType,
            commandTypeEDIT: commmandType,
        };

        configuration.commandConfig.saveCommandEdit(params).then(() => {
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            getCommandEditList(deviceType, subType, commmandType);
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 上传文件解析
    const startUpload = (fileId: string) => {
        configuration.commandConfig.startUpload(fileId).then(() => {
            let timer = setInterval(() => {
                configuration.commandConfig.getUploadProgress(fileId).then((res: UploadProgress) => {
                    let progress = (res.CUR_IDX / res.TOTAL_CNT) * 100 + '%';

                    console.log('progress', progress);
                    if (res.msg === 'success') {
                        message.success(res.msg);
                        // setModalVisible(false);
                        clearInterval(timer);
                        hideLoading();
                        getCommandEditList(deviceType, subType, commmandType);
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

    // 文件上传
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

    // 设置文件上传组件的属性
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

    const btnList: BtnConfig[] = [
        {
            type: 'Save',
            btnType: 'primary',
            title: Mes['btnSavesave'],
            onClick () {
                saveCommandEdit();
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            title: Mes['btnImportcommandexcelimportcommandexcel'],
            onClick () {
                // showImportModal();
                uRef.current?.openModel();
            },
        },
    ];

    const downExcel = () => {
        window.location.href = '/v1/amr/excelTemplate/CommandTemplate.xlsx';
    };

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
    //             window.location.href = '/v1/amr/excelTemplate/CommandTemplate.xlsx';
    //         },
    //     },
    // ];

    const onSelectDeviceType = (value: string) => {
        setDeviceType(value);
        getDeviceTypeList(value);
    };

    const onSelectSubType = (value: string) => {
        setSubType(value);
        getCommandEditList(deviceType, value, commmandType);
    };

    const onSelectCommandType = (value: string) => {
        setCommandType(value);
        getCommandEditList(deviceType, subType, value);
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            console.log(page);
            let start = (page - 1) * ROWS;
            let list = commandList.slice(start, page * ROWS);

            setCommandEditList(list);
            setCurrent(page);
            if (list.length > 0) {
                form.resetFields();
                let obj = {};

                list.map((v: CommandEditData, index: number) => {
                    obj['Name_' + (index)] = v.AFN_NAME;
                    obj['Code_' + (index)] = v.AFN;
                    obj['Scale_' + (index)] = v.SCALE;
                    obj['Unit_' + (index)] = v.UNIT;
                });

                form.setFieldsValue(obj);
            }
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    useEffect(() => {
        getDeviceTypeList(deviceType);
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
    }, []);

    return (<div className='pv10h20'>
        <Row gutter={20}>

            <Col span={4}>
                <Select value={deviceType} style={{ width: '100%' }} onSelect={ onSelectDeviceType}>
                    <Option value='Meter'>Meter</Option>
                    <Option value='DCU'>DCU</Option>
                </Select>
            </Col>
            <Col span={4}>
                <Select value={subType} style={{ width: '100%' }} onSelect={ onSelectSubType}>
                    {deviceTypeList && deviceTypeList.map((v: DeviceSubType) => (<Option key={ v.DEVICE_SUB_TYPE} value={ v.DEVICE_SUB_TYPE}>{ v.DEVICE_SUB_TYPE_NAME}</Option>))}
                </Select>
            </Col>
            <Col span={4}>
                <Select value={commmandType} style={{ width: '100%' }} onSelect={ onSelectCommandType}>
                    <Option value='read'>Reading</Option>
                    <Option value='set'>Setting</Option>
                </Select>
            </Col>
            <Col span={4}>
                <Search placeholder='Search' enterButton onSearch={search} value={searchValue} onChange={ changeSearchValue}></Search>
            </Col>
            <Col span={4} className='flex flexBetween'>
                <BtnList btnList={btnList} />

            </Col>
        </Row>

        <Form form={form} style={{ marginTop: '10px' }}>
            <div className='table'>
                <Table columns={baseColumns} rowKey='SN' dataSource={commandEditList} pagination={false} loading={loading} scroll={{ y: tableHeight }}></Table>
            </div>
            <div className='positonLtBt'>
                <Pagination {...pagination} />
            </div>
        </Form>
        <UploadModal
            uRef={uRef}
            title={Mes['titleExcelimportexcelimport']}
            downEvent={downExcel}
            onfinish={handleUpload} />
        {/* <Modal visible={modalVisible}
            title={ Mes['btnImportcommandexcelimportcommandexcel']}
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
                <BtnList btnList={uploadBtnList}/>
            </div>
            <span>{uploadMsg }</span>
        </Modal> */}
    </div>);
};


export default CommandEditTab;
