// eslint-disable-next-line no-use-before-define
import React, { useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { Table, message, Pagination } from 'antd';
import useFetchState from 'src/utils/useFetchState';
import { basicData, user } from 'src/api';
import { UserNode } from 'src/api/user/type';
import { GetDstListData, GetDstListParasm } from 'src/api/basicData/transformMgt/type';
import SearchList, { SRef } from 'src/components/business/searchList';
import { BtnConfig } from 'src/components/common/btnList';
import moment from 'moment';
import { collectReport } from 'src/api';
import { FrozenData, FrozenDataList } from 'src/api/collectReport/frozenData/types';
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

let nodeIds: string[] = [];
let nodeName = '';
let nodeNo = '';
let ROWS = 10;

const DailyFrozenDataPage: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;

    const format = 'YYYY-MM-DD';
    const sRef = useRef<SRef>();

    // const [ searchColumns, setSearchColumns ] = useFetchState<any[]>([]);
    const [ dailyFrozenList, setDailyFrozenList ] = useFetchState<FrozenData[]>([]);
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ current, setCurrent ] = useFetchState<number>(0);
    const [ loading, setLoading ] = useFetchState<boolean>(false);
    const [ feeders, setFeeders ] = useFetchState<SelectGroup[]>([]);
    const [ nodeTree, setNodeTree ] = useFetchState<CascaderData[]>([]);
    // const [ start, setStart ] = useFetchState<string>('');
    // const [ end, setEnd ] = useFetchState<string>('');

    const detailColumns = [
        {
            dataIndex: 'rn__',
            width: 30,
        },
        {
            title: Mes['titleTableDcuaddrdcuaddr'],
            dataIndex: 'CST_ADDR',
            // sorter: (a: DailyFrozenData, b: DailyFrozenData) => parseFloat(a.CST_ADDR) - parseFloat(b.CST_ADDR),
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
            title: Mes['titleTableReaddatareaddata'],
            dataIndex: 'FREEZEN_DATE',
            sorter: (a: FrozenData, b: FrozenData) => Date.parse(a.FREEZEN_DATE) - Date.parse(b.FREEZEN_DATE),
        },
        {
            title: Mes['titleTableFrozenvaluefrozenvalue'],
            dataIndex: 'FREEZEN_VALUE',
        },
        {
            title: Mes['titleTableRegistertimeregistertime'],
            dataIndex: 'REGISTER_TIME',
            sorter: (a: FrozenData, b: FrozenData) => Date.parse(a.REGISTER_TIME) - Date.parse(b.REGISTER_TIME),
        },
    ];

    const changeDate = (dates: any, dateStrings: string[]) => {
        sRef.current?.setFieldsValue({
            searchDate: [ moment(dateStrings[0], format), moment(dateStrings[1], format) ],
        });
    };

    const getData = (page: number = 1, rows:number, searchType?:string) => {
        sRef.current?.getFormData().then((data: any) => {
            setLoading(true);
            let params: any = {};

            if (searchType) {
                params = {
                    subSysNo: subSysNo,
                    page: page,
                    rows: rows,
                    searchField: data.searchField,
                    fieldValue: data.fieldValue ? data.fieldValue : '',
                    searchNode: nodeNo,
                    dstId: data.dstId,
                    startDate: data.searchDate[0].format(format),
                    endDate: data.searchDate[1].format(format),
                    searchType: searchType,
                };
            } else {
                params = {
                    subSysNo: subSysNo,
                    page: page,
                    rows: rows,
                    searchField: data.searchField,
                    fieldValue: data.fieldValue ? data.fieldValue : '',
                    searchNode: nodeNo,
                    dstId: data.dstId,
                    startDate: data.searchDate[0].format(format),
                    endDate: data.searchDate[1].format(format),
                };
            }

            collectReport.frozenData.dailyFrozenDataQuery(params).then((res:FrozenDataList) => {
                setLoading(false);

                if (searchType) {
                    // eslint-disable-next-line new-cap
                    const doc = new jsPDF('p', 'pt', 'a4');
                    // 设置中文字体

                    doc.addFileToVFS('ok.ttf', font);
                    doc.addFont('ok.ttf', 'font', 'normal');
                    doc.setFont('font');
                    doc.text('Day Freezen Report', 200, 20);
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
                            { header: Mes['titleTableDcuaddrdcuaddr'], dataKey: 'CST_ADDR' },
                            { header: Mes['titleTableGridcustomernamegridcustomername'], dataKey: 'CUSTOMER_NAME' },
                            { header: Mes['titleTableMeternometerno'], dataKey: 'METER_NO' },
                            { header: Mes['titleTableReaddatareaddata'], dataKey: 'FREEZEN_DATE' },
                            { header: Mes['titleTableFrozenvaluefrozenvalue'], dataKey: 'FREEZEN_VALUE' },
                            { header: Mes['titleTableRegistertimeregistertime'], dataKey: 'REGISTER_TIME' },
                        ],
                    });
                    let blob = doc.output('blob');

                    let url = window.URL.createObjectURL(blob);

                    window.open(url);
                    // doc.output('dataurlnewwindow').open();
                    // let base64URL = doc.output('dataurlstring', {filename: 'test.pdf'});
                    // let win = window.open(base64URL);

                    // win!.document.write('<iframe title="test" src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                } else {
                    setDailyFrozenList(res.rows);
                    setTotal(res.total);
                    setCurrent(page);
                }
            })
                .catch((err) => {
                    setLoading(false);
                    message.error(err);
                });
        });
    };

    const search = (data: any) => {
        console.log('a-----', data);
        getData(1, ROWS, '');
    };

    const onSelect = async (keys: React.Key[], info: any) => {
        console.log(info);
        nodeName = info.title;
        sRef.current?.setFieldsValue({
            searchNode: nodeName,
            dstId: '',
        });
        nodeNo = info.key;
        const params: GetDstListParasm = {
            subSysNo: subSysNo,
            nodeNo: nodeNo,
            sectionId: '',
        };

        let dstList: GetDstListData[] = await basicData.transformMgt.getDstList(params);
        const groupName: string[] = [];
        let feederlist = [];

        feederlist.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ {name: Mes['titleLabelComboallcomboall'], value: ''} ]});
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

                feederlist.push(feeder);
            }

        }
        setFeeders(feederlist);
    };

    const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
        const node = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

        node.forEach((item:UserNode) => {
            const findNode = nodeList.find((v:UserNode) => v.PARENTID === item.ID);
            const obj: CascaderData = {
                title: item.NAME,
                value: item.ID,
            };

            nodeIds.push(item.ID);
            if (findNode) {
                obj.children = [];
                rootNode.push(obj);
                nodeDataFormatCascader(nodeList, obj.children, item.ID);
            } else {
                rootNode.push(obj);
            }
        });
    };

    // const print = (url:string, parameters:any, features:any) => {
    //     let tempForm = document.createElement('form');

    //     tempForm.id = 'jasperForm';
    //     tempForm.method = 'post';
    //     tempForm.action = url;

    //     // 新窗口
    //     if (features === null) {
    //         tempForm.target = '_blank';
    //     } else if (features === '') {
    //         features = 'width=' + (window.screen.availWidth - 10) + ',height=' + (window.screen.availHeight - 60) + ',top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no';
    //         window.open('', 'jasperTarget', features);
    //         tempForm.target = 'jasperTarget';
    //     } else {
    //         window.open('', 'jasperTarget', features);
    //         tempForm.target = 'jasperTarget';
    //     }

    //     // 创建input设置参数
    //     for (let param in parameters) {
    //         let hideInput = document.createElement('input');

    //         hideInput.type = 'hidden';
    //         hideInput.name = param;
    //         hideInput.value = parameters[param];
    //         tempForm.appendChild(hideInput);
    //     }
    //     // 将此form表单添加到页面主体body中
    //     document.body.appendChild(tempForm);
    //     // 手动触发，提交表单
    //     tempForm.submit();
    //     // 从body中移除form表单
    //     document.body.removeChild(tempForm);
    // };

    const btnList: BtnConfig[] = [
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

    const searchList = [
        {
            name: 'searchDate',
            type: 'RangePicker',
            col: 4,
            attr: {
                format: format,
                style: { width: '100%' },
                defaultValue: [ moment(new Date(new Date().getTime() - 1000 * 60 * 60 * 24), format), moment(new Date(), format) ],
                onChange: changeDate,
                allowClear: false,
            },
        },
        {
            name: 'searchNode',
            col: 3,
            type: 'SelectTree',
            treeOpt: nodeTree,
            attr: {
                style: { width: '100%' },
                onSelect: onSelect,
            },
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
            name: 'searchField',
            col: 3,
            type: 'Select',
            attr: {
                style: { width: '100%' },
            },
            options: [ {name: Mes['titleTableGridcustomernamegridcustomername'], value: 'CUSTOMER_NAME'}, {name: Mes['titleTableMeternometerno'], value: 'METER_NO'}, {name: Mes['titleTableDcuaddrdcuaddr'], value: 'CST_ADDR'} ],
        },
        {
            name: 'fieldValue',
            col: 3,
            type: 'Input',
        },
    ];

    const initConfig = async () => {
        try {
            const date = new Date();

            let endDate = moment(date).format(format);
            let startDate = moment(date.setDate(date.getDate() - 1)).format(format);

            // setStart(startDate);
            // setEnd(endDate);
            const res = await user.userNodeTree(subSysNo);
            let nodes = [ ...nodeTree ];

            nodeDataFormatCascader(res, nodes);
            nodeName = nodes[0].title;
            nodeNo = nodes[0].value;
            setNodeTree(nodes);
            const params: GetDstListParasm = {
                subSysNo: subSysNo,
                nodeNo: nodes[0].value,
                sectionId: '',
            };

            let dstList: GetDstListData[] = await basicData.transformMgt.getDstList(params);
            const groupName: string[] = [];
            let feederlist = [ ...feeders ];

            feederlist.push({ name: Mes['titleLabelComboallcomboall'], value: '', children: [ {name: Mes['titleLabelComboallcomboall'], value: ''} ]});
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

                    feederlist.push(feeder);
                }

            }
            setFeeders(feederlist);
            setTimeout(() => {
                sRef.current?.setFieldsValue({
                    searchDate: [ moment(startDate, format), moment(endDate, format) ],
                    searchNode: nodeName,
                    searchField: 'CST_ADDR',
                    dstId: '',
                });
                getData(1, ROWS, '');
            }, 500);

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


    useEffect(() => {
        initConfig();
    }, []);

    return (<>
        <div className='main'>
            <div className='flexCenter flexBetween title'>
                <h4>{Mes['titleTableFrozendataqueryfrozendataquery']}</h4>
            </div>
            <div className='pv10h20'>

                {
                    searchList.length && <SearchList cRef={sRef} columns={searchList} onFinish={search} isReset={false} btnConfig={ btnConfig}/>
                }
                <div id={'table'} className='table'>
                    <Table columns={detailColumns} style={{ width: '100%' }} rowKey='rn__' className='table' dataSource={dailyFrozenList} loading={loading}
                        pagination={ false}
                        onRow={() => ({
                            onDoubleClick: () => {
                                console.log('double');
                            },
                        })}></Table>
                </div>
                <div className='positonLtBt'>
                    <Pagination {...pagination} />
                </div>
            </div>
        </div>
    </>);
};

export default connect((state:any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(DailyFrozenDataPage);
