/*
 * FileName : dcuGroupMgnt.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-17 10:49:00
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { Row, Col, Select, Input, message } from 'antd';
import TransferTable, { PaginationConfig, CRef, arrFormat } from 'src/components/business/transfer';
import { CstGroupMeterList } from 'src/api/customer&Device/dcuMgnt/type';
import useFetchState from 'src/utils/useFetchState';
import { customer, basicData } from 'src/api';
import { LangMessage } from 'src/store/common/language';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import AddRowCom, { CRef as ARef } from 'src/components/business/addRowCom';
import { ColumnsType } from 'antd/es/table';
import { connect } from 'react-redux';
import { deepClone } from 'src/utils/utils';
import { resCastOption, OptGroupList } from 'src/utils/function';
import UploadModal, { URef } from 'src/components/business/uploadModal';
import { RcFile } from 'antd/es/upload/interface';
const { Option, OptGroup } = Select;
const { Search } = Input;

import './index.less';

type SelectType = {
    value: string;
    name: string;
}

type QueryParams = {
    'group_id': string;
    'dst_addr': string;
    'dst_id': string;
}

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    nodeNo: string;
}

const DcuGroupMgnt: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;
    const cRef = useRef<CRef>();
    const aRef = useRef<ARef>();
    const uRef = useRef<URef>();
    const ROWS = 10;
    const INITPAGING = {
        page: 1,
        pageSize: ROWS,
    };
    const [ defaultKey, setDefaultKey ] = useFetchState<QueryParams>({
        'group_id': '',
        'dst_addr': '',
        'dst_id': '',
    });

    // 表计分组设置下拉
    const [ groupOpt, setGroupOpt ] = useFetchState<OptGroupList[]>([]);
    // 线路下拉
    const [ dstOpt, setDstOpt ] = useFetchState<OptGroupList[]>([]);
    // 添加弹窗分组下拉
    const [ modalGroupOpt, setModalGroupOpt ] = useFetchState<SelectType[]>([]);
    const groupColumns: ColumnsType<CstGroupMeterList> = [
        {
            title: 'Transformer',
            dataIndex: 'DST_NAME',
        },
        {
            title: 'DCU Address',
            dataIndex: 'CST_ADDR',
        },
        {
            title: 'Group Name',
            dataIndex: 'CLASSICAL_DETAIL_NAME',
        },
    ];

    // 获取左边Table数据
    const gainLeftNoGroupMeter = async (page: PaginationConfig, query: Object = {}) => {
        const param = {
            page: page.page,
            rows: page.pageSize,
            dstId: defaultKey['dst_id'],
            groupId: defaultKey['group_id'],
            deviceAddr: defaultKey['dst_addr'],
            subSysNo,
            ...query,
        };

        return await customer.dcuMgnt.getNoGroupCst(param);
    };

    // 获取右边Table的数据
    const gainRightGroupMeter = async (page: PaginationConfig, query: Object = {}) => {
        const param = {
            page: page.page,
            rows: page.pageSize,
            dstId: defaultKey['dst_id'],
            groupId: defaultKey['group_id'],
            subSysNo,
            deviceAddr: defaultKey['dst_addr'],
            ...query,
        };

        return await customer.dcuMgnt.getGroupCst(param);

    };

    // 切换设置数据
    const getTableData = async (query: Object = {}) => {
        cRef.current?.setLeftLoading(true);
        cRef.current?.setRightLoading(true);
        const resData = await Promise.all([
            gainLeftNoGroupMeter(INITPAGING, query),
            gainRightGroupMeter(INITPAGING, query),
        ]);

        cRef.current?.setLeftData({ rows: resData[0].rows, total: resData[0].total });
        cRef.current?.setRightData({ rows: resData[1].rows, total: resData[1].total });
        cRef.current?.setLeftLoading(false);
        cRef.current?.setRightLoading(false);
    };

    // 分组change事件
    const selectGroupChange = async (val: string) => {
        const selKey = deepClone(defaultKey);

        selKey['group_id'] = val;
        setDefaultKey(selKey);
        await getTableData({
            groupId: val,
        });
    };

    // 线路change事件
    const selectDstChange = async (val: string) => {
        const selKey = deepClone(defaultKey);

        selKey['dst_id'] = val;
        setDefaultKey(selKey);
        await getTableData({
            dstId: val,
        });
    };


    // 打开弹窗
    const openAddModal = async () => {
        let resOpt = modalGroupOpt;

        if (!resOpt.length) {
            const res = await customer.meterMgnt.getClassicalJson(subSysNo);

            resOpt = res.map((v) => ({ value: v.CLASSICAL_GUID, name: v.CLASSICAL_NAME }));

            setModalGroupOpt(resOpt);
        }
        const initVal = {
            'sys_classical': resOpt[0].value,
            isEnable: '1',
        };

        aRef.current?.openModel(initVal);
    };

    // 按钮事件
    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            onClick () {
                openAddModal();
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            onClick () {
                console.log('c--------');
                uRef.current?.openModel();
            },
        },
    ];

    // 左移
    const btnL = async (keys?:string[]) => {
        const rightSelectKeys = keys && keys.length ? keys : cRef.current?.getRightSelectKeysList() || [];

        if (!rightSelectKeys?.length) {
            return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
        }
        const rightData = cRef.current?.getRightTableData() || [];
        const rightSelectData = arrFormat(rightData, rightSelectKeys, 'CST_ID', false);
        const params = {
            leftRowList: JSON.stringify(rightSelectData),
            rowList: JSON.stringify([]),
            classicalDetailGuid: defaultKey.group_id,
        };
        const res = await customer.dcuMgnt.saveGroupList(params);

        console.log('-------', res);

        await getTableData(defaultKey);
    };
    // 右移
    const btnR = async (keys?:string[]) => {
        const leftSelectKeys = keys && keys.length ? keys : cRef.current?.getLeftSelectKeysList() || [];

        if (!leftSelectKeys.length) {
            return message.warning(Mes['messageAlarmSelectdcuselectdcu']);
        }
        const leftData = cRef.current?.getLeftTableData() || [];
        const leftSelectData = arrFormat(leftData, leftSelectKeys, 'CST_ID', false);
        const params = {
            leftRowList: JSON.stringify([]),
            rowList: JSON.stringify(leftSelectData),
            classicalDetailGuid: defaultKey.group_id,
        };
        const res = await customer.dcuMgnt.saveGroupList(params);

        console.log('-------', res);

        await getTableData(defaultKey);
    };

    const getCstConfig = async () => {
        try {

            const res = await Promise.all([
                customer.meterMgnt.getMeterGroup(),
                basicData.transformMgt.getDstList({
                    subSysNo,
                    nodeNo,
                    sectionId: '',
                }),
            ]);

            defaultKey['group_id'] = res[0][0].CLASSICAL_DETAIL_GUID;
            defaultKey['dst_id'] = res[1][0].ID;
            setDefaultKey(defaultKey);
            setDstOpt(resCastOption(res[1]));
            setGroupOpt(resCastOption(res[0]));
            const query = {
                dstId: defaultKey['dst_id'],
                groupId: defaultKey['group_id'],
            };

            await getTableData(query);
        } catch (error: any) {
            message.error(error.toString());
            setGroupOpt([]);
            setDstOpt([]);
        }
    };

    const dcuAdressChange = async (val: string) => {
        const selKey = deepClone(defaultKey);

        selKey['dst_addr'] = val;
        await getTableData({
            'dst_addr': val,
        });
    };


    // 添加参数配置
    const addOpt = [
        {
            type: 'Select',
            label: 'titleLabelClassificationnameclassificationname',
            name: 'sys_classical',
            rules: [ { required: true } ],
            attr: {},
            col: 12,
            options: modalGroupOpt,
        },
        {
            type: 'Input',
            label: 'titleLabelCodenamecodename',
            name: 'classicalDetailName',
            rules: [ { required: true }, {min: 1}, {max: 20} ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'titleLabelCodenocodeno',
            name: 'classicalDetailNo',
            rules: [ { required: true }, {min: 1}, {max: 20} ],
            col: 12,
            attr: {
                type: 'text',
            },
        },
        {
            type: 'Select',
            label: 'comboboxEnabledenabled',
            name: 'isEnable',
            col: 12,
            options: [
                {
                    value: '1',
                    name: Mes['titleTableYesyes'],
                },
                {
                    value: '0',
                    name: Mes['titleTableNono'],
                },
            ],
        },
    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    };

    // 添加表单参数配置
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    // model参数设置
    const modelOpt = {
        title: 'titleLabelAddclassificationdetailaddclassificationdetail',
        width: 800,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };

    // 增加保存分组
    const saveData = async (value: any) => {
        try {
            const res = await customer.meterMgnt.saveGroupClassical({
                ...value,
                subSysNo,
            });

            if (!parseInt(res.flag, 10)) {
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
                const groupRes = await customer.meterMgnt.getMeterGroup();

                setGroupOpt(resCastOption(groupRes));
            } else {
                message.error(res.mes);
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    // 下载模板
    const downExcel = () => {
        window.location.href = '/v1/amr/excelTemplate/dcuGroupTemplate.xlsx';
    };

    // 保存上传
    const saveUpload = async (file: RcFile| null) => {
        console.log('--v----');
        try {
            if (file) {
                console.log(file);
            } else {
                message.warning(Mes['messageWarnSelectFile']);
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };

    useEffect(() => {
        getCstConfig();
    }, []);

    return (<div className='dcuGroupMgnt'>
        <Row gutter={24} className='condition'>
            <Col span={4}>
                <Select value={defaultKey.group_id} onChange={selectGroupChange}>
                    {
                        groupOpt.map((v) => (
                            <OptGroup label={v.label} key={v.label}>
                                {
                                    v.children && v.children.map((item) => (
                                        <Option value={item.value} key={item.value}>{item.name}</Option>
                                    ))
                                }
                            </OptGroup>
                        ))
                    }
                </Select>
            </Col>
            <Col span={4}>
                <Select value={defaultKey.dst_id} onChange={selectDstChange}>
                    {
                        dstOpt.map((v) => (
                            <OptGroup label={v.label} key={v.label}>
                                {
                                    v.children && v.children.map((item) => (
                                        <Option value={item.value} key={item.value}>{item.name}</Option>
                                    ))
                                }
                            </OptGroup>
                        ))
                    }
                </Select>
            </Col>
            <Col span={4}>
                <Search placeholder='DCU Adress' onSearch={dcuAdressChange} />
            </Col>
            <Col span={4}>
                <BtnList btnList={btnList} />
            </Col>
        </Row>
        <Row gutter={24} className='transfer'>
            <Col span={24}>
                <TransferTable<CstGroupMeterList, CstGroupMeterList>
                    rowKey={'CST_ID'}
                    leftColumns={groupColumns}
                    rightColums={groupColumns}
                    leftGetData={ gainLeftNoGroupMeter }
                    rightGetData={gainRightGroupMeter}
                    btnEvent={{
                        btnL: btnL,
                        btnR: btnR,
                    }}
                    rows={ROWS}
                    cRef={cRef}
                />
            </Col>
        </Row>
        <AddRowCom<void, any>
            cRef={aRef}
            saveData={saveData}
            formOption={formOpt}
            modelOpt={modelOpt}
            Mes={Mes}
        />
        <UploadModal
            uRef={uRef}
            title={Mes['titleExcelimportexcelimport']}
            downEvent={downExcel}
            onfinish={saveUpload} />
    </div>);
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(DcuGroupMgnt);
