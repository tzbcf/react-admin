/*
 * FileName : DailyFrozenData.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-19 14:42:52
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import EchartsPage from 'src/components/common/echarts';
import { homePage } from 'src/api';
import { deepClone } from 'src/utils/utils';
import { FrozenSuccessRate } from 'src/api/homePage/type';
import { LineChartOutlined } from '@ant-design/icons';
import useFetchState from 'src/utils/useFetchState';
type Props = {
  type: 'Daily' | 'Monthly' | 'Curve';
}

type Size = {
    width: string;
    height: string;
}

const FrozenData: React.FC<Props> = (props) => {
    // 初始化数据
    const { type } = props;

    const optInit = {
        tooltip: {
            trigger: 'item',
        },
        xAxis: {
            type: 'category',
            data: [],
        },
        grid: {
            top: 15,
            height: 130,
        },
        yAxis: {
            type: 'value',
            max: '100',
            min: '0',
        },
        series: [ {
            data: [],
            type: 'line',
            smooth: true,
        } ],
    };

    const [ options, setOptions ] = useFetchState<any | null>(null);

    const width = document.getElementsByClassName('FrozenData')[0]?.clientWidth;

    const size: Size = {
        width: width ? width.toString() : '100%',
        height: 170 + 'px',
    };

    // 设置配置函数
    const setOptFunc = (res: FrozenSuccessRate): void => {
        const xAxisData = res.data.map((v) => v.FROZEN_TIME);

        const seriesData = res.data.map((v) => {
            let rate = Math.round(v.AUTUAL_READ / v.TOTAL_READ * 100.00);

            rate = isNaN(rate) ? 0 : rate;
            rate = isFinite(rate) ? rate : 0;
            return rate;
        });
        const daily = deepClone<any>(optInit);

        daily.xAxis.data = xAxisData;
        daily.series[0].data = seriesData;
        console.log('a------', daily);
        setOptions(daily);
    };

    const getFrozenRateData = async (): Promise<void> => {
        let res = null;

        switch (type) {
            case 'Daily':
                res = await homePage.getDailyFrozenSuccessRate();

                setOptFunc(res);
                break;
            case 'Monthly':
                res = await homePage.getMonthlyFrozenSuccessRate();

                setOptFunc(res);
                break;
            case 'Curve':
                res = await homePage.getCurveFrozenSuccessRate();

                setOptFunc(res);
                break;
            default:
                setOptions(null);
                break;
        }
    };

    useEffect(() => {
        getFrozenRateData();
    }, []);

    return (
        <div className='FrozenData'>
            <h5>
                <div>
                    <LineChartOutlined /> {type} Frozen Data
                </div>
            </h5>
            {
                options && <EchartsPage option={options} width={size.width} height={size.height} selectId={`${type}FrozenData`} />
            }
        </div>
    );
};

export default FrozenData;
