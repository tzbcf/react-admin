/* eslint-disable camelcase */
/*
 * FileName : configure.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-15 14:49:36
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { DeviceTreeRows } from 'src/api/common/type';
import { Row, Col, Select, Table, Tree, Pagination, message, Modal, Button, Input, Cascader } from 'antd';
import { Options } from 'src/utils/function';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
// import { Key } from 'rc-table/lib/interface';
import useFetchState from 'src/utils/useFetchState';
import { ColumnsType } from 'antd/es/table';
import { configuration } from 'src/api';
import { DeviceTypeData, CaptureObjectData, MeterObjectFile, ProtocolItem, CaptureObjectList } from 'src/api/configuration/configLoadProfile/type';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
import { showLoading, hideLoading } from 'src/components/common/loding';
import TransferTable, { CRef as TRef, PaginationConfig } from 'src/components/business/transfer';
const { Option } = Select;


type Props = {
  Mes: LangMessage;
  subSysNo: string;
  nodeNo: string;
};
let meterObjectList: MeterObjectFile[] = [];// 设备协议列表
let meterTypeList: any[] = [];// 设备型号列表
let nodeList: any[] = [];// 设备数列表
let meterObject: any = null;// 设备型号树形结构选择的节点
let sendTimeOut: any = null;
let snMeterType = '';// 当前选择设备型号
let snProtocol = '';// 当前选择protocol
let modalType = '';// 弹窗类型 0新增 1编辑
let rightTableData: CaptureObjectData[] = [];// 弹窗右边table数据列表

// websocket通信所需数据
type WebSocketData = {
    receiveMessNum: number;
    totalTaskNum: number;
    groupId: string;

}

const ConfigLoadProfile: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const ROWS = 10;
    // 设备类型
    const [ deviceType, setDeviceType ] = useFetchState<string>('METER');
    const [ meterType, setMeterType ] = useFetchState<string>('');
    const [ deviceTypeOpt, setDeviceTypeOpt ] = useFetchState<Options[]>([]);
    const [ tableData, setTableData ] = useFetchState<CaptureObjectData[]>([]);
    const [ treeData, setTreeData ] = useFetchState<any[]>([]);
    const [ checkKeyList, setCheckKeyList ] = useFetchState<string[]>([]);
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const [ expandedList, setExpandedList ] = useFetchState<string[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ protocolType, setProtocolType ] = useFetchState<string>('');
    const [ protocolItemOpt, setProtocolItemOpt ] = useFetchState<ProtocolItem[]>([]);
    const [ inputType, setInputType ] = useFetchState<string>('0');
    const [ timeType, setTimeType ] = useFetchState<string[]>([ 'Min', '300' ]);
    // const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    // 弹窗显示 时间级联项
    const timeOpt = [
        {
            value: 'Min',
            label: 'Min',
            children: [
                {
                    value: '300',
                    label: '5',
                },
                {
                    value: '900',
                    label: '15',
                },
                {
                    value: '1800',
                    label: '30',
                },
                {
                    value: '3600',
                    label: '60',
                },
                {
                    value: '28800',
                    label: '480',
                },
            ],
        },
        {
            value: 'Day',
            label: 'Day',
            children: [
                {
                    value: '86400',
                    label: '1',
                },
            ],
        },
        {
            value: 'Month',
            label: 'Month',
            children: [
                {
                    value: '2592000',
                    label: '1',
                },
            ],
        },
    ];

    const onConfig = useRef<WebSocketData>({
        receiveMessNum: 0,
        totalTaskNum: 0,
        groupId: '',
    });

    // 发送websocket消息
    const excute = () => {
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
        let list = [];

        if (meterObject) {
            list.push(meterObject);
        } else {
            for (let i = 0; i < meterObjectList.length - 1; i++) {
                list.push(meterObjectList[i]);
            }
        }
        console.log(nodeList, list);

        let nodes:any[] = [];

        nodeList.map((v) => {
            v.parentGuid = v.parentId;
            v.deviceId = v.deviceGuid;
            nodes.push(v);
        });
        let params = {
            subsys: subSysNo,
            groupId: onConfig.current.groupId,
            func_TYPE: '1',
            strlist: JSON.stringify(nodes),
            captureobj: JSON.stringify(list),
        };

        configuration.configLoadProfile.sendCommand(params).then((res) => {
            console.log(res);
            let mess = res.mes;

            if (res.flag === '1') {
                let messArr = mess.split(';');
                let taskNum = messArr[1];

                onConfig.current.groupId = messArr[0];
                onConfig.current.totalTaskNum = parseInt(taskNum, 10); // 总任务数量
                sendTimeOut = setTimeout(function () {
                    hideLoading();
                    message.warn('Timeout');
                }, 1000 * 60);
            } else {
                onConfig.current.totalTaskNum = 0;
                onConfig.current.groupId = '';
                hideLoading();
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
        // let taskId = data.taskid;
        let result = data.result;
        let isSuccess = data.success;

        console.log('webSocket收到消息', data);
        // hideLoading();
        if (wsguid === onConfig.current.groupId) {
            onConfig.current.receiveMessNum++;
            if (onConfig.current.receiveMessNum === 1 && name === 'otask-confirm') {
                sendProtocalCommand();
                onConfig.current.receiveMessNum = 0;
            } else if (onConfig.current.receiveMessNum > 0) {
                clearTimeout(sendTimeOut);

                if (onConfig.current.totalTaskNum === onConfig.current.receiveMessNum) {
                    onConfig.current.totalTaskNum = 0;
                    onConfig.current.groupId = '';
                    hideLoading();
                    if (isSuccess === 1) {
                        message.success('Operate Success!');
                    } else {
                        message.error(result);
                    }
                }
            }

        }
    };


    const tableColumns: ColumnsType<CaptureObjectData> = [
        {
            title: Mes['titleTableTypenametypename'],
            dataIndex: 'GROUP_TYPE_NAME',
        },
        {
            title: Mes['titleTableXuhaoxuhao'],
            dataIndex: 'CAPTURE_OBJ_INDEX',
        },
        {
            title: Mes['titleTableRechargegridcolnamerechargegridcolname'],
            dataIndex: 'AFN_NAME',
        },
        {
            title: Mes['titleTableClassidclassid'],
            dataIndex: 'CAPTURE_OBJ_CLASSID',
        },
        {
            title: Mes['titleTableObisobis'],
            dataIndex: 'CAPTURE_OBJ_OBIS',
        },
        {
            title: Mes['titleTableAttributeindexattributeindex'],
            dataIndex: 'CAPTURE_OBJ_ATTRIBUTE_INDEX',
        },
        {
            title: Mes['titleTableDataindexdataindex'],
            dataIndex: 'CAPTURE_OBJ_DATA_INDEX',
        },
        // {
        //     title: Mes['titleTableMetertypemetertype'],
        //     dataIndex: 'METER_TYPE',
        // },
        // {
        //     title: Mes['tableTitleSNProtocolCommandChildren'],
        //     dataIndex: 'SN_PROTOCOL_COMMAND_CHILDREN',
        // },
        // {
        //     title: Mes['titleTableSnprotocolcommandsnprotocolcommand'],
        //     dataIndex: 'SN_PROTOCOL_COMMAND',
        // },
        // {
        //     title: Mes['titleTableCaptureuintcaptureuint'],
        //     dataIndex: 'CAPTURE_UINT',
        // },
        // {
        //     title: Mes['titleTableRegistertimeregistertime'],
        //     dataIndex: 'REGISTER_TIME',
        // },
    ];

    // 根据下拉列表选项获取设备型号列表
    const getDeviceTypeList = (type: string) => {
        if (type === 'METER') {
            configuration.configLoadProfile.getDeviceTypeList(type, subSysNo).then((res: DeviceTypeData[]) => {
                meterTypeList = res;
                if (res.length) {
                    let list: Options[] = [];

                    res.map((v) => {
                        list.push({ name: v.SN_METER_TYPE_NAME, value: v.SN });
                    });

                    setDeviceTypeOpt(list);
                }
            });
        } else {
            configuration.configLoadProfile.getDCUTypeList(subSysNo).then((res) => {
                meterTypeList = res;
                if (res.length) {
                    let list: Options[] = [];

                    res.map((v) => {
                        list.push({ name: v.CST_TYPE_NAME, value: v.SN });
                    });

                    setDeviceTypeOpt(list);
                }
            });
        }
    };

    // 获取设备协议数据的树形结构
    const getMeterObjectFileList = (type:string, protocol:string, meter:string) => {
        let params = {
            subSysNo: subSysNo,
            captureType: type,
            snProtocol: protocol,
            snMeterType: meter,
        };

        configuration.configLoadProfile.getMeterObjectFileList(params).then((res) => {
            if (res.rows.length) {
                meterObjectList = res.rows;
                let group: string[] = [];

                res.rows.map((v) => {
                    if (!group.includes(v.SN_METER_TYPE_NAME)) {
                        group.push(v.SN_METER_TYPE_NAME);
                    }
                });
                let list:any[] = [];

                group.map((v) => {
                    let children: any[] = [];
                    let selects = res.rows.filter((item) => item.SN_METER_TYPE_NAME === v);

                    selects.map((child) => {
                        children.push({key: child.SN_PROTOCOL_COMMAND, title: child.AFN + ' | ' + child.AFN_NAME});
                    });
                    list.push({ key: v, title: v, children: children });
                });
                setTreeData(list);
                setExpandedList(group);
            }
        });
    };

    // 弹窗左边table数据接口
    const getCaptureItemList = async (page:number, rows:number, command:string, meter:string, protocal:string, itemName:string) => {
        let params = {
            page: page,
            rows: rows,
            snProtocolCommand: command,
            meterType: meter,
            snProtocal: protocal,
            itemName: itemName,
        };

        return await configuration.configLoadProfile.getCaptureItemList(params);
    };

    // 新增弹窗右边table数据接口
    const getClockClass = async (page:number, rows:number, command:string, meter:string, protocal:string) => {
        let params = {
            page: page,
            rows: rows,
            snProtocolCommand: command,
            meterType: meter,
            snProtocal: protocal,
            captureType: deviceType,
        };

        return await configuration.configLoadProfile.getClockClass(params);
    };

    // 编辑弹窗右边table数据接口
    const getMeterObjectTypeList = async (groupName:string, command:string, meter:string, protocal:string) => {
        let params = {
            groupName: groupName,
            snProtocolCommand: command,
            snMeterType: meter,
            snProtocal: protocal,
            captureType: deviceType,
            subSysNo: subSysNo,
        };

        return await configuration.configLoadProfile.getMeterTypeObObjectTypeList(params);
    };

    // 展开目录树
    const onExpand = (expandedKeys:any[]) => {
        setExpandedList(expandedKeys);
    };

    // 获取设备型号协议的table数据
    const getCaptureObjectList = (page: number = 1, snProtocal: string, type: string, snProtocolCommand: string, groupName: string) => {
        setLoading(true);
        let params = {
            page: page,
            rows: ROWS,
            snProtocal: snProtocal,
            subSysNo: subSysNo,
            meterType: type,
            snProtocolCommand: snProtocolCommand,
            groupName: groupName,
            captureType: deviceType,
        };


        configuration.configLoadProfile.getCaptureObjectList(params).then((res) => {
            setLoading(false);
            setTableData(res.rows);
            setCurrent(page);
            setTableTotal(res.total);
        });
    };

    // 弹窗左边table数据刷新
    const leftGetData = async (page: PaginationConfig, protocol:string = '', itemName:string = ''): Promise<any> => {
        console.log(page);
        tRef.current?.setLeftLoading(true);
        const list: CaptureObjectList = await getCaptureItemList(page.page, page.pageSize, protocol, snMeterType, snProtocol, itemName);

        tRef.current?.setLeftData({
            total: list.total,
            rows: list.rows,
        });
        tRef.current?.setLeftLoading(false);
        return {
            total: list.total,
            rows: list.rows,
        };
    };

    // 弹窗右边table数据刷新
    const rightGetData = async (page: PaginationConfig, protocol: string = ''): Promise<any> => {
        console.log(page, rightTableData);
        tRef.current?.setRightLoading(true);
        let list: CaptureObjectData[] = [];

        if (rightTableData.length > 0) {
            list = [ ...rightTableData ];
        } else {
            if (modalType === '0') {
                list = await getClockClass(page.page, page.pageSize, protocol, snMeterType, snProtocol);
            } else {
                let meter = meterTypeList.filter((v) => v.SN === meterType)[0];
                let group = meterObject ? meterObject.GROUP_NAME : meter.SN_METER_TYPE_NAME.replaceAll(' ', '_') + '_' + meterType + '_1';

                list = await getMeterObjectTypeList(group, protocol, snMeterType, snProtocol);
            }
            rightTableData = list;
        }
        let rowsData = list.slice((page.page - 1) * page.pageSize, page.pageSize * page.page);

        console.log('rowsData', rowsData, list);
        tRef.current?.setRightData({
            total: list.length,
            rows: rowsData,
        });
        tRef.current?.setRightLoading(false);
        return {
            total: list.length,
            rows: rowsData,
        };
    };

    // 弹窗下拉列表数据接口
    const getProtocolItemList = (type:string, protocol:string, btnType:string) => {
        let params = {
            page: 1,
            rows: ROWS,
            subSysNo: subSysNo,
            meterType: type,
            snProtocol: protocol,
            btnType: btnType,
            captureType: deviceType,
        };

        configuration.configLoadProfile.getProtocolItemList(params).then((res) => {

            setProtocolItemOpt(res);
            if (res.length > 0 && meterObject) {
                if (modalType === '0') {
                    setProtocolType(res[0].SN);
                    leftGetData({page: 1, pageSize: ROWS}, res[0].SN);
                    rightGetData({page: 1, pageSize: ROWS}, res[0].SN);
                } else {
                    setProtocolType(meterObject.SN_PROTOCOL_COMMAND);
                    leftGetData({page: 1, pageSize: ROWS}, meterObject.SN_PROTOCOL_COMMAND);
                    rightGetData({page: 1, pageSize: ROWS}, meterObject.SN_PROTOCOL_COMMAND);
                }
            }
        });
    };

    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getCaptureObjectList(page, meterObject.SN_PROTOCAL, meterObject.METER_TYPE, meterObject.SN_PROTOCOL_COMMAND, meterObject.GROUP_NAME);
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
        hideOnSinglePage: true,
    };

    // 按钮
    const btnList: BtnConfig[] = [
        {
            type: 'Del',
            btnType: 'primary',
            title: 'Stop',
            async onClick () {
                if (meterObject) {
                    let groupName = meterObject.GROUP_NAME;
                    let type = meterObject.METER_TYPE;

                    let curStatus = meterObject.STATUS_FLAG;

                    let status = '1';

                    if (curStatus !== '0') {
                        status = '0';
                    }
                    let params = {
                        subSysNo: subSysNo,
                        meterType: type,
                        groupName: groupName,
                        status: status,
                        snCommand: meterObject.SN_PROTOCOL_COMMAND,
                    };

                    configuration.configLoadProfile.stopCaptureObject(params).then(() => {
                        message.success('Save Success!');
                        getMeterObjectFileList(deviceType, '', '');
                        setTableData([]);
                    });
                }
            },
        },
        {
            type: 'Add',
            btnType: 'primary',
            title: 'Add',
            async onClick () {
                snMeterType = '';
                snProtocol = '';

                if (meterObject) {
                    snMeterType = meterObject.METER_TYPE;
                    snProtocol = meterObject.SN_PROTOCAL;
                } else if (meterType) {
                    let meter = meterTypeList.filter((v) => v.SN === meterType)[0];

                    console.log(meter);
                    snMeterType = meter.SN;
                    snProtocol = meter.SN_PROTOCOL ? meter.SN_PROTOCOL : meter.SN_PROTOCAL;
                }
                if (snMeterType) {
                    modalType = '0';
                    setTimeType([ 'Min', '300' ]);
                    setModalVisible(true);
                    getProtocolItemList(snMeterType, snProtocol, '0');
                } else {
                    message.warn('Please select the device type');
                }
            },
        },
        {
            type: 'Edit',
            btnType: 'primary',
            title: 'Edit',
            async onClick () {
                snMeterType = '';
                snProtocol = '';
                let status = '';

                if (meterObject) {
                    console.log(meterObject);
                    snMeterType = meterObject.METER_TYPE;
                    snProtocol = meterObject.SN_PROTOCAL;
                    status = meterObject.STATUS_FLAG;
                } else if (meterType) {
                    let meter = meterTypeList.filter((v) => v.SN === meterType)[0];

                    console.log(meter);
                    snMeterType = meter.SN;
                    snProtocol = meter.SN_PROTOCOL ? meter.SN_PROTOCOL : meter.SN_PROTOCAL;
                    status = meter.STATUS_FLAG;
                }
                if (status === '1') {
                    message.warn(Mes['messageAlarmUnactivestatuscantupdateunactivestatuscantupdate']);
                    return;
                }
                if (snMeterType) {
                    modalType = '1';
                    if (meterObject) {
                        let time = meterObject.CAPTURE_PERIOD;

                        if (time === '86400') {
                            setTimeType([ 'Day', time ]);
                        }
                        if (time === '2592000') {
                            setTimeType([ 'Month', time ]);
                        } else {
                            setTimeType([ 'Min', time ]);
                        }
                    } else {
                        setTimeType([ 'Min', '300' ]);
                    }
                    setModalVisible(true);
                    getProtocolItemList(snMeterType, snProtocol, '1');
                } else {
                    message.warn('Please select the device type');
                }
            },
        },

        {
            type: 'BatchSync',
            btnType: 'primary',
            title: 'Get object list from device',
            async onClick () {
                if (deviceType === 'METER') {
                    if (meterType) {
                        if (treeData.length > 0) {
                            excute();
                        } else {
                            message.warn('Please select device first.');
                        }
                    } else {
                        message.warn('Please select device first.');
                    }
                } else {
                    excute();
                }
            },
        },
    ];

    // 点击设备树节点
    const onNodeCheck = (row:any) => {
        console.log('a-----', row);
        nodeList = row;
        if (nodeList.length > 0) {// 选中
            setMeterType(nodeList[0].deviceModel);
            setTableData([]);
            setTreeData([]);
            setCheckKeyList([]);
            configuration.configLoadProfile.getByMeterTypeList(deviceType, nodeList[0].deviceModel).then((res) => {
                if (res.length > 0) {
                    getMeterObjectFileList(deviceType, res[0].SN_PROTOCAL, res[0].SN);
                }
            });
        } else {// 未选中
            setMeterType('');
            setTableData([]);
            setTreeData([]);
            setCheckKeyList([]);
            getMeterObjectFileList(deviceType, '', '');
        }
    };

    // 筛选设备类型 meter或者dcu
    const handleTypeChange = (val: string) => {
        setTreeData([]);
        setTableData([]);
        setDeviceType(val);
        getDeviceTypeList(val);
        setCheckKeyList([]);
        getMeterObjectFileList(val, '', '');
    };

    // 筛选设备型号
    const handleMeterTypeChange = (val: string) => {
        setMeterType(val);
        setTreeData([]);
        setTableData([]);
        setCheckKeyList([]);
        let meter = meterTypeList.filter((v) => v.SN === val)[0];

        getMeterObjectFileList(deviceType, meter.SN_PROTOCOL ? meter.SN_PROTOCOL : meter.SN_PROTOCAL, val);
    };

    // 弹窗筛选下拉选项值
    const handleProtocolTypeChange = (val: string) => {
        setProtocolType(val);
        rightTableData = [];
        leftGetData({ page: 1, pageSize: ROWS }, val, '');
        rightGetData({ page: 1, pageSize: ROWS }, val);

    };

    // 弹窗筛选输入框对应筛选类型
    const handleInputTypeChange = (val: string) => {
        setInputType(val);
    };

    // 弹窗筛选时间类型
    const handleTimeTypeChange = (val: any) => {
        setTimeType(val);
    };

    // 弹窗点击输入框搜索按钮
    const onSearch = (val: any) => {
        leftGetData({ page: 1, pageSize: ROWS }, protocolType, val);
    };

    // 点击设备协议树节点
    const deviceTypeCheck = (checkedKeysValue:any, info:any) => {
        console.log('-------', checkedKeysValue, info);
        setCheckKeyList(checkedKeysValue);
        if (checkedKeysValue) {
            let list = meterObjectList.filter((v) => v.SN_PROTOCOL_COMMAND === checkedKeysValue[0]);

            if (list.length > 0) {
                meterObject = list[0];
                // setTreeData([]);
                setTableData([]);
                getCaptureObjectList(1, meterObject.SN_PROTOCAL, meterObject.METER_TYPE, meterObject.SN_PROTOCOL_COMMAND, meterObject.GROUP_NAME);
            }
        }
    };

    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: (keys: React.Key[], selectedRows: CaptureObjectData[]) => {
    //         if (keys.length > 0) {
    //             let key = keys[keys.length - 1];

    //             keys = [ key ];
    //         }
    //         setSelectedRowKeys(keys);
    //         if (selectedRows.length > 0) {
    //         //     selectedRows.forEach((v:CstData) => {
    //         //         meterNos.push(v.METER_NO);
    //         //         meterIds.push(v.METER_GUID_NO);
    //         //     });
    //         }
    //     },
    // };

    const handleCancel = () => {
        setModalVisible(false);
        rightTableData = [];
    };

    // 点击弹窗save按钮
    const handleOk = () => {
        // const rightList = tRef.current?.getRightTableData() as CaptureObjectData[];
        let protocolItem = protocolItemOpt.filter((v) => v.SN === protocolType)[0];
        let list = [ ...rightTableData ];

        rightTableData.map((v, index) => {
            if (!v.CAPTURE_OBJ_INDEX) {
                v.CAPTURE_OBJ_INDEX = (index + 1);
                list[index] = v;
            }
            if (!v.SN_PROTOCOL_COMMAND) {
                v.SN_PROTOCOL_COMMAND = meterObject ? meterObject.SN_PROTOCOL_COMMAND : protocolType;
                list[index] = v;
            }
        });
        let meter = meterTypeList.filter((v) => v.SN === meterType)[0];
        let params = {
            captureListJson: JSON.stringify(list),
            subSysNo: subSysNo,
            snProtocolCommand: meterObject ? meterObject.SN_PROTOCOL_COMMAND : protocolType,
            meterType: snMeterType,
            snProtocal: snProtocol,
            periodTime: timeType[1],
            afn: protocolItem.AFN_NAME_OBIS,
            captureType: deviceType,
            groupName: meterObject ? meterObject.GROUP_NAME : meter.SN_METER_TYPE_NAME.replaceAll(' ', '_') + '_' + meterType + '_1',
        };

        console.log(params);
        configuration.configLoadProfile.saveCaptureObjectList(params).then(() => {
            message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            setModalVisible(false);
            rightTableData = [];
            setTableData([]);
            setCheckKeyList([]);
            meterObject = null;
            getMeterObjectFileList(deviceType, meter ? meter.SN_PROTOCOL : '', meterType);
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 左边表单配置
    const leftColumns: ColumnsType<CaptureObjectData> = [
        {
            dataIndex: 'AFN_NAME',
        },
        {
            dataIndex: 'CAPTURE_OBJ_OBIS',
        },
    ];
    // 右边表单配置
    const rightColumns: ColumnsType<CaptureObjectData> = [
        {
            dataIndex: 'AFN_NAME',
        },
        {
            dataIndex: 'CAPTURE_OBJ_OBIS',
        },
    ];

    const isInclude = (list:CaptureObjectData[], item:CaptureObjectData) => {
        let isClude = false;

        list.map((v) => {
            if (v.AFN_NAME === item.AFN_NAME) {
                isClude = true;
            }
        });
        return isClude;
    };

    // 左移
    const btnL = (keys?:string[]) => {
        // 获取右边选择数据key
        const rightSelectedRowKeys = keys ? keys : tRef.current?.getRightSelectKeysList() as String[];

        if (rightSelectedRowKeys.length) {
            const rightList = tRef.current?.getRightTableData() as CaptureObjectData[];
            // 获取右边需要左移的数据
            // const rightSelectData = rightList.filter((v) => rightSelectedRowKeys.includes(v.SN_PROTOCOL_COMMAND_CHILDREN));
            let list = [ ...rightList ];

            rightList.map((v, index) => {
                if (rightSelectedRowKeys.includes(v.AFN_NAME)) {
                    if (modalType === '0' && v.AFN_NAME === 'Clock') {// clock是必选项不可清除
                        console.log(v);
                    } else {
                        list.splice(index, 1);
                        rightTableData.splice(index, 1);
                    }
                }
            });
            tRef.current?.setRightData({
                rows: list,
                total: list.length,
            });
            // 清空右边选择
            tRef.current?.setRightSelectKeysList([]);
        }
    };

    // 全部左移
    const btnLL = () => {

        const rightList = tRef.current?.getRightTableData() as CaptureObjectData[];
        let list = [ ...rightList ];

        rightList.map((v, index) => {
            if (modalType === '0' && v.AFN_NAME === 'Clock') {// clock是必选项不可清除
                console.log(v);
            } else {
                list.splice(index, 1);
                rightTableData.splice(index, 1);
            }

        });
        tRef.current?.setRightData({
            rows: list,
            total: list.length,
        });
        // 清空右边选择
        tRef.current?.setRightSelectKeysList([]);
    };

    // 右移
    const btnR = (keys?:string[]) => {
        // 获取左边选择数据key
        const leftSelectedRowKeys = keys ? keys : tRef.current?.getLeftSelectKeysList() as string[];

        if (leftSelectedRowKeys.length) {
            // 获取左边列表数据
            const leftList = tRef.current?.getLeftTableData() as CaptureObjectData[];

            const leftSelectData = leftList.filter((v) => leftSelectedRowKeys.includes(v.AFN_NAME));

            // let rightList = tRef.current?.getRightTableData() as CaptureObjectData[];
            let list = [ ...rightTableData ];

            console.log(leftSelectData, rightTableData);
            leftSelectData.map((v) => {
                if (!isInclude(rightTableData, v)) {
                    list.push(v);
                    rightTableData.push(v);
                }
            });
            tRef.current?.setRightData({
                rows: list,
                total: list.length,
            });
            // 清空左边选择
            tRef.current?.setLeftSelectKeysList([]);
        }
    };

    // 全部右移
    const btnRR = () => {
        // 获取左边列表数据
        const leftList = tRef.current?.getLeftTableData() as CaptureObjectData[];

        // let rightList = tRef.current?.getRightTableData() as CaptureObjectData[];

        let list = [ ...rightTableData ];

        leftList.map((v) => {
            if (!isInclude(rightTableData, v)) {
                list.push(v);
                rightTableData.push(v);
            }
        });
        console.log(rightTableData);
        tRef.current?.setRightData({
            rows: list,
            total: list.length,
        });
        // 清空左边选择
        tRef.current?.setLeftSelectKeysList([]);
    };

    // 上移
    const btnUp = () => {
        // 获取右边选择数据key
        const rightSelectedRowKeys = tRef.current?.getRightSelectKeysList() as String[];

        if (rightSelectedRowKeys.length) {
            if (rightSelectedRowKeys.length > 1) {
                message.warn('Please select a row!');
                return;
            }
            const rightList = tRef.current?.getRightTableData() as CaptureObjectData[];

            let list = [ ...rightList ];

            rightList.map((v, index) => {
                if (rightSelectedRowKeys.includes(v.SN_PROTOCOL_COMMAND_CHILDREN) && index > 0) {
                    let temp = list[index];

                    list[index] = list[index - 1];
                    list[index - 1] = temp;
                }
            });
            tRef.current?.setRightData({
                rows: list,
                total: list.length,
            });
            tRef.current?.setRightSelectKeysList([]);
        }
    };

    // 下移
    const btnDown = () => {
        // 获取右边选择数据key
        const rightSelectedRowKeys = tRef.current?.getRightSelectKeysList() as String[];

        if (rightSelectedRowKeys.length) {
            if (rightSelectedRowKeys.length > 1) {
                message.warn('Please select a row!');
                return;
            }
            const rightList = tRef.current?.getRightTableData() as CaptureObjectData[];

            let list = [ ...rightList ];

            rightList.map((v, index) => {
                if (rightSelectedRowKeys.includes(v.SN_PROTOCOL_COMMAND_CHILDREN) && index < rightList.length - 1) {
                    let temp = list[index];

                    list[index] = list[index + 1];
                    list[index + 1] = temp;
                }
            });
            tRef.current?.setRightData({
                rows: list,
                total: list.length,
            });
            tRef.current?.setRightSelectKeysList([]);
        }
    };

    // 设备树展开子集
    const calladdNextNode = async (item: DeviceTreeRows) => await cRef.current?.addNextNodeByLoading(item) || null;

    useEffect(() => {
        setDeviceTypeOpt([]);
        setTableData([]);
        setTreeData([]);
        // // setCheckKeyList([]);
        // console.log(subSysNo, nodeNo);
        setTableTotal(0);
        setCurrent(1);
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 250);
        getDeviceTypeList(deviceType);
        getMeterObjectFileList(deviceType, '', '');
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
        <div className='configLoad flex' style={{height: '100%'}}>
            <DeviceTree cRef={cRef} isExpand={deviceType === 'METER'} checkbox={true} checkType={ true} onNodeCheck={onNodeCheck} selectOpt={ [ 'DCU', 'Meter' ]} calladdNextNode={calladdNextNode}/>
            <Row gutter={24} className='section'>
                <Col span={6} className='card'>
                    <Row gutter={24} className='top'>
                        <Col span={8}>
                            <Select value={deviceType} style={{ width: '100%' }} onChange={handleTypeChange}>
                                <Option value='DCU'>DCU</Option>
                                <Option value='METER'>Meter</Option>
                            </Select>
                        </Col>
                        <Col span={16}>
                            <Select value={meterType} style={{ width: '100%' }} onChange={handleMeterTypeChange}>
                                {
                                    deviceTypeOpt.map((v) => (
                                        <Option value={v.value} key={v.value}>{ v.name }</Option>
                                    ))
                                }
                            </Select>

                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24} style={{width: '800px'}}>
                            <Tree
                                selectable
                                onSelect={deviceTypeCheck}
                                selectedKeys={checkKeyList}
                                treeData={treeData}
                                height={tableHeight}
                                autoExpandParent
                                showLine={ { showLeafIcon: false }}
                                expandedKeys={expandedList}
                                onExpand={ onExpand}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={18} className='cardBody'>
                    <Row gutter={24}>
                        <Col span={24}>
                            <Row gutter={24} className='top'>
                                <Col span={24}>
                                    <BtnList btnList={ btnList}/>
                                </Col>
                            </Row>
                            <Row gutter={24} className='table'>
                                <Col span={24}>
                                    <Table
                                        columns={tableColumns}
                                        dataSource={tableData}
                                        style={{ width: '100%' }}
                                        loading={loading}
                                        pagination={false}
                                        rowKey='rn__'
                                        // rowSelection={{
                                        //     type: 'checkbox',
                                        //     ...rowSelection,
                                        // }}
                                        // onRow={(record) => ({
                                        //     onClick: () => {
                                        //         let key = record.rn__;
                                        //         const rowsKeys = [ ...selectedRowKeys ];
                                        //         let index = rowsKeys.indexOf(key);

                                        //         if (index >= 0) {
                                        //             rowsKeys.splice(index, 1);
                                        //         } else {
                                        //             rowsKeys.splice(0, rowsKeys.length);
                                        //             rowsKeys.push(key);
                                        //         }
                                        //         setSelectedRowKeys(rowsKeys);
                                        //     },
                                        // })}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={24} className='page'>
                                <Col span={24}>
                                    <Pagination {...pagination} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* 弹窗新增或者编辑 */}
            <Modal visible={modalVisible}
                destroyOnClose
                width={ 1000}
                onCancel={handleCancel}
                title='Modify Capture Object'
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{ Mes['btnCancelcancel'] }</Button>,
                    <Button key='submit' type='primary' onClick={handleOk}> { Mes['btnSavesave'] }</Button>,
                ]}>
                <Row>
                    <Col span={10}>
                        <Select style={{ width: '100%' }} value={protocolType} onChange={handleProtocolTypeChange}>
                            {
                                protocolItemOpt.map((v) => (
                                    <Option value={v.SN} key={v.SN}>{ v.AFN_NAME_OBIS }</Option>
                                ))
                            }
                        </Select>
                        <Row style={{marginTop: '5px'}}>
                            <Col span={ 10}>
                                <Select style={{ width: '100%' }} value={ inputType} onChange={handleInputTypeChange}>
                                    <Option value='0'>Item Name</Option>
                                    <Option value='1'>OBIS</Option>
                                </Select>
                            </Col>
                            <Col span={ 12} style={{marginLeft: '5px'}}>
                                <Input.Search enterButton onSearch={ onSearch}/>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                        <Cascader options={timeOpt} onChange={handleTimeTypeChange} value={ timeType}/>

                    </Col>
                </Row>
                <div style={{marginTop: '10px', height: '500px'}}>
                    <TransferTable<CaptureObjectData, CaptureObjectData>
                        rowKey={'AFN_NAME'}
                        leftColumns={leftColumns}
                        rightColums={rightColumns}
                        leftGetData={leftGetData}
                        rightGetData={rightGetData}
                        rows={ROWS}
                        cRef={tRef}
                        scrollY={ 400}
                        btnEvent={{
                            btnL: btnL,
                            btnR: btnR,
                            btnLL: btnLL,
                            btnRR: btnRR,
                            btnUp: btnUp,
                            btnDown: btnDown,
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(ConfigLoadProfile);


