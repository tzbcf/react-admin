/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-30 14:27:03
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { Table, Button, Pagination } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Key } from 'antd/es/table/interface';
import { RightOutlined, LeftOutlined, DoubleRightOutlined, DoubleLeftOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import useFetchState from 'src/utils/useFetchState';
import { deepClone } from 'src/utils/utils';
import './index.less';

export type PaginationConfig = {
    page: number;
    pageSize: number;
};

type SetData = {
    rows: any[];
    total: number;
}

export type CRef = {
    setLeftData: (value: SetData) => void; // 设置左边的值
    setRightData: (value: SetData) => void; // 设置右边的值
    setLeftSelectKeysList: (value: Key[]) => void; // 设置左边选中的值
    setRightSelectKeysList: (value: Key[]) => void; // 设置右边选中的值
    getLeftSelectKeysList: () => Key[]; // 获取左边选中的值
    getRightSelectKeysList: () => Key[]; // 获取右边选中的值
    getRightOverList: () => Key[]; // 获取右移过去的值
    getLeftOverList: () => Key[]; // 获取左移过去的值
    setLeftOverList: (value: Key[]) => void; // 设置左移完成的值
    setRightOverList: (value: Key[]) => void; // 设置右移完成的值
    getLeftTableData: () => any[]; // 获取左边table的数据
    getRightTableData: () => any[]; // 获取右边table的数据
    setLeftCurrent: (val: number) => void; // 左边设置分页的值
    setRightCurrent: (val: number) => void; // 右边设置分页的值
    setLeftLoading: (val: boolean) => void; // 左边loading
    setRightLoading: (val: boolean) => void; // 右边loading
    getLeftCurrent: () => number; // 获取左边第几页页
    getRightCurrent: () => number; // 获取右边第几页
}

export type BtnEvent = {
    btnL?: (keys?:string[]) => void;
    btnR?: (keys?:string[]) => void;
    btnLL?: () => void;
    btnRR?: () => void;
    btnUp?: () => void;
    btnDown?: () => void;
}

type ReturnData<T> = {
    rows: T[];
    total: number;
}

type Props<L, R> = {
    leftColumns: ColumnsType<L>; // 穿梭框左边的table配置
    rightColums: ColumnsType<R>; // 穿梭框右边的table配置
    leftGetData: (value: PaginationConfig) => Promise<ReturnData<L>>; // 左边数据获取函数
    rightGetData: (value: PaginationConfig) => Promise<ReturnData<R>>; // 右边数据获取函数
    rows?: number;
    LeftSolt?: React.ReactNode ; // 左边插槽（插入组件）
    RightSolt?: React.ReactNode; // 右边插槽
    scrollY?: number; // 不是自适应，根据屏幕高度计算
    cRef?: React.MutableRefObject<CRef | undefined>;
    btnEvent?: BtnEvent;
    rowKey: string;
    sidePagination?: {
        left: boolean,
        right: boolean,
    }; // false后端分页
};

// 数组转换 flag为true是删除，flase是余数
export const arrFormat = (arr: any[], list: Key[], key: string, flag: boolean = true) => arr.filter((v) => {
    if (!flag) {
        return list.some((i) => v[key] === i);
    } else {
        return list.every((i) => v[key] !== i);
    }
});


const TransferTable = <L extends Object =any, R extends Object = any>(props: Props<L, R>) => {
    // 获取父级传参
    const { cRef, leftColumns, rightColums, leftGetData, rightGetData, rows = 10, LeftSolt, RightSolt, scrollY, btnEvent, rowKey, sidePagination } = props;
    // 左边分页配置
    const [ leftLoding, setLeftLoading ] = useFetchState<boolean>(false);
    const [ leftCurrent, setLeftCurrent ] = useFetchState<number>(1);
    const [ leftTotal, setLeftTotal ] = useFetchState<number>(0);
    const [ leftData, setLeftData ] = useFetchState<any[]>([]);
    const [ leftSelectedRowKeys, setLeftSelectedRowKeys ] = useFetchState<Key[]>([]);
    const [ leftOverData, setLeftOverData ] = useFetchState<Key[]>([]);
    // 右边分页配置
    const [ rightCurrent, setRightCurrent ] = useFetchState<number>(1);
    const [ rightTotal, setRightTotal ] = useFetchState<number>(0);
    const [ rightLoding, setRightLoading ] = useFetchState<boolean>(false);
    const [ rightData, setRightData ] = useFetchState<any[]>([]);
    const [ rightSelectedRowKeys, setRightSelectedRowKeys ] = useFetchState<Key[]>([]);
    const [ rightOverData, setRightOverData ] = useFetchState<Key[]>([]);
    // 获取左边的数据
    const getLeftData = async (page: number = 1, pageSize: number = rows) => {
        const data = await leftGetData({ page, pageSize });

        if (!sidePagination?.left) {
            setLeftSelectedRowKeys([]);
        }
        setLeftLoading(false);
        setLeftCurrent(page);
        setLeftTotal(data.total);
        setLeftData(data.rows);
    };
    // 获取右边的数据
    const getRightData = async (page: number = 1, pageSize: number = rows) => {
        const data = await rightGetData({ page, pageSize });

        if (!sidePagination?.right) {
            setRightSelectedRowKeys([]);
        }
        setRightLoading(false);
        setRightCurrent(page);
        setRightTotal(data.total);
        setRightData(data.rows);
    };
    // 左边分页的数据
    const leftPagination = {
        total: leftTotal,
        onChange (page: number, pageSize: number | undefined) {
            setLeftLoading(true);
            getLeftData(page, pageSize);
        },
        current: leftCurrent,
        hideOnSinglePage: true,
        pageSize: rows,
        showSizeChanger: false,
    };
    // 右边分页的数据
    const rightPagination = {
        total: rightTotal,
        onChange (page: number, pageSize: number | undefined) {
            setRightLoading(true);
            getRightData(page, pageSize);
        },
        current: rightCurrent,
        hideOnSinglePage: true,
        pageSize: rows,
        showSizeChanger: false,
    };
    // 左边选择的数据
    const leftRowSelection = {
        selectedRowKeys: leftSelectedRowKeys,
        onSelect (record:L, selected:boolean) {
            let keysList: Key[] = deepClone(leftSelectedRowKeys);

            if (selected) {
                keysList.push(record[rowKey]);
            } else {
                keysList = keysList.filter((v) => v !== record[rowKey]);
            }
            setLeftSelectedRowKeys(keysList);
        },
        onSelectAll (selected:boolean, selectedRows:L[], changeRows:L[]) {
            let keysList: Key[] = deepClone(leftSelectedRowKeys);
            const selKeysList = changeRows.map((v) => v[rowKey]);

            if (selected) {
                if (sidePagination?.left) {
                    keysList = [ ...keysList, ...selKeysList ];
                } else {
                    keysList = selKeysList;
                }
            } else {
                if (sidePagination?.left) {
                    keysList = keysList.filter((v) => selKeysList.every((o) => v !== o));
                } else {
                    keysList = [];
                }
            }
            setLeftSelectedRowKeys(keysList);
        },
    };
    // 右边选择的数据
    const rightRowSelection = {
        selectedRowKeys: rightSelectedRowKeys,
        onSelect (record:R, selected:boolean) {
            let keysList: Key[] = deepClone(rightSelectedRowKeys);

            if (selected) {
                keysList.push(record[rowKey]);
            } else {
                keysList = keysList.filter((v) => v !== record[rowKey]);
            }
            setRightSelectedRowKeys(keysList);
        },
        onSelectAll (selected:boolean, selectedRows:R[], changeRows:R[]) {
            let keysList: Key[] = deepClone(rightSelectedRowKeys);
            const selKeysList = changeRows.map((v) => v[rowKey]);

            if (selected) {
                if (sidePagination?.left) {
                    keysList = [ ...keysList, ...selKeysList ];
                } else {
                    keysList = selKeysList;
                }
            } else {
                if (sidePagination?.left) {
                    keysList = keysList.filter((v) => selKeysList.every((o) => v !== o));
                } else {
                    keysList = [];
                }
            }
            setRightSelectedRowKeys(keysList);
        },
    };

    useImperativeHandle(cRef, () => ({
        setLeftData (value: any) {
            if (!sidePagination?.left) {
                setLeftSelectedRowKeys([]);
            }
            setLeftData(value.rows);
            setLeftTotal(value.total);
        },
        setRightData (value: any) {
            if (!sidePagination?.right) {
                setRightSelectedRowKeys([]);
            }
            setRightData(value.rows);
            setRightTotal(value.total);
        },
        setLeftSelectKeysList (value: Key[]) {
            setLeftSelectedRowKeys(value);
        },
        setRightSelectKeysList (value: Key[]) {
            setRightSelectedRowKeys(value);
        },
        getRightOverList () {
            return rightOverData;
        },
        getLeftOverList () {
            return leftOverData;
        },
        setLeftOverList (value:Key[]) {
            setLeftOverData(value);
        },
        setRightOverList (value: Key[]) {
            setRightOverData(value);
        },
        getLeftTableData () {
            return leftData;
        },
        getRightTableData () {
            return rightData;
        },
        getLeftSelectKeysList () {
            return leftSelectedRowKeys;
        },
        getRightSelectKeysList () {
            return rightSelectedRowKeys;
        },
        setLeftCurrent (val:number) {
            setLeftCurrent(val);
        },
        setRightCurrent (val: number) {
            setRightCurrent(val);
        },
        setLeftLoading (val: boolean) {
            setLeftLoading(val);
        },
        setRightLoading (val: boolean) {
            setRightLoading(val);
        },
        getLeftCurrent () {
            return leftCurrent;
        },
        getRightCurrent () {
            return rightCurrent;
        },
    }));
    // 选中右移
    const btnR = () => {
        btnEvent?.btnR && btnEvent?.btnR();
    };
    // 选中左移
    const btnL = () => {
        btnEvent?.btnL && btnEvent?.btnL();
    };

    // 全部左移
    const btnLL = () => {
        btnEvent?.btnLL && btnEvent?.btnLL();
    };

    // 全部右移
    const btnRR = () => {
        btnEvent?.btnRR && btnEvent?.btnRR();
    };

    // 上移
    const btnUp = () => {
        btnEvent?.btnUp && btnEvent?.btnUp();
    };

    // 下移
    const btnDown = () => {
        btnEvent?.btnDown && btnEvent?.btnDown();
    };

    return (
        <div className='transferMain'>
            <div className='leftTable'>
                <div className='content'>
                    <div className='solt' style={{height: LeftSolt ? '40px' : 0 }}>
                        {LeftSolt && LeftSolt}
                    </div>
                    <div className='table'>
                        <Table
                            columns={leftColumns}
                            loading={leftLoding}
                            dataSource={leftData}
                            rowSelection={leftRowSelection}
                            scroll={{y: scrollY}}
                            rowKey={`${rowKey}`}
                            pagination={false}
                            onRow={(record) => ({
                                onClick: () => {
                                    let key = record[rowKey];
                                    const rowsKeys = [ ...leftSelectedRowKeys ];
                                    let index = rowsKeys.indexOf(key);

                                    if (index >= 0) {
                                        rowsKeys.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                    }
                                    setLeftSelectedRowKeys(rowsKeys);
                                },
                                onDoubleClick () {
                                    btnEvent?.btnR && btnEvent?.btnR([ record[rowKey] ]);
                                },
                            })}/>
                    </div>
                </div>
                <div className='pagination'>
                    <Pagination {...leftPagination} />
                </div>
            </div>
            <div className='btnGroup'>
                {btnEvent?.btnR && <Button type='primary' shape='circle' icon={<RightOutlined />} onClick={btnR} />}
                {btnEvent?.btnL && <Button type='primary' shape='circle' icon={<LeftOutlined />} onClick={btnL} />}
                {btnEvent?.btnUp && <Button type='primary' shape='circle' icon={<UpOutlined />} onClick={btnUp} />}
                {btnEvent?.btnDown && <Button type='primary' shape='circle' icon={<DownOutlined />} onClick={btnDown} />}
                {btnEvent?.btnLL && <Button type='primary' shape='circle' icon={<DoubleLeftOutlined onClick={btnLL} />} />}
                {btnEvent?.btnRR && <Button type='primary' shape='circle' icon={<DoubleRightOutlined />} onClick={btnRR} />}
            </div>
            <div className='rightTable'>
                <div className='content'>
                    <div className='solt' style={{height: RightSolt ? '40px' : 0 }}>
                        {RightSolt && RightSolt}
                    </div>
                    <div className='table'>
                        {/* <div className='list'> */}
                        <Table
                            columns={rightColums}
                            loading={rightLoding}
                            dataSource={rightData}
                            rowSelection={rightRowSelection}
                            scroll={{y: scrollY}}
                            rowKey={`${rowKey}`}
                            pagination={false}
                            onRow={(record) => ({
                                onClick: () => {
                                    let key = record[rowKey];

                                    const rowsKeys = [ ...rightSelectedRowKeys ];
                                    let index = rowsKeys.indexOf(key);

                                    if (index >= 0) {
                                        rowsKeys.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                    }
                                    setRightSelectedRowKeys(rowsKeys);
                                },
                                onDoubleClick () {
                                    btnEvent?.btnL && btnEvent?.btnL([ record[rowKey] ]);
                                },
                            })}/>
                        {/* </div> */}
                    </div>
                </div>
                <div className='pagination'>
                    <Pagination {...rightPagination} />
                </div>
            </div>
        </div>
    );
};

export default TransferTable;
