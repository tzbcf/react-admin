/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-08-24 16:27:20
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { DatePicker, Input, Tree } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/index.d';
import { RangeValue } from 'rc-picker/lib/interface.d';
import moment, { Moment } from 'moment';
import useFetchState from 'src/utils/useFetchState';
// import { PaginationProps } from 'antd/lib/pagination/Pagination.d';
import { dateFormat } from 'src/utils/utils';
// import { GroupListRows } from 'src/api/AmiFunction/firmwareUpgrade/type';
import { queryTaskFormatTreeData } from 'src/utils/function';
import { Key } from 'antd/es/table/interface';
import './index.less';
const { RangePicker } = DatePicker;
const { Search } = Input;

export type GetListParams = {
    startTime: string;
    endTime: string;
    inputVal?: string;
}

export type TaskRef<T> = {
    setTreeData (data: T[]): void;
    initFiled (): void;
    setSelKeys (val: string): void;
    resetTreeData (): void;
}

type Props<T> = {
    TimePicker?: RangePickerProps;
    showInput?: boolean;
    onChick: (row: any|null) => void;
    title: string;
    getList: (val: GetListParams) => void;
    taskRef: React.MutableRefObject<TaskRef<T> | undefined>;
    groupTaskFormatTitle: (val: any)=> string;
};
const TaskCom = <T extends Object>(props: Props<T>) => {
    // 初始化
    const { TimePicker, showInput = true, onChick, title, getList, taskRef, groupTaskFormatTitle } = props;
    const [ treeData, setTreeData ] = useFetchState<any[]>([]);
    // const [ current, setCurrent ] = useFetchState<number>(1);
    // table选中
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<string[]>([]);
    // 输入搜索
    const [ startTime, setStartTime ] = useFetchState<any>(moment(dateFormat('YYYY/MM/DD', moment(new Date().getTime() - 24 * 60 * 60 * 1000)), 'YYYY/MM/DD'));
    const [ endTime, setEndTime ] = useFetchState<any>(moment(dateFormat('YYYY/MM/DD'), 'YYYY/MM/DD'));
    const [ inputVal, setInputVal ] = useFetchState<string>('');

    // 时间变化
    const timeChange = (value: RangeValue<Moment> | null) => {
        if (value !== null) {
            setStartTime(value[0]);
            setEndTime(value[1]);
            if (!showInput) {
                getList && getList({
                    startTime: dateFormat('YYYY-MM-DD', value[0] as Moment),
                    endTime: dateFormat('YYYY-MM-DD', value[1] as Moment),
                    inputVal,
                });
            }
        } else {
            setStartTime('');
            setEndTime('');
            if (!showInput) {
                getList && getList({
                    startTime: dateFormat('YYYY/MM/DD'),
                    endTime: dateFormat('YYYY/MM/DD'),
                    inputVal,
                });
            }
        }
    };

    // 搜索
    const onSearch = (value: string) => {
        setInputVal(value);
        getList({
            startTime: dateFormat('YYYY-MM-DD', startTime),
            endTime: dateFormat('YYYY-MM-DD', endTime),
            inputVal: value,
        });
    };

    // 鼠标点击table某列元素
    const onTreeCheck = (rowKey: Key[]|{ checked: Key[]; halfChecked: Key[]; }, selectedRows: {checkedNodes:any[]}) => {
        const selKeys = rowKey as any[];
        const nodes = selectedRows.checkedNodes;

        if (selKeys.length) {
            setSelectedRowKeys([ selKeys[selKeys.length - 1] ]);
            onChick(nodes[nodes.length - 1]);
        } else {
            setSelectedRowKeys([]);
            onChick(null);
        }

    };

    // 暴露给父级调用的方法
    useImperativeHandle(taskRef, () => ({
        setTreeData (data) {
            setTreeData(queryTaskFormatTreeData<T>(data, groupTaskFormatTitle));
        },
        initFiled () {
            setStartTime(moment(dateFormat('YYYY/MM/DD'), 'YYYY/MM/DD'));
            setEndTime(moment(dateFormat('YYYY/MM/DD'), 'YYYY/MM/DD'));
            setInputVal('');
        },
        setSelKeys (val: string) {
            setSelectedRowKeys([ val ]);
        },
        resetTreeData () {
            getList({
                startTime: dateFormat('YYYY-MM-DD', startTime),
                endTime: dateFormat('YYYY-MM-DD', endTime),
                inputVal,
            });
        },
    }));

    return (
        <div id='taskCom'>
            <div className='time'>
                <RangePicker {...TimePicker} value={[ startTime, endTime ]} onCalendarChange={timeChange} />
            </div>
            {showInput && <Search placeholder='input search text' className='search' onSearch={onSearch} enterButton />}
            <h4 className='md6'>{title}</h4>
            <div className='list scrollbar'>
                <Tree
                    checkable
                    onCheck={onTreeCheck}
                    checkedKeys={selectedRowKeys}
                    treeData={treeData}
                />
            </div>
        </div>
    );
};

export default TaskCom;
