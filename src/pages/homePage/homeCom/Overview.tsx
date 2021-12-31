/*
 * FileName : homeCom.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-19 10:37:03
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import EchartsPage from 'src/components/common/echarts';
import { homePage } from 'src/api';
import { message } from 'antd';
import { deepClone } from 'src/utils/utils';
import { RingIcon } from 'src/components/common/icon/customIcon';
import useFetchState from 'src/utils/useFetchState';
import '../index.less';

type OverviewPages = {
  title?: string;
  show?: boolean;
}

type CountInfo = {
    deviceOnline: number;
    runMeter: number;
}

type Size = {
    width: string;
    height: string;
}

const OverviewCom: React.FC<OverviewPages> = (overviewPages) => {
    // 初始化数据
    const { title = 'Overview', show = true } = overviewPages;

    const MeterCountInfo = {
        deviceOnline: 0,
        runMeter: 0,
    };

    const DcuCountInfo = {
        deviceOnline: 0,
        runMeter: 0,
    };

    const [ meterCount, setmeterCount ] = useFetchState<CountInfo>(MeterCountInfo);
    const [ dcuCount, setdcuCount ] = useFetchState<CountInfo>(DcuCountInfo);

    // 初始化环形图数据
    const optionsInit = {
        tooltip: {
            trigger: 'item',
            position (pos: any) {
                let obj: any = {};

                obj['left'] = pos[0] + 20;
                obj['top'] = pos[1] - 70;
                return obj;
            },
        },
        series: [
            {
                name: 'data',
                type: 'pie',
                radius: [ '40%', '70%' ],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '8',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: true,
                },
                data: [
                    {value: 0, name: 'Online count' },
                    {value: 0, name: 'Offline Count' },
                ],
            },
        ],
    };

    const [ echartOptDcu, setEchartOptDcu ] = useFetchState(optionsInit);
    const [ echartOptMeter, setEchartOptMeter ] = useFetchState(optionsInit);
    const [ size, setSize ] = useFetchState<Size>({
        width: '100%',
        height: '100%',
    });


    // 获取dcu数据
    const getDcuCount = () => homePage.getDcuCount();

    const getMeterCount = () => homePage.getMeterCount();

    useEffect(() => {
        Promise.all([ getDcuCount(), getMeterCount() ]).then((res: any[]) => {
            setdcuCount({
                deviceOnline: res[0].rtDeviceOnline,
                runMeter: res[0].tRunCst,
            });
            const dcuOptData = [
                {
                    value: res[0].rtDeviceOnline,
                    name: 'Online count',
                    itemStyle: { color: '#3AB17A'},
                },
                {
                    value: res[0].tRunCst - res[0].rtDeviceOnline,
                    name: 'Offline count',
                    itemStyle: { color: 'rgb(213, 213, 225)'},
                },
            ];
            const dcuOptInit = deepClone(optionsInit);

            dcuOptInit.series[0].data = dcuOptData;
            setEchartOptDcu(dcuOptInit);
            setmeterCount(res[1] as CountInfo);
            const meterData = [
                {
                    value: res[1].deviceOnline,
                    name: 'Online count',
                    itemStyle: { color: '#3AB17A'},
                },
                {
                    value: res[1].runMeter - res[1].deviceOnline,
                    name: 'Offline count',
                    itemStyle: { color: 'rgb(213, 213, 225)'},
                },
            ];
            const meterOptInit = deepClone(optionsInit);

            meterOptInit.series[0].data = meterData;
            setEchartOptMeter(meterOptInit);

            const width = document.getElementsByClassName('chart')[0]?.clientWidth;
            const height = document.getElementsByClassName('chart')[0]?.clientHeight;

            setSize({
                width: (width ?? 0) + 'px',
                height: (height ?? 0) + 'px',
            });

        })
            .catch((err) => {
                message.error(err);
                // console.error(err);
            });
    }, []);

    return (
        <div className='OverviewCom'>
            {
                show && <h5>
                    <div>
                        <RingIcon style={{marginRight: '3px'}} />
                        {title}
                    </div>
                </h5>
            }
            <div className='flexCenter flex1'>
                <div>
                    <p className='pv0h20'>DCU overview</p>
                    <div className='flexCenter flex1'>
                        <div className='chart'>
                            <EchartsPage selectId='dcuOverview' width={size.width} height={size.height} option={echartOptDcu} />
                        </div>
                        <div>
                            <p>Online Count:{ dcuCount.deviceOnline }</p>
                            <p>Total Count:{ dcuCount.runMeter }</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className='pv0h20'>Meter Overview</p>
                    <div className='flexCenter flex1'>
                        <div className='chart'>
                            <EchartsPage selectId='meterOverview' width={size.width} height={size.height} option={echartOptMeter} />
                        </div>
                        <div>
                            <p>Online Count:{ meterCount.deviceOnline }</p>
                            <p>Total Count:{ meterCount.runMeter }</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewCom;
