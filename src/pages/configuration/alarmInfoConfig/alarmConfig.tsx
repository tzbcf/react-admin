// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { Table, message } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { MeterModel, AlarmConfigData, AlarmConfigList, WebSocketMessage } from 'src/api/configuration/alarmConfig/types';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    excuteTask: any;
};

// websocket通信所需数据
type WebSocketData = {
    receiveMessNum: number;
    totalTaskNum: number;
    groupId: string;
    selectData: number[];
    selectMeter: string;
    selectAlarm: string;
}

const AlarmConfigTab: React.FC<Props> = (props) => {
    const { Mes, excuteTask } = props;
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    const [ alarmConfigList, setAlarmConfigList ] = useFetchState<AlarmConfigData[]>([]);
    const [ meterModelList, setMeterModelList ] = useFetchState<any[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    // const [ total, setTotal ] = useFetchState<number>(0);
    // const [ current, setCurrent ] = useFetchState<number>(0);
    const ROWS = 32;

    const onConfig = useRef<WebSocketData>({
        receiveMessNum: 0,
        totalTaskNum: 0,
        groupId: '',
        selectData: [],
        selectAlarm: '',
        selectMeter: '',
    });

    const detailColumns = [
        {
            title: Mes['titleTableWordseqwordseq'],
            dataIndex: 'WORD_SEQ',
        },
        {
            title: Mes['titleTableWordnamewordname'],
            dataIndex: 'WORD_NAME',
        },

    ];

    const getData = (page:number = 1) => {
        setLoading(true);
        setSelectedRowKeys([]);
        sRef.current?.getFormData().then((data: any) => {
            configuration.alarmConfig.getAlarmConfigList(page, ROWS, data.meterModelNo, data.alarmType, 'asc').then((res:AlarmConfigList) => {
                setAlarmConfigList(res.rows);
                // setTotal(res.total);
                // setCurrent(page);
                setLoading(false);
            })
                .catch((err) => {
                    message.error(err);
                    setLoading(false);
                });


        });
    };

    // 选择设备树
    const onNodeCheck = (row: any[]) => {
        console.log(row);
        if (row.length > 0) {
            let meterModel = row[0].metermodelno;

            onConfig.current.selectMeter = meterModel;
            sRef.current?.setFieldsValue({
                meterModelNo: meterModel,
            });
            // setTimeout(() => {
            getData();
        // }, 200);
        }
    };

    const search = (data: any) => {
        console.log('a-----', data);
        getData();
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: AlarmConfigData[]) => {
            setSelectedRowKeys(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
                let selects:number[] = [];

                selectedRows.map((v:AlarmConfigData) => {
                    let index = alarmConfigList.findIndex((value) => value.SN === v.SN);

                    selects.push(index);
                });

                onConfig.current.selectData = selects;
            }
        },
    };

    // const pagination = {
    //     total: total,
    //     onChange (page: number) {
    //         getData(page);
    //     },
    //     current: current,
    //     hideOnSinglePage: true,
    //     pageSize: ROWS,
    //     showSizeChanger: false,
    // };


    const selectMeterModel = (value: string) => {
        console.log(value);
        onConfig.current.selectMeter = value;
        getData();
    };

    const selectAlarmType = (value: string) => {
        console.log(value);
        onConfig.current.selectAlarm = value;
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
        setTimeout(() => {
            onConfig.current.selectMeter = list[0].METER_MODEL_NO;
            onConfig.current.selectAlarm = 'Alarm1';
            sRef.current?.setFieldsValue({
                meterModelNo: list[0].METER_MODEL_NO,
                alarmType: 'Alarm1',
            });
            getData();
        }, 1000);
    };

    const sendProtocalCommand = () => {
        console.log('sendProtocalCommand', onConfig.current.selectData);
        let cmds = [];

        for (let i = 0; i < ROWS; i++) {
            if (onConfig.current.selectData.includes(i)) {
                cmds.push(1);
            } else {
                cmds.push(0);
            }
        }
        console.log(cmds);
        let cmdParameter = '';

        for (let i = 0, len = cmds.length; i <= len - 1; i++) {
            cmdParameter += cmds[cmds.length - i - 1] + '';
        }

        let params = {
            groupId: onConfig.current.groupId,
            meterModelNo: onConfig.current.selectMeter,
            alarmType: onConfig.current.selectAlarm,
            cmdParameter: parseInt(cmdParameter, 2),
        };

        console.log(params);
        configuration.alarmConfig.sendProtocalCommand(params).then((res: WebSocketMessage) => {
            if (res.flag) {
                let messArr = res.mess.split(';');

                onConfig.current.groupId = messArr[0];
                let taskNum = messArr[1];

                onConfig.current.totalTaskNum = parseInt(taskNum, 10); // 总任务数量
                excuteTask();
            } else {
                message.error(res.mess);
            }
            hideLoading();
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const startSend = () => {
        showLoading();
        onConfig.current.groupId = v4();
        onConfig.current.receiveMessNum = 0;
        onConfig.current.totalTaskNum = 0;
        const obj = {
            name: 'otask',
            guid: onConfig.current.groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
    };

    // webSocket消息回调函数
    const OnDemand = (data: any) => {
        let wsguid = data.guid;
        let name = data.name;
        let taskId = data.taskid;
        // let result = data.result;
        // let isSuccess = data.success;

        console.log('webSocket收到消息', data);
        hideLoading();
        if (wsguid === onConfig.current.groupId) {
            onConfig.current.receiveMessNum++;
            if (onConfig.current.receiveMessNum === 1 && name === 'otask-confirm') {
                sendProtocalCommand();
                onConfig.current.receiveMessNum = 0;
            } else {
                if (taskId) {
                    // let list: SchemeProfileData[] = [ ...onConfig.current.tableData ];
                    // let selects = list.filter((v) => v.SCHEME_SN === taskId);

                    // selects.map((v: SchemeProfileData, index: number) => {

                    // });
                    console.log(taskId);

                }
                if (onConfig.current.totalTaskNum === onConfig.current.receiveMessNum) {
                    onConfig.current.totalTaskNum = 0;
                    hideLoading();
                }
            }

        }
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Start',
            btnType: 'primary',
            title: Mes['btnExecuteexecute'],
            onClick () {
                if (selectedRowKeys.length > 0) {
                    startSend();
                } else {
                    message.warn(Mes['messageHintSelectlinelossselectlineloss']);
                }

            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };


    useEffect(() => {
        initConfig();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 300);

        // webSocket监听
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
        };
    }, []);

    return (
        <div className='remoteControl contentWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} isExpand={true} checkbox={true} cRef={cRef} PAGESIZE={12} />
            </div>
            <div className='wrapRight'>
                <div className='pv10h20'>

                    {
                        searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} btnConfig={btnConfig} isSearch={ false}/>
                    }
                    <div id={'table'}>
                        <Table columns={detailColumns} style={{ width: '60%' }} rowKey='SN' className='table' dataSource={alarmConfigList} loading={loading}
                            pagination={ false} scroll={{y: tableHeight}}
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            onRow={(record) => ({
                                onClick: () => {
                                    let key = record.SN;
                                    const rowsKeys = [ ...selectedRowKeys ];
                                    let index = rowsKeys.indexOf(key);

                                    if (index >= 0) {
                                        rowsKeys.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                    }
                                    setSelectedRowKeys(rowsKeys);
                                    let selectIndex = alarmConfigList.findIndex((value) => value.SN === key);

                                    if (onConfig.current.selectData.indexOf(selectIndex) >= 0) {
                                        onConfig.current.selectData.splice(onConfig.current.selectData.indexOf(selectIndex), 1);
                                    } else {
                                        onConfig.current.selectData.push(selectIndex);
                                    }
                                },
                            })}></Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlarmConfigTab;
