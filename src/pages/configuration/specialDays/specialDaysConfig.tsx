// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import { Form, Checkbox, DatePicker, Button, TimePicker, Modal, message, Row, Col } from 'antd';
// import useFetchState from 'src/utils/useFetchState';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import useFetchState from 'src/utils/useFetchState';
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import bus from 'src/utils/eventBus';
import moment from 'moment';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';
import { configuration } from 'src/api';
import { WebSocketMessage } from 'src/api/configuration/activityCalender/types';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    excuteTask: any;
};

type TableData = {
    id: number;
    date: string;
}

// websocket通信所需信息
type WebSocketData = {
    receiveMessNum: number;
    totalTaskNum: number;
    groupId: string;
    meter: any[];
    formData: any;
    tableData: TableData[];
}

let length = 1;// 当前day个数
const SpecialDaysConfig: React.FC<Props> = (props) => {
    const { Mes, excuteTask } = props;
    const cRef = useRef<CRef>();
    const [ form ] = Form.useForm();
    const INIT:TableData = {
        id: 1,
        date: '',
    };
    const [ tableList, setTableList ] = useFetchState<TableData[]>([ INIT ]);
    const weekOptions = [
        { label: 'Sunday', value: 'Sunday' },
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
    ];
    const format = 'YYYY-MM-DD';
    const timeFormat = 'HH:mm';
    const onConfig = useRef<WebSocketData>({
        receiveMessNum: 0,
        totalTaskNum: 0,
        groupId: '',
        meter: [],
        formData: null,
        tableData: [ INIT ],
    });
    // 点击设备树的DCU
    const onNodeCheck = (row: any[]) => {
        console.log(row);
        onConfig.current.meter = row;
    };

    // websocket发送消息
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

    // 下发指令
    const sendProtocalCommand = () => {
        const data = onConfig.current.formData;
        const daySelect = data.days;
        const weekSelect = data.weeks;
        const timeSelect = data.times;

        if (!daySelect && !weekSelect && !timeSelect) {
            message.warn(Mes['messageAlarmSelectschemeselectscheme']);
            return;
        }
        let cmds = [];

        if (daySelect) {// 选中day
            let specialDay = '';

            for (let i = 1; i <= length; i++) {// 获取day中添加的日期
                if (data['Date_' + i]) {
                    let date = moment(data['Date_' + i]).format('MM-DD');

                    // if (specialDay.includes(date)) {
                    //     message.warn(Mes['messageHintDatedate']);
                    //     return;
                    // } else {
                    specialDay = specialDay + date + ',';
                    // }
                }
            }
            console.log(data, specialDay, length);
            if (!specialDay) {
                message.warn(Mes['messageHintDatedate']);
                return;
            }
            cmds.push({
                param: specialDay.substring(0, specialDay.length - 1),
                commandType: '18',
            });
        }
        if (weekSelect) {// 选中week
            const weekArry:string[] = data.selectWeek;
            let specialWeek = '';

            for (let i = 0; i < weekOptions.length; i++) {// 拼接week选项
                if (weekArry && weekArry.includes(weekOptions[i].value)) {
                    specialWeek = specialWeek + '1';
                } else {
                    specialWeek = specialWeek + '0';
                }
            }
            console.log(specialWeek);
            let brr = specialWeek.split('');
            let week = '';

            for (let i = 0, len = specialWeek.length; i <= len - 1; i++) {
                week += brr[brr.length - i - 1];
            }
            week = '0' + week;
            cmds.push({
                param: week,
                commandType: '20',
            });
        }

        if (timeSelect) {// 选择time
            let selectTime = data.selectTime;

            if (!selectTime) {
                message.warn(Mes['messageHintTimetime']);
                return;
            }
            // 获取输入的time信息
            let specialTime = moment(selectTime[0]).format(timeFormat) + ',' + moment(selectTime[1]).format(timeFormat);

            cmds.push({
                param: specialTime,
                commandType: '19',
            });
        }

        let meters = onConfig.current.meter;
        let meterList:any[] = [];

        meters.map((v) => {
            meterList.push({
                ITEM_ID: v.deviceGuid,
                CST_ID: v.CST_ID,
                SN_METER_TYPE: v.deviceModel,
            });
        });
        let params = {
            groupId: onConfig.current.groupId,
            remark: 'specialDay',
            meterItems: JSON.stringify(meterList),
            cmdParameter: JSON.stringify(cmds),
        };

        console.log(params);
        configuration.activityCalender.sendProtocalCommand(params).then((res: WebSocketMessage) => {
            if (res.flag) {
                let messArr = res.mess.split(';');

                onConfig.current.groupId = messArr[0];
                let taskNum = messArr[1];

                onConfig.current.totalTaskNum = parseInt(taskNum, 10); // 总任务数量
                excuteTask();// 跳转task 标签页查询结果
            } else {
                let messArr = res.mess.split(';');

                message.error(messArr[2]);
            }
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
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
                    // console.log(taskId);
                    excuteTask();// 跳转task 标签页查询结果

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
            async onClick () {
                form.validateFields().then((data) => {
                    onConfig.current.formData = data;
                    if (onConfig.current.meter.length > 0) {
                        startSend();
                    } else {
                        Modal.confirm({
                            icon: <ExclamationCircleOutlined />,
                            content: Mes['messageConfirmIssuetoallmetertypeissuetoallmetertype'],
                            onOk () {
                                startSend();
                            },
                            onCancel () {
                                console.log('Cancel');
                            },
                        });
                    }
                });
            },
        },
    ];

    // day添加一个item
    const addTableItem = async () => {
        let list = [ ...tableList ];

        length++;
        list.push({
            id: length,
            date: '',
        });
        setTableList(list);

        let obj = {};

        obj['Date_' + length] = undefined;
        form.setFieldsValue(obj);
        onConfig.current.tableData = list;
    };

    // day删除一个item
    const removeTableItem = (id: number) => {
        let list = [ ...tableList ];

        if (list.length > 1) {
            let index = list.findIndex((v) => v.id === id);

            list.splice(index, 1);
            setTableList(list);
            onConfig.current.tableData = list;
        }
    };

    // const detailColumns = [
    //     {
    //         title: Mes['titleLabelDatedate'],
    //         render (_: any, record: any, index:number) {
    //             return (
    //                 <>
    //                     <Form.Item name={'Date_' + index} fieldKey={record.id} shouldUpdate preserve={ false} noStyle>
    //                         <DatePicker format={format} style={{ width: '300px' }}></DatePicker>
    //                     </Form.Item>
    //                 </>
    //             );
    //         },
    //     },
    //     {
    //         title: Mes['titleLabelOperation2operation2'],
    //         width: 250,
    //         render (_: any, record: any, index:number) {
    //             return (
    //                 <>
    //                     <Button type='primary' onClick={() => {addTableItem();}} title={Mes['btnTitleAdd']} icon={<PlusOutlined />} style={{marginLeft: '20px'}}>

    //                     </Button>
    //                     <Button type='default' danger onClick={() => {removeTableItem(index);}} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> } style={{marginLeft: '20px'}}>

    //                     </Button>

    //                 </>
    //             );
    //         },
    //     },
    // ];

    useEffect(() => {
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

    return (<>
        <div className='remoteControl contentWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} checkbox={false} cRef={cRef} PAGESIZE={12} isExpand={ true}/>
            </div>
            <div className='wrapRight' style={{overflow: 'auto'}}>
                <div className='pv10h20'>
                    {
                        btnList.length && <BtnList btnList={ btnList} />
                    }
                </div>
                <Form form={form}>
                    <div style={{border: '1px solid #aaa', margin: '5px', padding: '10px'}}>
                        <Form.Item name='days' valuePropName='checked'>
                            <Checkbox><h2>{ Mes['titleTableDaysdays']}</h2></Checkbox>
                        </Form.Item>
                        {/* <Table columns={detailColumns} style={{ width: '60%' }} pagination={false} bordered={true} dataSource={tableList} rowKey='id'></Table> */}
                        <Row style={{background: '#F5F5F5', width: '60%'}}>
                            <Col span={10}>
                                <span>{Mes['titleLabelDatedate']}</span>
                            </Col>
                            <Col span={10}>
                                <span>{Mes['titleLabelOperation2operation2']}</span>
                            </Col>
                        </Row>

                        {tableList.length && tableList.map((v) => (
                            <Row key={v.id} style={{width: '60%', marginTop: '10px'}}>
                                <Col span={10}>
                                    <Form.Item name={'Date_' + v.id} noStyle>
                                        <DatePicker format={format} style={{ width: '300px' }} allowClear={false} defaultValue={ undefined}></DatePicker>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <>
                                        <Button type='primary' onClick={() => {addTableItem();}} title={Mes['btnTitleAdd']} icon={<PlusOutlined />} style={{marginLeft: '20px'}}>

                                        </Button>
                                        <Button type='default' danger onClick={() => {removeTableItem(v.id);}} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> } style={{marginLeft: '20px'}}>

                                        </Button>

                                    </>
                                </Col>
                            </Row>
                        ))}

                    </div>

                    <div style={{ border: '1px solid #aaa', margin: '5px', padding: '10px'}}>
                        <Form.Item name='weeks' valuePropName='checked'>
                            <Checkbox><h2>{ Mes['titleLabelWeekweek']}</h2></Checkbox>
                        </Form.Item>
                        <Form.Item name='selectWeek'>
                            <Checkbox.Group
                                options={weekOptions}
                            />
                        </Form.Item>
                    </div>

                    <div style={{ border: '1px solid #aaa', margin: '5px', padding: '10px'}}>
                        <Form.Item name='times' valuePropName='checked'>
                            <Checkbox><h2>{ Mes['titleLabelTimetime']}</h2></Checkbox>
                        </Form.Item>

                        <Form.Item name='selectTime'>
                            <TimePicker.RangePicker format={ timeFormat}/>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    </>);
};

export default SpecialDaysConfig;
