// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, Table, Button, Input, message, Modal, Pagination } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CommandList, CommandData, CommandParams, UpdateCommand } from 'src/api/basicData/commandScheme/types';
import useFetchState from 'src/utils/useFetchState';
import { basicData } from 'src/api';
import AddLangElment, { CRef } from 'src/components/business/addRowCom';
import {EditOutlined, DeleteOutlined } from '@ant-design/icons';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

const CommandScheme: React.FC<Props> = (props) => {
    const { Mes } = props;
    const { Search } = Input;
    const [ commandList, setCommandList ] = useFetchState<CommandData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ commandId, setCommandId ] = useFetchState<string>('');
    const cRef = useRef<CRef>();


    const getCommandList = (page: number = 1, rows: number = 20, name?: string) => {
        setLoading(true);
        const params: CommandParams = {
            page: page,
            rows: rows,
            schemeName: name,
        };

        basicData.commandScheme.commandList(params).then((res:CommandList) => {
            setTotal(res.total);
            setCommandList(res.rows);
            setLoading(false);
            setCurrent(page);
        })
            .catch((error) => {
                message.error(error);
                setLoading(false);
            });
    };

    const showDeleteConfirm = (data:CommandData) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: Mes['messageConfirmSuredeleterecordsuredeleterecord'].replace('(s)', '(' + data.SCHEME_NAME + ')'),
            onOk () {
                const params: any = {
                    id: data.SCHEME_GUID,
                };

                basicData.commandScheme.deleteCommand(params).then(() => {
                    message.success(Mes['messageSuccessDeletesuccessdeletesuccess']);
                    getCommandList();
                })
                    .catch((err) => {
                        message.error(err);
                    });
            },
            onCancel () {
                console.log('Cancel');
            },
        });
    };

    const showModal = (data?: CommandData) => {
        let val:any = {};

        if (data) {
            setCommandId(data.SCHEME_GUID);
            val = {
                schemeName: data.SCHEME_NAME,
                enabled: data.IS_ENABLE,
            };
            cRef.current?.openModel(val, Mes['titleLabelEditedit']);
        } else {
            setCommandId('');
            val = {
                schemeName: '',
                enabled: '1',
            };
            cRef.current?.openModel(val, Mes['titleLabelAddadd']);
        }
    };

    const columns = [
        {
            title: Mes['tableTitleSequence'],
            dataIndex: 'rn__',
            width: 150,
        },
        {
            title: Mes['titleTableSchemenameschemename'],
            dataIndex: 'SCHEME_NAME',
        },
        {
            title: Mes['titleTableOperenableoperenable'],
            dataIndex: 'IS_ENABLE',
            render (_: any, record: CommandData) {
                return (
                    <>
                        { record.IS_ENABLE === '1' ? <span>YES</span> : <span>NO</span>}
                    </>
                );
            },
        },
        {
            title: Mes['titleTableTblcaozuoyuantblcaozuoyuan'],
            dataIndex: 'OPERATOR',
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            className: 'flex flexBetween',
            width: 100,
            render (_: any, record: CommandData) {
                return (
                    <>
                        <Button type='primary' onClick={() => {showModal(record);}} title={Mes['btnTitleEditor']} icon={ <EditOutlined />}>

                        </Button>
                        <Button type='default' danger onClick={() => {showDeleteConfirm(record);}} title={Mes['btnTitleDelete']} icon={<DeleteOutlined /> }>

                        </Button>
                    </>
                );
            },
        },
    ];

    const onSearch = (value:string) => {
        getCommandList(1, 20, value);
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            getCommandList(page, pageSize);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: 10,
        showSizeChanger: false,
    };

    const saveData = async (row: any): Promise<any> => {
        if (commandId) {
            const params: UpdateCommand = {
                schemeName: row.schemeName,
                enabled: row.enabled,
                schemeGuid: commandId,
            };

            basicData.commandScheme.updateCommand(params).then(() => {
                getCommandList();
                message.success(Mes['messageSuccessModifysuccessmodifysuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        } else {
            const params: UpdateCommand = {
                schemeName: row.schemeName,
                enabled: row.enabled,
            };

            basicData.commandScheme.addCommand(params).then(() => {
                getCommandList();
                message.success(Mes['messageSuccessSavesuccesssavesuccess']);
            })
                .catch((err) => {
                    message.error(err);
                });
        }
    };

    const addOpt = [
        {
            type: 'Input',
            label: 'titleTableSchemenameschemename',
            name: 'schemeName',
            rules: [ { required: true } ],
            col: 20,
            attr: {
                type: 'text',
                maxLength: 20,
            },
        },

        {
            type: 'Select',
            label: 'comboboxEnabledenabled',
            name: 'enabled',
            rules: [ { required: true } ],
            col: 20,
            options: [ { name: 'YES', value: '1' }, {name: 'NO', value: '0'} ],
        },

    ];

    // 添加表单属性设置
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    // 弹窗参数设置
    const modelOpt = {
        title: 'btnTitleAdd',
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

    useEffect(() => {
        getCommandList();
    }, []);


    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleCommandScheme']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={20}>
                    <Col span={6}><Search enterButton placeholder={Mes['titleTableSchemenameschemename']} onSearch={ onSearch}/></Col>
                    <Col span={6}><Button type='primary' icon={<PlusOutlined />} onClick={() => {showModal();}} title={Mes['btnTitleAdd']}></Button></Col>
                </Row>
                <div className='table'>
                    <Table columns={columns} rowKey='rn__' dataSource={commandList} loading={loading} pagination={ false}
                        size='small'
                        onRow={() => ({
                            onDoubleClick: () => {
                                console.log('double');

                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>

                <AddLangElment
                    cRef={cRef}
                    saveData={saveData}
                    formOption={formOpt}
                    modelOpt={modelOpt}
                    Mes={Mes}
                />
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(CommandScheme);
