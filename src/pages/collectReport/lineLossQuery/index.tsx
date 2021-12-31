// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { message, Table, Row, Col, Modal, Button, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { basicData, collectReport } from 'src/api';
import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import moment from 'moment';
import { LineLossData, LineLossStatistics, LineLossList, SendCmdResult } from 'src/api/collectReport/linelossQuery/types';
import './index.less';
import { showLoading, hideLoading } from 'src/components/common/loding';
import bus from 'src/utils/eventBus';
import { v4 } from 'uuid';
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

let ROWS = 15;
let taskNum = 0;
let lineLossDate = '';
let receiveMessNum = 0;
let groupId = '';
let detailRecord: LineLossData = {};
const LineLossQueryPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo, nodeNo } = props;

    const format = 'YYYY-MM-DD';
    const sRef = useRef<SRef>();

    const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ lineLossList, setLineLossList ] = useFetchState<LineLossData[]>([]);
    const [ lineLossStatistics, setLineLossStatistics ] = useFetchState<LineLossStatistics>({checkMeterCount: 0, checkMeterSum: 0, clientMeterCount: 0, clientMeterSum: 0});
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ transform, setTransform ] = useFetchState<string>('');
    const [ transformList, setTransformList ] = useFetchState<GetDstListData[]>([]);
    const [ lineLossDetal, setLineLossDetail ] = useFetchState<LineLossData[]>([]);
    const [ detailTotal, setDetailTotal ] = useFetchState<number>(0);
    const [ detailCurrent, setDetailCurrent ] = useFetchState<number>(0);
    const [ detailLoading, setDetailLoading ] = useFetchState<boolean>(false);
    const [ modalVisible, setModalVisible ] = useFetchState<boolean>(false);


    const showDetailModal = (page:number, record:LineLossData) => {
        setModalVisible(true);
        setDetailLoading(true);
        detailRecord = record;
        let params = {
            page: page,
            rows: ROWS,
            cstId: record.CST_ID,
            frozenType: record.FROZEN_TYPE,
            date: record.CREATE_DATE,
        };

        collectReport.linelossQuery.getLineLossDetailList(params).then((res) => {
            setDetailLoading(false);
            setDetailTotal(res.total);
            setDetailCurrent(page);
            setLineLossDetail(res.rows);
        });
    };

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
        },
        {
            title: 'Load Meter Num',
            dataIndex: 'METER_COUNT',
        },
        {
            title: 'Check Meter Num',
            dataIndex: 'CHECK_METER_COUNT',
        },
        {
            title: 'Client Meter Num',
            dataIndex: 'CLIENT_METER_COUNT',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_DATE',
        },
        {
            title: Mes['lineLossTableCheckcapturedatacheckcapturedata'],
            dataIndex: 'CHECK_CAPTURE_DATA',
        },
        {
            title: Mes['lineLossTableClientcapturedataclientcapturedata'],
            dataIndex: 'CLIENT_CAPTURE_DATA',

        },
        {
            title: Mes['lineLossTableDiffvaluediffvalue'],
            dataIndex: 'DIFF_CAPTURE_DATA',

        },
        {
            title: Mes['titleTableOperationoperation'],
            render (_: any, record: LineLossData) {
                return (
                    <>
                        <a onClick={(e: any) => {
                            e.stopPropagation();// 阻止点击事件向上冒泡
                            showDetailModal(1, record);
                        }}>Detail</a>
                    </>
                );
            },
        },
        // {
        //     title: Mes['lineLossTableClientcapturedataclientcapturedata'],
        //     render (_: any, record: LineLossData) {
        //         return (
        //             <>
        //                 <span>{ record.CHECK_CAPTURE_DATA !== '' ? parseInt(record.CHECK_CAPTURE_DATA, 10) - parseInt(record.CLIENT_CAPTURE_DATA, 10) : '-'}</span>
        //             </>
        //         );
        //     },

        // },

    ];

    const modalColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableDcunodcuno'],
            dataIndex: 'CST_NO',
        },
        {
            title: Mes['titleTableMeternometerno'],
            dataIndex: 'METER_NO',
        },
        {
            title: 'Check Device No',
            dataIndex: 'CHECK_METER_NO',
        },
        {
            title: Mes['titleTableCreatedatecreatedate'],
            dataIndex: 'CREATE_DATE',
        },
        {
            title: Mes['lineLossTableCheckcapturedatacheckcapturedata'],
            dataIndex: 'CHECK_CAPTURE_DATA',
        },
        {
            title: Mes['lineLossTableClientcapturedataclientcapturedata'],
            dataIndex: 'CLIENT_CAPTURE_DATA',

        },
        {
            title: Mes['lineLossTableDiffvaluediffvalue'],
            dataIndex: 'DIFF_CAPTURE_DATA',

        },

    ];

    const changeDate = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            searchDate: [ moment(dateStrings[0], format), moment(dateStrings[1], format) ],
        });
    };

    const getData = (page:number = 1, rows:number, type:string) => {
        setLoading(true);
        sRef.current?.getFormData().then((data: any) => {
            let params: any = {};

            let dst = transformList.filter((v: GetDstListData) => v.ID === data.dstId);

            if (dst.length > 0) {
                setTransform(dst[0].NAME);
            } else {
                setTransform('All');
            }

            params = {
                subSysNo: subSysNo,
                page: page,
                rows: rows,
                sortOrder: 'asc',
                dstId: data.dstId,
                startDate: data.searchDate[0].format(format),
                endDate: data.searchDate[1].format(format),
                frozenType: data.frozenType,
            };
            collectReport.linelossQuery.getLineLossDataList(params).then((res:LineLossList) => {
                setLoading(false);
                if (type) {
                    // eslint-disable-next-line new-cap
                    const doc = new jsPDF('p', 'pt', 'a4');
                    // 设置中文字体

                    doc.addFileToVFS('ok.ttf', font);
                    doc.addFont('ok.ttf', 'font', 'normal');
                    doc.setFont('font');
                    doc.text('Line Loss Report', 200, 20);
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
                        // },
                        theme: 'grid', // 主题
                        startY: 40, // 距离上边的距离
                        margin: 10, // 距离左右边的距离
                        body: res.rows, // 表格内容
                        columns: [ // 表头
                            { header: Mes['titleLabelNono'], dataKey: 'rn__' },
                            { header: Mes['titleTableDcunodcuno'], dataKey: 'CST_NO' },
                            { header: Mes['titleTableDcuaddrdcuaddr'], dataKey: 'CST_ADDR' },
                            { header: 'Load Meter Num', dataKey: 'METER_COUNT' },
                            { header: 'Check Meter Num', dataKey: 'CHECK_METER_COUNT' },
                            { header: 'Client Meter Num', dataKey: 'CLIENT_METER_COUNT' },
                            { header: Mes['titleTableCreatedatecreatedate'], dataKey: 'CREATE_DATE' },
                            { header: Mes['lineLossTableCheckcapturedatacheckcapturedata'], dataKey: 'CHECK_CAPTURE_DATA' },
                            { header: Mes['lineLossTableClientcapturedataclientcapturedata'], dataKey: 'CLIENT_CAPTURE_DATA' },
                            { header: Mes['lineLossTableDiffvaluediffvalue'], dataKey: 'DIFF_CAPTURE_DATA' },
                        ],
                    });
                    let blob = doc.output('blob');

                    let url = window.URL.createObjectURL(blob);

                    window.open(url);
                    // let base64URL = doc.output('datauristring');
                    // let win = window.open();

                    // win!.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                } else {
                    setLineLossList(res.rows);
                    setTotal(res.total);
                    setCurrent(page);
                }
            })
                .catch((err) => {
                    setLoading(false);
                    message.error(err);
                });

            collectReport.linelossQuery.getLineLossStatistics(params).then((res: LineLossStatistics) => {
                setLineLossStatistics(res);
            });
        });
    };

    const search = () => {
        getData(1, ROWS, '');
    };

    // 发送webSocket消息
    const startSend = () => {
        groupId = v4();
        receiveMessNum = 0;
        const obj = {
            name: 'otask',
            guid: groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
    };

    // 下发指令
    const sendCmd = () => {
        sRef.current?.getFormData().then((data: any) => {
            showLoading();
            collectReport.linelossQuery.sendCmd(groupId, data.frozenType).then((res: SendCmdResult) => {
                taskNum = res.taskNum;
                lineLossDate = res.lineLossDate;
                receiveMessNum = 0;
            })
                .catch((err) => {
                    message.error(err);
                    hideLoading();
                });
        });
    };

    // 断开连接
    const disconnect = () => {
        sRef.current?.getFormData().then((data: any) => {

            collectReport.linelossQuery.disconnect(data.frozenType);
        });
    };

    // 计算线损
    const computeLineloss = () => {
        sRef.current?.getFormData().then((data: any) => {

            collectReport.linelossQuery.computeLineloss(lineLossDate, data.frozenType).then(() => {
                hideLoading();
                disconnect();
                getData(1, ROWS, '');
            })
                .catch((err) => {
                    message.error(err);
                    hideLoading();
                });
        });
    };

    // webSocket消息回调函数
    const OnDemand = (data: any) => {
        let wsguid = data.guid;
        let name = data.name;

        if (wsguid === groupId) {
            receiveMessNum++;
            if (receiveMessNum === 1 && name === 'otask-confirm') {
                sendCmd();
                receiveMessNum = 0;
            } else if (receiveMessNum > 0) {
                if (taskNum === receiveMessNum) {
                    taskNum = 0;
                    computeLineloss();

                }
            }

        }
    };

    const btnList: BtnConfig[] = [
        {
            type: 'Start',
            btnType: 'primary',
            title: Mes['btnPlayondemandplayondemand'],
            onClick () {
                startSend();
            },
        },
        {
            type: 'Print',
            btnType: 'primary',
            title: Mes['titleLabelPrintprint'],
            onClick () {
                getData(1, 1000, 'print');

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

            setTransformList(dstList);
            const groupName: string[] = [];
            const feeders: SelectGroup[] = [];

            feeders.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ {name: Mes['titleLabelComboallcomboall'], value: ''} ]});
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
                    name: 'frozenType',
                    col: 4,
                    type: 'Select',
                    attr: {
                        style: { width: '100%' },
                    },
                    options: [ {name: 'Daily load profile', value: 'Daily'}, {name: 'Monthly billing profile', value: 'Monthly'} ],
                },
                {
                    name: 'dstId',
                    col: 4,
                    type: 'SelectGroup',
                    options: feeders,
                    attr: {
                        style: { width: '100%' },
                    },
                },
            ];

            setSearchColumns(searchList);
            sRef.current?.setFieldsValue({
                searchDate: [ moment(start, format), moment(end, format) ],
                frozenType: 'Daily',
                dstId: '',
            });
            setTransform('All');
            getData(1, ROWS, '');
        } catch (error: any) {
            message.warn(error.toString());
        }
    };

    const pagination = {
        total: total,
        onChange (page: number, pageSize: number | undefined) {
            ROWS = pageSize!;
            getData(page, ROWS, '');
        },
        current: current,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const detailPagination = {
        total: detailTotal,
        onChange (page: number) {
            showDetailModal(page, detailRecord);
        },
        current: detailCurrent,
        hideOnSinglePage: true,
        pageSize: ROWS,
        showSizeChanger: false,
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        initConfig();
        // webSocket监听
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
        };
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['titleLabelLinelossreportlinelossreport']}</h4>
            </div>
            <div className='pv10h20'>

                {
                    searchColumns.length && <SearchList cRef={sRef} columns={searchColumns} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div id={'table'} className='table'>
                    <Row gutter={20} style={{padding: '10px', display: 'none'}}>
                        <Col span={4}>
                            <div className='statisticsTitle'>Transformer</div>
                            <div className='statisticsContent'>{ transform}</div>
                        </Col>
                        <Col span={4}>
                            <div className='statisticsTitle'>Check Meter Count</div>
                            <div className='statisticsContent'>{ lineLossStatistics.checkMeterCount ? lineLossStatistics.checkMeterCount : 0}</div>
                        </Col>
                        <Col span={4}>
                            <div className='statisticsTitle'>Customer Meter Count</div>
                            <div className='statisticsContent'>{ lineLossStatistics.clientMeterCount ? lineLossStatistics.clientMeterCount : 0}</div>
                        </Col>
                        <Col span={4}>
                            <div className='statisticsTitle'>Summary Check Meter</div>
                            <div className='statisticsContent'>{ lineLossStatistics.checkMeterSum ? lineLossStatistics.checkMeterSum : 0}</div>
                        </Col>
                        <Col span={4}>
                            <div className='statisticsTitle'>Summary Customer Meter</div>
                            <div className='statisticsContent'>{ lineLossStatistics.clientMeterSum ? lineLossStatistics.clientMeterSum : 0}</div>
                        </Col>
                    </Row>
                    <Table columns={detailColumns} style={{ width: '100%' }} rowKey='rn__' className='table' dataSource={lineLossList} loading={loading}
                        pagination={ false}
                    ></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
            <Modal visible={modalVisible}
                destroyOnClose
                width={ 1000}
                onCancel={handleCancel}
                title={ Mes['titleTableLast5gridcoldetaillast5gridcoldetail']}
                // afterClose={afterClose}
                footer={[
                    <Button key='back' onClick={handleCancel}>{ Mes['btnCancelcancel'] }</Button>,
                ]}>
                <Table columns={modalColumns} style={{ width: '1000' }} rowKey='rn__' className='table' dataSource={lineLossDetal} loading={detailLoading}
                    pagination={ detailPagination}
                ></Table>
            </Modal>
        </div>
    </>);
};


export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
    nodeNo: state.userInfo.sysUser.nodeNo,
}))(LineLossQueryPage);
