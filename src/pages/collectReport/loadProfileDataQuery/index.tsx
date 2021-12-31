// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col, Select, Input, DatePicker, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import moment from 'moment';
import { collectReport } from 'src/api';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import {MeterType, SchemeData, LoadProfileData, TitleData } from 'src/api/collectReport/loadProfileData/types';
import { ColumnsType } from 'antd/lib/table';
import EchartsPage from 'src/components/common/echarts';
import { deepClone } from 'src/utils/utils';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};


let ROWS = 10;
let chartDate = '';
let sortName = '';
let sortType = 'asc';
const LoadProfileDataQuery: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const { Column } = Table;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const [ chartTitle, setChartTitle ] = useFetchState<string>('');
    const [ meterNo, setMeterNo ] = useFetchState<string>('');
    const optInit = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: [],
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            zlevel: 0,
            z: 0,
            top: 80,
            containLabel: true,
        },
        yAxis: {
            type: 'value',
        },
        legend: {
            data: [],
            z: 4,
            zlevel: 0,
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    name: meterNo + '_' + chartDate,
                },
            },
        },
        series: [ {
            data: [],
            type: 'line',
            smooth: true,
        } ],
    };
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ meterTypeList, setMeterTypeList ] = useFetchState<MeterType[]>([]);
    const [ loadProfileDataList, setLoadProfileDataList ] = useFetchState<any[]>([]);
    const [ loadProfileTitleList, setLoadProfileTitleList ] = useFetchState<TitleData[]>([]);
    const [ tableTitleList, setTableTitleList ] = useFetchState<ColumnsType[]>([]);
    const [ meterType, setMeterType ] = useFetchState<string>('');
    const [ dataType, setDataType ] = useFetchState<string>('table');
    const [ schemeList, setSchemeList ] = useFetchState<SchemeData[]>([]);
    const [ snCommand, setSnCommand ] = useFetchState<string>('');
    const [ startTime, setStartTime ] = useFetchState<string>('');
    const [ endTime, setEndTime ] = useFetchState<string>('');
    const [ options, setOptions ] = useFetchState<any | null>(optInit);

    const changeDate = (dates: any, dateStrings: string[]) => {
        setStartTime(dateStrings[0]);
        setEndTime(dateStrings[1]);
    };

    // 设置图表属性
    const setChartOption = (titles: TitleData[], datas:any[]) => {
        if (!titles.length) {
            return;
        }
        let chartLegends: string[] = [];
        let xValues: string[] = [];
        let clock = titles[0];
        let seriesValues: any[] = [];

        titles = titles.slice(1, titles.length);
        // 获取图表折线的数量和名称
        titles.map((v: TitleData) => {
            chartLegends.push(v.afn_name);
        });
        // 获取图表X轴值
        if (datas.length) {
            datas.map((v: any) => {
                let time: string = v[`CAP_OBJ_DATA_${clock.capture_obj_index}`];

                chartDate = time.substring(0, 10);

                setChartTitle(chartDate);
                xValues.push(time.substring(11, time.length));
            });
        }
        // 获取折线的值
        for (let title of titles) {
            let name = title.afn_name;
            let values = [];

            if (datas.length) {
                for (let data of datas) {
                    values.push(data[`CAP_OBJ_DATA_${title.capture_obj_index}`]);
                }
            }
            let series = {
                name: name,
                type: 'line',
                data: values,
            };

            seriesValues.push(series);
        }

        const daily = deepClone<any>(optInit);

        daily.xAxis.data = xValues;
        daily.legend.data = chartLegends;
        daily.series = seriesValues;
        setOptions(daily);
    };

    const getData = (page: number = 1) => {
        if (dataType === 'chart' && !meterNo) {
            message.error(Mes['messageHintPleaseinputidpleaseinputid']);
            return;
        }
        setLoading(true);
        let params: any = {};

        params = {
            subSysNo: subSysNo,
            page: page,
            rows: ROWS,
            meterNo: meterNo,
            startTime: startTime,
            endTime: endTime,
            dataType: dataType,
            sortOrder: sortType,
            meterType: meterType,
            snCommand: snCommand,
            sortName: sortName,
        };

        collectReport.loadProfileData.getDataList(params).then((res: LoadProfileData) => {
            setLoading(false);
            if (dataType === 'table') {
                setTotal(res.total);
                setCurrent(page);
                setLoadProfileDataList(res.rows);
                let titles: TitleData[] = res.allRows;
                let tableTitles: any[] = [];
                // 动态设置表格的表头

                tableTitles.push({
                    title: Mes['titleTableCustomernocustomerno'],
                    dataIndex: 'CUSTOMER_NO',
                    width: 150,
                });
                tableTitles.push({
                    title: Mes['titleTableDcunodcuno'],
                    dataIndex: 'CST_NO',
                    width: 150,
                });
                tableTitles.push({
                    title: Mes['titleTableMeternometerno'],
                    dataIndex: 'METER_NO',
                    width: 150,
                });
                tableTitles.push({
                    title: Mes['titleTableFnnamefnname'],
                    dataIndex: 'AFN_NAME',
                    width: 200,
                });
                tableTitles.push({
                    title: Mes['titleTableMetertypemetertype'],
                    dataIndex: 'SN_METER_TYPE_NAME',
                    width: 200,
                });
                tableTitles.push({
                    title: Mes['titleTableStoragetimestoragetime'],
                    dataIndex: 'REGISTER_TIME',
                    width: 200,
                    // sorter: (a: any, b: any) => Date.parse(a.REGISTER_TIME) - Date.parse(b.REGISTER_TIME),
                    sorter: true,
                });
                if (titles.length) {

                    titles.map((v: TitleData) => {
                        let tableTitle = {};

                        if (v.afn_name.includes('Clock')) {
                            tableTitle = {
                                title: v.afn_name,
                                dataIndex: 'CAP_OBJ_DATA_' + v.capture_obj_index,
                                width: 200,
                                sorter: true,
                                // sorter: (a: any, b: any) => Date.parse(a['CAP_OBJ_DATA_' + v.capture_obj_index]) - Date.parse(b['CAP_OBJ_DATA_' + v.capture_obj_index]),
                            };
                        } else {
                            tableTitle = {
                                title: v.afn_name,
                                dataIndex: 'CAP_OBJ_DATA_' + v.capture_obj_index,
                                width: 200,
                            };
                        }

                        tableTitles.push(tableTitle);
                    });
                }
                setTableTitleList(tableTitles);

            } else {
                setLoadProfileDataList(res.rows);
                setLoadProfileTitleList(res.allRows);
                if (res.rows.length) {
                    setChartOption(res.allRows, res.rows[current - 1]);
                } else {
                    setChartOption(res.allRows, []);
                }
            }
        });
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Search',
            btnType: 'primary',
            title: Mes['btnTitleSearch'],
            onClick () {
                getData();

            },
        },
        // {
        //     type: 'Print',
        //     btnType: 'primary',
        //     title: Mes['titleLabelPrintprint'],
        //     shape: 'circle',
        //     onClick () {
        //         console.log('print');

        //     },
        // },
    ];


    const getSchemeList = (meter: string) => {
        collectReport.loadProfileData.getSchemeList(subSysNo, meter).then((res: SchemeData[]) => {
            setSchemeList(res);
            if (res.length > 0) {
                setSnCommand(res[0].sn);
            }
        });
    };

    const getMeterTypeList = () => {
        collectReport.loadProfileData.getMeterTypeList(subSysNo).then((res: MeterType[]) => {
            setMeterTypeList(res);
            if (res.length > 0) {
                setMeterType(res[0].ID);
                getSchemeList(res[0].ID);
            }
        });
    };

    // 切换表计型号下拉框值
    const selectMeterType = (value: string) => {
        setMeterType(value);
        setSnCommand('');
        getSchemeList(value);
    };

    const selectScheme = (value: string) => {
        setSnCommand(value);
    };

    const selectDataType = (value: string) => {
        setDataType(value);
        // setCurrent(1);
        if (value === 'chart') {
            ROWS = 100;
        } else {
            ROWS = 15;
        }
    };

    const selectExportType = (value: string) => {
        console.log(window.location);
        let basePath = window.location.origin + '/v1';
        let url = basePath + '/schemereport/exportReport?' +
        'snCommand=' + encodeURIComponent(snCommand) +
        '&meterType=' + encodeURIComponent(meterType) +
        '&startTime=' + encodeURIComponent(startTime) +
        '&endTime=' + encodeURIComponent(endTime) +
        '&type=' + encodeURIComponent(value) +
        // '&snTask=' + encodeURIComponent(snTask) +
        // '&queryType=' + encodeURIComponent(queryType) +
        '&meterNo=' + encodeURIComponent(meterNo) +
        '&rows=' + 100000 +
        '&subsysNo=' + encodeURIComponent(subSysNo);

        // window.location.href = url;
        window.open(url);
        // let win = window.open();

        // win!.document.write('<iframe src="' + url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    };

    const inputMeterNo = (e:any) => {
        const { value } = e.target;

        setMeterNo(value);
    };

    const initConfig = async () => {
        try {
            const date = new Date();

            let end = moment(date).format(format);
            let start = moment(date.setDate(date.getDate() - 1)).format(format);

            setStartTime(start);
            setEndTime(end);
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            ROWS = pageSize!;
            getData(page);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    // 图表切换分页
    const changeChartPage = (page:number) => {
        setCurrent(page);
        setChartOption(loadProfileTitleList, loadProfileDataList[page - 1]);
    };

    const changeTable = (paginations:any, filters:any, sorter:any) => {
        console.log(paginations, filters, sorter);
        if (sorter.field) {
            sortName = sorter.field;
            if (sorter.order) {
                sortType = sorter.order.substr(0, 3);
            } else {
                sortType = 'asc';
            }
            getData(paginations.current);
        }
    };


    useEffect(() => {
        initConfig();
        getMeterTypeList();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleLoadProfileDataQuery']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={25}>
                    <Col span={5}>
                        <RangePicker style={{ width: '100%' }} showTime format={format} value={[ moment(startTime, format), moment(endTime, format) ]} onChange={changeDate} allowClear={ false}/>
                    </Col>
                    <Col span={4}>
                        <Select style={{ width: '100%' }} value={meterType} onSelect={ selectMeterType}>
                            {meterTypeList.length && meterTypeList.map((v: MeterType) =>
                                (<Option value={ v.ID} key={ v.ID}>{ v.NAME}</Option>)
                            )}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select style={{ width: '100%' }} value={snCommand} onSelect={ selectScheme}>
                            {schemeList.length && schemeList.map((v: SchemeData) => (
                                <Option value={v.sn} key={v.sn}>{v.afn_name + '(' + v.afn + ')'}</Option>
                            )
                            )}
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Select value={dataType} style={{ width: '100%' }} onSelect={ selectDataType}>
                            <Option value='table'>table</Option>
                            <Option value='chart'>chart</Option>
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Input placeholder={Mes['titleTableMeternometerno']} value={meterNo} onChange={ inputMeterNo}></Input>
                    </Col>
                    <Col span={1} className='flex flexBetween'>
                        <BtnList btnList={btnList} />

                    </Col>

                    <Col span={2}>
                        {dataType === 'table' && (<Select placeholder='Export' onSelect={selectExportType}>
                            <Option value='html'>Html</Option>
                            <Option value='excel'>Excel</Option>
                            <Option value='csv'>Csv</Option>
                        </Select>)}

                    </Col>
                </Row>
                <div style={{paddingTop: '10px'}}>
                    {dataType === 'table' && (
                        <div>
                            <div className='table'>
                                <Table className='table' loading={loading} onChange={changeTable}
                                    pagination={false} dataSource={loadProfileDataList}>
                                    {tableTitleList.length && tableTitleList.map((v: any) => (
                                        <Column title={v.title} key={v.dataIndex} dataIndex={v.dataIndex} width={v.width} ellipsis={true} sorter={v.sorter}></Column>
                                    ))}
                                </Table>
                            </div>
                            <div className='positonLtBt'>
                                <Pagination {...pagination} />
                            </div>
                        </div>
                    )}
                    {dataType === 'chart' && (
                        <div>
                            <h3>{ chartTitle}</h3>
                            <EchartsPage option={options} selectId='loadProfileData' height='500px'/>
                            <Pagination current={current} total={loadProfileDataList.length} pageSize={1} onChange={changeChartPage} showSizeChanger={ false}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(LoadProfileDataQuery);
