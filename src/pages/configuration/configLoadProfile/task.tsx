/*
 * FileName : task.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-15 18:31:57
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
import { SendOutlined } from '@ant-design/icons';
import SearchList, { SRef } from 'src/components/business/searchList';
import {Button, Table, Pagination, message, Modal } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { configuration } from 'src/api';
import { DeviceTypeData, ExcuteCommandResult } from 'src/api/configuration/configLoadProfile/type';
import { CheckCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons/lib/icons';
import CloseCircleTwoTone from '@ant-design/icons/lib/icons/CloseCircleOutlined';
import PlayCircleOutlined from '@ant-design/icons/lib/icons/PlayCircleOutlined';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import FolderOutlined from '@ant-design/icons/lib/icons/FolderOutlined';
import { BtnConfig } from 'src/components/common/btnList';

type Props = {
  Mes: LangMessage;
  subSysNo: string;
  nodeNo: string;
}

const ConfigLoadTask: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;
    const sRef = useRef<SRef>();
    const ROWS = 10;
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ deviceTypeList, setDeviceTypeList ] = useFetchState<DeviceTypeData[]>([]);
    const [ commandResultList, setCommandResultList ] = useFetchState<ExcuteCommandResult[]>([]);
    const [ groupList, setGroupList ] = useFetchState<any[]>([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);
    const [ tableHeight, setTableHeight ] = useFetchState<number>(500);

    const leftColumns = [
        {
            title: Mes['titleTableMetertypemetertype'],
            dataIndex: 'SN_METER_TYPE_NAME',
        },
    ];

    const rightColumns = [
        {
            title: Mes['titleTableStatusstatus'],
            dataIndex: 'IS_SUCCESS',
            render (_: any, record: ExcuteCommandResult) {
                if (record.IS_EXECUTED === '1') {
                    if (record.IS_SUCCESS === '1') {
                        return (<span><CheckCircleTwoTone style={{color: '#52c41a', fontSize: '14px'}}/></span>);
                    } else {
                        return (<span><CloseCircleTwoTone style={{color: '#ff0000', fontSize: '14px'}}/></span>);
                    }
                }
                if (record.IS_EXECUTED === '0') {
                    return (<span><PlayCircleOutlined style={{fontSize: '14px'}}/></span>);
                }
                if (record.IS_EXECUTED === '2') {
                    return (<span><LoadingOutlined style={{fontSize: '14px'}}/></span>);
                }
                if (record.IS_EXECUTED === '9') {
                    return (<span><FolderOutlined style={{fontSize: '14px'}}/></span>);
                }
            },
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableItemnameitemname'],
            dataIndex: 'FN_XUHAO_NAME',
        },
        {
            title: Mes['titleTableObisobis'],
            dataIndex: 'AFN',
        },
        {
            title: Mes['titleTableResultresult'],
            dataIndex: 'RETURN_DATA',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'BUILD_DATE',
        },

    ];


    const getDeviceTypeList = () => {
        configuration.configLoadProfile.getDeviceTypeList('DCU', subSysNo).then((res) => {
            setDeviceTypeList(res);
        });
    };

    const getExcuteCommandList = (page:number = 1) => {
        sRef.current?.getFormData().then((data) => {
            setLoading(true);
            let params = {
                page: page,
                rows: ROWS,
                subSysNo: subSysNo,
                groupSn: data.groupSn,
                meterNo: data.meterNo,
            };

            configuration.configLoadProfile.getExcuteCommandResultList(params).then((res) => {
                setLoading(false);
                setCurrent(page);
                setTableTotal(res.total);
                setCommandResultList(res.rows);
            })
                .catch((err) => {
                    message.error(err);
                    setLoading(false);
                });
        });
    };

    const getGroupList = () => {
        configuration.configLoadProfile.getGroupList(subSysNo).then((res) => {
            if (res.length) {
                let list:any[] = [];

                res.map((v) => {
                    list.push({
                        name: v.GROUP_NAME,
                        value: v.GROUP_ID,
                        key: v.GROUP_ID,
                    });
                });
                setGroupList(list);
                sRef.current?.setFieldsValue({
                    groupSn: list[0].value,
                });
                getExcuteCommandList();
            }
        });
    };

    const getGroupList2 = (groupId:string) => {
        configuration.configLoadProfile.getGroupList2(subSysNo, groupId).then((res) => {
            let result = res.result;

            if (result.length) {
                let list:any[] = [];

                result.map((v) => {
                    list.push({
                        name: v.GROUP_NAME,
                        value: v.GROUP_ID,
                        key: v.GROUP_ID,
                    });
                });
                setGroupList(list);
                sRef.current?.setFieldsValue({
                    groupSn: list[0].value,
                });
                getExcuteCommandList();
            }
        });
    };


    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getExcuteCommandList(page);
        },
        current: current,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: DeviceTypeData[]) => {

            setSelectedRowKeys(keys);
            // meterIds = [];
            // meterNos = [];
            if (selectedRows.length > 0) {
            //     selectedRows.forEach((v:CstData) => {
            //         meterNos.push(v.METER_NO);
            //         meterIds.push(v.METER_GUID_NO);
            //     });
            }
        },
    };

    const selectGroup = (value: string) => {
        console.log(value);
        getExcuteCommandList();
    };

    const searchColumns = [
        {
            name: 'groupSn',
            col: 6,
            type: 'Select',
            options: groupList,
            attr: {
                style: { width: '100%' },
                onSelect: selectGroup,
            },
        },
        {
            name: 'meterNo',
            col: 4,
            type: 'Input',
            label: Mes['titleTableMeternometerno'],
            attr: {
                style: { width: '100%' },
                placeholder: 'Meter No',
            },
        },
    ];


    const btnList: BtnConfig[] = [
        {
            type: 'Restart',
            btnType: 'primary',
            title: 'Re-Excute Failed',
            onClick () {
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    content: 'Are you sure you want to re-execute the failed task?',
                    onOk () {
                        sRef.current?.getFormData().then((data) => {
                            let groupId = data.groupSn;

                            configuration.configLoadProfile.resendCommand(subSysNo, groupId).then((res) => {
                                message.success(Mes['titleLabelBatchtokenstatus1batchtokenstatus1']);
                                getGroupList2(res.param1);
                            })
                                .catch((err) => {
                                    message.error(err);
                                });
                        });
                    },
                    onCancel () {
                        console.log('Cancel');
                    },
                });

            },
        },
    ];

    const btnConfig = {
        col: 2,
        btnList: btnList,
    };

    const searchFinish = (val: any) => {
        console.log(val, subSysNo, nodeNo);
        getExcuteCommandList();
    };

    const batchSendCaptureByMeterType = () => {
        let selectes: any[] = [];

        if (selectedRowKeys.length) {
            deviceTypeList.map((v) => {
                if (selectedRowKeys.includes(v.SN_METER_TYPE_NAME)) {
                    selectes.push({
                        SN: v.SN,
                        SN_PROTOCOL: v.SN_PROTOCOL,
                    });
                }
            });
        }
        let params = {
            meterSnListJson: JSON.stringify(selectes),
            subSysNo: subSysNo,
        };

        configuration.configLoadProfile.batchSendCaptureByMeterType(params).then(() => {
            message.success('Save Success!');
            getGroupList();
        })
            .catch((err) => {
                message.error(err);
            });
    };

    useEffect(() => {
        getDeviceTypeList();
        getGroupList();
        let screenHeight = window.innerHeight;

        setTableHeight(screenHeight - 300);
    }, []);

    return (
        <div className='configureTask'>
            <div className='left'>
                <div className='top'>
                    <Button type='primary' icon={<SendOutlined />} onClick={() => {batchSendCaptureByMeterType();}} title={ Mes['btnSendsend']}/>
                </div>
                <div>
                    <Table columns={leftColumns} dataSource={deviceTypeList} pagination={false} rowKey='SN_METER_TYPE_NAME' scroll={{y: tableHeight}}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}/>
                </div>
            </div>
            <div className='right'>
                <SearchList
                    columns={searchColumns}
                    cRef={sRef}
                    isReset={false}
                    onFinish={searchFinish}
                    btnConfig={ btnConfig}
                />
                <Table
                    columns={rightColumns}
                    dataSource={commandResultList}
                    loading={loading}
                    pagination={false}
                    className='table'
                    rowKey='SN'
                />
                <div className='page'>
                    <Pagination {...pagination} />
                </div>
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(ConfigLoadTask);


