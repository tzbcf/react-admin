// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import SearchList, { SRef } from 'src/components/business/searchList';
import useFetchState from 'src/utils/useFetchState';
import { MeasurePointInfoData } from 'src/api/customer&Device/measurePointMgnt/type';
import { Table, Row, Col, Pagination, Typography, Form, Popconfirm, message } from 'antd';
import { PaginationConfig } from 'src/api/types';
// import { ColumnsType } from 'antd/es/table';
import EditableCell from 'src/components/common/editableCell';
import { customer } from 'src/api';
import { BtnConfig } from 'src/components/common/btnList';
import { abnormalFn } from 'src/utils/function';
import UploadModal, { URef } from 'src/components/business/uploadModal';
type Props = {
  Mes: LangMessage;
  subSysNo: string;
  nodeNo: string;
}
const MeasurePointMgnt: React.FC<Props> = (props) => {
    const { Mes } = props;
    const sRef = useRef<SRef>();
    const uRef = useRef<URef>();
    const [ form ] = Form.useForm();
    const ROWS = 10;
    const INITPAGING = {
        page: 1,
        pageSize: ROWS,
    };
    // table数据
    const [ tableData, setTableData ] = useFetchState<MeasurePointInfoData[]>([]);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ searchVal, setSearchVal ] = useFetchState<Object>({});
    const [ editingKey, setEditingKey ] = useFetchState<string>('');
    // 设置搜索组件的属性，需要查找的项
    const searchColumns = [
        {
            name: 'custName',
            col: 4,
            type: 'Input',
            attr: {
                placeholder: 'Customer Name',
            },
        },
        {
            name: 'sectionName',
            col: 4,
            type: 'Input',
            attr: {
                placeholder: 'Feeder Name',
            },
        },
        {
            name: 'meterNo',
            type: 'Input',
            col: 4,
            attr: {
                placeholder: 'Meter No',
            },
        },
        {
            name: 'measurepointNo',
            type: 'Input',
            col: 4,
            attr: {
                placeholder: 'Measurepoint No',
            },
        },
    ];

    // 获取数据, 由于后端接口不是必传的字段需要为空传，否则报错或无法获取数据
    const getData = async (pages: PaginationConfig, query: Object = {}) => {
        setLoading(true);
        setEditingKey('');
        const params = {
            page: pages.page,
            rows: pages.pageSize,
            status: '1',
            custName: '',
            sectionName: '',
            meterNo: '',
            measurepointNo: '',
            sqlSort: 'MP.CREATE_TIME',
            sqlOrder: 'DESC',
            ...searchVal,
            ...query,
        };
        const res = await customer.measurePoint.getMeasurePointList(params);

        setTableTotal(res.total);
        setCurrent(pages.page);
        setTableData(res.rows);
        setLoading(false);
    };

    const isEditing = (record: MeasurePointInfoData) => record.JLD_GUID === editingKey;
    // 保存表单修改
    const saveEdit = async (record: MeasurePointInfoData) => {
        try {
            const rows = await form.validateFields() as MeasurePointInfoData;

            console.log('s-----');
            const res = await customer.measurePoint.updateMeasurePoint({
                address: rows.ADDRESS,
                'customer_NAME': rows.CUSTOMER_NAME,
                'jld_GUID': record.JLD_GUID,
                'meter_NO': rows.METER_NO,
                remark: rows.REMARK,
            });

            if (res.flag) {
                getData({page: current, pageSize: ROWS});
                setEditingKey('');
            } else {
                message.error(res.mess || Mes['messageErrorSavefailuresavefailure']);
            }
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageErrorSavefailuresavefailure']);
        }
    };
    const cancel = () => {
        setEditingKey('');
    };
    const edit = (record: MeasurePointInfoData) => {
        form.setFieldsValue(record);
        setEditingKey(record.JLD_GUID);
    };
    // 表单配置
    const columns = [
        {
            title: Mes['measurepointTitleTableMeasurepointnomeasurepointno'],
            dataIndex: 'REMARK',
            editable: true,
        },
        {
            title: Mes['titleTableDstaddressdstaddress'],
            dataIndex: 'ADDRESS',
            sorter: (a:MeasurePointInfoData, b:MeasurePointInfoData) => parseInt(a.ADDRESS, 10) - parseInt(b.ADDRESS, 10),
            editable: true,
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
            editable: true,
        },
        {
            title: Mes['titleTableGridcustomernamegridcustomername'],
            dataIndex: 'CUSTOMER_NAME',
            sorter: (a: MeasurePointInfoData, b: MeasurePointInfoData) => parseInt(a.CUSTOMER_NAME, 10) - parseInt(b.CUSTOMER_NAME, 10),
            editable: true,
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
        },
        {
            title: Mes['titleTableCreatetimecreatetime'],
            dataIndex: 'OPERATE_DATE',
            sorter: (a:MeasurePointInfoData, b:MeasurePointInfoData) => parseInt(a.OPERATE_DATE, 10) - parseInt(b.OPERATE_DATE, 10),
        },
        {
            title: Mes['titleTableModifytimemodifytime'],
            dataIndex: 'MODIFY_TIME',
            sorter: (a:MeasurePointInfoData, b:MeasurePointInfoData) => parseInt(a.MODIFY_TIME, 10) - parseInt(b.MODIFY_TIME, 10),
        },
        {
            title: Mes['titleTableRemoteoperateremoteoperate'],
            dataIndex: '',
            render (_: any, record: MeasurePointInfoData) {
                const editable = isEditing(record);

                return editable ? (
                    <span>
                        <Typography.Link onClick={() => saveEdit(record)} style={{ marginRight: 8 }}>{Mes['btnSavesave']}</Typography.Link>
                        <Popconfirm title={ Mes['messageTitleSureCancel']} onConfirm={cancel}>
                            <a>{Mes['btnCancelcancel']}</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>{ Mes['titleLabelEditedit']}</Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: MeasurePointInfoData) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                Mes: Mes,
                editing: isEditing(record),
            }),
        };
    });
    // 分页组件配置
    const pagination = {
        total: tableTotal,
        onChange (page: number) {
            getData({ page, pageSize: ROWS });
            cancel();
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showTotal: (total: number) => `Total ${total} items`,
        showSizeChanger: false,
    };
    // 搜索方法
    const searchFinsh = async (val: any) => {
        setSearchVal({
            ...searchVal,
            ...val,
        });
        getData(INITPAGING, val);
    };
    // 重置搜索条件
    const initSearch = () => {
        const initVal = {
            custName: '',
            sectionName: '',
            meterNo: '',
            measurepointNo: '',
        };

        setSearchVal(initVal);
        getData(INITPAGING, initVal);
    };

    // table某个字段排序
    const tableChange = (...val: any[]) => {
        let order = '';
        let key = '';

        if (val[2].field && val[2].order) {
            key = val[2].field;

            if (val[2].order === 'ascend') {
                order = 'ASC';
            }
            if (val[2].order === 'descend') {
                order = 'DESC';
            }
            if (key === 'OPERATE_DATE') {
                key = 'MP.CREATE_TIME';
            }
            getData(INITPAGING, {
                sqlSort: key,
                sqlOrder: order,
            });
        } else {
            getData(INITPAGING);
        }
        setSearchVal({
            ...searchVal,
            ...{
                sqlSort: key,
                sqlOrder: order,
            },
        });
    };

    // 导入导出
    const btnList:BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            title: 'Add',
            async onClick () {
                console.log('a-----');
                uRef.current?.openModel();
            },
        },
        {
            type: 'Download',
            btnType: 'primary',
            title: 'Export',
            async onClick () {
                abnormalFn(async () => {
                    const val = await sRef.current?.getFormData();

                    // eslint-disable-next-line max-len
                    window.location.href = `/v1/measure-point/export?custName=${val.custName || ''}&sectionName=${val.sectionName || ''}&meterNo=${val.meterNo || ''}&measurepointNo=${val.measurepointNo || ''}&date=${new Date()}`;
                    console.log('b-----', val);
                });
            },
        },
    ];

    const downExcel = () => {
        window.location.href = '/v1/measure-point/export';
    };

    const saveUpload = async () => {
        console.log('asd-a-');
    };

    useEffect(() => {
        getData(INITPAGING);
    }, []);

    return (
        <>
            <div className='customerMgnt'>
                <Row gutter={24}>
                    <h4 className='title'>{Mes['menuTitleMeasurePointManagement']}</h4>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <SearchList
                            cRef={sRef}
                            columns={searchColumns}
                            onFinish={searchFinsh}
                            resetFn={initSearch}
                            btnConfig={{
                                col: 4,
                                btnList: btnList,
                            }}
                        />
                    </Col>
                </Row>
                <div className='table'>
                    <Form form={form} component={false}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            dataSource={tableData}
                            pagination={false}
                            columns={mergedColumns}
                            loading={loading}
                            onChange={tableChange}
                            rowKey='JLD_GUID'
                        />
                    </Form>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <UploadModal
                uRef={uRef}
                title={Mes['titleExcelimportexcelimport']}
                downEvent={downExcel}
                onfinish={saveUpload} />
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo?.sysUser?.nodeNo,
}))(MeasurePointMgnt);
