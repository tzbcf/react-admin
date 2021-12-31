/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, Tree, Table, Button, Input, Select, message, Modal, Form, DatePicker } from 'antd';
import { ExclamationCircleOutlined} from '@ant-design/icons';
import { basicData } from 'src/api';
import {
    InstoreMeterList, BatchNameJson, InstoreMeterParams, InstoreMeterData, BatchList, BatchData, MeterBaseType, MeterFactory, MeterRegisterType,
    MaxBatchNo, MeterAdd, QueryBatchCount, QueryBatchInfo, QueryMeterRegisterType,
} from 'src/api/basicData/meterInWareHouse/types';
import useFetchState from 'src/utils/useFetchState';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import { SGCData, SGCDataList } from 'src/api/basicData/organizationMgt/types';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import moment from 'moment';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

// 树形组件展示批次信息
type TreeData = {
    title: string;
    key: string;
    children: BatchNameJson[];
}

let searchType = 'DB_DOT';// 搜索框值的类型
let batch = '';// 所选批次NO
let searchValue = '';// 搜索框输入值
let meterIds:string[] = [];// 批量选择的表计ID
let meterNos:string[] = [];// 批量选择的表计NO

const MeterInWareHouse: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    // const { DirectoryTree } = Tree;
    const { Search, TextArea } = Input;
    const { Option } = Select;
    const [ meterList, setMeterList ] = useFetchState<InstoreMeterData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ batchList, setBatchList ] = useFetchState<TreeData[]>([]);
    const [ expandedList, setExpandedList ] = useFetchState<string[]>([]);
    // const [ meterNo, setMeterNo ] = useFetchState<string>('');
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);
    const [ submitLoading, setSubmitLoading ] = useFetchState<boolean>(false);
    const [ modalTitle, setModalTitle ] = useFetchState<string>('');
    const [ SGCList, setSGCList ] = useFetchState<SGCData[]>([]);
    const [ factoryList, setFactoryList ] = useFetchState<MeterFactory[]>([]);
    const [ baseTypeList, setBaseTypeList ] = useFetchState<MeterBaseType[]>([]);
    const [ registerList, setRegisterList ] = useFetchState<MeterRegisterType[]>([]);
    const [ isMeterAdd, setIsMeterAdd ] = useFetchState<boolean>(false);
    const [ maxMeterNo, setMaxMeterNo ] = useFetchState<number>(8);
    const [ meterLengthList, setMeterLengthList ] = useFetchState<string[]>([ '11', '13' ]);
    const [ isStsMeter, setIsStsMeter ] = useFetchState<boolean>(true);
    const [ isCustomAdd, setCustomAdd ] = useFetchState<boolean>(false);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);
    const cRef = useRef<CRef>();
    const cRef1 = useRef<CRef>();
    const [ form ] = Form.useForm();

    // 获取表计入库列表
    const getInstoreMeterList = (page: number = 1, rows: number = 20) => {
        setLoading(true);
        const params: InstoreMeterParams = {
            subSysNo: subSysNo,
            page: page,
            rows: rows,
            searchField: searchType,
            fieldValue: searchValue,
            batchNo: batch,
        };

        basicData.meterInWareHouse.instoreMeterList(params).then((res:InstoreMeterList) => {
            setLoading(false);
            setCurrent(page);
            setTotal(res.total);
            setMeterList(res.rows);
        })
            .catch((error) => {
                message.error(error);
                setLoading(false);
            });
    };

    // 获取批次列表
    const getBatchList = () => {
        basicData.meterInWareHouse.batchList(subSysNo).then((res:BatchNameJson[]) => {
            if (res.length > 0) {
                const groups:any = res.find((v: BatchNameJson) =>
                    v.LEVEL1 === 0
                );

                setExpandedList([ groups.ID ]);// 设置树形组件展开ID
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

    const getKMFList = () => {
        basicData.organizationMgt.getKMFList().then((res:SGCDataList) => {
            setSGCList(res.rows);
        });
    };

    const getSGCList = () => {
        basicData.organizationMgt.getSGCList().then((res:SGCDataList) => {
            setSGCList(res.rows);
        });
    };

    // 获取表计工厂列表
    const getFactoryList = () => {
        basicData.meterInWareHouse.meterFactory(subSysNo).then((res:MeterFactory[]) => {
            setFactoryList(res);
        });
    };

    // 获取表计类型列表
    const getBaseTypeList = () => {
        basicData.meterInWareHouse.meterBaseType(subSysNo).then((res:MeterBaseType[]) => {
            setBaseTypeList(res);
        });
    };

    // 获取表计型号列表
    const getRegisterTypeList = (baseType?: string) => {
        if (!baseType) {
            baseType = baseTypeList[0].SN;
        }
        const params: QueryMeterRegisterType = {
            subSysNo: subSysNo,
            baseType: baseType,
        };

        basicData.meterInWareHouse.meterRegisterType(params).then((res:MeterRegisterType[]) => {
            setRegisterList(res);
        });
    };

    // 选择树形组件的批次
    const onSelect = (keys: React.Key[], info: any) => {
        console.log('Trigger Select', keys, info);
        batch = keys[0] + '';
        setSelectedRowKeys([]);
        meterIds = [];
        meterNos = [];
        getInstoreMeterList(1, 20);
    };

    // 选择搜索框类型
    const onSelectSearchType = (value:string) => {
        searchType = value;
    };

    // 点击搜索框搜索按钮
    const onSearch = (value: string) => {
        searchValue = value;
        setSelectedRowKeys([]);
        meterIds = [];
        meterNos = [];
        getInstoreMeterList(1, 20);
    };

    const changeSearch = (e: any) => {
        // console.log(e);
        searchValue = e.target.value;
    };

    // 下拉框选择表计加密类型
    const onSelectEncryptionType = (value:string) => {
        if (value === '1') {
            getKMFList();
        } else {
            getSGCList();
        }
    };

    // 下拉框选择表计类型
    const onSelectBaseType = (value: string) => {
        form.setFieldsValue({
            meterType: '',
        });
        getRegisterTypeList(value);
    };

    // 根据选择项组成批次名称
    const updateBatchName = () => {
        let type = form.getFieldValue('meterType');
        let date = form.getFieldValue('start_date');

        if (type) {
            let typeValue = registerList.filter((v: MeterRegisterType) => v.METER_MODEL_SYS_NO === type)[0];

            if (date) {
                let temp = moment(date).format('YYYY-MM-DD');
                const params: QueryBatchCount = {
                    subSysNo: subSysNo,
                    deviceType: type,
                    pruduceDate: temp,
                };

                basicData.meterInWareHouse.batchCount(params).then((res: string) => {
                    let batchName = typeValue.METER_MODEL_NAME + '-' + temp.split('-').join('') + '-' + (parseInt(res, 10) + 1);

                    form.setFieldsValue({
                        batchName: batchName,
                    });
                });
            }
            if (typeValue.MEDIA_MODEL === '11' || typeValue.MEDIA_MODEL === '13' || typeValue.MEDIA_MODEL === '14') {// sts表计类型
                setIsStsMeter(true);
            } else {
                setIsStsMeter(false);
                form.setFieldsValue({
                    EA: '',
                    NumTokens: '',
                    encryptionType: '1',
                    ComposeNo: '',
                });
            }
        }
    };

    // 根据所选项动态更新表计编号最大长度
    const updateMaxMeterNo = () => {
        let noMode = form.getFieldValue('meterNoMode');
        let noLength = form.getFieldValue('meterNoLength');
        let factory = form.getFieldValue('meterFac');
        let range = 13;

        if (noMode === '1') {// 带校验位
            if (factory) { // 带厂商编号
                range = 8;
            } else {// 不带厂商编号
                if (noLength === '11') {
                    range = 10;
                } else {
                    range = 12;
                }
            }
        } else {// 不带校验位
            range = 18;
        }
        setMaxMeterNo(range);
    };

    // 下拉框选择表计编号方式
    const onSelectNoMode = (value: string) => {
        if (value === '1') {
            setMeterLengthList([ '11', '13' ]);
        } else {
            setMeterLengthList([ '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18' ]);
        }
        updateMaxMeterNo();
    };

    const Luhn = (sourc_s:string) => {
        let s = ''; let str = '';
        let i = 0; let j = 0; let k = 0;

        s = sourc_s;
        str = '';
        for (i = 0; i < s.length; i++) {
            str += s.substr(s.length - i - 1, 1);
        }

        // alert(str+"="+sourc_s);

        s = str;
        str = '';

        for (i = 0; i < s.length; i++) {
            if ((i + 1) % 2 > 0) {
                str = parseInt(s.substr(i, 1), 10) * 2 + str;
                continue;
            }

            if ((i + 1) % 2 === 0) {
                str = s.substr(i, 1) + str;
                continue;
            }
        }


        j = 0;
        for (i = 0; i < str.length; i++) {

            j = j + parseInt(str.substr(i, 1), 10);

        }

        s = '' + j;

        k = parseInt(s.substr(s.length - 1, 1), 10);

        // alert(s+"="+k);

        if (k === 0) {
            k = 10;
        }

        let r = 0;

        r = 10 - k;

        // alert( sourc_s +r);
        return sourc_s + r;
    };

    // 根据所选值生成表计编号
    const updateMeterNo = (objId: string, tempValue: string) => {
        if (tempValue !== '') {
            let curValue = '00000000' + tempValue;

            curValue = curValue.replace('-', '');
            curValue = curValue.replace('.', '');

            let meterNoMode = form.getFieldValue('meterNoMode');
            let meterLen = form.getFieldValue('meterNoLength');
            let factory = form.getFieldValue('meterFac');
            let ss = '';

            if (meterNoMode === '1') {
                if (factory !== '00') {
                    curValue = factory + curValue.substr(curValue.length - 8, 8);
                    ss = '0000' + Luhn(curValue);

                    ss = ss.substr(ss.length - parseInt(meterLen, 10), parseInt(meterLen, 10));
                } else {
                    let cutLen = parseInt(meterLen, 10) - 1;

                    curValue = '000000000000000000' + curValue;
                    curValue = curValue.substr(curValue.length - cutLen, cutLen);
                    ss = '0000' + Luhn(curValue);

                    ss = ss.substr(ss.length - parseInt(meterLen, 10), parseInt(meterLen, 10));
                }

            } else {

                curValue = '000000000000000000' + curValue;
                ss = curValue;

                ss = ss.substr(ss.length - parseInt(meterLen, 10), parseInt(meterLen, 10));

            }

            if (objId === 'start_sn') {
                form.setFieldsValue({
                    start_no: ss,
                });
            } else if (objId === 'end_sn') {
                form.setFieldsValue({
                    end_no: ss,
                });
            }
        }
    };

    // 输入表计开始SN码
    const onChangeStartSN = () => {
        const value = form.getFieldValue('start_sn');
        let curValue = '00000000' + value;

        updateMeterNo('start_sn', curValue);
        let end = form.getFieldValue('end_sn');

        if (end) {
            let totalNum = parseInt(end, 10) - parseInt(value, 10) + 1;

            if (totalNum > 0) {
                form.setFieldsValue({
                    totalMeter: totalNum,
                });
            }
        }
    };

    // 输入表计结束SN码
    const onChangeEndSN = () => {
        const value = form.getFieldValue('end_sn');
        let curValue = '00000000' + value;

        updateMeterNo('end_sn', curValue);
        let start = form.getFieldValue('start_sn');

        if (start) {
            let totalNum = parseInt(value, 10) - parseInt(start, 10) + 1;

            if (totalNum > 0) {
                form.setFieldsValue({
                    totalMeter: totalNum,
                });
            }
        }
    };

    // 选择表计添加时间
    const changeDate = (time: any, timeString: string) => {
        console.log(time, timeString);
        // form.setFieldsValue({
        //     start_date: timeString,
        // });
        updateBatchName();
    };

    // 弹出删除确认框
    const showDeleteConfirm = () => {
        if (meterNos.length > 0) {
            Modal.confirm({
                icon: <ExclamationCircleOutlined />,
                content: Mes['messageConfirmSuredeleterecordsuredeleterecord'],
                onOk () {
                    let nos = '';

                    meterNos.forEach((v) => {
                        nos = nos + v + ',';
                    });
                    const params: any = {
                        id: nos,
                        subSysNo: subSysNo,
                    };

                    basicData.meterInWareHouse.delMeter(params).then(() => {
                        message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                        setSelectedRowKeys([]);
                        meterIds = [];
                        meterNos = [];
                        getInstoreMeterList();
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

    // 批量更新表计状态
    const editStatus = async (row: any): Promise<any> => {
        console.log(row);
        // const params: any = {
        //     id: meterNo,
        //     subSysNo: subSysNo,
        //     statusFlag: row.statusFlag,
        // };

        // basicData.meterInWareHouse.saveMeterStatus(params).then(() => {
        //     message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
        //     setSelectedRowKeys([]);
        //     meterIds = [];
        //     meterNos = [];
        //     getInstoreMeterList();
        // })
        //     .catch((err) => {
        //         message.error(err);
        //     });
    };

    // 更新批次下所有表计版本信息
    const editVersion = async (row: any): Promise<any> => {
        const params: any = {
            batchNo: row.batchNo,
            subSysNo: subSysNo,
            soft_version: row.soft_version,
            module_fw_version: row.module_fw_version,
        };

        basicData.meterInWareHouse.saveBatchVersion(params).then(() => {
            message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            setSelectedRowKeys([]);
            meterIds = [];
            meterNos = [];
            getInstoreMeterList();
        })
            .catch((err) => {
                message.error(err);
            });
    };


    // 更新状态弹窗设置
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

    // 更新版本信息弹窗设置
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
            label: 'titleTableMetertypemetertype',
            name: 'meterType',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                disabled: true,
            },
        },

        {
            type: 'Input',
            label: 'titleTableModuleversionmoduleversion',
            name: 'module_fw_version',
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Input',
            label: 'titleTableSoftversionsoftversion',
            name: 'soft_version',
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

    // 弹出更新表计状态窗口
    // const showEditStatus = () => {
    //     if (meterIds.length > 0) {

    //         let val: any = {};
    //         let ids = '';

    //         meterIds.forEach((v) => {
    //             ids = ids + v + ',';
    //         });
    //         setMeterNo(ids);
    //         // val = {
    //         //     statusFlag: item.IF_USED,
    //         // };
    //         cRef.current?.openModel(val);

    //     } else {
    //         setMeterNo('');
    //         message.error(Mes['messageAlarmSelectitemselectitem']);
    //     }

    // };

    // 弹出更新表计版本信息窗口
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
                const params: QueryBatchInfo = {
                    subSysNo: subSysNo,
                    batchNo: batch,
                };

                basicData.meterInWareHouse.batchInfo(params).then((res: BatchList) => {
                    if (res.rows.length > 0) {
                        let data: BatchData = res.rows[0];
                        let val: any = {
                            batchNo: data.BATCH_NO,
                            batchName: data.BATCH_NAME,
                            meterType: data.DEVICE_TYPE_NAME,
                            module_fw_version: data.MODULE_VERSION !== 'null' ? data.MODULE_VERSION : '',
                            soft_version: data.SOFT_VERSION !== 'null' ? data.SOFT_VERSION : '',
                        };

                        cRef1.current?.openModel(val);
                    }
                });

            }

        } else {
            message.error(Mes['messageAlarmPleaseselectupdatenodepleaseselectupdatenode']);
        }

    };

    // 弹出删除批次确认窗口
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

                        basicData.meterInWareHouse.delBatch(params).then(() => {
                            message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                            setSelectedRowKeys([]);
                            meterIds = [];
                            meterNos = [];
                            getBatchList();
                            getInstoreMeterList();
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

    // 弹出添加批次窗口
    const showBatchAdd = () => {
        setModalTitle(Mes['btnMeteraddallmeteraddall']);
        basicData.meterInWareHouse.maxBatchNo(subSysNo).then((res:MaxBatchNo) => {
            if (res) {
                form.setFieldsValue({
                    meterNoMode: '1',
                    batchNo: res.result,
                    encryptionType: '1',
                    meterSort: baseTypeList[0].SN,
                    meterFac: '24',
                });
                getKMFList();
                getRegisterTypeList();
                setIsMeterAdd(false);
                setModalVisible(true);
                setCustomAdd(false);
                onSelectNoMode('1');
            }
        });

    };

    // 弹出添加表计窗口
    const showMeterAdd = () => {
        if (selectedRowKeys.length > 0) {
            setModalTitle(Mes['titleLabelAddadd']);
            let selectedMeterNo = meterNos[0];

            let selectedMeter:InstoreMeterData = meterList.filter((v: InstoreMeterData) => v.METER_NO === selectedMeterNo)[0];

            let arr = selectedMeter.MODIFY_NODE_NO.split('\@');
            let fac = arr[0];
            let type = arr[1];

            getRegisterTypeList(type);
            form.setFieldsValue({
                meterNoMode: selectedMeter.METER_NO_MODE,
                batchNo: selectedMeter.BATCH_NO,
                encryptionType: selectedMeter.ENCRYP_TYPE,
                meterNoLength: selectedMeter.METER_NO_LENGTH,
                batchName: selectedMeter.DB_DOT,
                meterType: selectedMeter.METER_MODEL_NO,
                start_date: moment(selectedMeter.OPERATE_DATE.substr(0, 10)),
                module_fw_version: selectedMeter.MODULE_FW_VERSION,
                soft_version: selectedMeter.SOFT_VERSION,
                EA: selectedMeter.EA,
                NumTokens: selectedMeter.NUM_TOKENS,
                meterFac: fac,
                meterSort: type,
                ComposeNo: selectedMeter.COMPOSE_NO,
            });
            if (selectedMeter.MEDIA_MODEL === '11' || selectedMeter.MEDIA_MODEL === '13' || selectedMeter.MEDIA_MODEL === '14') {// sts表计类型
                setIsStsMeter(true);
            } else {
                setIsStsMeter(false);
            }
            setIsMeterAdd(true);
            setModalVisible(true);
            setCustomAdd(false);
        } else {
            message.error(Mes['messageAlarmPleaseselectexistingbatchespleaseselectexistingbatches']);
        }
    };

    // 弹出添加customer窗口
    const showCustomAdd = () => {
        setModalTitle(Mes['titleDialogAddcustomeraddcustomer']);
        basicData.meterInWareHouse.maxBatchNo(subSysNo).then((res:MaxBatchNo) => {
            if (res) {
                form.setFieldsValue({
                    meterNoMode: '1',
                    batchNo: res.result,
                    encryptionType: '1',
                    meterSort: baseTypeList[0].SN,
                    meterFac: '24',
                });
                getRegisterTypeList();
                setIsMeterAdd(false);
                setModalVisible(true);
                setCustomAdd(true);
                onSelectNoMode('1');
            }
        });

    };

    // 校验表计编号
    const checkMeterNo = (meterNoList:string[], length:number) => {

        let reg = /^[0-9]*$/;

        for (let i = 0; i < meterNoList.length; i++) {
            let meter = meterNoList[i];

            if (!reg.test(meter) || meter.length !== length) {
                return Mes['messageAlarmMeternoerrorleftmeternoerrorleft'] + meter + Mes['messageAlarmMeternoerrorrightmeternoerrorright'];
            }

        }

        meterNoList = meterNoList.sort();
        for (let i = 0; i < meterNoList.length - 1; i++) {
            if (meterNoList[i] === meterNoList[i + 1]) {
                return Mes['messageAlarmMeternorepeatleftmeternorepeatleft'] + meterNoList[i] + Mes['messageAlarmMeternorepeatrightmeternorepeatright'];
            }
        }
        return 'success';


    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    // 点击弹窗submit按钮提交信息
    const handleOk = () => {
        form.validateFields().then((res) => {
            setSubmitLoading(true);
            let typeValue = registerList.filter((v: MeterRegisterType) => v.METER_MODEL_SYS_NO === res.meterType)[0];
            let factory = factoryList.filter((v: MeterFactory) => v.FACTORY_NO === res.meterFac)[0];
            let meterNoList = res.meterNoList;
            let length = parseInt(res.meterNoLength, 10);

            if (isCustomAdd) {// 当前弹窗为添加customer
                // 去除空格
                meterNoList = meterNoList.replace(/\s*/g, '');
                // 转为数组
                meterNoList = meterNoList.split(',');
                let check = checkMeterNo(meterNoList, length);

                console.log(check);
                if (check !== 'success') {
                    message.warn(check);
                    setSubmitLoading(false);
                    return;
                }
            }
            const params: MeterAdd = {
                subSysNo: subSysNo,
                meter_batch_no: res.batchNo,
                batchAddFlag: isMeterAdd ? 'N' : 'Y',
                batch_name: res.batchName,
                meterFac: factory.FACTORY_NO,
                meterFacName: factory.FACTORY_NAME,
                meterSort: res.meterSort,
                meterType: typeValue.METER_MODEL_SYS_NO,
                meterTypeName: typeValue.METER_MODEL_NAME,
                start_sn: res.start_sn,
                end_sn: res.end_sn,
                start_date: moment(res.start_date).format('YYYY-MM-DD'),
                meter_batch_mode: res.meterNoMode,
                batch_len: res.meterNoLength,
                EA: res.EA,
                NumTokens: res.NumTokens,
                ComposeNo: res.ComposeNo,
                soft_version: res.soft_version ? res.soft_version : '',
                module_fw_version: res.module_fw_version ? res.module_fw_version : '',
                encryptionType: res.encryptionType,
                meterNoMode: res.meterNoMode,
                meterNoLength: res.meterNoLength,
                isCusomerInstore: isCustomAdd ? 'true' : 'false',
                meterNoList: isCustomAdd ? JSON.stringify(meterNoList) : '',
            };

            basicData.meterInWareHouse.addBatchMeter(params).then(() => {
                setSubmitLoading(false);
                setModalVisible(false);
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                setSelectedRowKeys([]);
                meterIds = [];
                meterNos = [];
                getInstoreMeterList();
                getBatchList();
            })
                .catch((err) => {
                    message.error(err);
                    // setModalVisible(false);
                    setSubmitLoading(false);
                });
        });

    };

    // table列设置
    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'IF_USED',
            width: 50,
            render (_: any, record: InstoreMeterData) {
                return (
                    <>
                        {record.IF_USED === '1' ? <span style={{ color: '#0000ff' }}>YES</span> : <span style={{ color: '#ff0000' }}>NO</span>}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
            width: 150,
        },
        {
            title: Mes['titleTableMetertypemetertype'],
            dataIndex: 'METER_MODEL_NAME',
        },
        {
            title: Mes['titleTableModuleversionmoduleversion'],
            dataIndex: 'MODULE_FW_VERSION',
            width: 120,
        },
        {
            title: Mes['titleTableSoftversionsoftversion'],
            dataIndex: 'SOFT_VERSION',
            width: 120,
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
            title: Mes['titleTableProduceddateproduceddate'],
            dataIndex: 'OPERATE_DATE',
            width: 100,
            render (_: any, record: InstoreMeterData) {
                return (
                    <>
                        <span>{ record.OPERATE_DATE.substr(0, 10)}</span>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableTblcaozuoyuantblcaozuoyuan'],
            dataIndex: 'OPERATOR_NAME',
            width: 150,
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'MODIFY_TIME',
            width: 100,
            sorter: (a: InstoreMeterData, b: InstoreMeterData) => Date.parse(a.MODIFY_TIME) - Date.parse(b.MODIFY_TIME),
            render (_: any, record: InstoreMeterData) {
                return (
                    <>
                        <span>{ record.MODIFY_TIME.substr(0, 10)}</span>
                    </>
                );
            },
        },

    ];

    // SGC table列设置
    const SGCColumns = [
        {
            title: Mes['titleTableSgcnumbersgcnumber'],
            dataIndex: 'SGC_NO',
        },
        {
            title: Mes['titleTableSgcnamesgcname'],
            dataIndex: 'SGC_NAME',
        },
        {
            title: Mes['titleTableGridkeytypegridkeytype'],
            dataIndex: 'SGC_TYPE',
        },
        {
            title: Mes['titleTableKeykrnkeykrn'],
            dataIndex: 'KEY_KRN',
        },
        {
            title: Mes['titleTableKeykenkeyken'],
            dataIndex: 'KEY_KEN',
        },
        {
            title: Mes['titleTableDkgadkga'],
            dataIndex: 'DKGA',
        },
        {
            title: Mes['titleTableGridkeyvaluegridkeyvalue'],
            dataIndex: 'KEY_VALUE',
        },

    ];

    // table分页设置
    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            setSelectedRowKeys([]);
            meterIds = [];
            meterNos = [];
            getInstoreMeterList(page, pageSize);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: 20,
        showSizeChanger: false,
    };

    // table行选择设置
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: InstoreMeterData[]) => {
            setSelectedRowKeys(keys);
            meterIds = [];
            meterNos = [];
            if (selectedRows.length > 0) {
                selectedRows.forEach((v:InstoreMeterData) => {
                    meterNos.push(v.METER_NO);
                    meterIds.push(v.METER_GUID_NO);
                });
            }
        },
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
                showMeterAdd();
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
        {
            type: 'CostomerAdd',
            btnType: 'primary',
            title: Mes['titleDialogAddcustomeraddcustomer'],
            onClick () {
                showCustomAdd();
            },
        },

    ];

    const onExpand = (expandedKeys: any[]) => {
        // console.log(expandedKeys);
        setExpandedList(expandedKeys);
    };

    useEffect(() => {
        getBatchList();
        getInstoreMeterList();
        getBaseTypeList();
        getFactoryList();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 350);
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title' style={{height: '50px'}}>
                <h4>{Mes['menuTitleMeterInWareHouse']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={20}>
                    <Col span={5}>
                        <Select defaultValue={searchType} style={{ width: '100%' }} onSelect={ onSelectSearchType}>
                            <Option value='BATCH_NO'>{ Mes['titleTableBatchnobatchno']}</Option>
                            <Option value='DB_DOT'>{ Mes['titleTableBatchnamebatchname']}</Option>
                            <Option value='METER_NO'>{ Mes['titleTableMeternometerno']}</Option>
                        </Select>
                    </Col>
                    <Col span={5}><Search enterButton onSearch={onSearch} onChange={ changeSearch}/></Col>
                    <Col span={10} className='flex flexBetween'>
                        <BtnList btnList={btnList} />
                        {/* <Button type='primary' icon={<PlusSquareOutlined />} onClick={() => {showBatchAdd();}}>{Mes['btnMeteraddallmeteraddall']}</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={() => {showMeterAdd();}}>{Mes['btnTitleAdd']}</Button>
                        <Button type='primary' icon={<FormOutlined />} onClick={() => {showEditVersion();}}>{Mes['btnMeterupdateeditstatusmeterupdateeditstatus']}</Button>
                        <Button type='primary' icon={<DeleteOutlined />} onClick={() => {showBatchDel();}}>{Mes['btnMeterdelallmeterdelall']}</Button>
                        <Button type='primary' icon={ <EditOutlined />} onClick={() => {showEditStatus();}}>
                            {Mes['btnMetereditstatusmetereditstatus']}
                        </Button>
                        <Button type='primary' icon={ <CloseCircleOutlined />} onClick={() => {showDeleteConfirm();}}>
                            {Mes['btnTitleDelete']}
                        </Button>
                        <Button type='primary' icon={<UserAddOutlined />} onClick={() => {showCustomAdd();}}>{Mes['titleDialogAddcustomeraddcustomer']}</Button> */}
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
                            onExpand={onExpand}
                            style={{overflowY: 'auto'}}
                        />
                    </Col>
                    <Col span={18} style={{border: '1px solid #ccc', marginLeft: '5px', height: tableHeight + 100}}>
                        <Table columns={detailColumns} dataSource={meterList} loading={loading} pagination={pagination} style={{ width: '100%' }} scroll={{y: tableHeight}}
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
                                        meterNos.splice(index, 1);
                                        meterIds.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                        meterNos.push(record.METER_NO);
                                        meterIds.push(record.METER_GUID_NO);
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
                                <Form.Item name='meterNoMode' label={Mes['titleLabelMeternomodemeternomode']} rules={[ { required: true } ]}>
                                    <Select disabled={isMeterAdd} onSelect={ onSelectNoMode}>
                                        <Option value='1'>{Mes['comboboxCheckbitcheckbit']}</Option>
                                        <Option value='0'>{Mes['comboboxNocheckbitnocheckbit'] }</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='meterNoLength' label={Mes['titleLabelMeternolengthmeternolength']} rules={[ { required: true } ]}>
                                    <Select disabled={isMeterAdd} onSelect={ updateMaxMeterNo}>
                                        {meterLengthList && meterLengthList.map((v: string) => (<Option key={ v} value={ v}>{ v}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

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
                                <Form.Item name='meterFac' label={Mes['titleLabelMeterfactorymeterfactory']} rules={[ { required: true } ]}>
                                    <Select disabled={isMeterAdd} onSelect={ updateMaxMeterNo}>
                                        {factoryList && factoryList.map((v: MeterFactory) => (<Option key={ v.FACTORY_NO} value={ v.FACTORY_NO}>{ v.FACTORY_SHORTNAME}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='meterSort' label={Mes['titleLabelMetersortmetersort']} rules={[ { required: true } ]}>
                                    <Select disabled={ isMeterAdd} onSelect={ onSelectBaseType}>
                                        {baseTypeList && baseTypeList.map((v: MeterBaseType) => (<Option key={ v.SN} value={ v.SN}>{ v.METER_BASE_NAME}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='meterType' label={Mes['titleTableMetertypemetertype']} rules={[ { required: true } ]}>
                                    <Select disabled={isMeterAdd} onSelect={ updateBatchName}>
                                        {registerList && registerList.map((v: MeterRegisterType) => (<Option key={ v.METER_MODEL_SYS_NO} value={ v.METER_MODEL_SYS_NO}>{ v.METER_MODEL_NAME}</Option>))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='start_date' label={Mes['titleLabelProducdateproducdate']} rules={[ { required: true } ]}>
                                    <DatePicker style={{ width: '100%' }} disabled={isMeterAdd} onChange={changeDate} format='YYYY-MM-DD'/>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isCustomAdd ? 'none' : ''}}>
                                <Form.Item name='start_sn' label={Mes['titleLabelStartmetersnstartmetersn']}
                                    rules={[ { required: !isCustomAdd, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                    <Input maxLength={maxMeterNo} onBlur={ onChangeStartSN}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isCustomAdd ? 'none' : ''}}>
                                <Form.Item name='end_sn' label={Mes['titleLabelEndmetersnendmetersn']}
                                    rules={[ { required: !isCustomAdd, pattern: new RegExp(/^[1-9]\d*$/, 'g'), message: Mes['messageAlarmPleaseenterintegerpleaseenterinteger'] } ]}>
                                    <Input maxLength={maxMeterNo} onBlur={ onChangeEndSN}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='module_fw_version' label={Mes['titleTableModuleversionmoduleversion']}>
                                    <Input maxLength={ 20} disabled={ isMeterAdd}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item name='soft_version' label={Mes['titleTableSoftversionsoftversion']}>
                                    <Input maxLength={ 20} disabled={ isMeterAdd}></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isCustomAdd ? 'none' : ''}}>
                                <Form.Item name='start_no' label={Mes['titleLabelStartmeternostartmeterno']} rules={[ { required: !isCustomAdd } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isCustomAdd ? 'none' : ''}}>
                                <Form.Item name='end_no' label={Mes['titleLabelEndmeternoendmeterno']} rules={[ { required: !isCustomAdd } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isStsMeter ? '' : 'none'}}>
                                <Form.Item name='EA' label={Mes['titleTableMetereameterea']} rules={[ { required: isStsMeter } ]}>
                                    <Select>
                                        <Option value='07'>07</Option>
                                        <Option value='11'>11</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isStsMeter ? '' : 'none'}}>
                                <Form.Item name='NumTokens' label={Mes['titleLableMeterNumTokensnumtokens']} rules={[ { required: isStsMeter } ]}>
                                    <Select>
                                        <Option value='2'>2</Option>
                                        <Option value='3'>3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isStsMeter ? '' : 'none'}}>
                                <Form.Item name='encryptionType' label={Mes['titleLabelWithhardwaremodulewithhardwaremodule']} rules={[ { required: isStsMeter } ]}>
                                    <Select onSelect={ onSelectEncryptionType}>
                                        <Option value='1'>YES</Option>
                                        <Option value='0'>NO</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isStsMeter ? '' : 'none'}}>
                                <Form.Item name='ComposeNo' label={Mes['titleTableSgcnumbersgcnumber']} rules={[ { required: isStsMeter } ]}>
                                    <Select dropdownRender={() => (
                                        <div>
                                            <Table dataSource={ SGCList} columns={ SGCColumns} size='small' rowKey='SGC_NO'></Table>
                                        </div>
                                    )}>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} style={{display: isCustomAdd ? 'none' : ''}}>
                                <Form.Item name='totalMeter' label={Mes['titleTableTotalmeternumtotalmeternum']} rules={[ { required: !isCustomAdd } ]}>
                                    <Input disabled></Input>
                                </Form.Item>
                            </Col>

                            <Col span={24} style={{display: isCustomAdd ? '' : 'none'}}>
                                <Form.Item name='meterNoList' label={Mes['titleTableMeterNoListmeternolist']} rules={[ { required: isCustomAdd } ]}>
                                    <TextArea rows={4} style={{width: '100%'}}></TextArea>
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
}))(MeterInWareHouse);
