/*
 * FileName : phaseCensus.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-06 14:06:03
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { ColumnsType } from 'antd/es/table';
import { PhaseCensusRow, PhaseCensusData } from 'src/api/AmiFunction/netWorkMgnt/type.d';
import { nodeDataFormatCascader, CascaderData, abnormalFn } from 'src/utils/function';
import { Table, Cascader} from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { CascaderValueType} from 'rc-cascader/es/interface';
import { amiFunc } from 'src/api';

export type PhaseCensusCallBackFn = (page?:number, nodeNos?:string) => Promise<PhaseCensusData>;

type Props = {
  Mes: LangMessage;
  callback: PhaseCensusCallBackFn;
  subSysNo: string;
}
const PhaseCensusDialog: React.FC<Props> = (props) => {
    const { Mes, callback, subSysNo } = props;
    const [ tableData, setTableData ] = useFetchState<PhaseCensusRow[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ nodeTree, setNodeTree ] = useFetchState<CascaderData[]>([]);
    const [ treeVal, setTreeVal ] = useFetchState<CascaderValueType>([]);
    const columns: ColumnsType<PhaseCensusRow> = [
        {
            title: Mes['titleTableXuhaoxuhao'],
            render (value, record, index) {
                return (<span>{ index + 1 }</span>);
            },
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'sectionName',
        },
        {
            title: Mes['titleTableTransformertransformer'],
            dataIndex: 'dstName',
        },
        {
            title: Mes['titleLabelPhasephase'],
            dataIndex: 'phase',
            render (value) {
                switch (parseInt(value, 10)) {
                    case 1:
                        return 'Phase A';
                    case 2:
                        return 'Phase B';
                    case 3:
                        return 'Phase A&B';
                    case 4:
                        return 'Phase C';
                    case 5:
                        return 'Phase A&C';
                    case 6:
                        return 'Phase B&C';
                    case 7:
                        return 'Phase A&B&C';
                    default:
                        return 'Unknown';
                }
            },
        },
        {
            title: Mes['titleLabelMetersummetersum'],
            dataIndex: 'meterSum',
        },
        {
            title: Mes['titleLabelOnlinemetersumonlinemetersum'],
            dataIndex: 'onlineSum',
        },
        {
            title: Mes['titleLabelOfflinemetersumofflinemetersum'],
            dataIndex: 'offlineSum',
            render (value, record) {
                if (value && value !== 'null') {
                    return value;
                } else {
                    return record.meterSum - record.onlineSum;
                }
            },
        },
    ];

    // 分页配置
    const pagetion = {
        total: total,
        async onChange (page: number) {
            setLoading(true);
            if (typeof callback === 'function') {
                const res = await callback(page);

                setTableData(res.list);
                setTotal(res.sum);
                setCurrent(page);
            }
            setLoading(false);
        },
        current: current,
        pageSize: 10,
        showSizeChanger: false,
    };

    const onChange = (val:CascaderValueType) => {
        console.log('asa-----', val);
        setTreeVal(val);
    };

    const getNode = () => {
        abnormalFn(async () => {
            const res = await amiFunc.abnormalMgnt.getNodeByLoginUser(subSysNo);
            let optTree: CascaderData[] = [];

            nodeDataFormatCascader(res, optTree);
            setTreeVal([ optTree[0]?.value ]);
            setNodeTree(optTree);
            const data = await callback(1, optTree[0]?.value);

            setTableData(data.list);
            setTotal(data.sum);
            setLoading(false);
        });
    };

    useEffect(() => {
        setLoading(true);
        getNode();
    }, []);

    return (
        <div className='census'>
            <div>
                <Cascader options={nodeTree} onChange={onChange} changeOnSelect value={treeVal} />
            </div>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey='dstId'
                pagination={pagetion}
                loading={loading}
            />
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(PhaseCensusDialog);
