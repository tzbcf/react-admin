/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-13 16:42:47
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useRef, useEffect} from 'react';
import { Table, Button, message, Row, Col } from 'antd';
import SearchList, {SRef} from 'src/components/business/searchList';
import AddLangElment, {CRef} from 'src/components/business/addRowCom';
import { LikeOutlined } from '@ant-design/icons';
// import { deepClone } from 'src/utils/utils';
import { lang } from 'src/api';
import { GetLangRes, AddLangParams } from 'src/api/lang/type';
import useFetchState from 'src/utils/useFetchState';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { BtnConfig } from 'src/components/common/btnList';

const langFormat = (rowObj: any): AddLangParams => {
    const data: AddLangParams = {
        code: rowObj.code,
        fields: [],
    };

    for (const key in rowObj) {
        if (key !== 'code' && rowObj[key]) {
            const obj = {
                content: rowObj[key],
                field: key,
            };

            data.fields.push(obj);
        }
    }
    return data;
};

type Props = {
    Mes: LangMessage
}

const LangManage = (props: Props) => {
    const { Mes } = props;
    // 调用添加弹窗子组件的方法
    const cRef = useRef<CRef>();
    const sRef = useRef<SRef>();
    // 设置table的值
    const [ tableData, setTableData ] = useFetchState<any[]>([]);
    // 设置分页的值
    const [ tableTotal, setTableTotal ] = useFetchState<number>(0);
    // 设置分页的当前页数
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 设置table获取数据Loadin
    const [ loading, setLoading ] = useFetchState<boolean>(true);
    // 获取列表数据
    const getLangList = async (page: number = 1, rows: number = 10, query?: AddLangParams|undefined|null) => {
        try {
            const res = await lang.getLangList({
                code: query ? query.code : '',
                fields: query ? query.fields : [],
                page,
                rows,
            });

            setTableData(res.rows);
            setTableTotal(res.total);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            message.error(error);
        }
    };

    // 设置搜索组件的属性，需要查找的项
    const searchColumns = [
        {
            name: 'code',
            label: 'labelTitleKeyName',
            type: 'Input',
            col: 6,
            attr: {
                placeholder: '请输入key值',
            },
        },
        {
            name: 'fields',
            label: 'labelLangSearch',
            type: 'InputGroup',
            col: 6,
            groupOpt: {
                Select: {
                    name: 'field',
                    options: [
                        {
                            value: 'ZH_CN',
                            name: '中文',
                        },
                        {
                            value: 'EN_US',
                            name: '英语',
                        },
                        {
                            value: 'ES_ES',
                            name: '西班牙语',
                        },
                        {
                            value: 'FR_FR',
                            name: '法语',
                        },
                    ],
                    attr: {
                        placeholder: '请选择',
                    },
                },
                Input: {
                    name: 'content',
                    attr: {
                        placeholder: '请输入搜索内容',
                    },
                },
            },
        },
    ];

    // 搜索方法
    const searchFinsh = async (list: any) => {
        setCurrent(1);
        const params = {
            code: list.code,
            fields: [ {
                content: list.fields?.content || '',
                field: list.fields?.field || '',
            } ],
        };

        await getLangList(1, 10, params);
    };

    // 添加语言打开弹窗
    const addLang = async () => {
        cRef.current?.openModel();
    };

    // 添加某项次数方法
    const addCount = (row: any) => {
        const rowData = tableData.map((v: any) => {
            if (v.sn === row.sn) {
                if (!v.count) {
                    v.count = 1;
                } else {
                    v.count += 1;
                }
            }
            return v;
        });

        setTableData(rowData);
    };

    // 某项设置值
    // const setRow = (row: any) => {
    //     if (tableData.length < 10) { // 如果列表不超过10项，那么在后面添加一项
    //         row.sn = tableData.length + 1;
    //         const newTableData = deepClone(tableData);

    //         newTableData.push(row);
    //         setTableData(newTableData);
    //     }
    // };

    // 保存数据
    const saveData = async (row: GetLangRes): Promise<any> => {
        try {
            const params = langFormat(row);

            await lang.addLang(params);
            message.success('success');
        } catch (e: any) {
            message.error(e.toString());
        }
    };

    // 分页属性设置
    const pagination = {
        total: tableTotal,
        async onChange (page: number, pageSize?: number) {
            setLoading(true);
            const list = await sRef.current?.getFormData();
            let query = null;

            if (list) {
                query = {
                    code: list.code,
                    fields: [ {
                        content: list.fields?.content || '',
                        field: list.fields?.field || '',
                    } ],
                };
            }
            getLangList(page, pageSize, query);
            setCurrent(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: 10,
        showSizeChanger: false,
    };

    // 列表头部设置
    const tableList = [
        {
            title: '属性名',
            dataIndex: 'CODE',
            ellipsis: true,
            width: 200,
        },
        {
            title: '中文',
            dataIndex: 'ZH_CN',
        },
        {
            title: '英语',
            dataIndex: 'EN_US',
        },
        {
            title: '西班牙语',
            dataIndex: 'ES_ES',
        },
        {
            title: '法语',
            dataIndex: 'FR_FR',
        },
        {
            title: '使用次数',
            dataIndex: 'count',
            render (_: any, record: any) {
                return (
                    <>
                        <Button type='text' icon={<LikeOutlined />} onClick={() => addCount(record)}></Button>
                        <span>{ record.count ?? 0 }</span>
                    </>
                );
            },
        },
    ];

    // 添加参数配置
    const addOpt = [
        {
            type: 'Input',
            label: 'labelTitleKeyName',
            name: 'code',
            rules: [ { required: true } ],
            col: 24,
            attr: {
                placeholder: 'test',
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'labelTitleChinese',
            name: 'zh_CN',
            col: 24,
            attr: {
                placeholder: 'test',
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'labelTitleEnglish',
            name: 'en_US',
            col: 24,
            attr: {
                placeholder: 'test',
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'labelTitleSpanish',
            name: 'es_ES',
            col: 24,
            attr: {
                placeholder: 'test',
                type: 'text',
            },
        },
        {
            type: 'Input',
            label: 'labelTitleFrench',
            name: 'FR_FR',
            col: 24,
            attr: {
                placeholder: 'test',
                type: 'text',
            },
        },
    ];
    // 添加表单属性设置
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    // model参数设置
    const modelOpt = {
        title: 'titleAddLang',
        width: 400,
        destroyOnClose: true,
        cancelText: 'titleLabelCloseclose',
        okText: 'btnSubmit',
    };
        // 表单参数
    const formOpt = {
        options: addOpt,
        layout: layout,
    };

    // 按钮列表
    const btnList: BtnConfig[] = [
        {
            type: 'Add',
            btnType: 'primary',
            async onClick () {
                addLang();
            },
        },
        {
            type: 'Template',
            btnType: 'primary',
            async onClick () {
                console.log('a---s---');
            },
        },
        {
            type: 'Import',
            btnType: 'primary',
            async onClick () {
                console.log('a---s---');
            },
        },
    ];

    useEffect(() => {
        getLangList();
    }, []);

    return (
        <div id='langManage'>
            <Row gutter={24} >
                <h4 className='title'>{ Mes['menuTitleLangManage'] }</h4>
            </Row>
            <Row gutter={24}>
                <Col span={24} style={{paddingTop: '12px'}}>
                    <SearchList
                        cRef={sRef}
                        columns={searchColumns}
                        onFinish={searchFinsh}
                        btnConfig={{
                            col: 6,
                            btnList: btnList,
                        }}
                    />
                </Col>
            </Row>
            <div className='table'>
                <Table
                    columns={tableList}
                    pagination={pagination}
                    loading={loading}
                    rowKey={(record, index) => `${index}`}
                    dataSource={tableData}
                    scroll={{ y: 340 }}
                />
            </div>
            <AddLangElment
                cRef={cRef}
                // setData={setRow}
                saveData={saveData}
                formOption={formOpt}
                modelOpt={modelOpt}
                Mes={Mes}
            />
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(LangManage);
