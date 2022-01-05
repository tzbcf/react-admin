/* eslint-disable max-nested-callbacks */
/* eslint-disable react/display-name */
// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect} from 'react';
import { LangMessage } from 'src/store/common/language';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { Table, message, Modal, Button, Select, Col, Row, Input, Form } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { DCUAccountInfo, MeterList, MeterInfo, OperationData, FileCompareResult, ParamInfo } from 'src/api/configuration/configDcuArchive/types';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import { basicData } from 'src/api';
import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';
import { v4 } from 'uuid';
import { randomStr } from 'src/utils/utils';
import { showLoading, hideLoading } from 'src/components/common/loding';
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons';
// import { DeviceTreeRows } from 'src/api/common/type';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    excuteTask: any;
};

type MeterListByDcu = {
    dcuId: string;
    meterList: MeterInfo[];
}

type SelectGroup = {
    name: string;
    value: string;
    children?: SelectGroup[];
}

let opertionType = '';
let dstId = '';
const ConfigDcuArchiveTab: React.FC<Props> = (props) => {
    const { Mes, subSysNo, excuteTask } = props;
    const cRef = useRef<CRef>();
    const tRef = useRef<TRef>();
    const { Option, OptGroup } = Select;
    const [ dcuList, setDcuList ] = useFetchState<DCUAccountInfo[]>([]);
    const [ meterList, setMeterList ] = useFetchState<MeterListByDcu[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ expandedRowKeys, setExpandedRowKeys ] = useFetchState<string[]>([]);
    const [ dcuSelectedList, setDcuSelectedList ] = useFetchState<string[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ operationList, setOperationList ] = useFetchState<OperationData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ feeders, setFeeders ] = useFetchState<SelectGroup[]>([]);
    const [ fileCompareList, setFileCompareList ] = useFetchState<FileCompareResult[]>([]);
    const [ paramInfoList, setParamInfoList ] = useFetchState<ParamInfo[]>([]);
    const [ modalVisible1, setModalVisible1 ] = useFetchState<boolean>(false);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const [ nodeSelectedList, setNodeSelectedList ] = useFetchState<any[]>([]);
    const ROWS = 10;

    // 弹窗显示DCU或者Meter的基本信息
    const showDeviceInfo = (type:string, deviceId: string) => {
        if (type === 'dcu') {
            tRef.current?.openModel('dcu', deviceId);
        } else {
            tRef.current?.openModel('meter', deviceId);
        }

    };

    // DCU table行属性
    const detailColumns = [
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            render (_: any, record: DCUAccountInfo) {
                return (
                    <>
                        <a onClick={(e: any) => {
                            e.stopPropagation();// 阻止点击事件向上冒泡
                            showDeviceInfo('dcu', record.CST_ID);
                        }}>{record.CST_ADDR}</a>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableTotalfiletotalfile'],
            dataIndex: 'TOTALCOUNT',
        },
        {
            title: Mes['titleTableInstallfileinstallfile'],
            dataIndex: 'INSTALLEDCOUNT',
        },
        {
            title: Mes['titleTableUninstallfileuninstallfile'],
            dataIndex: 'UNINSTALLEDCOUNT',
        },

    ];


    const dialogColumns = [
        {
            title: Mes['titleTableCstnocstno'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableMetercountmetercount'],
            dataIndex: 'METERS',
        },


    ];

    // 获取DCU信息
    const getDcuAccountInfo = (dcuId:string) => {
        configuration.configDcuArchive.getDcuAccountInfo(dcuId, subSysNo, randomStr(16)).then((res:DCUAccountInfo[]) => {
            let list = [ ...dcuList ];

            if (res.length && !list.includes(res[0])) {
                list.push(res[0]);
            }
            setDcuList(list);
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 更新DCU信息
    const refreshDcuAccountInfo = (dcuId:string, index:number) => {
        configuration.configDcuArchive.getDcuAccountInfo(dcuId, subSysNo, randomStr(16)).then((res:DCUAccountInfo[]) => {
            let list = [ ...dcuList ];
            let item = list[index];

            item.INSTALLEDCOUNT = res[0].INSTALLEDCOUNT;
            item.TOTALCOUNT = res[0].TOTALCOUNT;
            item.UNINSTALLEDCOUNT = res[0].UNINSTALLEDCOUNT;
            list[index] = item;
            setDcuList(list);
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 获取DCU下的表计列表
    const getMeterList = (dcuId:string) => {
        configuration.configDcuArchive.getMeterListByDcu(1, 999, dcuId, subSysNo).then((res:MeterList) => {
            let list = [ ...meterList ];

            if (res) {
                list.push({
                    dcuId: dcuId,
                    meterList: res.rows,
                });
            }
            setMeterList(list);

            if (res.rows.length) {
                let expaned = [ ...expandedRowKeys ];

                if (!expaned.includes(dcuId)) {
                    expaned.push(dcuId);
                }
                setExpandedRowKeys(expaned);// 默认展开
                let selected = [ ...selectedRowKeys ];

                res.rows.map((v) => {
                    if (!selected.includes(v.METER_NO)) {
                        selected.push(v.METER_NO);
                    }
                });
                setSelectedRowKeys(selected);// 默认选中
            }
        })
            .catch((err) => {
                message.error(err);
            });
    };

    // 设备树翻页，清空当前所选设备列表
    const movePage = (page: number) => {
        console.log(page);
        setDcuList([]);
        setDcuSelectedList([]);
        setMeterList([]);
        setExpandedRowKeys([]);
        setSelectedRowKeys([]);
        setNodeSelectedList([]);
        cRef.current?.clearCheckedKeys();
    };

    // 设备树刷新，清空当前所选设备列表
    const clearTree = () => {
        setDcuList([]);
        setDcuSelectedList([]);
        setMeterList([]);
        setExpandedRowKeys([]);
        setSelectedRowKeys([]);
        setNodeSelectedList([]);
        cRef.current?.clearCheckedKeys();
    };

    const isDcuExist = (item:any) => {
        let isExist = false;

        dcuSelectedList.map((v) => {
            if (v === item.deviceGuid) {
                isExist = true;
            }
        });
        return isExist;
    };

    const isNodeExist = (item:any, list:any[]) => {
        let isExist = false;

        list.map((v) => {
            if (v.deviceGuid === item.deviceGuid) {
                isExist = true;
            }
        });
        return isExist;
    };

    const isMeterExist = (item:MeterInfo, list:any[]) => {
        let isExist = false;

        list.map((v) => {
            if (v.deviceNo === item.METER_NO) {
                isExist = true;
            }
        });
        return isExist;
    };

    // 点击设备树的DCU
    const onNodeCheck = (row: any[]) => {
        console.log(row, nodeSelectedList);
        if (row.length > nodeSelectedList.length) { // 新增
            let addList: any[] = [];
            let dcu = [ ...dcuSelectedList ];

            row.map((v) => {
                if (!isNodeExist(v, nodeSelectedList)) {
                    addList.push(v);
                }
            });
            console.log('addList', addList);

            let tmpList = addList.filter((v) => v.nodeType === '1');

            if (tmpList.length > 0) { // 新增的列表中有集中器和表计
                let v = tmpList[0];

                if (!isDcuExist(v)) {// 新集中器
                    getDcuAccountInfo(v.CST_ID);
                    getMeterList(v.CST_ID);
                    if (!dcuSelectedList.includes(v.CST_ID)) {
                        dcu.push(v.CST_ID);
                    }
                } else {// 新表计
                    let meters = [ ...meterList ];
                    let index = dcuSelectedList.indexOf(v.CST_ID);

                    if (meters.length > 0) {
                        configuration.configDcuArchive.getMeterListByDcu(1, 999, v.CST_ID, subSysNo).then((res: MeterList) => {
                            if (meters[index]) {
                                let list = meters[index].meterList;
                                let selecteds = [ ...selectedRowKeys ];
                                let tt = [ ...list ];

                                res.rows.map((item) => {
                                    if (!list.includes(item) && isMeterExist(item, addList)) {
                                        tt.push(item);
                                        selecteds.push(item.METER_NO);
                                    }
                                });
                                console.log(tt);
                                meters[index].meterList = tt;

                                setMeterList(meters);
                                setSelectedRowKeys(selecteds);
                            }
                        });
                    }
                }
                setDcuSelectedList(dcu);
            } else {// 新增的列表中只有表计
                addList.map((v) => {
                    let index = dcuSelectedList.indexOf(v.CST_ID);

                    if (index >= 0) {// 已经存在的集中器
                        let meters = [ ...meterList ];

                        if (meters.length > 0) {

                            configuration.configDcuArchive.getMeterListByDcu(1, 999, v.CST_ID, subSysNo).then((res: MeterList) => {
                                let list = meters[index].meterList;
                                let selecteds = [ ...selectedRowKeys ];
                                let tt = [ ...list ];

                                res.rows.map((item) => {
                                    if (!list.includes(item) && v.deviceNo === item.METER_NO) {
                                        tt.push(item);
                                        selecteds.push(item.METER_NO);
                                    }
                                });
                                meters[index].meterList = tt;
                                console.log(tt);
                                setMeterList(meters);
                                setSelectedRowKeys(selecteds);
                            });
                        }
                    } else {// 不存在的新集中器
                        getDcuAccountInfo(v.CST_ID);

                        configuration.configDcuArchive.getMeterListByDcu(1, 999, v.CST_ID, subSysNo).then((res: MeterList) => {
                            let list = [ ...meterList ];
                            let selecteds = [ ...selectedRowKeys ];

                            if (res) {
                                let tt:MeterInfo[] = [];

                                res.rows.map((item) => {
                                    if (isMeterExist(item, addList)) {
                                        tt.push(item);
                                        selecteds.push(item.METER_NO);
                                    }
                                });
                                list.push({
                                    dcuId: v.CST_ID,
                                    meterList: tt,
                                });
                            }
                            setMeterList(list);
                            let expaned = [ ...expandedRowKeys ];

                            if (!expaned.includes(v.CST_ID)) {
                                expaned.push(v.CST_ID);
                            }
                            setExpandedRowKeys(expaned);// 默认展开
                            setSelectedRowKeys(selecteds);// 默认选中

                        });
                    }
                    if (!dcuSelectedList.includes(v.CST_ID)) {
                        dcu.push(v.CST_ID);
                    }

                    setDcuSelectedList(dcu);
                });
            }
        } else { // 减少
            if (row.length > 0) {// 减少部分
                let subList: any[] = [];
                let dcu = [ ...dcuSelectedList ];
                let meters = [ ...meterList ];

                nodeSelectedList.map((v) => {
                    if (!isNodeExist(v, row)) {
                        subList.push(v);
                    }
                });
                console.log('subList', subList);

                let tmpList = subList.filter((v) => v.nodeType === '1');

                if (tmpList.length > 0) {// 删除列表中包含集中器和表计
                    let tmp = tmpList[0];
                    let index = dcu.indexOf(tmp.CST_ID);

                    if (meters.length > 0) {
                        if (meters[index]) {
                            let list = meters[index].meterList;

                            if (subList.length - list.length === 1) {// 删除集中器所有表计
                                let dcus = [ ...dcuList ];

                                dcu.splice(index, 1);
                                dcus.splice(index, 1);
                                let selecteds = [ ...selectedRowKeys ];

                                list.map((meter) => {
                                    if (selecteds.includes(meter.METER_NO)) {
                                        selecteds.splice(selecteds.indexOf(meter.METER_NO), 1);
                                    }
                                });

                                setSelectedRowKeys(selecteds);
                                meters.splice(index, 1);
                                if (expandedRowKeys.includes(tmp.CST_ID)) {
                                    let index1 = expandedRowKeys.indexOf(tmp.CST_ID);
                                    let expands = [ ...expandedRowKeys ];

                                    expands.splice(index1, 1);
                                    setExpandedRowKeys(expands);
                                }
                                setDcuList(dcus);
                                setDcuSelectedList(dcu);
                                setMeterList(meters);
                            } else { // 删除集中器下某个表计
                                subList.map((v) => {
                                    if (v.nodeType === '0') {
                                        if (meters.length > 0) {
                                            let selecteds = [ ...selectedRowKeys ];
                                            let tt = [ ...list ];

                                            list.map((meter, i) => {
                                                if (meter.METER_NO === v.deviceNo) {
                                                    tt.splice(i, 1);
                                                    selecteds.splice(selecteds.indexOf(meter.METER_NO), 1);
                                                }
                                            });
                                            meters[index].meterList = tt;
                                            setSelectedRowKeys(selecteds);
                                            setMeterList(meters);
                                        }
                                    }
                                });
                            }
                        }
                    } else {
                        let dcus = [ ...dcuList ];

                        dcu.splice(index, 1);
                        dcus.splice(index, 1);
                        setDcuList(dcus);
                        setDcuSelectedList(dcu);
                    }
                } else {// 删除列表中只有表计
                    subList.map((v) => {
                        let index = dcu.indexOf(v.CST_ID);

                        if (meters.length > 0) {
                            let list = meters[index].meterList;

                            if (v.nodeType === '0') {
                                if (meters.length > 0) {
                                    let selecteds = [ ...selectedRowKeys ];
                                    let tt = [ ...list ];

                                    list.map((meter, i) => {
                                        if (meter.METER_NO === v.deviceNo) {
                                            tt.splice(i, 1);
                                            selecteds.splice(selecteds.indexOf(meter.METER_NO), 1);
                                        }
                                    });
                                    meters[index].meterList = tt;
                                    setSelectedRowKeys(selecteds);
                                    setMeterList(meters);
                                    if (tt.length === 0) {// 集中器下所有表计已经删除完毕
                                        let dcus = [ ...dcuList ];

                                        dcu.splice(index, 1);
                                        dcus.splice(index, 1);
                                        setDcuList(dcus);
                                        setDcuSelectedList(dcu);
                                    }
                                }
                            }
                        }
                    });
                }

            } else {// 减少全部
                setDcuList([]);
                setDcuSelectedList([]);
                setMeterList([]);
                setExpandedRowKeys([]);
                setSelectedRowKeys([]);
            }
        }
        setNodeSelectedList(row);

    };

    // 获取所有DCU的档案信息
    const getOperationList = (page: number = 1) => {
        setLoading(true);
        configuration.configDcuArchive.getOperationList(page, ROWS, subSysNo, opertionType, dstId).then((res) => {
            setOperationList(res.rows);
            setTotal(res.total);
            setCurrent(page);
            setLoading(false);
        })
            .catch((err) => {
                setLoading(false);
                message.error(err);
            });
    };

    // 获取变压器选择列表
    const getDstList = async () => {
        const params: GetDstListParasm = {
            subSysNo: subSysNo,
            nodeNo: '',
            sectionId: '',
        };
        let dstList: GetDstListData[] = await basicData.transformMgt.getDstList(params);
        const groupName: string[] = [];
        let feederlist = [];

        feederlist.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ {name: Mes['titleLabelComboallcomboall'], value: ''} ]});
        if (dstList && dstList.length > 0) {
            dstList.map((v: GetDstListData) => {
                if (!groupName.includes(v.GNAME)) {
                    groupName.push(v.GNAME);
                }
            });
            for (let g of groupName) {
                const list = dstList.filter((v: GetDstListData) => v.GNAME === g);
                let children:SelectGroup[] = [];

                list.map((v: GetDstListData) => {
                    children.push({ name: v.NAME, value: v.ID });
                });
                const feeder:SelectGroup = {
                    name: g,
                    value: g,
                    children: children,
                };

                feederlist.push(feeder);
            }

        }
        setFeeders(feederlist);
    };

    // 下发read指令
    const sendReadCommand = (record:MeterInfo) => {
        const groupId = v4();
        const params = {
            subSysNo: subSysNo,
            cstId: record.CST_ID,
            meterGuid: record.METER_GUID,
            groupId: groupId,
            snProtocol: record.SN_PROTOCAL,
        };

        configuration.configDcuArchive.sendReadCommand(params).then(() => {
            showLoading();
            let times = 0;

            let timer = setInterval(() => {
                const postParams = {
                    cstid: record.CST_ID,
                    mguid: record.METER_GUID,
                    groupid: groupId,
                };

                configuration.configDcuArchive.fileCompare(postParams).then((res) => {
                    times++;
                    if (res) {
                        setFileCompareList(res);
                        hideLoading();
                        clearInterval(timer);
                        configuration.configDcuArchive.getCstParamInfo(record.CST_ID, record.METER_GUID).then((result) => {
                            if (result) {
                                // message.success(Mes['messageSuccessOpersuccessopersuccess']);
                                setParamInfoList(result);
                                setModalVisible1(true);
                            }
                        });
                    }
                    if (times > 5) {
                        hideLoading();
                        message.error(Mes['messageErrorOperfailedoperfailed']);
                        clearInterval(timer);
                    }
                });
            }, 5000);
        });
    };

    // 表计table选中属性
    const rowSelection = {
        selectedRowKeys,
        // onChange: (keys: React.Key[], selectedRows: MeterInfo[]) => {
        //     console.log(keys, selectedRows);
        //     setSelectedRowKeys(keys);
        //     if (selectedRows.length > 0) {
        //         console.log('');
        //     }
        // },
        onSelect: (record:MeterInfo, selected:boolean, selectedRows:MeterInfo[], nativeEvent:any) => {
            console.log(record, selected, selectedRows, nativeEvent);
            let key = record.METER_NO;
            const rowsKeys = [ ...selectedRowKeys ];

            if (selected) {// 选中
                rowsKeys.push(key);
            } else {
                let index = rowsKeys.indexOf(key);

                if (index >= 0) {
                    rowsKeys.splice(index, 1);
                }
            }
            setSelectedRowKeys(rowsKeys);
        },
        onSelectAll: (selected: boolean, selectedRows: MeterInfo[], changeRows: MeterInfo[]) => {
            console.log(selected, selectedRows, changeRows);
            const rowsKeys = [ ...selectedRowKeys ];

            if (selected) {// 选中
                changeRows.map((v) => {
                    rowsKeys.push(v.METER_NO);
                });
            } else {
                changeRows.map((v) => {
                    let index = rowsKeys.indexOf(v.METER_NO);

                    if (index >= 0) {
                        rowsKeys.splice(index, 1);
                    }
                });
            }
            setSelectedRowKeys(rowsKeys);
        },
    };

    // DCU table展开属性
    const onExpand = (bool:boolean, row:DCUAccountInfo) => {
        if (bool) {
            setExpandedRowKeys([ ...expandedRowKeys, row.CST_ID ]);
        } else {
            const index = expandedRowKeys.findIndex((e) => e === row.CST_ID);
            const newArray = [ ...expandedRowKeys ];

            newArray.splice(index, 1);
            setExpandedRowKeys(newArray);
        }

    };

    const getStatusText = (record:MeterInfo) => {
        if (record.LOAD_METER_FLG === '1') {
            return (<span style={{color: '#0000ff'}}>Installed</span>);
        } else if (record.LOAD_METER_FLG === '0') {
            return (<span style={{color: '#ff0000'}}>Uninstall</span>);
        } else if (record.LOAD_METER_FLG === '2') {
            return (<span><LoadingOutlined /></span>);
        } else {
            return (<span style={{color: '#ff0000'}}>Uninstall</span>);
        }
    };

    const getOperateText = (record:MeterInfo) => {

        if (record.LOAD_METER_FLG === '1') {
            return (<a onClick={(e: any) => {
                e.stopPropagation();// 阻止点击事件向上冒泡
                sendReadCommand(record);
            }}>Read</a>);
        } else {
            return (<span></span>);
        }
    };

    // const meterPagination = {
    //     total: total,
    //     // onChange (page: number) {
    //     // },
    //     current: current,
    //     hideOnSinglePage: true,
    //     pageSize: ROWS,
    //     showSizeChanger: false,
    // };

    // DCU table展开的子table也就是表计table
    const expandedRowRender = (item: DCUAccountInfo) => {
        const columns = [
            {
                title: Mes['titleTableMeternometerno'], dataIndex: 'METER_NO', key: 'METER_NO',
                width: 200,
                sorter: (a: MeterInfo, b: MeterInfo) => parseFloat(a.METER_NO) - parseFloat(b.METER_NO),
                // render (_: any, record: MeterInfo) {
                //     return (
                //         <>
                //             <a onClick={(e: any) => {
                //                 e.stopPropagation();// 阻止点击事件向上冒泡
                //                 showDeviceInfo('meter', record.METER_NO);
                //             }}>{record.METER_NO}</a>
                //         </>
                //     );
                // },
            },
            { title: Mes['titleTableGridmeteraddressgridmeteraddress'], dataIndex: 'METER_ADDR', key: 'METER_ADDR', width: 200 },
            {
                title: Mes['titleTableMetertypemetertype'],
                dataIndex: 'PRODUCT_TYPE_NAME',
                key: 'PRODUCT_TYPE_NAME',
                width: 200,
            },
            {
                title: Mes['titleTableMeasurepointnomeasurepointno'],
                dataIndex: 'CHECK_POINT_NUM',
                key: 'CHECK_POINT_NUM',
                width: 200,
                sorter: (a: MeterInfo, b: MeterInfo) => a.CHECK_POINT_NUM - b.CHECK_POINT_NUM,
            },
            {
                title: Mes['titleTableUpgradestatusupgradestatus'],
                dataIndex: 'LOAD_METER_FLG',
                key: 'LOAD_METER_FLG',
                width: 200,
                render (_: any, record: MeterInfo) {
                    return (
                        <>
                            { getStatusText(record)}
                        </>
                    );
                },
            },
            {
                title: Mes['titleTableRemoteoperateremoteoperate'],
                key: 'opreate',
                render (_: any, record: MeterInfo) {
                    return (
                        <>
                            { getOperateText(record)}
                        </>
                    );
                },
            },
        ];
        let list = meterList.filter((v) => v.dcuId === item.CST_ID);


        return <Table columns={columns} dataSource={list[0].meterList} pagination={false} bordered={ true} rowKey='METER_NO' rowSelection={{
            type: 'checkbox',
            ...rowSelection,
        }}
        onRow={(record) => ({
            onClick: () => {
                let key = record.METER_NO;
                const rowsKeys = [ ...selectedRowKeys ];
                let index = rowsKeys.indexOf(key);

                if (index >= 0) {
                    rowsKeys.splice(index, 1);
                } else {
                    rowsKeys.push(key);
                }
                setSelectedRowKeys(rowsKeys);
            },
        })}/>;
    };

    const showAllInstallDialog = () => {
        opertionType = 'install';
        dstId = '';
        getOperationList();
        getDstList();
        setModalTitle('Are you sure Install all DCU archive ?');
        setModalVisible(true);
    };

    const showAllUninstallDialog = () => {
        opertionType = 'uninstall';
        dstId = '';
        getOperationList();
        getDstList();
        setModalTitle('Are you sure unInstall all DCU archive ?');
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setModalVisible1(false);
    };

    // 全部装载或者卸载
    const handleOk = () => {
        showLoading();
        let params = {
            searchType: 2,
            subSysNo: subSysNo,
            sendToCst: true,
            operation: opertionType,
            groupId: v4(),
            dstId: dstId,
        };

        configuration.configDcuArchive.operationAll(params).then(() => {
            hideLoading();
            setModalVisible(false);
            message.success(Mes['messageSuccessOpersuccessopersuccess']);
            excuteTask();
        })
            .catch((err) => {
                message.error(err);
                hideLoading();
            });
    };

    const searchDst = (value:string) => {
        dstId = value;
        getOperationList();
    };

    const pagination = {
        total: total,
        onChange (page: number) {
            getOperationList(page,);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 获取装载或者卸载命令的执行情况并刷新列表
    const refreshMeterList = (groupId:string, refreshIds:string[]) => {

        let timer = setInterval(() => {
            configuration.configDcuArchive.getLoadingResult(groupId).then((res:string[]) => {
                if (res.length > 0) {
                    clearInterval(timer);
                }
                let str = '';

                for (let i = 0;i < refreshIds.length; i++) {
                    if (i === 0) {
                        str += "\'" + refreshIds[i] + "\'";
                    } else {
                        str += ",\'" + refreshIds[i] + "\'";
                    }
                }
                configuration.configDcuArchive.refreshMeterList(str).then((result:MeterList) => {
                    if (result.rows) {
                        let list = [ ...meterList ];

                        list.map((meter, i) => {
                            meter.meterList.map((v, index) => {
                                let j = result.rows.findIndex((item) => item.METER_GUID === v.METER_GUID);

                                if (j >= 0) {
                                    v.LOAD_METER_FLG = result.rows[j].LOAD_METER_FLG;
                                    meter.meterList[index] = v;
                                    list[i] = meter;
                                }
                            });
                        });
                        setMeterList(list);
                    }
                    if (dcuSelectedList.length > 0) {
                        dcuSelectedList.map((v, index) => {
                            refreshDcuAccountInfo(v, index);
                        });
                    }
                });

            })
                .catch(() => {
                    clearInterval(timer);
                });
        }, 5000);
    };

    // 装载档案或者卸载档案
    const operation = (type:string) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: type === '1' ? Mes['messageConfirmLoadingoperateloadingoperate'] : Mes['messageConfirmUnloadingoperateunloadingoperate'],
            onOk () {
                let rowsSelect: MeterInfo[] = [];
                let refreshIds:string[] = [];
                let list = [ ...meterList ];

                list.map((meter, i) => {
                    meter.meterList.map((v, index) => {
                        if (v.LOAD_METER_FLG !== type && selectedRowKeys.includes(v.METER_NO)) {
                            rowsSelect.push(v);
                            refreshIds.push(v.METER_GUID);
                            v.LOAD_METER_FLG = '2';
                            meter.meterList[index] = v;
                            list[i] = meter;
                        }
                    });
                });
                setMeterList(list);
                let groupId = v4();
                let params = {
                    searchType: 2,
                    subSysNo: subSysNo,
                    sendToCst: true,
                    groupId: groupId,
                    rowsList: JSON.stringify(rowsSelect),
                };

                if (type === '1') {
                    configuration.configDcuArchive.installArchive(params).then(() => {
                        message.success(Mes['messageSuccessInstallsuccessinstallsuccess']);
                        excuteTask();
                        refreshMeterList(groupId, refreshIds);

                    })
                        .catch(() => {
                            message.error(Mes['messageErrorInstallfailedinstallfailed']);
                        });
                } else {
                    configuration.configDcuArchive.uninstallArchive(params).then(() => {
                        message.success(Mes['messageSuccessUninstallsuccessuninstallsuccess']);
                        excuteTask();
                        refreshMeterList(groupId, refreshIds);
                    })
                        .catch(() => {
                            message.error(Mes['messageErrorUninstallfaileduninstallfailed']);
                        });
                }
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Install',
            btnType: 'primary',
            title: Mes['btnInstallarchiveinstallarchive'],
            onClick () {
                if (selectedRowKeys.length > 0) {
                    operation('1');
                } else {
                    message.warn(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
                }

            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            title: Mes['btnUninstallarchiveuninstallarchive'],
            onClick () {
                if (selectedRowKeys.length > 0) {
                    operation('0');
                } else {
                    message.warn(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
                }

            },
        },
        {
            type: 'Restart',
            btnType: 'primary',
            title: Mes['btnGetinstallresultgetinstallresult'],
            onClick () {
                if (selectedRowKeys.length > 0) {
                    Modal.confirm({
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['messageConfirmResetoperateresetoperate'],
                        onOk () {
                            let rowsSelect: MeterInfo[] = [];
                            let refreshIds:string[] = [];

                            meterList.map((meter) => {
                                meter.meterList.map((v) => {
                                    if (selectedRowKeys.includes(v.METER_NO)) {
                                        rowsSelect.push(v);
                                        refreshIds.push(v.METER_GUID);
                                    }
                                });
                            });
                            let params = {
                                searchType: 2,
                                subSysNo: subSysNo,
                                rowsList: JSON.stringify(rowsSelect),
                            };

                            configuration.configDcuArchive.resetArchive(params).then(() => {
                                message.success(Mes['messageSuccessResetsuccessresetsuccess']);
                                let str = '';
                                // getDcuAccountInfo(dcuSelectedList[0].CST_ID);

                                for (let i = 0;i < refreshIds.length; i++) {
                                    if (i === 0) {
                                        str += "\'" + refreshIds[i] + "\'";
                                    } else {
                                        str += ",\'" + refreshIds[i] + "\'";
                                    }
                                }
                                configuration.configDcuArchive.refreshMeterList(str).then((result:MeterList) => {
                                    if (result.rows) {
                                        let list = [ ...meterList ];

                                        list.map((meter, i) => {
                                            meter.meterList.map((v, index) => {
                                                let j = result.rows.findIndex((item) => item.METER_GUID === v.METER_GUID);

                                                if (j >= 0) {
                                                    v.LOAD_METER_FLG = result.rows[j].LOAD_METER_FLG;
                                                    meter.meterList[index] = v;
                                                    list[i] = meter;
                                                }
                                            });
                                        });
                                        setMeterList(list);
                                    }
                                    if (dcuSelectedList.length > 0) {
                                        dcuSelectedList.map((v, index) => {
                                            refreshDcuAccountInfo(v, index);
                                        });
                                    }
                                });
                            })
                                .catch(() => {
                                    message.error(Mes['messageErrorResetfailedresetfailed']);
                                });

                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                } else {
                    message.warn(Mes['messageAlarmPleaseselectrowpleaseselectrow']);
                }

            },
        },
        {
            type: 'BatchAdd',
            btnType: 'primary',
            title: Mes['btnInstallallinstallall'],
            onClick () {
                showAllInstallDialog();

            },
        },
        {
            type: 'BatchDel',
            btnType: 'primary',
            title: Mes['btnUninstallalluninstallall'],
            onClick () {
                showAllUninstallDialog();

            },
        },
    ];

    // 设备树展开子集
    // const calladdNextNode = async (item: DeviceTreeRows) => await cRef.current?.addNextNodeByLoading(item) || null;

    useEffect(() => {
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 100);
    }, []);

    return (
        <div className='remoteControl contentWrap'>
            <div className='wrapLeft'>
                <DeviceTree onNodeCheck={onNodeCheck} isExpand={true} checkbox={false} cRef={cRef} PAGESIZE={12} movePage={movePage } clearTree={clearTree} selectOpt={ [ 'DCU', 'Meter' ]}/>
            </div>
            <div className='wrapRight' style={{overflowY: 'auto'}}>
                <div className='pv10h20'>

                    {
                        <BtnList btnList={ btnList}/>
                    }
                    <div style={{marginTop: '10px'}}>
                        <Table columns={detailColumns} style={{ width: '100%' }} rowKey='CST_ID' className='table' dataSource={ dcuList}
                            pagination={ false} expandable={{ expandedRowKeys, expandedRowRender, onExpand }}
                        ></Table>
                    </div>
                </div>
            </div>
            <TerminalInfo cRef={tRef} />
            <Modal visible={modalVisible}
                destroyOnClose
                width={ 1000}
                onCancel={handleCancel}
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{ Mes['btnCancelcancel'] }</Button>,
                    <Button key='submit' type='primary' onClick={handleOk}> { Mes['btnOkok'] }</Button>,
                ]}>
                <h1>{modalTitle}</h1>
                <Select onSelect={searchDst} style={{ width: '30%' }} defaultValue={ dstId}>
                    {
                        feeders && feeders.map((item) => (
                            <OptGroup key={item.value} label={item.name}>
                                {
                                    item.children?.map((o) => (
                                        <Option value={ o.value} key={o.value}>{ o.name }</Option>
                                    ))
                                }
                            </OptGroup>
                        ))
                    }
                </Select>
                <Table style={{ margin: '10px' }} columns={dialogColumns} dataSource={operationList} rowKey='CST_NO' pagination={pagination}
                    bordered={true} loading={ loading}></Table>
            </Modal>

            <Modal visible={modalVisible1}
                destroyOnClose
                width={1200}
                onCancel={handleCancel}
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{Mes['btnCancelcancel']}</Button>,
                ]}
                closable={ false}
                bodyStyle={{ overflow: 'auto', height: tableHeight }}
                // title={Mes['titlePromptprompt']}
            >
                <Row>
                    <Col span={12}><h2>Archive in Database</h2></Col>
                    <Col span={ 12}><h2>Archive in DCU</h2></Col>
                </Row>
                {/* <Divider plain/> */}
                <Form style={{ marginTop: '10px' }}
                    name='langForm'
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    preserve={false}>
                    <Row>

                        <Col span={10}>
                            {paramInfoList && paramInfoList.map((v) => (

                                <Form.Item key={v.PARAMETER_VALUE} label={v.PROTOCAL_NAME} colon={false} initialValue={v.PARAMETER_VALUE}>
                                    <Input value={ v.PARAMETER_VALUE}></Input>
                                </Form.Item>
                            ))
                            }
                        </Col>
                        <Col span={ 2}></Col>
                        <Col span={10}>
                            {fileCompareList && fileCompareList.map((v) => (

                                <Form.Item key={v.PARAM_NAME} label={v.PARAM_NAME} colon={false} initialValue={ v.PARAM_VALUE}>
                                    <Input value={ v.PARAM_VALUE}></Input>
                                </Form.Item>
                            ))}
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ConfigDcuArchiveTab;
