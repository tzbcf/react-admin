// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Form, Input, Select } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { MeterModel, AlarmConfigData, AlarmConfigList } from 'src/api/configuration/alarmConfig/types';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const AlarmValueTab: React.FC<Props> = (props) => {
    const { Mes } = props;
    const sRef = useRef<SRef>();
    const [ alarmConfigList, setAlarmConfigList ] = useFetchState<AlarmConfigData[]>([]);
    const [ meterModelList, setMeterModelList ] = useFetchState<any[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    // const [ total, setTotal ] = useFetchState<number>(0);
    // const [ current, setCurrent ] = useFetchState<number>(0);
    const ROWS = 32;
    const { Option} = Select;
    const [ form ] = Form.useForm();
    const detailColumns = [
        {
            title: Mes['titleTableWordseqwordseq'],
            dataIndex: 'WORD_SEQ',
        },
        {
            title: Mes['titleTableWordnamewordname'],
            dataIndex: 'WORD_NAME',
            render (_: any, record: AlarmConfigData, index:number) {
                return (
                    <>
                        <Form.Item name={'Name_' + index} required noStyle>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },

        {
            title: 'Word Level',
            dataIndex: 'BIT_LEN',
            render (_: any, record: AlarmConfigData, index:number) {
                return (
                    <>
                        <Form.Item name={'Bit_' + index} required noStyle>
                            <Select style={{width: '250px'}}>
                                <Option value={1}>Low Level</Option>
                                <Option value={2}>Middle Level</Option>
                                <Option value={3}>High Level</Option>
                            </Select>
                        </Form.Item>
                    </>
                );
            },
        },

        {
            title: Mes['titleTableStatusdefineemunstatusdefineemun'],
            dataIndex: 'STATUS_DEFINE_EMUN',
            render (_: any, record: AlarmConfigData, index:number) {
                return (
                    <>
                        <Form.Item name={'Status_' + index} required noStyle>
                            <Input></Input>
                        </Form.Item>
                    </>
                );
            },
        },

    ];

    const getData = (page:number = 1) => {
        setLoading(true);
        sRef.current?.getFormData().then((data: any) => {
            configuration.alarmConfig.getAlarmConfigList(page, ROWS, data.meterModelNo, data.alarmType, 'asc').then((res:AlarmConfigList) => {
                form.resetFields();
                setAlarmConfigList(res.rows);
                // setTotal(res.total);
                // setCurrent(page);
                setLoading(false);
                if (res.rows) {
                    let obj = {};

                    res.rows.map((v: AlarmConfigData, index: number) => {
                        obj['Name_' + index] = v.WORD_NAME;
                        obj['Bit_' + index] = v.BIT_LEN;
                        obj['Status_' + index] = v.STATUS_DEFINE_EMUN;
                    });
                    form.setFieldsValue(obj);
                }
            })
                .catch((err) => {
                    message.error(err);
                });


        });
    };


    const search = (data: any) => {
        console.log('a-----', data);
        getData();
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Save',
            btnType: 'primary',
            title: Mes['btnSavesave'],
            onClick () {
                form.validateFields().then((data) => {
                    let list:AlarmConfigData[] = [];

                    alarmConfigList.map((v: AlarmConfigData, index: number) => {
                        list.push({
                            rn__: v.rn__,
                            WORD_NAME: data['Name_' + index],
                            WORD_SEQ: v.WORD_SEQ,
                            SN: v.SN,
                            STATUS_DEFINE_EMUN: data['Status_' + index],
                            BIT_LEN: data['Bit_' + index],
                        });
                    });
                    // console.log(list);
                    let params = {
                        alarmConfigs: JSON.stringify(list),
                    };

                    configuration.alarmConfig.saveAlarmConfig(params).then(() => {
                        message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                        getData();
                    })
                        .catch((err) => {
                            message.error(err);
                        });
                });

            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const selectMeterModel = (value: string) => {
        console.log(value);
        getData();
    };

    const selectAlarmType = (value: string) => {
        console.log(value);
        getData();
    };

    const searchList = [
        {
            name: 'meterModelNo',
            col: 4,
            type: 'Select',
            options: meterModelList,
            attr: {
                style: { width: '100%' },
                onSelect: selectMeterModel,
            },
        },
        {
            name: 'alarmType',
            col: 3,
            type: 'Select',
            attr: {
                style: { width: '100%' },
                onSelect: selectAlarmType,
            },
            options: [ {name: 'Alarm1', value: 'Alarm1'}, {name: 'Alarm2', value: 'Alarm2'} ],
        },
    ];

    const initConfig = async () => {
        let list: MeterModel[] = await configuration.alarmConfig.getMeterModelList();
        let meterList:any[] = [];

        list.map((v) => {
            meterList.push({
                name: v.METER_MODEL_NAME,
                value: v.METER_MODEL_NO,
            });
        });

        setMeterModelList(meterList);
        // setTimeout(() => {
        sRef.current?.setFieldsValue({
            meterModelNo: list[0].METER_MODEL_NO,
            alarmType: 'Alarm1',
        });
        getData();
        // }, 400);
    };

    useEffect(() => {
        initConfig();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 300);
    }, []);

    return (
        <div className='main'>

            <div className='pv10h20'>

                {
                    searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} btnConfig={ btnConfig} isSearch={ false}/>
                }
                <div id={'table'}>
                    <Form form={form}>
                        <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' dataSource={alarmConfigList} loading={loading}
                            pagination={ false} scroll={{y: tableHeight}}></Table>
                    </Form>
                </div>
            </div>

        </div>
    );
};

export default AlarmValueTab;
