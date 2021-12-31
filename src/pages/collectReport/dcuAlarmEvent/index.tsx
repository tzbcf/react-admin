/* eslint-disable new-cap */
/* eslint-disable camelcase */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { basicData, collectReport } from 'src/api';
import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import moment from 'moment';
import { DcuAlarmEvent, DcuAlarmEventList } from 'src/api/collectReport/dcuAlarmEvent/types';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import { randomStr } from 'src/utils/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import font from 'src/utils/fzytk-normal';

type Props = {
    Mes: LangMessage;
    subSysNo: string;
    nodeNo: string;
};

type SelectGroup = {
    name: string;
    value: string;
    children?: SelectGroup[];
}

let ROWS = 10;
let dcuNos: string[] = [];
let sortName = '';
let sortType = 'asc';
const DcuAlarmEventPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;

    const format = 'YYYY-MM-DD';
    const sRef = useRef<SRef>();
    const tRef = useRef<TRef>();
    const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ dcuAlarmEventList, setDcuAlarmEventList ] = useFetchState<DcuAlarmEvent[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ selectedRowKeys, setSelectedRowKeys ] = useFetchState<any[]>([]);

    const showDeviceInfo = (deviceType: string, deviceId: string) => {
        if (deviceType === 'DCU') {
            tRef.current?.openModel('dcu', deviceId);
        } else {
            tRef.current?.openModel('meter', deviceId);
        }
    };
    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableSectionsection'],
            dataIndex: 'SECTION_NAME',
            sorter: true,
        },
        {
            title: Mes['titleTableTransformernametransformername'],
            dataIndex: 'DST_NAME',
            sorter: true,
        },
        {
            title: Mes['titleTableDeviceaddressdeviceaddress'],
            dataIndex: 'SN_DEVICE',
            render (_: any, record: DcuAlarmEvent) {
                return (
                    <>
                        <a onClick={(e: any) => {
                            e.stopPropagation();// 阻止点击事件向上冒泡
                            showDeviceInfo(record.DEVICE_TYPE, record.CST_ID);
                        }}>{record.SN_DEVICE}</a>
                    </>
                );
            },
        },
        {
            title: Mes['titleTableDevicetypedevicetype'],
            dataIndex: 'DEVICE_TYPE',
        },
        {
            title: Mes['titleTableUpgradestatusupgradestatus'],
            dataIndex: 'STATUS_DESC',
        },
        {
            title: Mes['titleTableOccurtimeoccurtime'],
            dataIndex: 'OCCUR_DATETIME',
            sorter: true,
        },
        {
            title: Mes['titleTableEventcontenteventcontent'],
            dataIndex: 'EVENT_DESC',
        },
        {
            title: Mes['titleTableExtendcontentextendcontent'],
            dataIndex: 'EVENT_CONTENT',
            sorter: true,
        },
    ];

    const changeDate = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            searchDate: [ moment(dateStrings[0], format), moment(dateStrings[1], format) ],
        });
    };

    const getData = (page: number, rows:number, type?:string) => {
        setLoading(true);
        sRef.current?.getFormData().then((data: any) => {
            let params: any = {};
            let temp = page;

            params = {
                subSysNo: subSysNo,
                page: page - 1,
                rows: rows,
                sortOrder: sortType,
                sortName: sortName,
                searchField: data.searchField,
                fieldValue: data.fieldValue ? data.fieldValue : '',
                status: data.status,
                dstId: data.dstId,
                eventType: data.eventType,
                startDate: data.searchDate[0].format(format),
                endDate: data.searchDate[1].format(format),
            };
            console.log(params);
            collectReport.dcuAlarmEvent.getDcuAlarmEventList(params).then((res:DcuAlarmEventList) => {
                if (type) {// 打印
                    setLoading(false);
                    const doc = new jsPDF('p', 'pt', 'a4');
                    // 设置中文字体

                    doc.addFileToVFS('ok.ttf', font);
                    doc.addFont('ok.ttf', 'font', 'normal');
                    doc.setFont('font');
                    doc.text('DCU Event Alarm Report', 200, 20);
                    autoTable(doc, {
                        styles: {// 设置表格的字体，不然表格中文也乱码
                            fillColor: [ 255, 255, 255 ], font: 'font', textColor: [ 0, 0, 0 ], halign: 'right', fontSize: 10,
                        },
                        headStyles: { lineWidth: 1, halign: 'center' },
                        // columnStyles: {
                        //     0: { cellWidth: 'auto' },
                        //     1: { cellWidth: 'auto' },
                        //     2: { cellWidth: 'auto' },
                        //     3: { cellWidth: 'auto' },
                        //     4: { cellWidth: 'auto' },
                        //     5: { cellWidth: 'auto' },
                        //     6: { cellWidth: 'auto'},
                        //     7: { cellWidth: 'auto' },
                        //     8: {cellWidth: 'auto' },
                        // },
                        theme: 'grid', // 主题
                        startY: 40, // 距离上边的距离
                        margin: 10, // 距离左右边的距离
                        body: res.rows, // 表格内容
                        columns: [ // 表头
                            { header: Mes['titleLabelNono'], dataKey: 'rn__' },
                            { header: Mes['titleTableSectionsection'], dataKey: 'SECTION_NAME' },
                            { header: Mes['titleTableTransformernametransformername'], dataKey: 'DST_NAME' },
                            { header: Mes['titleTableDeviceaddressdeviceaddress'], dataKey: 'SN_DEVICE' },
                            { header: Mes['titleTableDevicetypedevicetype'], dataKey: 'DEVICE_TYPE' },
                            { header: Mes['titleTableUpgradestatusupgradestatus'], dataKey: 'STATUS_DESC' },
                            { header: Mes['titleTableOccurtimeoccurtime'], dataKey: 'OCCUR_DATETIME' },
                            { header: Mes['titleTableEventcontenteventcontent'], dataKey: 'EVENT_DESC' },
                            { header: Mes['titleTableExtendcontentextendcontent'], dataKey: 'EVENT_CONTENT' },
                        ],
                    });
                    let blob = doc.output('blob');

                    let url = window.URL.createObjectURL(blob);

                    window.open(url);
                    // let base64URL = doc.output('datauristring');
                    // let win = window.open();

                    // win!.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                } else {
                    setLoading(false);
                    setDcuAlarmEventList(res.rows);
                    setTotal(res.total);
                    setCurrent(temp);
                }
            })
                .catch((err) => {
                    setLoading(false);
                    message.error(err);
                });
        });
    };

    const updateAlarmStatus = async (): Promise<void> => {
        let apis = [];

        for (let dcuNo of dcuNos) {
            apis.push(collectReport.dcuAlarmEvent.updateAlarmStatus({alarmType: 'ALARM-DCU', guid: dcuNo}, randomStr(20)));
        }
        try {
            await Promise.all(apis);
        } catch (err:any) {
            message.error(err);
            console.log(err);
        }
        getData(current, ROWS, '');
        setSelectedRowKeys([]);
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Print',
            btnType: 'primary',
            title: Mes['titleLabelPrintprint'],
            onClick () {
                // const win = window.open('', 'printwindow');

                // if (win) {
                //     let table = window.document.getElementById('table');

                //     win.document.write(table!.innerHTML);
                //     win.print();
                //     win.close();
                // }

                getData(1, 1000, 'print');
            },
        },
        {
            type: 'Confirm',
            btnType: 'primary',
            title: Mes['btnConfirmconfirm'],
            onClick () {
                if (dcuNos.length > 0) {
                    updateAlarmStatus();
                } else {
                    message.warn(Mes['messageAlarmSelectdevicefirstselectdevicefirst']);
                }
            },
        },
    ];

    const btnConfig = {
        col: 4,
        btnList: btnList,
    };

    const initConfig = async () => {
        try {
            const date = new Date();

            let end = moment(date).format(format);
            let start = moment(date.setDate(date.getDate() - 1)).format(format);
            const params: GetDstListParasm = {
                subSysNo: subSysNo,
                nodeNo: nodeNo,
                sectionId: '',
            };

            let dstList: GetDstListData[] = await basicData.transformMgt.getDstList(params);
            const groupName: string[] = [];
            const feeders: SelectGroup[] = [];

            feeders.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ {name: Mes['titleLabelComboallcomboall'], value: 'All'} ]});
            if (dstList && dstList.length > 0) {
                dstList.map((v: GetDstListData) => {
                    if (!groupName.includes(v.GNAME)) {
                        groupName.push(v.GNAME);
                    }
                });
                for (let g of groupName) {
                    const list = dstList.filter((v: GetDstListData) => v.GNAME === g);
                    let children:SelectGroup[] = [];

                    list.map((v: GetDstListData) => {
                        children.push({ name: v.NAME, value: v.ID });
                    });
                    const feeder:SelectGroup = {
                        name: g,
                        value: g,
                        children: children,
                    };

                    feeders.push(feeder);
                }

            }
            const searchList = [
                {
                    name: 'searchDate',
                    type: 'RangePicker',
                    col: 4,
                    attr: {
                        format: format,
                        style: { width: '100%' },
                        defaultValue: [ moment(start, format), moment(end, format) ],
                        onChange: changeDate,
                        allowClear: false,
                    },
                },
                {
                    name: 'status',
                    col: 3,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: Mes['titleLabelComboallcomboall'], value: 'all'}, {name: Mes['comboboxConfirmedconfirmed'], value: '1'}, {name: Mes['comboboxUnconfirmedunconfirmed'], value: '0'} ],
                },
                {
                    name: 'dstId',
                    col: 3,
                    type: 'SelectGroup',
                    options: feeders,
                    attr: {
                        style: { width: '100%' },
                    },
                },
                {
                    name: 'eventType',
                    col: 3,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: Mes['titleLabelComboallcomboall'], value: 'all'}, {name: Mes['titleTableDcudcu'], value: '1'}, {name: Mes['titleLabelMetermeter'], value: '0'} ],
                },
                {
                    name: 'searchField',
                    col: 3,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: Mes['titleTableDcuaddrdcuaddr'], value: 'CST_ADDR'}, {name: Mes['titleTableSectionsection'], value: 'SECTION_NAME'} ],
                },
                {
                    name: 'fieldValue',
                    col: 3,
                    type: 'Input',
                },
            ];

            setSearchColumns(searchList);
            sRef.current?.setFieldsValue({
                searchDate: [ moment(start, format), moment(end, format) ],
                status: 'all',
                eventType: 'all',
                searchField: 'CST_ADDR',
                dstId: 'All',
            });
            getData(1, ROWS, '');
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const search = () => {
        setSelectedRowKeys([]);
        dcuNos = [];
        getData(1, ROWS, '');
    };

    const changeTable = (paginations:any, filters:any, sorter:any) => {
        console.log(paginations, filters, sorter);
        if (sorter.field) {
            sortName = sorter.field;
            if (sorter.order) {
                if (sorter.order.includes('asc')) {
                    sortType = sorter.order.substr(0, 3);
                } else {
                    sortType = sorter.order.substr(0, 4);
                }
            } else {
                sortType = 'asc';
            }
            getData(paginations.current, ROWS, '');
        }
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            console.log(page, pageSize);
            ROWS = pageSize!;
            setSelectedRowKeys([]);
            dcuNos = [];
            getData(page, ROWS, '');
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys: React.Key[], selectedRows: DcuAlarmEvent[]) => {
            setSelectedRowKeys(keys);
            dcuNos = [];
            if (selectedRows.length > 0) {
                selectedRows.forEach((v:DcuAlarmEvent) => {
                    dcuNos.push(v.SN);
                });
            }
        },
    };


    useEffect(() => {
        initConfig();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['menuTitleDcuAlarmEvent']}</h4>
            </div>
            <div className='pv10h20'>

                {
                    searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div id={'table'} className='table'>
                    <Table columns={detailColumns} style={{ width: '100%' }} rowKey='SN' className='table' dataSource={dcuAlarmEventList} loading={loading}
                        pagination={false} onChange={ changeTable} rowSelection={{
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
                                    dcuNos.splice(index, 1);
                                } else {
                                    rowsKeys.push(key);
                                    dcuNos.push(record.SN);
                                }
                                setSelectedRowKeys(rowsKeys);
                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
                <TerminalInfo cRef={tRef} />
            </div>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo.sysUser.nodeNo,
}))(DcuAlarmEventPage);
