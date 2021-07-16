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
}

const EchartsPage = (props: Props) => {
    const { option, selectId } = props;

    useEffect(() => {
        // 初始化echarts实例
        const myEcharts = echarts.init(document.getElementById(`${selectId}`) as HTMLElement);

        // 绘制图表
        myEcharts.setOption(option);
    }, []);

    return (
        <div id={selectId} style={{width: '100%', height: '100%'}}></div>
    );
};

export default EchartsPage;
