/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-16 15:03:37
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import * as echarts from 'echarts';

type Props = {
    option: any;
    selectId: string;
    width?: string;
    height?: string;
}

const EchartsPage = (props: Props) => {
    const { option, selectId, width = '100%', height = '100%' } = props;
    // 初始化echarts实例

    useEffect(() => {
        const dom: HTMLElement = document.getElementById(`${selectId}`) as HTMLElement;
        let myEcharts: null | echarts.EChartsType = echarts.getInstanceByDom(dom);

        if (!myEcharts) {
            if (width === '100%' || height === '100%') {
                myEcharts = echarts.init(dom);
            } else {
                myEcharts = echarts.init(dom, '', {
                    width: parseInt(width, 10),
                    height: parseInt(height, 10),
                });
            }
        }

        // 绘制图表并清除缓存
        myEcharts.setOption(option, true);
    }, [ option ]);

    return (
        <div id={selectId} style={{width: width, height: height}}></div>
    );
};

export default EchartsPage;
