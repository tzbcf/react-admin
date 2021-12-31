// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, Select, Tabs, message, Table, Form, Input, Checkbox, DatePicker, InputNumber } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { basicData, configuration } from 'src/api';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { MeterBaseType, MeterRegisterType, QueryMeterRegisterType } from 'src/api/basicData/meterInWareHouse/types';
import { MeterTypeParam } from 'src/api/configuration/meterTypeParameters/types';
import moment from 'moment';
import { showLoading, hideLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

let format = 'YYYY-MM-DD';
let isPrePaidSystem = false;
const MeterTypeParamtersPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { Option } = Select;
    const { TabPane } = Tabs;
    const [ form ] = Form.useForm();
    const [ form1 ] = Form.useForm();
    const [ form2 ] = Form.useForm();
    const [ baseTypeList, setBaseTypeList ] = useFetchState<MeterBaseType[]>([]);
    const [ registerList, setRegisterList ] = useFetchState<MeterRegisterType[]>([]);
    const [ baseType, setBaseType ] = useFetchState<string>('');
    const [ registerType, setRegisterType ] = useFetchState<string>('');
    const [ baseParamList, setBaseParamList ] = useFetchState<MeterTypeParam[]>([]);
    const [ preParamList, setPreParamList ] = useFetchState<MeterTypeParam[]>([]);
    const [ amiParamList, setAmiParamList ] = useFetchState<MeterTypeParam[]>([]);
    const [ prepayTab, setPrepayTab ] = useFetchState<boolean>(true);
    const [ amiTab, setAmiTab ] = useFetchState<boolean>(true);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);

    // 根据类型返回不同form表单编辑组件
    const getEditType = (record: MeterTypeParam) => {
        if (record.EDIT_TYPE === '1' || record.EDIT_TYPE === '6' || record.DATA_TYPE === '1' || record.DATA_TYPE === '6') {// 下拉框
            let comboboxDataArr = [];
            let arr = record.ENUM_LIST_USE.split('@');

            for (let ii = 0; ii < arr.length; ii++) {
                let tmpArr = arr[ii].split(',');

                comboboxDataArr.push({
                    'id': tmpArr[1],
                    'key': tmpArr[1],
                    'text': tmpArr[0],
                });
            }
            return (<Select style={{ width: '250px'}} >{comboboxDataArr && comboboxDataArr.map((v) => (<Option key={ v.key} value={ v.id}>{ v.text}</Option>))}</Select>);
        }
        if (record.EDIT_TYPE === '2' || record.DATA_TYPE === '2') {// 日期选择
            return (<DatePicker format={format} style={{ width: '250px' }} allowClear={ false}></DatePicker>);
        }
        if (record.EDIT_TYPE === '0' || record.DATA_TYPE === '0' || record.DATA_TYPE === '4') {// 数字输入框
            return (<InputNumber max={parseFloat(record.MAX_VALUE)} min={parseFloat(record.MIN_VALUE)} style={{width: '250px'}}></InputNumber>);
        }
        return (<Input style={{width: '250px'}}></Input>);
    };
    const baseColumns = [
        {
            dataIndex: 'PROTOCOL_NAME',
            title: 'Parameter Name',
        },
        {
            title: 'Parameter Value',
            dataIndex: 'DEFAULT_VALUE',
            editable: true,
            key: 'DEFAULT_VALUE',
            render (_: any, record: MeterTypeParam, index:number) {
                return (
                    <>
                        <Form.Item name={'BaseValue_' + index} preserve={ false} noStyle>
                            {getEditType(record)}
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: 'Is Hidden',
            dataIndex: 'DB_DOT',
            editable: true,
            key: 'DB_DOT',
            render (_: any, record: MeterTypeParam, index:number) {
                return (
                    <>
                        <Form.Item name={'BaseHidden_' + index} valuePropName='checked' preserve={ false} noStyle>
                            <Checkbox ></Checkbox>
                        </Form.Item>
                    </>
                );
            },
        },
    ];

    const prepayColumns = [
        {
            dataIndex: 'PROTOCOL_NAME',
            title: 'Parameter Name',
        },
        {
            title: 'Parameter Value',
            dataIndex: 'DEFAULT_VALUE',
            editable: true,
            render (_: any, record: MeterTypeParam, index:number) {
                return (
                    <>
                        <Form.Item name={'PrepayValue_' + index} noStyle>
                            <Input style={{ width: '250px'}}></Input>
                        </Form.Item>
                    </>
                );
            },
        },

    ];

    const amiColumns = [
        {
            dataIndex: 'PROTOCAL_NAME',
            title: 'Parameter Name',
        },
        {
            dataIndex: 'XU_HAO',
            title: 'Order',
            width: 150,
        },
        {
            title: 'Parameter Value',
            dataIndex: 'DEFAULT_VALUE',
            editable: true,
            render (_: any, record: MeterTypeParam, index:number) {
                return (
                    <>
                        <Form.Item name={'AmiValue_' + index} noStyle>
                            {getEditType(record)}
                        </Form.Item>
                    </>
                );
            },
        },
        {
            title: 'Is Hidden',
            dataIndex: 'IS_HIDDEN',
            editable: true,
            render (_: any, record: MeterTypeParam, index:number) {
                return (
                    <>
                        <Form.Item name={'AmiHidden_' + index} valuePropName='checked' noStyle>
                            <Checkbox ></Checkbox>
                        </Form.Item>
                    </>
                );
            },
        },
    ];

    const updateMeterParamter = async () => {
        const baseRes = await form.validateFields();

        let baseValues = [];

        for (let i = 0; i < baseParamList.length; i++) {
            let value = baseRes['BaseValue_' + i];

            if (!value) {
                message.warn(Mes['messageHintFieldRequried']);
                return;
            }
            let param = baseParamList[i];
            let obj = {
                METER_MODEL_NO: param.METER_MODEL_NO,
                PROTOCOL_NO: param.PROTOCOL_NO,
                DEFAULT_VALUE: param.EDIT_TYPE === '2' ? value.format(format) : value,
                DB_NOT: baseRes['BaseHidden_' + i],
            };

            baseValues.push(obj);
        }
        let prepayValues = [];

        if (isPrePaidSystem) {
            const prepayRes = await form1.validateFields();

            for (let i = 0; i < preParamList.length; i++) {
                let value = prepayRes['PrepayValue_' + i];

                if (!value) {
                    message.warn(Mes['messageHintFieldRequried']);
                    return;
                }
                let param = preParamList[i];
                let obj = {
                    METER_MODEL_NO: param.METER_MODEL_NO,
                    PROTOCOL_NO: param.PROTOCOL_NO,
                    DEFAULT_VALUE: value,
                    CARD_TYPENO: param.CARD_TYPENO,
                };

                prepayValues.push(obj);
            }
        }

        const amiRes = await form2.validateFields();
        let amiValues = [];

        for (let i = 0; i < amiParamList.length; i++) {
            let value = amiRes['AmiValue_' + i];

            if (!value) {
                message.warn(Mes['messageHintFieldRequried']);
                return;
            }
            let param = amiParamList[i];
            let obj = {
                SN: param.SN,
                DEFAULT_VALUE: param.DATA_TYPE === '2' ? value.format(format) : value,
                PROTOCOL_NAME_USE: amiRes['AmiHidden_' + i],
            };

            amiValues.push(obj);
        }
        showLoading();
        let params = {
            subSysNo: subSysNo,
            meterType: registerType,
            baseParamListStr: JSON.stringify(baseValues),
            prepayParamListStr: JSON.stringify(prepayValues),
            mpParamListStr: JSON.stringify(amiValues),
        };

        configuration.meterTypeParameters.updateMeterParamter(params).then(() => {
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            hideLoading();
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Save',
            btnType: 'primary',
            title: Mes['btnSavesave'],
            onClick () {
                updateMeterParamter();
            },
        },
    ];

    // 获取表计基本参数列表
    const getBaseParamsList = (meterType: string) => {
        configuration.meterTypeParameters.getMeterBaseParam(subSysNo, meterType).then((res: MeterTypeParam[]) => {
            form.resetFields();
            setBaseParamList(res);
            if (res.length > 0) {
                let obj = {};

                for (let i = 0; i < res.length; i++) {
                    let param = res[i];
                    let name = 'BaseValue_' + i;
                    let value = param.EDIT_TYPE === '2' ? moment(param.DEFAULT_VALUE) : param.DEFAULT_VALUE;
                    let name1 = 'BaseHidden_' + i;
                    let value1 = param.DB_DOT === '1';

                    obj[name] = value;
                    obj[name1] = value1;
                }
                form.setFieldsValue(obj);// 设置form表单的值
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 获取表计预付费参数列表
    const getPrepayParamsList = (meterType: string) => {
        configuration.meterTypeParameters.getMeterPrepayParam(subSysNo, meterType).then((res: MeterTypeParam[]) => {
            form1.resetFields();
            setPreParamList(res);
            if (res.length > 0) {
                let obj = {};

                for (let i = 0; i < res.length; i++) {
                    let param = res[i];
                    let name = 'PrepayValue_' + i;
                    let value = param.DEFAULT_VALUE;

                    obj[name] = value;

                }
                form1.setFieldsValue(obj);// 设置form表单的值
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 获取表计AMI参数列表
    const getAMIParamsList = (meterType: string) => {
        configuration.meterTypeParameters.getAMIParam(subSysNo, meterType).then((res: MeterTypeParam[]) => {
            form2.resetFields();
            setAmiParamList(res);
            if (res.length > 0) {
                let obj = {};

                for (let i = 0; i < res.length; i++) {
                    let param = res[i];
                    let name = 'AmiValue_' + i;
                    let value = param.DATA_TYPE === '2' ? moment(param.DEFAULT_VALUE, format) : param.DEFAULT_VALUE;
                    let name1 = 'AmiHidden_' + i;
                    let value1 = param.IS_HIDDEN === '1';

                    obj[name] = value;
                    obj[name1] = value1;
                }
                form2.setFieldsValue(obj);// 设置form表单的值
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    const getOperateId = (meterType: string) => {
        configuration.meterTypeParameters.getOperateId(meterType).then((res: string) => {
            if (res) {
                let resultArr = res.split(',');
                let meterOperateId = resultArr[0];
                let defaultRemoteFlag = resultArr[1];

                if (meterOperateId === '0') {// 0：本地预付费
                    isPrePaidSystem = true;
                    setPrepayTab(true);
                    setAmiTab(false);
                } else if (meterOperateId === '1') {// 1：远程预付费
                    isPrePaidSystem = true;
                    setPrepayTab(true);
                    setAmiTab(true);
                } else if (meterOperateId === '2') {// 2：本地加远程
                    isPrePaidSystem = true;
                    if (defaultRemoteFlag === '0') {// 本地
                        setPrepayTab(true);
                        setAmiTab(false);
                    } else {
                        setPrepayTab(true);
                        setAmiTab(true);
                    }
                }
            }
        });
    };

    // 获取表计型号列表
    const getRegisterTypeList = (type: string) => {
        const params: QueryMeterRegisterType = {
            subSysNo: subSysNo,
            baseType: type,
        };

        basicData.meterInWareHouse.meterRegisterType(params).then((res:MeterRegisterType[]) => {
            setRegisterList(res);
            if (res.length > 0) {
                setRegisterType(res[0].METER_MODEL_SYS_NO);
                getBaseParamsList(res[0].METER_MODEL_SYS_NO);
                getPrepayParamsList(res[0].METER_MODEL_SYS_NO);
                getAMIParamsList(res[0].METER_MODEL_SYS_NO);
                getOperateId(res[0].METER_MODEL_SYS_NO);
            } else {
                setRegisterType('');
                setBaseParamList([]);
                setPreParamList([]);
                setAmiParamList([]);
            }
        });
    };

    // 获取表计类型列表
    const getBaseTypeList = () => {
        basicData.meterInWareHouse.meterBaseType(subSysNo).then((res:MeterBaseType[]) => {
            setBaseTypeList(res);
            if (res.length > 0) {
                setBaseType(res[0].SN);
                getRegisterTypeList(res[0].SN);
            }
        });
    };

    const onSelectBaseType = (value: string) => {
        setBaseType(value);
        getRegisterTypeList(value);
    };

    const onSelectRegisterType = (value: string) => {
        setRegisterType(value);
        getBaseParamsList(value);
        getPrepayParamsList(value);
        getAMIParamsList(value);
        getOperateId(value);
    };

    useEffect(() => {
        getBaseTypeList();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleMeterTypeParameters']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={15}>

                    <Col span={5}>
                        <Select value={baseType} style={{ width: '100%' }} onSelect={ onSelectBaseType}>
                            {baseTypeList && baseTypeList.map((v: MeterBaseType) => (<Option key={ v.SN} value={ v.SN}>{ v.METER_BASE_NAME}</Option>))}
                        </Select>
                    </Col>
                    <Col span={5}>
                        <Select value={registerType} style={{ width: '100%' }} onSelect={ onSelectRegisterType}>
                            {registerList && registerList.map((v: MeterRegisterType) => (<Option key={ v.METER_MODEL_SYS_NO} value={ v.METER_MODEL_SYS_NO}>{ v.METER_MODEL_NAME}</Option>))}
                        </Select>
                    </Col>
                    <Col span={5} className='flex flexBetween'>
                        <BtnList btnList={btnList} />

                    </Col>
                </Row>
                <Tabs defaultActiveKey='1' type='card' style={{paddingTop: '10px'}}>
                    <TabPane tab={Mes['titleTableMeterbaseparametermeterbaseparameter']} key='1' forceRender={ true}>
                        <Form form={form}>
                            <Table columns={baseColumns} rowKey='PROTOCOL_NO' dataSource={baseParamList} pagination={false} style={{width: '800px'}} scroll={{y: tableHeight}} key='table1'></Table>
                        </Form>
                    </TabPane>
                    {prepayTab && (<TabPane tab={Mes['titleTableMeterprepayparametermeterprepayparameter']} key='2' forceRender={ true}>
                        <Form form={form1}>
                            <Table columns={prepayColumns} rowKey='PROTOCOL_NO' dataSource={preParamList} pagination={false} style={{width: '800px'}} scroll={{y: tableHeight}} key='table2'></Table>
                        </Form>
                    </TabPane>)}
                    {amiTab && (<TabPane tab={Mes['titleTableAmiparameteramiparameter']} key='3' forceRender={ true}>
                        <Form form={form2}>
                            <Table columns={amiColumns} rowKey='SN' dataSource={amiParamList} pagination={false} style={{width: '1000px'}} scroll={{y: tableHeight}} key='table3'></Table>
                        </Form>
                    </TabPane>)}
                </Tabs>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterTypeParamtersPage);
