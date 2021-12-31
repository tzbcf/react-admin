/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-28 14:20:51
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import useFetchState from 'src/utils/useFetchState';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { ExclamationCircleOutlined, ToTopOutlined } from '@ant-design/icons';
import DeviceTree, { CRef, NodeTree } from 'src/components/business/deviceTree';
import { Table, Row, Col, Input, Tree, Modal, Select, Button, message, Pagination, Tabs } from 'antd';
import { Key } from 'antd/es/table/interface';
import { ColumnsType } from 'antd/es/table';
import { MeterParamList } from 'src/api/AmiFunction/meterParam/type';
import AddRowCom, { CRef as ARef } from 'src/components/business/addRowCom';
import { abnormalFn, Options, formatArrOptions } from 'src/utils/function';
import { showLoading, hideLoading } from 'src/components/common/loding';
import { dateFormat, IsIp, arrPaging, IsEmptyObejct} from 'src/utils/utils';
import { amiFunc } from 'src/api';
import bus from 'src/utils/eventBus';
import UploadSlot, { UploadRef } from 'src/components/common/uploadSolt';
import TaskCom, { TaskRef, GetListParams } from 'src/components/business/taskCom';
import { GroupListRows } from 'src/api/AmiFunction/firmwareUpgrade/type';
import { TaskListRow } from 'src/api/AmiFunction/meterParam/type';
import moment from 'moment';
import { v4 } from 'uuid';
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;
const { TabPane } = Tabs;

import './index.less';

type Props = {
  Mes: LangMessage;
  subSysNo: string;
}

type MeterItem = {
  ITEM_ID: string;
  CST_ID: string;
  SN_METER_TYPE: string;
}

type CacheConfig = {
  groupId: string;
  receiveMessNum: number;
  totalTaskNum: number;
  planSelectedKeys: Key[];
  paramsSelectedKeys: Key[];
  planList: any[];
  paramsList: MeterParamList[];
  areaVal: string;
  meterList: MeterItem[];
  taskList: TaskListRow[];
}

type TaskInfo = {
  SuccessCount: number;
  failCount: number;
  upgradeTime: number;
  unfinished: number;
}

type PageSizeType = {
  page: number;
  rows: number;
}

const rowsFormatTreeData = (arr: any) => arr.map((v:any) => ({
    key: v.SN,
    title: v.Program_Name,
    ...v,
}));

const MeterParam: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const ROWS = 10;
    const INITPAGE: PageSizeType = {
        page: 1,
        rows: ROWS,
    };
    const cRef = useRef<CRef>();
    const aRef = useRef<ARef>();
    const upRef = useRef<UploadRef>();
    const taskRef = useRef<TaskRef<GroupListRows>>();
    const onConfig = useRef<CacheConfig>({
        groupId: '',
        receiveMessNum: 0,
        totalTaskNum: 0,
        planSelectedKeys: [],
        paramsSelectedKeys: [],
        planList: [],
        paramsList: [],
        areaVal: 'All',
        meterList: [],
        taskList: [],
    });
    const INITTASKINFO: TaskInfo = {
        SuccessCount: 0,
        failCount: 0,
        upgradeTime: 0,
        unfinished: 0,
    };
    // tab切换
    const [ activeKey, setActiveKey ] = useFetchState<string>('1');
    // 设备类型
    const [ deviceTypeOpt, setDeviceTypeOpt ] = useFetchState<Options[]>([]);
    // 方案列表树结构
    const [ planListTree, setPlanListTree ] = useFetchState<any[]>([]);
    // 方案选择
    const [ planSelectKeys, setPlanSelectKeys ] = useFetchState<Key[]>([]);
    // 参数选择
    const [ paramsSelectedKeys, setParamsSelectedKeys ] = useFetchState<Key[]>([]);
    // 参数列表
    const [ paramsList, setParamsList ] = useFetchState<MeterParamList[]>([]);
    // 地域配置
    const [ areaOpt, setAreaOpt ] = useFetchState<Options[]>([]);
    // 地域选择Key值
    const [ areaVal, setAreaVal ] = useFetchState<string>('All');
    // 参数分页总数
    const [ paramsTotal, setParamsTotal ] = useFetchState<number>(0);
    // 参数分页当前页数
    const [ paramsCurrent, setParamsCurrent ] = useFetchState<number>(1);
    // 参数分页Loading
    const [ paramsLoading, setParamsLoading ] = useFetchState<boolean>(false);
    // 表计选择
    const [ meterItems, setMeterItems ] = useFetchState<MeterItem[]>([]);

    // ---- 结果页
    // 任务状态
    const [ taskStatus, setTaskStatus ] = useFetchState<string>('All');
    // 参数下发方案信息
    const [ groupTaskRow, setGroupTaskRow ] = useFetchState<any>({});
    // 参数下发任务列表数据
    const [ taskData, setTaskData ] = useFetchState<TaskListRow[]>([]);
    // 总数
    const [ taskTotal, setTaskTotal ] = useFetchState<number>(0);
    // 当前页
    const [ taskCurrent, setTaskCurrent ] = useFetchState<number>(1);
    // loading状态
    const [ taskLoading, setTaskLoading ] = useFetchState<boolean>(false);
    // 任务选中
    const [ selTaskRowKeys, setTaskSelRowKeys ] = useFetchState<Key[]>([]);
    // 任务方案详细信息
    const [ taskInfo, setTaskInfo ] = useFetchState<TaskInfo>(INITTASKINFO);
    const handleTabsChange = (val: string) => {
        setActiveKey(val);
        if (val === '2' && !taskTotal) {
            // eslint-disable-next-line no-use-before-define
            getGroupTaskList({
                startTime: dateFormat('YYYY/MM/DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                endTime: dateFormat('YYYY/MM/DD'),
                inputVal: '',
            }, true);
        }
    };

    // 地域下拉获取
    const getAreaList = () => {
        abnormalFn(async () => {
            const res = await amiFunc.meterParamControl.getAreaList();
            const list = formatArrOptions(res, 'ID', 'NAME');

            list.unshift({ value: 'All', name: 'All' });
            setAreaOpt(list);
        });
    };

    // 地域下拉变化事件
    const areaChange = (val: string) => {
        setAreaVal(val);
        onConfig.current.areaVal = val;
    };

    // 方案搜索事件，显示方案列表
    const planSearch = (val: string = '') => {
        console.log(val);
        abnormalFn(async () => {
            const res = await amiFunc.meterParamControl.getProgramList(val);
            const fileListData = rowsFormatTreeData(res.rows);

            onConfig.current.planList = res.rows;
            setPlanListTree(fileListData);
        });
    };

    // 方案选择事件
    const onParamsTreeCheck = async (rowKey: Key[] | { checked: Key[]; halfChecked: Key[]; }, selectedRows: { checkedNodes: any[] }) => {
        setParamsLoading(true);
        console.log('as------');
        try {
            cRef.current?.clearCheckedKeys();
            const selKeys = rowKey as Key[];
            const selRowKeys = selKeys.length ? [ selKeys[selKeys.length - 1] ] : selKeys;

            setPlanSelectKeys(selRowKeys);
            onConfig.current.planSelectedKeys = selRowKeys;
            if (selKeys.length) {
                const planRow = planListTree.find((v) => v.key === selRowKeys[0]);

                cRef.current?.setSameTypeDevice(planRow.DEVICE_MODEL);
                const res = await amiFunc.meterParamControl.getMeterParamList(selectedRows.checkedNodes[0].SN || '');
                const keys = res.map((v) => v.Parameter);

                setParamsList(arrPaging(res, 1, ROWS));
                setParamsTotal(res.length);
                setParamsCurrent(1);
                setParamsSelectedKeys(keys);
                onConfig.current.paramsList = res;
                onConfig.current.paramsSelectedKeys = keys;
                cRef.current?.setFlagType(true);
            } else {
                cRef.current?.setSameTypeDevice('');
                cRef.current?.setFlagType(false);
                setParamsList([]);
                setParamsTotal(0);
                setParamsCurrent(1);
                setParamsSelectedKeys([]);
                onConfig.current.paramsList = [];
                onConfig.current.paramsSelectedKeys = [];
            }
        } catch (error: any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageHintExceptionError ']);
        }
        setParamsLoading(false);
    };

    // 分页
    const paramsPagetion = {
        total: paramsTotal,
        onChange (page: number) {
            setParamsList(arrPaging(onConfig.current.paramsList, page, ROWS));
        },
        current: paramsCurrent,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 右边table展示列表
    const paramsColumns: ColumnsType<MeterParamList> = [
        {
            title: Mes['titleTableParametersparameters'],
            dataIndex: 'Parameter',
        },
        {
            title: Mes['titleTabClassclass'],
            dataIndex: 'Class',
        },
        {
            title: Mes['titleTableObisobis'],
            dataIndex: 'Obis',
        },
        {
            title: Mes['titleTableServicetypeservicetype'],
            dataIndex: 'ServiceType',
        },
        {
            title: Mes['titleTableAttributemethodattributemethod'],
            dataIndex: 'AttributeMethod',
        },
    ];

    // 参数列表选择事件
    const paramsTableSelectChange = (tableSelectedRowKeys:Key[]) => {
        setParamsSelectedKeys(tableSelectedRowKeys);
        onConfig.current.paramsSelectedKeys = tableSelectedRowKeys;
    };

    // 设备选择
    const onNodeCheck = (row: any, node: NodeTree) => {
        if (!planSelectKeys.length) {
            return message.warning(Mes['messageAlarmSelectprogramselectprogram']);
        }
        if (node.nodeType === '0') { // 选择表计
            if (!node.checked) {
                meterItems.push({
                    'ITEM_ID': node.key as string,
                    'CST_ID': node.parentId || '',
                    'SN_METER_TYPE': node.deviceModel,
                });
                setMeterItems(meterItems);
                onConfig.current.meterList = meterItems;
            } else {
                const newMeterItems = meterItems.filter((v) => v.ITEM_ID !== node.key);

                onConfig.current.meterList = newMeterItems;
                setMeterItems(newMeterItems);
            }
        }
        if (node.nodeType === '1') { // 选择集中器
            if (!node.checked) {
                const planRow = planListTree.find((v) => v.key === planSelectKeys[0]);

                if (Array.isArray(node.children) && node.children.length) {
                    node.children.forEach((item:any) => {
                        if (item?.metermodelno === planRow?.DEVICE_MODEL) {
                            meterItems.push({
                                'ITEM_ID': node.key as string,
                                'CST_ID': node.parentId || '',
                                'SN_METER_TYPE': node.deviceModel,
                            });
                            setMeterItems(meterItems);
                            onConfig.current.meterList = meterItems;
                        }
                    });
                }
            } else {
                if (Array.isArray(node.children) && node.children.length) {
                    const newMeterItems = meterItems.filter((v) => node.children?.some((o:any) => o.metermodelno !== v.ITEM_ID));

                    onConfig.current.meterList = newMeterItems;
                    setMeterItems(newMeterItems);
                }

            }
        }
    };

    // 参数下发上传
    const handleSetting = () => {
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

    // 添加弹窗设备选择变化事件，影响设备类型下拉
    const fileTypeChange = (val: string = '') => {
        abnormalFn(async () => {
            const res = await amiFunc.meterParamControl.getDeviceType(val);

            setDeviceTypeOpt(formatArrOptions(res, 'NO', 'NAME'));
            aRef.current?.setFieldsValue({
                deviceModel: res[0].NO,
                programName: `${res[0].NAME}-${dateFormat('YYYYMMDDHHmmss')}`,
            });
        });
    };

    // 方案添加与删除事件
    const planBtnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            onClick () { // 添加
                abnormalFn(async () => {
                    const res = await amiFunc.meterParamControl.getSetting();

                    aRef.current?.openModel({
                        ftpIpAddress: res[0],
                        ftpIpPort: res[1],
                        ftpUserName: res[2],
                        ftpUserPwd: res[3],
                        fileType: '1',
                    });
                    fileTypeChange('1');
                });
            },
        },
        {
            type: 'Del',
            btnType: 'primary',
            async onClick () { // 删除
                confirm({ // 确认框
                    title: Mes['messageSuccessConfirmconfirm'],
                    icon: <ExclamationCircleOutlined />,
                    content: Mes['confirmTextDeleteFiles'],
                    async onOk () {
                        abnormalFn(async () => {
                            const rowData = planListTree.filter((v) => v.key === planSelectKeys[0]);
                            const res = await amiFunc.meterParamControl.delFileImpl({
                                rowsList: JSON.stringify(rowData),
                                subSysNo,
                            });

                            if (!res) {
                                message.success(Mes['titleTableSuccesssuccess']);
                                planSearch();
                                setPlanSelectKeys([]);
                                setParamsList([]);
                                setParamsTotal(0);
                                setParamsCurrent(1);
                                setParamsSelectedKeys([]);
                            }
                        });
                    },
                    onCancel () {
                        console.log('Cancel');
                    },
                });
            },
        },
    ];

    // 添加方案保存
    const addPlanSubmit = async (val:any) => {
        console.log(val);
        const deviceModelName = deviceTypeOpt.find((v) => v.value === val.deviceModel);
        const params = {
            subSysNo,
            deviceModelName: deviceModelName?.name || '',
            activeDate: '',
            deviceModel: val.deviceModel,
            fileName: Array.isArray(val.fileName) ? `\\${val.fileName[0].name}` : '',
            fileType: val.fileType,
            ftpIpAddress: val.ftpIpAddress,
            ftpIpPort: val.ftpIpPort,
            ftpUserName: val.ftpUserName,
            ftpUserPwd: val.ftpUserPwd,
            programName: val.programName,
        };
        const res = await amiFunc.meterParamControl.uploadFileImpl(params);

        if (!res) {
            message.success(Mes['titleTableSuccesssuccess']);
            planSearch();
        } else {
            throw res.mess || '';
        }
    };

    // ftp连接
    const handleConnect = async () => {
        const formVal = await aRef.current?.getFieldsValue();

        if (!formVal.ftpIpAddress) {
            return message.warning(Mes['messageInputFtpIpAddress']);
        }

        if (!formVal.ftpIpPort && !parseInt(formVal.ftpIpPort, 10)) {
            return message.warning(Mes['messageInputFtpport']);
        }

        if (!formVal.ftpUserName) {
            return message.warning(Mes['messageInputFtpUserName']);
        }

        if (!formVal.ftpUserPwd) {
            return message.warning(Mes['messageInputFtpPassword']);
        }
        const res = await amiFunc.meterParamControl.tryFTPConn({
            ftpIpAddress: [ `${formVal.ftpIpAddress}:${formVal.ftpIpPort}` ],
            ftpUserName: formVal.ftpUserName,
            ftpUserPwd: formVal.ftpUserPwd,
            subSysNo,
        });

        if (!res) {
            message.success(Mes['messageSuccessTestconnectionsucctestconnectionsucc']);
        }
    };

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 9 },
        wrapperCol: { span: 15 },
    };

    // 添加参数配置
    const addOpt = [
        {
            type: 'Input',
            label: 'titleTableUpgradeftpipupgradeftpip',
            name: 'ftpIpAddress',
            rules: [
                { required: true },
                {
                    validator: (_:any, value:any) =>
                        IsIp(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputFormatIncorrect']),
                },
            ],
            col: 12,
        },
        {
            type: 'Input',
            label: 'titleTableFtpnameportftpnameport',
            name: 'ftpIpPort',
            col: 12,
            rules: [ {
                validator: (_:any, value:any) => {
                    if (value && /^\d+$/.test(value)) {
                        if (value < 1) {
                            return Promise.reject(`${Mes['messageHintGreaterthan0greaterthan0']} 1`);
                        } else if (value > 65535) {
                            return Promise.reject(`${Mes['messageHintLessthan0lessthan0']} 65535`);
                        } else {
                            return Promise.resolve();
                        }
                    } else {
                        return Promise.reject(Mes['formRuleTitleInputFormatIncorrect']);
                    }
                },
            } ],
        },
        {
            type: 'Input',
            label: 'titleTableUpgradeusernameupgradeusername',
            name: 'ftpUserName',
            col: 12,
            rules: [ {required: true },
                { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                { max: 20, message: Mes['hintRulesMaxBytes']?.replace('*', '20') },
                {
                    validator: (_:any, value:any) =>
                        /^[a-zA-Z0-9]+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']),
                } ],
        },
        {
            type: 'Input',
            label: 'titleTableUpgradeusernameupgradePassword',
            name: 'ftpUserPwd',
            col: 12,
            rules: [ {required: true },
                { min: 3, message: Mes['hintRulesMinBytes']?.replace('*', '3') },
                { max: 20, message: Mes['hintRulesMaxBytes']?.replace('*', '20') },
                {
                    validator: (_:any, value:any) =>
                        /^[a-zA-Z0-9]+$/.test(value) ? Promise.resolve() : Promise.reject(Mes['formRuleTitleInputAlphabeticalAndNumber']),
                } ],
            attr: {
                type: 'password',
            },
        },
        {
            type: 'Select',
            label: 'titleTableFiletypefiletype',
            name: 'fileType',
            col: 12,
            rules: [ { required: true } ],
            options: [
                {
                    value: '1',
                    name: 'Meter',
                },
            ],
        },
        {
            type: 'Select',
            label: 'titleTableDevicetypedevicetype',
            name: 'deviceModel',
            rules: [ { required: true } ],
            col: 12,
            options: deviceTypeOpt,
        },
        {
            type: 'Input',
            label: 'titleTableProgramnameprogramname',
            name: 'programName',
            rules: [
                { required: true },
                { min: 3 },
                {max: 50},
            ],
            col: 12,
        },
        {
            type: 'Slot',
            name: 'fileName',
            col: 12,
            slot: (<UploadSlot
                upRef={upRef}
                maxLen={1}
                key='uploadKey'
                action='/v1/upgradeXmlFolderUpload'
                label={Mes['labelTiltleFilePath']}
                btnTitle={Mes['btnTitleChooseFile']} />),
        },
    ];
    // 表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };
        // model参数设置
    const modelOpt = {
        title: 'titleDialogAddoperatoraddoperator',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 设置下发参数
    const setParams = (wsguid:string) => {
        console.log(wsguid);
        if (!onConfig.current.planSelectedKeys.length) {
            return message.warning(Mes['messageAlarmSelectprogramselectprogram']);
        }
        if (!onConfig.current.paramsSelectedKeys.length) {
            return message.warning(Mes['messageAlarmSelectdeliveryparametersselectdeliveryparameters']);
        }
        confirm({
            title: Mes['messageSuccessConfirmconfirm'],
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSurepublishingparameterssurepublishingparameters'],
            async onOk () {
                showLoading();
                const {
                    planList: fileListData,
                    planSelectedKeys: fileRowKeys,
                    paramsSelectedKeys: tableRowsKeys,
                    paramsList: tableListData,
                    areaVal: areaValue,
                    meterList,
                } = onConfig.current;
                const programList = fileListData.find((v) => v.SN === fileRowKeys[0]);
                const param = `${programList.SN},${tableListData.filter((v) => tableRowsKeys.some((o) => v.Parameter === o)).map((v) => v.Parameter)
                    .join(',')}`;

                await abnormalFn(async () => {
                    const res = await amiFunc.meterParamControl.upgradeFileIssued({
                        subSysNo,
                        groupId: onConfig.current.groupId,
                        area: areaValue,
                        programList: JSON.stringify([ programList ]),
                        strlist: JSON.stringify(meterList),
                        param: param,
                    });

                    if (parseInt(res.flag, 10)) {
                        if (!res.list.length) {
                            setActiveKey('2');
                            // eslint-disable-next-line no-use-before-define
                            getGroupTaskList({
                                startTime: dateFormat('YYYY/MM/DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)),
                                endTime: dateFormat('YYYY/MM/DD'),
                                inputVal: '',
                            }, true);
                            message.success(Mes['messageAlarmSettingcommandsuccessandwaitsettingcommandsuccessandwait']);
                        }
                    } else if (res.mes) {
                        message.error(res.mes);
                    } else {
                        message.info(Mes['messageAlarmSettingcommandfailedandwaitsettingcommandfailedandwait']);
                    }
                });
                hideLoading();
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    // websocket任务
    const OnDemand = (row: any) => {
        if (row.guid === onConfig.current.groupId) {
            onConfig.current.receiveMessNum++;
            if (onConfig.current.receiveMessNum === 1 && row.name === 'otask-confirm') {
                setParams(row.guid);
                onConfig.current.receiveMessNum = 0;
            } else if (onConfig.current.receiveMessNum > 0) {
                const { taskList } = onConfig.current;
                const taskRow = taskList.find((v) => v.SN_TASK === row.taskid);

                if (taskRow) {
                    if (row.success) {
                        taskRow.UPGRADE_STATUS = '3';
                    } else {
                        taskRow.UPGRADE_STATUS = '2';
                        taskRow.RETURN_DATA = row.result;
                    }
                    setTaskData(taskList);
                }
            }
        }
    };

    useEffect(() => {
        planSearch();
        getAreaList();
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
    }, []);

    // ----结果页

    // 获取参数下发表计任务数据
    const getTaskTableData = async (row: any = groupTaskRow, pages: PageSizeType = INITPAGE, status: string = taskStatus) => {
        try {
            setTaskLoading(true);
            const res = await amiFunc.meterParamControl.getTaskListAndStatusCount({
                subSysNo,
                status,
                sortOrder: 'asc',
                page: pages.page,
                rows: pages.rows,
                groupId: row.GROUP_ID || '',
            });

            setTaskInfo({
                SuccessCount: res.SuccessCount,
                failCount: res.failCount,
                upgradeTime: new Date(res.upgradeTime).getTime(),
                unfinished: res.unfinished,
            });
            setTaskData(res.rows);
            onConfig.current.taskList = res.rows;
            setTaskTotal(res.total);
            setTaskLoading(false);
            setTaskCurrent(pages.page);
        } catch (error:any) {
            console.error(error);
            message.error(`${error}`);
            setTaskLoading(false);
        }
    };
    // 任务点击事件
    const groupTaskClick = async (row: any) => {
        if (row && IsEmptyObejct(row)) {
            setGroupTaskRow(row);
            getTaskTableData(row, INITPAGE, 'All');
        } else {
            setGroupTaskRow({});
            setTaskData([]);
            setTaskTotal(0);
            setTaskCurrent(1);
        }
    };
    // 任务树title设置
    const groupTaskFormatTitle = (val: any): string => `${val['UPGRADE_TYPE']}--${val['PROGRAM_NAME']}`;

    // 获取设置方案列表
    const getGroupTaskList = async (val: GetListParams, flagType:boolean = false) => {
        try {
            const res = await amiFunc.meterParamControl.getGroupList({
                startDate: val.startTime,
                endDate: val.endTime,
                programName: val.inputVal || '',
                sortName: '',
                sortOrder: 'asc',
            });

            if (flagType && res.rows.length) {
                getTaskTableData(res.rows[0], INITPAGE, 'All');
                setGroupTaskRow(res.rows[0]);
                taskRef.current?.setSelKeys(res.rows[0].GROUP_ID);
            }
            const list:any = res.rows.map((v) => {
                v['create_time'] = dateFormat('YYYY-MM-DD HH:mm:ss', moment(v['create_time']));
                return v;
            });

            taskRef.current?.setTreeData(list);
        } catch (error: any) {
            console.error(error);
            message.error(`${error}`);
        }
    };

    // 状态选择
    const taskStatusChange = (val: string) => {
        if (IsEmptyObejct(groupTaskRow)) {
            setTaskStatus(val);
            getTaskTableData(groupTaskRow, INITPAGE, val);
        } else {
            setTaskStatus(val);
        }
    };

    // 结果页按钮事件
    const taskBtnList: BtnConfig[] = [
        {
            type: 'Search',
            btnType: 'primary',
            title: 'Search setting result',
            async onClick () {
                getTaskTableData(groupTaskRow, INITPAGE, taskStatus);
            },
        },
        {
            type: 'Redo',
            btnType: 'primary',
            title: 'Re-execution Setting',
            async onClick () {
                try {
                    confirm({
                        title: Mes['messageSuccessConfirmconfirm'],
                        icon: <ExclamationCircleOutlined />,
                        content: Mes['btnBtnresendbtnresend'],
                        async onOk () {
                            abnormalFn(async () => {
                                const strust = taskData.map((v) => {
                                    const key = selTaskRowKeys.find((o) => o === v.PSN);

                                    if (key) {
                                        if (v.UPGRADE_STATUS === '2') {
                                            return v;
                                        } else {
                                            const newSelKeys = selTaskRowKeys.filter((o) => o !== v.PSN);

                                            setTaskSelRowKeys(newSelKeys);
                                        }
                                    }
                                }).filter((v) => v);
                                const res = await amiFunc.meterParamControl.resend({
                                    subSysNo,
                                    strlist: JSON.stringify(strust || []),
                                    groupId: groupTaskRow.GROUP_ID || '',
                                });

                                if (!res) {
                                    getTaskTableData(groupTaskRow, {page: taskCurrent, rows: ROWS});
                                    return message.success(Mes['messageSuccessResendsuccessresendsuccess']);
                                }
                            });
                        },
                        onCancel () {
                            console.log('Cancel');
                        },
                    });
                } catch (error:any) {
                    console.error(error);
                    message.error(`${error}`);
                }
            },
        },
    ];

    // 任务列表
    const taskColumns: ColumnsType<TaskListRow> = [
        {
            title: Mes['titleTableDcunamedcuname'],
            dataIndex: 'CST_NAME',
        },
        {
            title: Mes['titleTableDcutypedcutype'],
            dataIndex: 'CST_TYPE_NAME',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableCompletetimecompletetime'],
            dataIndex: 'COMPLETION_DATE',
            render (value: number, record: TaskListRow) {
                if (record.UPGRADE_STATUS === '3' || record.UPGRADE_STATUS === '2') {
                    return dateFormat('YYYY-MM-DD HH:mm:ss', new Date(value));
                }
                return '-';
            },
        },
        {
            title: Mes['titleTableUploadtaskuploadtask'],
            dataIndex: 'UPGRADE_STATUS',
            render (value: string) {
                let status = parseInt(value, 10);

                if (status === 3) { // sucess
                    return (<span><i className='fa fa-check-circle' style={{verticalAlign: 'middle', color: '#21c913'}}></i>Success</span>);
                } else if (status === 2) {
                    return (<span><i className='fa fa-times-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Failure</span>);
                } else if (status === 0) {
                    return (<span><i className='fa fa-play-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Ready</span>);
                } else if (status === 1) {
                    return (<span><i className='fa fa-spinner fa-spin' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Upgrading</span>);
                } else {
                    return (<span><i className='fa fa-times-circle' style={{verticalAlign: 'middle', color: '#FC321E'}}></i>Failure</span>);
                }
            },
        },
        {
            title: Mes['titleTableParametersparameters'],
            dataIndex: 'PARAMETERS',
            render (value: string) {
                try {
                    return value.split(',')[1];
                } catch (error) {
                    return '-';
                }
            },
        },
        {
            title: Mes['titleTableMessagemessage'],
            dataIndex: 'RETURN_DATA',
            render (value: string, record: TaskListRow) {
                if (record.UPGRADE_STATUS !== '3' &&
                record.UPGRADE_STATUS !== '1') {
                    return (<span title={value}>{value }</span>);
                }
                return '-';
            },
        },
    ];

    // 任务分页
    const taskPagetion = {
        total: taskTotal,
        onChange (page: number) {
            setTaskSelRowKeys([]);
            getTaskTableData(groupTaskRow, {page, rows: ROWS});
        },
        current: taskCurrent,
        showTotal: () => `Total ${taskTotal} items`,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 任务Table选择
    const rowSelection = {
        selectedRowKeys: selTaskRowKeys,
        onChange (rowKeys: Key[]) {
            setTaskSelRowKeys(rowKeys);
        },
    };

    return (
        <>
            <div className='metertParam tabWrap'>
                <Tabs activeKey={activeKey} onChange={handleTabsChange}>
                    <TabPane tab={Mes['tabsTitleRemoteIssued']} key='1'>
                        <div className='meterControl'>
                            <div className='fileList'>
                                <div className='btn'>
                                    <BtnList btnList={planBtnList} />
                                </div>
                                <div className='search'>
                                    <Search placeholder='Input search value' size='middle' onSearch={planSearch} enterButton />
                                </div>
                                <h4>{ Mes['titleTableProgramnameprogramname'] }</h4>
                                <div className='list scrollbar'>
                                    <Tree
                                        checkable
                                        onCheck={onParamsTreeCheck}
                                        checkedKeys={planSelectKeys}
                                        treeData={planListTree}
                                    />
                                </div>
                            </div>
                            <DeviceTree
                                onNodeCheck={onNodeCheck}
                                isExpand={true}
                                checkbox={false}
                                checkType={true}
                                checkNodeTypeKey='metermodelno'
                                cRef={cRef} />
                            <div className='paramList border'>
                                <Row className='top' gutter={24}>
                                    <Col span={5}>
                                        <Select onChange={areaChange} value={areaVal}>
                                            {
                                                areaOpt.map((v) => (
                                                    <Option value={v.value} key={v.value}>{ v.name }</Option>
                                                ))
                                            }
                                        </Select>
                                    </Col>
                                    <Col span={2}>
                                        <Button type='primary' icon={<ToTopOutlined />} onClick={handleSetting} />
                                    </Col>
                                </Row>
                                <div className='table'>
                                    <Table
                                        columns={paramsColumns}
                                        dataSource={paramsList}
                                        rowKey='Parameter'
                                        loading={paramsLoading}
                                        rowSelection={{
                                            selectedRowKeys: paramsSelectedKeys,
                                            onChange: paramsTableSelectChange,
                                        }}
                                        pagination={false}
                                    />
                                </div>
                                <div className='page'>
                                    <Pagination {...paramsPagetion} />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab={Mes['titleLabelIdqueryresultidqueryresult']} key='2'>
                        <div className='queryResult contentWrap'>
                            <div className='wrapLeft'>
                                <TaskCom
                                    onChick={groupTaskClick}
                                    title={Mes['titleTableTaskgroupnametaskgroupname']}
                                    taskRef={taskRef}
                                    groupTaskFormatTitle={groupTaskFormatTitle}
                                    getList={getGroupTaskList} />
                            </div>
                            <div className='wrapRight'>
                                <Row gutter={24} className='top'>
                                    <Col span={3}>
                                        <Select value={taskStatus} onChange={taskStatusChange}>
                                            <Option value='All'>All</Option>
                                            <Option value='3'>Success</Option>
                                            <Option value='2'>Failure</Option>
                                            <Option value='1'>Upgrading</Option>
                                            <Option value='0'>Ready</Option>
                                        </Select>
                                    </Col>
                                    <Col>
                                        <BtnList btnList={taskBtnList} />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='table'>
                                    <Col span={24}>
                                        <Table
                                            columns={taskColumns}
                                            loading={taskLoading}
                                            dataSource={taskData}
                                            rowSelection={rowSelection}
                                            pagination={false}
                                            rowKey='PSN'
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='page'>
                                    <Col span={24}>
                                        <Pagination {...taskPagetion} />
                                    </Col>
                                </Row>
                                <Row gutter={24} className='statistical'>
                                    <Col span={7}>
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <strong>{Mes['titleTableSettingstarttimesettingstarttime']}:</strong>
                                            </Col>
                                            <Col span={12}>
                                                {taskInfo.upgradeTime ? dateFormat('YYYY-MM-DD hh:mm:ss', moment(taskInfo.upgradeTime)) : ''}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={3}>
                                        <Row gutter={24}>
                                            <Col span={8}>
                                                <strong>{Mes['tableTitleStatus']}:</strong>
                                            </Col>
                                            <Col span={12}>
                                                {taskTotal - taskInfo.SuccessCount - taskInfo.failCount > 0 ? 'Upgrading' : 'Finish'}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={4}>
                                        <Row gutter={24}>
                                            <Col span={16}>
                                                <strong>{Mes['titleTableUpgradesuctotalupgradesuctotal']}:</strong>
                                            </Col>
                                            <Col span={8}>
                                                {typeof taskInfo.SuccessCount === 'number' ? taskInfo.SuccessCount : 0}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={3}>
                                        <Row gutter={24}>
                                            <Col span={16}>
                                                <strong>{Mes['titleTableUpgradefailtotalupgradefailtotal']}:</strong>
                                            </Col>
                                            <Col span={8}>
                                                {typeof taskInfo.failCount === 'number' ? taskInfo.failCount : 0}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={5}>
                                        <Row gutter={24}>
                                            <Col span={16}>
                                                <strong>{Mes['titleTableUnfinishedunfinished']}:</strong>
                                            </Col>
                                            <Col span={8}>
                                                {typeof taskInfo.unfinished === 'number' ? taskInfo.unfinished : 0}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
            <AddRowCom<void, any>
                cRef={aRef}
                saveData={addPlanSubmit}
                formOption={formOpt}
                modelOpt={modelOpt}
                handleConnectFunc={handleConnect}
                Mes={Mes}
            />
        </>
    );
};


export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(MeterParam);
