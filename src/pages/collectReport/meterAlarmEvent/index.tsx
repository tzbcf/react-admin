// eslint-disable-next-line no-use-before-define
import React, { useEffect} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Row, Col, Select, Input, DatePicker, TreeSelect, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import moment from 'moment';
import { collectReport, user, basicData } from 'src/api';
import BtnList, { BtnConfig } from 'src/components/common/btnList';
import { MeterAlarmEventList, MeterAlarmEvent, MeterModeNo, MeterAlarmOption } from 'src/api/collectReport/meterAlarmEvent/types';
import { UserNode } from 'src/api/user/type';
import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';
import { randomStr } from 'src/utils/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import font from 'src/utils/fzytk-normal';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
};

type CascaderData = {
    value: string;
    title: string;
    children?: CascaderData[];
}

type SelectGroup = {
    name: string;
    value: string;
    children?: SelectGroup[];
}


let ROWS = 15;
let nodeNo = '';
let meterNos:string[] = [];
const MeterAlarmEventPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const { Option, OptGroup } = Select;
    const { RangePicker } = DatePicker;
    const format = 'YYYY-MM-DD HH:mm:ss';

    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(1);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ startTime, setStartTime ] = useFetchState<string>('');
    const [ endTime, setEndTime ] = useFetchState<string>('');
    const [ meterAlarmList, setMeterAlarmList ] = useFetchState<MeterAlarmEvent[]>([]);
    const [ nodeTree, setNodeTree ] = useFetchState<CascaderData[]>([]);
    const [ nodeName, setNodeName ] = useFetchState<string>('');
    const [ dstId, setDstId ] = useFetchState<string>('');
    const [ feederList, setFeederList ] = useFetchState<SelectGroup[]>([]);
    const [ status, setStatus ] = useFetchState<string>('all');
    const [ alarmLevel, setAlarmLevel ] = useFetchState<string>('all');
    const [ meterTypeList, setMeterTypeList ] = useFetchState<MeterModeNo[]>([ {METER_MODEL_NAME: 'All', METER_MODEL_NO: 'all'} ]);
    const [ meterType, setMeterType ] = useFetchState<string>('all');
    const [ alarmOptionList, setAlarmOptionList ] = useFetchState<MeterAlarmOption[]>([ {WORD_NAME: 'All', WORD_NAME_EN: 'all', WORD_SEQ: ''} ]);
    const [ alarmOption, setAlarmOption ] = useFetchState<string>('all_');
    const [ searchField, setSearchField ] = useFetchState<string>('METER_NO');
    const [ fieldValue, setFieldValue ] = useFetchState<string>('');
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);

    const getData = (page: number = 1, start:string, end:string, rows:number, type:string) => {
        setLoading(true);
        let params: any = {};
        let alarm = alarmOption.split('_');

        params = {
            subsys: subSysNo,
            page: page,
            rows: rows,
            sortOrder: 'asc',
            searchField: searchField,
            fieldValue: fieldValue,
            searchNode: nodeNo,
            status: status,
            dstId: dstId,
            alarmLevel: alarmLevel,
            startDate: start,
            endDate: end,
            alarmSeq: alarm[1],
            alarmNum: alarm[0],
        };


        collectReport.meterAlarmEvent.getMeterAlarmEventList(params).then((res: MeterAlarmEventList) => {
            setLoading(false);
            if (type) {
                let list = res.rows;

                res.rows.map((v, index) => {
                    if (v.BIT_LEN === 1) {
                        v['BIT_LEN_NAME'] = 'Low Level';
                    }
                    if (v.BIT_LEN === 2) {
                        v['BIT_LEN_NAME'] = 'Middle Level';
                    }
                    if (v.BIT_LEN === 3) {
                        v['BIT_LEN_NAME'] = 'High Level';
                    }
                    if (v.STATUS === '1') {
                        v.STATUS = 'Confirmed';
                    } else {
                        v.STATUS = 'UnConfirmed';
                    }
                    list[index] = v;
                });
                // eslint-disable-next-line new-cap
                const doc = new jsPDF('p', 'pt', 'a4');
                // 设置中文字体

                doc.addFileToVFS('ok.ttf', font);
                doc.addFont('ok.ttf', 'font', 'normal');
                doc.setFont('font');
                doc.text('Meter Event Alarm Report', 200, 20);
                autoTable(doc, {
                    styles: {// 设置表格的字体，不然表格中文也乱码
                        fillColor: [ 255, 255, 255 ], font: 'font', textColor: [ 0, 0, 0 ], halign: 'left', fontSize: 10,
                    },
                    headStyles: { lineWidth: 1, halign: 'center' },
                    // columnStyles: {
                    //     0: { valign: 'middle', minCellWidth: 60 },
                    //     1: { valign: 'middle', minCellWidth: 60 },
                    //     2: { valign: 'middle', minCellWidth: 60 },
                    //     3: { valign: 'middle', minCellWidth: 50 },
                    //     4: { valign: 'middle', minCellWidth: 60 },
                    //     5: { valign: 'middle', minCellWidth: 60 },
                    //     6: { valign: 'middle', minCellWidth: 60 },
                    // },
                    theme: 'grid', // 主题
                    startY: 40, // 距离上边的距离
                    margin: 10, // 距离左右边的距离
                    body: list, // 表格内容
                    columns: [ // 表头
                        { header: Mes['titleLabelNono'], dataKey: 'rn__' },
                        { header: Mes['titleTableDcuaddrdcuaddr'], dataKey: 'CST_ADDR' },
                        { header: Mes['titleTableGridcustomernamegridcustomername'], dataKey: 'CUSTOMER_NAME' },
                        { header: Mes['titleTableMeternometerno'], dataKey: 'METER_NO' },
                        { header: Mes['titleTableAlarmLevelalarmlevel'], dataKey: 'BIT_LEN_NAME' },
                        { header: Mes['titleTableUpgradestatusupgradestatus'], dataKey: 'STATUS' },
                        { header: Mes['titleTableMeasurepointmeasurepoint'], dataKey: 'CHECK_POINT_NUM' },
                        { header: Mes['titleTableOccurtimeoccurtime'], dataKey: 'OCCUR_DATETIME' },
                        { header: Mes['titleTableAlarmDescalarmdesc'], dataKey: 'WORD_NAME' },
                    ],
                });
                let blob = doc.output('blob');

                let url = window.URL.createObjectURL(blob);

                window.open(url);
                // let base64URL = doc.output('datauristring');
                // let win = window.open();

                //     win!.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
            } else {
                setMeterAlarmList(res.rows);
                setTotal(res.total);
                setCurrent(page);
            }
        })
            .catch((err) => {
                setLoading(false);
                message.error(err);
            });

    };

    const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
        const node = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

        node.forEach((item:UserNode) => {
            const findNode = nodeList.find((v:UserNode) => v.PARENTID === item.ID);
            const obj: CascaderData = {
                title: item.NAME,
                value: item.ID,
            };

            // nodeIds.push(item.ID);
            if (findNode) {
                obj.children = [];
                rootNode.push(obj);
                nodeDataFormatCascader(nodeList, obj.children, item.ID);
            } else {
                rootNode.push(obj);
            }
        });
    };

    const getFeederList = async (node: string) => {
        const params: GetDstListParasm = {
            subSysNo: subSysNo,
            nodeNo: node,
            sectionId: '',
        };

        let dstList: GetDstListData[] = await basicData.transformMgt.getDstList(params);
        const groupName: string[] = [];
        const feeders: SelectGroup[] = [];

        // feeders.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ { name: Mes['titleLabelComboallcomboall'], value: '' } ] });
        if (dstList && dstList.length > 0) {
            dstList.map((v: GetDstListData) => {
                if (!groupName.includes(v.GNAME)) {
                    groupName.push(v.GNAME);
                }
            });
            for (let g of groupName) {
                const list = dstList.filter((v: GetDstListData) => v.GNAME === g);
                let children: SelectGroup[] = [];

                list.map((v: GetDstListData) => {
                    children.push({ name: v.NAME, value: v.ID });
                });
                const feeder: SelectGroup = {
                    name: g,
                    value: g,
                    children: children,
                };

                feeders.push(feeder);
            }
            setFeederList(feeders);
        }
    };

    const getNodeTree = async () => {
        const res = await user.userNodeTree(subSysNo);
        let nodeList: CascaderData[] = [];

        nodeDataFormatCascader(res, nodeList);
        let node = nodeList[0].value;

        setNodeName(node);
        setNodeTree(nodeList);
        nodeNo = nodeList[0].value;
        getFeederList(nodeNo);
    };

    const getMeterTypeList = () => {
        collectReport.meterAlarmEvent.getMeterModelNos().then((res: MeterModeNo[]) => {
            let types = [];

            types.push({ METER_MODEL_NAME: 'All', METER_MODEL_NO: 'all' });
            types = types.concat(res);
            setMeterTypeList(types);
        });
    };

    const getMeterAlarmOptionList = (meterModel:string) => {
        collectReport.meterAlarmEvent.getMeterAlarmOptions(meterModel).then((res: MeterAlarmOption[]) => {
            let options = [];

            options.push({ WORD_NAME: 'All', WORD_NAME_EN: 'all', WORD_SEQ: '' });
            options = options.concat(res);
            setAlarmOptionList(options);
        });
    };

    const updateAlarmStatus = async (): Promise<void> => {
        let apis = [];

        for (let meter of meterNos) {
            apis.push(collectReport.dcuAlarmEvent.updateAlarmStatus({alarmType: 'ALARM-METER', guid: meter}, randomStr(20)));
        }
        try {
            await Promise.all(apis);
        } catch (err:any) {
            message.error(err);
            console.log(err);
        }
        getData(current, startTime, endTime, ROWS, '');
        setSelectedRowKeys([]);
    };


    const changeDate = (dates: any, dateStrings: string[]) => {
        if (dateStrings.length) {
            setStartTime(dateStrings[0]);
            setEndTime(dateStrings[1]);
        }
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Search',
            btnType: 'primary',
            title: Mes['btnTitleSearch'],
            onClick () {
                getData(1, startTime, endTime, ROWS, '');

            },
        },
        {
            type: 'Print',
            btnType: 'primary',
            title: Mes['titleLabelPrintprint'],
            onClick () {
                getData(1, startTime, endTime, 999, 'print');

            },
        },
        {
            type: 'Confirm',
            btnType: 'primary',
            title: Mes['btnConfirmconfirm'],
            onClick () {
                if (meterNos.length > 0) {
                    updateAlarmStatus();
                } else {
                    message.warn(Mes['messageAlarmSelectdevicefirstselectdevicefirst']);
                }
            },
        },
    ];

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            sorter: (a: MeterAlarmEvent, b: MeterAlarmEvent) => parseInt(a.CST_ADDR, 10) - parseInt(b.CST_ADDR, 10),
        },
        {
            title: Mes['titleTableGridcustomernamegridcustomername'],
            dataIndex: 'CUSTOMER_NAME',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: Mes['titleTableAlarmLevelalarmlevel'],
            dataIndex: 'BIT_LEN',
            render (_: any, record: MeterAlarmEvent) {
                if (record.BIT_LEN === 1) {
                    return (
                        <>
                            <span>Low Level</span>
                        </>
                    );
                }
                if (record.BIT_LEN === 2) {
                    return (
                        <>
                            <span>Middle Level</span>
                        </>
                    );
                }
                if (record.BIT_LEN === 3) {
                    return (
                        <>
                            <span>High Level</span>
                        </>
                    );
                }
            },
        },
        {
            title: Mes['titleTableUpgradestatusupgradestatus'],
            dataIndex: 'STATUS',
            render (_: any, record: MeterAlarmEvent) {
                return (
                    <>
                        <span>{ record.STATUS === '1' ? 'Confirmed' : 'UnConfirmed'}</span>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableMeasurepointmeasurepoint'],
            dataIndex: 'CHECK_POINT_NUM',
        },
        {
            title: Mes['titleTableOccurtimeoccurtime'],
            dataIndex: 'OCCUR_DATETIME',
            sorter: (a: MeterAlarmEvent, b: MeterAlarmEvent) => Date.parse(a.OCCUR_DATETIME) - Date.parse(b.OCCUR_DATETIME),
        },
        {
            title: Mes['titleTableAlarmDescalarmdesc'],
            dataIndex: 'WORD_NAME',
        },
    ];

    const initConfig = async () => {
        try {
            const date = new Date();

            let end = moment(date).format(format);
            let start = moment(date.setDate(date.getDate() - 1)).format(format);

            setStartTime(start);
            setEndTime(end);
            getData(1, start, end, ROWS, '');
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const onSelectNode = (value:string) => {
        setNodeName(value);
        nodeNo = value;
        setDstId('');
        getFeederList(nodeNo);
    };

    const onSelectDst = (value: string) => {
        setDstId(value);
    };

    const onSelectStatus = (value: string) => {
        setStatus(value);
    };

    const onSelectAlarmLevel = (value: string) => {
        setAlarmLevel(value);
    };

    const onSelectMeterType = (value: string) => {
        setMeterType(value);
        getMeterAlarmOptionList(value);
        setAlarmOption('all_');
    };

    const onSelectAlarmOption = (value: string) => {
        setAlarmOption(value);
    };

    const onSelectSearchType = (value: string) => {
        setSearchField(value);
    };

    const inputFieldValue = (e:any) => {
        const { value } = e.target;

        setFieldValue(value);
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            ROWS = pageSize!;
            getData(page, startTime, endTime, ROWS, '');
            setSelectedRowKeys([]);
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: MeterAlarmEvent[]) => {
            setSelectedRowKeys(keys);
            meterNos = [];
            if (selectedRows.length > 0) {
                selectedRows.forEach((v:MeterAlarmEvent) => {
                    meterNos.push(v.SN);
                });
            }
        },
    };

    useEffect(() => {
        initConfig();
        getNodeTree();
        getMeterTypeList();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleMeterAlarmEvent']}</h4>
            </div>
            <div className='pv10h20'>
                <Row gutter={20}>
                    <Col span={5}>
                        <RangePicker style={{ width: '100%' }} showTime format={format} value={[ moment(startTime, format), moment(endTime, format) ]} onChange={changeDate} allowClear={ false}/>
                    </Col>
                    <Col span={4}>
                        <TreeSelect treeDefaultExpandAll style={{ width: '100%' }} value={nodeName} treeData={ nodeTree} onSelect={ onSelectNode}></TreeSelect>
                        {/* <Select style={{ width: '100%' }} value={nodeName} dropdownRender={() => (
                            <div>
                                <Tree
                                    defaultExpandAll={true}
                                    autoExpandParent={true}
                                    treeData={nodeTree}
                                    onSelect={ onSelectNode}
                                />
                            </div>
                        )}></Select> */}
                    </Col>
                    <Col span={4}>
                        <Select style={{ width: '100%' }} value={dstId} onSelect={ onSelectDst}>
                            {
                                feederList && feederList.map((item) => (
                                    <OptGroup key={item.value} label={item.name}>
                                        {
                                            item.children?.map((o) => (
                                                <Option value={ o.value} key={o.value}>{ o.name }</Option>
                                            ))
                                        }
                                    </OptGroup>
                                ))
                            }
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select value={status} style={{ width: '100%' }} onSelect={ onSelectStatus}>
                            <Option value='all'>{Mes['titleLabelComboallcomboall']}</Option>
                            <Option value='1'>{Mes['comboboxConfirmedconfirmed']}</Option>
                            <Option value='0'>{ Mes['comboboxUnconfirmedunconfirmed']}</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select value={alarmLevel} style={{ width: '100%' }} onSelect={ onSelectAlarmLevel}>
                            <Option value='all'>All</Option>
                            <Option value='1'>Low Level</Option>
                            <Option value='2'>Middle Level</Option>
                            <Option value='3'>High Level</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={20} style={{paddingTop: '10px'}}>
                    <Col span={4}>
                        <Select style={{ width: '100%' }} value={meterType} onSelect={ onSelectMeterType}>
                            {meterTypeList.length && meterTypeList.map((v: MeterModeNo) =>
                                (<Option value={ v.METER_MODEL_NO} key={ v.METER_MODEL_NO}>{ v.METER_MODEL_NAME}</Option>)
                            )}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select style={{ width: '100%' }} value={alarmOption} onSelect={ onSelectAlarmOption}>
                            {alarmOptionList.length && alarmOptionList.map((v: MeterAlarmOption) => (
                                <Option value={v.WORD_NAME_EN + '_' + v.WORD_SEQ} key={v.WORD_NAME_EN + '_' + v.WORD_SEQ}>{v.WORD_NAME}</Option>
                            )
                            )}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Select value={searchField} style={{ width: '100%' }} onSelect={ onSelectSearchType}>
                            <Option value='METER_NO'>Meter No</Option>
                            <Option value='CUSTOMER_NAME'>Customer Name</Option>
                            <Option value='CST_ADDR'>DCU Address</Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Input value={fieldValue} onChange={ inputFieldValue}></Input>
                    </Col>
                    <Col span={4} className='flex flexBetween'>
                        <BtnList btnList={btnList} />

                    </Col>
                </Row>
                <div style={{ paddingTop: '10px' }}>
                    <div className='table'>
                        <Table className='table' loading={loading} columns={detailColumns} rowKey='SN'
                            pagination={false} dataSource={meterAlarmList}
                            rowSelection={{
                                type: 'checkbox',
                                ...rowSelection,
                            }}
                            onRow={(record) => ({
                                onClick: () => {
                                    let key = record.SN;
                                    const rowsKeys = [ ...selectedRowKeys ];
                                    let index = rowsKeys.indexOf(key);

                                    if (index >= 0) {
                                        rowsKeys.splice(index, 1);
                                        meterNos.splice(index, 1);
                                    } else {
                                        rowsKeys.push(key);
                                        meterNos.push(record.SN);
                                    }
                                    setSelectedRowKeys(rowsKeys);
                                },
                            })}>
                        </Table>
                    </div>
                    <div className='positonLtBt'>
                        <Pagination {...pagination} />
                    </div>
                </div>
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(MeterAlarmEventPage);
