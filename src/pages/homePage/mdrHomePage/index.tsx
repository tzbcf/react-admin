// eslint-disable-next-line no-use-before-define
import React from 'react';
import EchartsPage from 'src/components/common/echarts';
import './index.less';
const MdrHomePage = () => {
    const MeterCountInfo = {
        deviceOnline: 1,
        runMeter: 3,
    };
    const DcuCountInfo = {
        deviceOnline: 1,
        runMeter: 2,
    };

    const options = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '5%',
            left: 'center',
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
                        fontSize: '12',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    {value: 1, name: 'Online count'},
                    {value: 1, name: 'Offline Count'},
                ],
            },
        ],
    };

    return (
        <div id='mdrHomepage'>
            <div className='left'>
                <div className='overview'>
                    <h5>Overview</h5>
                    <div className='flexCenter flexBetween'>
                        <div>
                            <p>DCU overview</p>
                            <div className='flexCenter flexBetween'>
                                <div className='chart'>
                                    <EchartsPage selectId='dcuOverview' option={options} />
                                </div>
                                <div>
                                    <p>Online Count:{DcuCountInfo.deviceOnline}</p>
                                    <p>Total Count:{ DcuCountInfo.runMeter}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>Meter Overview</p>
                            <div className='flexCenter flexBetween'>
                                <div className='chart'>
                                    <EchartsPage selectId='meterOverview' option={options} />
                                </div>
                                <div>
                                    <p>Online Count:{MeterCountInfo.deviceOnline}</p>
                                    <p>Total Count:{ MeterCountInfo.runMeter}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='right'></div>
        </div>
    );

};

export default MdrHomePage;
