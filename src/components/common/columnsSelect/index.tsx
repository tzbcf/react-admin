/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2022-01-04 14:56:56
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React, {useImperativeHandle, useEffect} from 'react';
import { Cascader } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { ColumnsType } from 'antd/es/table';
import { CascaderValueType, DataNode } from 'rc-cascader/es/interface';
import {
    AppstoreAddOutlined,
    DownSquareOutlined,
} from '@ant-design/icons';
import './index.less';

export type CSRef<T> = {
  getNewColumns():ColumnsType<T>;
}

type Props<T> = {
  columns: ColumnsType<T>;
  casOpt: DataNode[];
  csRef?: React.MutableRefObject<CSRef<T> | undefined>;
  change: (columns: ColumnsType<T>) => void;
  defaultCasVal?: CascaderValueType[];
}

const ColumnsList = <T extends any>(porps:Props<T>) => {
    const { columns, casOpt, csRef, change, defaultCasVal = [] } = porps;
    const [ casVal, setCasVal ] = useFetchState<CascaderValueType[]>([]);

    const casChange = (value:CascaderValueType[]) => {
        setCasVal(value);
        const newCol = columns.map((v:any) => {
            const item = value.find((o) => o[0] === v.dataIndex);

            if (item) {
                return v;
            }
        }).filter((v) => v);

        change(newCol);
    };

    // 暴露给父级调用的方法
    useImperativeHandle(csRef, () => ({
        getNewColumns () {
            return columns.map((v:any) => {
                const item = casVal.find((o) => o[0] === v.dataIndex);

                if (item) {
                    return v;
                }
            }).filter((v) => v);
        },
    }));

    useEffect(() => {
        setCasVal(defaultCasVal);
    }, [ defaultCasVal.length ]);

    return (
        <div className='columnsList'>
            <Cascader
                multiple={true}
                options={casOpt}
                onChange={casChange}
                maxTagCount='responsive'
                allowClear={false}
                value={casVal}
                className='thList'
            />
            <div className='icon'>
                <AppstoreAddOutlined />
                <DownSquareOutlined />
            </div>
        </div>
    );
} ;

export default ColumnsList;
