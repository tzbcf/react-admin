/*
 * FileName : historyChart.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-08 16:25:14
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
import { HistoryDataParams } from 'src/api/AmiFunction/netWorkMgnt/type.d';
import { abnormalFn } from 'src/utils/function';
import useFetchState from 'src/utils/useFetchState';
import { amiFunc } from 'src/api';
import EchartsPage from 'src/components/common/echarts';
import {deepClone} from 'src/utils/utils';
export type {HistoryDataParams};
type Props = {
  value: HistoryDataParams;
}
const HistoryChart: React.FC<Props> = (props) => {
    const { value } = props;
    const optInit = {
        tooltip: {
            trigger: 'item',
        },
        xAxis: {
            type: 'category',
            data: [],
        },
        grid: {
            bottom: 20,
        },
        yAxis: {
            type: 'value',
        },
        series: [ {
            data: [],
            type: 'line',
            smooth: true,
        } ],
    };

    let list = [
        {time: '2021-12-07 12:00:41', value: 0},
        {time: '2021-12-07 18:18:26', value: 150},
        {time: '2021-12-08 00:00:39', value: 10},
        {time: '2021-12-08 06:00:41', value: 300},
        { time: '2021-12-08 12:00:38', value: 120 },
    ];

    const [ options, setOptions ] = useFetchState<any | null>(null);

    const getData = () => {
        abnormalFn(async () => {
            const res = await amiFunc.netWorkMgnt.getMeterHistoryData({
                meterAddr: value.meterAddr,
                startDay: value.startDay,
                endDay: value.endDay,
            });

            if (res.list && res.list.length) {
                list = res.list;
            }

            const daily = deepClone<any>(optInit);
            const xAxisData = list.map((v) => v.time);
            const seriesData = list.map((v) => v.value);

            daily.xAxis.data = xAxisData;
            daily.series[0].data = seriesData;
            setOptions(daily);
        });
    };


    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='historyRecord'>
            {
                options && <EchartsPage option={options} height='400' selectId={'historyRecord'} />
            }
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(HistoryChart);


