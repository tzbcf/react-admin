// eslint-disable-next-line no-use-before-define
import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import DeviceTree, { CRef } from 'src/components/business/deviceTree';
import { LangMessage } from 'src/store/common/language';
import { Row, Col, DatePicker, Button, Select, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ModalTable, {MRef, PingForm, WsNodeVal, NodeVal} from './modalTable';
import useFetchState from 'src/utils/useFetchState';
import moment, { Moment } from 'moment';
import { RangeValue } from 'rc-picker/es/interface';
import { abnormalFn } from 'src/utils/function';
import { dateFormat } from 'src/utils/utils';
import { amiFunc } from 'src/api';
import { CensusRow, InitDataEdgesRows, InitDataNodesRow } from 'src/api/AmiFunction/netWorkMgnt/type';
import TerminalInfo, { CRef as TRef } from 'src/components/business/terminalInfo';
import { showLoading, hideLoading } from 'src/components/common/loding';
import { DownloadOutlined } from '@ant-design/icons';
import { deepClone } from 'src/utils/utils';
import G6, { Graph, IG6GraphEvent, NodeConfig } from '@antv/g6';
import { v4 } from 'uuid';
import bus from 'src/utils/eventBus';
import './index.less';
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const defaultColor = '#111';
const hoverEdgeColor = '#000';
const shadowColor = '#999';
const whiteColor = 'white';
const nodeSize = 60;
const dcuMax = 128;
const nodeMaxSplit = 20;
const nodeStr = 'node';
const semaphores = [
    {start: 0, end: 16, level: 1, color: '#36ca78'},
    {start: 16, end: 32, level: 2, color: '#1E9FFF'},
    {start: 32, end: 64, level: 3, color: '#C2C2C2'},
    {start: 64, end: 128, level: 4, color: '#FFB800'},
    {start: 128, end: 256, level: 5, color: '#FF5722'},
];

const offlineSemaphore = {level: 6, color: '#2F4056'};

type Props = {
  Mes: LangMessage,
    subSysNo: string;
}

type CensusSearch = {
    time: string;
    cstIds: string;
    nodeNo: string;
    sum: number;
    pageSize: number;
    list: CensusRow[];
}

const InitCensusSearch = {
    time: '',
    cstIds: '',
    nodeNo: '',
    sum: 0,
    pageSize: 0,
    list: [],
};

type CircleConf = {
    r: number;
    R: number;
    firstSum: number;
    increaseSum: number;
    levelIncreaseSum: number;
    nodes: any[];
    edges: any[];
    startDeg: number;
    middleDeg:number;
    endDeg: number;
    rate:number;
}

const INITCIRCLECONF = {
    r: nodeSize,
    R: 0,
    firstSum: 50,
    increaseSum: 0,
    levelIncreaseSum: 0,
    nodes: [],
    edges: [],
    startDeg: 45,
    middleDeg: 0,
    endDeg: 135,
    rate: 0,
};

type G6Data = {
    nodes: any[];
    edges: any[];
    start: any;
    layerData: any[];
    orgData: any;
}

const INITG6DATA = {
    nodes: [],
    edges: [],
    start: {},
    layerData: [],
    orgData: {},
};

type DataCount = {
    type: number;
    relayList: any[];
    hopList: any[];
    semaphoreList: any[];
}

const DATACOUNT = {
    type: 1,
    relayList: [],
    hopList: [],
    semaphoreList: [],
};

type Config = {
    graph: Graph | null;
    topologyType: number;
    g6CircleConf: CircleConf;
    g6Data: G6Data;
    dataCount: DataCount;
    currentHoverId: any[];
    currentDuc: string;
    currentMeterColorsMap: Map<any, any>;
    cstIds: string;
    censusList: CensusRow[];
    mapPing: WsNodeVal[];
    selTime: string;
}

const NetMangemant: React.FC<Props> = (props) => {
    const { Mes, subSysNo } = props;
    const cRef = useRef<CRef>();
    const mRef = useRef<MRef>();
    const tRef = useRef<TRef>();
    const initConfig = useRef<Config>({
        graph: null,
        topologyType: 1,
        g6CircleConf: INITCIRCLECONF,
        g6Data: INITG6DATA,
        dataCount: DATACOUNT,
        currentHoverId: [],
        currentDuc: '',
        currentMeterColorsMap: new Map(),
        cstIds: '',
        censusList: [],
        mapPing: [],
        selTime: '--',
    });
    const [ timeSection, setTimeSection ] = useFetchState<[Moment, Moment]>([ moment(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), moment(new Date()) ]);
    const [ timeOpt, setTimeOpt ] = useFetchState<string[]>([]);
    const [ selectedTime, setSelectedTime ] = useFetchState<string>('--');
    const [ censusSearch, setCensusSearch ] = useFetchState<CensusSearch>(InitCensusSearch);
    const [ topoType, setTopologyType ] = useFetchState<number>(1);
    const [ selectColor, setCurrentSelectColor ] = useFetchState<string[]>([]);
    // 选择表计颜色激活状态
    const getCurrentClass = (color:string) => {
        if (selectColor.indexOf(color) > -1) {
            return 'color-current';
        } else {
            return '';
        }
    };
    // 时间区间变化
    const timeSectionChange = (values: RangeValue<Moment>) => {
        setTimeSection(values as [Moment, Moment]);
    };

    // 打开Pingresult弹窗
    const handlePingResult = () => {
        mRef.current?.openModel({
            title: Mes['titleLabelPingresultpingresult'],
            type: 1,
            value: null,
        });
    };

    // 获取census数据
    const getCensus = async (page?: number) => {
        const { cstIds, selTime } = initConfig.current;
        const newCensusSearch: CensusSearch = deepClone(censusSearch);

        try {
            let dataSumFlag = 0;

            if (newCensusSearch.cstIds !== cstIds) {
                newCensusSearch.cstIds = cstIds;
                dataSumFlag = 1;
            }
            if (newCensusSearch.time !== selTime) {
                newCensusSearch.time = selTime;
                dataSumFlag = 1;
            }
            const resCensus = await amiFunc.netWorkMgnt.getCensus({
                cstIds: newCensusSearch.cstIds,
                time: newCensusSearch.time,
                dataSumFlag: dataSumFlag,
                page: page || 1,
            });

            if (resCensus.list && resCensus.list.length) {
                initConfig.current.censusList = resCensus.list;
                newCensusSearch.list = resCensus.list;
                newCensusSearch.sum = resCensus.sum;
                newCensusSearch.pageSize = resCensus.pageSize;
                if (resCensus.sum) {
                    newCensusSearch.sum = resCensus.sum;
                }
                setCensusSearch(newCensusSearch);
            } else {
                initConfig.current.censusList = [];
                newCensusSearch.sum = 0;
                newCensusSearch.pageSize = 0;
                newCensusSearch.list = [];
            }
        } catch (error: any) {
            console.error(error);
            message.error(Mes['messageAlarmRequestfailrequestfail']);
            initConfig.current.censusList = [];
            newCensusSearch.sum = 0;
            newCensusSearch.pageSize = 0;
            newCensusSearch.list = [];
        }
        return newCensusSearch;
    };

    // 打开census数据展示弹窗
    const handleShowCensus = () => {
        mRef.current?.openModel({
            title: Mes['titlePromptprompt'],
            type: 2,
            value: {
                sum: censusSearch.sum,
                list: censusSearch.list,
                pageSize: censusSearch.pageSize,
            },
            height: 450,
            callback: getCensus,
        });
    };
    // 获取phaseCenesus数据
    const getPhaseCensus = async (page?: number, nodeNos?: string) => {
        const newCensusSearch: CensusSearch = deepClone(censusSearch);

        try {
            if (nodeNos) {
                newCensusSearch.nodeNo = nodeNos;
                setCensusSearch(newCensusSearch);
            }
            const res = await amiFunc.netWorkMgnt.getPhaseCensus({
                time: selectedTime,
                subsys: subSysNo,
                nodeNo: newCensusSearch.nodeNo || '',
                cstIds: newCensusSearch.cstIds,
                page: page || 1,
            });

            return res;
        } catch (error) {
            return {
                pageSize: 0,
                list: [],
                sum: 0,
            };
        }
    };
    // 打开phaseCensus弹窗
    const handlePhaseCensus = () => {
        mRef.current?.openModel({
            title: Mes['titlePromptprompt'],
            type: 3,
            value: null,
            height: 480,
            callback: getPhaseCensus,
        });
    };
    // 打开Datacount弹窗
    const handleDataCount = () => {
        const { dataCount } = initConfig.current;

        mRef.current?.openModel({
            title: Mes['titlePromptprompt'],
            type: 8,
            value: dataCount,
            height: 480,
        });
    };

    // 初始化绘画参数
    const initG6CircleInfo = () => {
        const conf = deepClone<CircleConf>(INITCIRCLECONF);

        conf.increaseSum = 1.2 * conf.r;
        const girth = 1.8 * conf.r * conf.firstSum;

        conf.R = girth / 3 / Math.PI;
        conf.levelIncreaseSum = conf.R;
        conf.rate = (conf.endDeg - conf.startDeg) / 360;
        conf.middleDeg = (conf.startDeg + conf.endDeg) * Math.PI / 360;
        conf.startDeg = conf.startDeg * Math.PI / 180;
        initConfig.current.g6CircleConf = conf;
    };

    // 获取信号量等级
    const getSemaphore = (semaphore: any) => {
        let currentSemaphore = null;

        semaphores.forEach((s) => {
            if (semaphore >= s.start && semaphore < s.end) {
                currentSemaphore = s;
            }
        });
        return currentSemaphore ? currentSemaphore : offlineSemaphore;
    };

    const getSemaphoreColor = (semaphore: any) => getSemaphore(semaphore).color;

    // 初始化某些必要参数
    const initDataProperty = (node: any) => {
        node.style = {};
        node.labelCfg = {};
        node.labelCfg.style = {};
    };

    // 设置不同nodeType的节点信息
    const nodeModelInfo = (node: any) => {
        node.size = nodeSize;
        initDataProperty(node);
        if (node.nodeType === 1) {
            node.type = 'star';
            node.size = 30;
        } else if (node.nodeType === 2) {
            node.type = 'triangle';
            node.size = 25;
        } else if (node.nodeType === 3) {
            node.type = 'diamond';
        } else if (node.nodeType === 4) {
            node.type = 'circle';
        } else if (node.nodeType === 5) {
            node.type = 'rect';
        } else if (node.nodeType === 6) {
            node.type = 'circle';
        } else if (node.nodeType === 7) {
            node.type = 'rect';
            node.size = [ 60, 30 ];
        }
        if (node.nodeType === 2 || node.nodeType === 4) {
            node.labelCfg.style.fill = defaultColor;
        }
        if (node.nodeType === 6 || node.nodeType === 7) {
            const color = getSemaphoreColor(node.semaphore);

            node.style.fill = color;
            node.style.stroke = color;
            node.style.cursor = 'pointer';
            node.labelCfg.style.fill = whiteColor;
        } else {
            node.style.fill = whiteColor;
        }
        if (node.nodeType === 5 || node.nodeType === 6 || node.nodeType === 7) {
            let len = node.no.length;
            const maxTextLen = 7;
            let sub = len > maxTextLen ? (len - maxTextLen) : 0;

            node.label = node.no.substring(sub);
        } else {
            node.labelCfg.position = 'bottom';
            node.label = node.hideLabel;
        }
        node.style.stroke = defaultColor;
        node.style.lineWidth = 1;
        return node;
    };

    // 设置起始位置
    const setG6DataStart = (node: any) => {
        if (!node.x) {
            node.x = 0;
            node.y = 0;
        }
        node.layer = 0;
        initConfig.current.g6Data.start = nodeModelInfo(node);
    };

    // 递归将节点分层
    const recursionInitDataLayer = (node: any, nodesMap: Map<string, any>, edgesMap: Map<string, any>) => {
        const targetNodes = edgesMap.get(node.id);

        if (targetNodes) {
            edgesMap.delete(node.id);
            if (initConfig.current.g6Data.layerData.length <= node.layer) {
                initConfig.current.g6Data.layerData[node.layer] = [];
            }
            let targetNode = null;

            targetNodes.forEach((nodeId: any) => {
                targetNode = nodesMap.get(nodeId);
                if (targetNode) {
                    targetNode.layer = node.layer + 1;
                    initConfig.current.g6Data.layerData[node.layer].push(targetNode);
                    nodesMap.delete(nodeId);
                    recursionInitDataLayer(targetNode, nodesMap, edgesMap);
                }
            });
        }
    };

    // 设置节点坐标
    const loadDataPosition = (nodes: any[], deg: number) => {
        let node = null;
        const { g6Data, g6CircleConf } = initConfig.current;

        // if (nodes.length === 1) {
        //     node = nodes[0];
        //     node.x = g6Data.start.x + g6CircleConf.R * Math.cos(g6CircleConf.middleDeg);
        //     node.y = g6Data.start.y + g6CircleConf.R * Math.sin(g6CircleConf.middleDeg);
        // }
        for (let i = 0, len = nodes.length; i < len; i++) {
            node = nodes[i];
            node.x = g6Data.start.x + g6CircleConf.R * Math.cos(i * deg + g6CircleConf.startDeg);
            node.y = g6Data.start.y + g6CircleConf.R * Math.sin(i * deg + g6CircleConf.startDeg);
            initConfig.current.g6CircleConf.nodes.push(nodeModelInfo(node));
        }
    };

    // 递归设置节点均匀排布
    const initNodePosition = (nodes: any[], layoutFlag: boolean, lastLayer: boolean, next?: number) => {
        const g6CircleConf = initConfig.current.g6CircleConf;
        let maxSum = Math.floor(1.4 * Math.PI * g6CircleConf.R / g6CircleConf.r);
        let nodeSum = nodes.length;
        let currentNodes = [];
        let nextNodes = null;
        let currentSum = 0;
        let maxRealSum = layoutFlag ? (maxSum * g6CircleConf.rate) : maxSum;

        if (nodeSum > maxRealSum) {
            currentSum = maxRealSum;
            nextNodes = nodes.slice(currentSum, nodeSum);
        } else {
            currentSum = nodeSum;
        }
        currentNodes = nodes.slice(0, currentSum);
        let deg = 0;

        if (currentSum === 1) {
            deg = g6CircleConf.middleDeg;
        } else {
            if (layoutFlag && !lastLayer) {
                deg = Math.PI * 2 * g6CircleConf.rate / (currentSum - 1);
            } else {
                deg = Math.PI * 2 / maxSum;
            }
            if (next) {
                deg = Math.PI * 2 / maxSum;
            }
        }
        loadDataPosition(currentNodes, deg);
        if (nextNodes) {
            initConfig.current.g6CircleConf.R += g6CircleConf.increaseSum;
            initNodePosition(nextNodes, layoutFlag, lastLayer, 1);
        }
    };

    // 初始化数据统计
    const initDataInit = (nodes: any[], edges: Map<any, any>) => {
        const { dataCount } = initConfig.current;

        dataCount.relayList = [];
        dataCount.hopList = [];
        dataCount.semaphoreList = [];
        let hopMap = new Map();
        let semaphoreMap = new Map();
        let nodeInfo = null;
        let semaphore = null;
        let semaphoreInfo = null;
        let tempData = null;

        nodes.forEach((n) => {
            if (n.nodeType === 6 || n.nodeType === 7) {
                nodeInfo = hopMap.get(n.layer);
                if (!nodeInfo) {
                    nodeInfo = { meterSum: 0, relaySum: 0, layer: n.layer, onlineMeterSum: 0, offlineMeterSum: 0, onlineRelaySum: 0, offlineRelaySum: 0 };
                    hopMap.set(n.layer, nodeInfo);
                }
                semaphore = getSemaphore(n.semaphore);
                semaphoreInfo = semaphoreMap.get(semaphore.level);
                if (!semaphoreInfo) {
                    semaphoreInfo = { meterSum: 0, relaySum: 0, level: semaphore.level, onlineMeterSum: 0, offlineMeterSum: 0, onlineRelaySum: 0, offlineRelaySum: 0 };
                    semaphoreMap.set(semaphore.level, semaphoreInfo);
                }
                if (n.nodeType === 6) {
                    nodeInfo.meterSum++;
                    semaphoreInfo.meterSum++;
                    if (semaphore.level < offlineSemaphore.level) {
                        nodeInfo.onlineMeterSum++;
                        semaphoreInfo.onlineMeterSum++;
                    } else {
                        nodeInfo.offlineMeterSum++;
                        semaphoreInfo.offlineMeterSum++;
                    }
                }
                if (n.nodeType === 7) {
                    tempData = edges.get(n.id);
                    if (tempData) {
                        n.childrenSum = tempData.length;
                    } else {
                        n.childrenSum = 0;
                    }
                    dataCount.relayList.push(n);
                    nodeInfo.relaySum++;
                    semaphoreInfo.relaySum++;
                    if (semaphore.level < offlineSemaphore.level) {
                        nodeInfo.onlineRelaySum++;
                        semaphoreInfo.onlineRelaySum++;
                    } else {
                        nodeInfo.offlineRelaySum++;
                        semaphoreInfo.offlineRelaySum++;
                    }
                }
            }
        });
        hopMap.forEach((h) => {
            dataCount.hopList.push(h);
        });
        semaphoreMap.forEach((s) => {
            dataCount.semaphoreList.push(s);
        });
    };

    // 绘画画布
    // eslint-disable-next-line complexity
    const drawG6 = (nodes: InitDataNodesRow[], edges: InitDataEdgesRows[]) => {
        console.log(nodes, edges);
        initG6CircleInfo();
        if (!nodes || !nodes.length) {return;}
        let nodesMap = new Map(); let edgesMap = new Map(); let dataEdgeMap = new Map();
        const { g6CircleConf, g6Data, topologyType, graph } = initConfig.current;

        g6CircleConf.nodes = [];
        let flag = false;

        for (const node of nodes) {
            if (node.nodeType === 1) {
                flag = true;
                setG6DataStart(node);
                continue;
            }
            nodesMap.set(node.id, node);
        }
        g6CircleConf.edges = [];
        let existsEdgeMap = new Map();
        let edgeValue = '';

        if (edges && edges.length) {
            let edgeList = [];

            for (const edge of edges) {
                if (!edge.source || !edge.target) {continue;}
                if (!nodesMap.get(edge.source) &&
                    edge.source !== g6Data.start.id) {continue;}
                if (!nodesMap.get(edge.target)) {continue;}
                g6CircleConf.edges.push(edge);
                edgeList = edgesMap.get(edge.source);
                if (!edgeList) {edgeList = [];}
                edgeList.push(edge.target);
                edgesMap.set(edge.source, edgeList);
                dataEdgeMap.set(edge.source, edgeList);
                edgeValue = edge.source + '-' + edge.target;
                existsEdgeMap.set(edgeValue, edgeValue);
            }
        }
        g6Data.layerData = [];
        recursionInitDataLayer(g6Data.start, nodesMap, edgesMap);
        if (edgesMap.size > 0) {
            if (!g6Data.layerData.length) {
                g6Data.layerData[0] = [];
            }
            let firstLayer = [];
            let flagEdge = true;

            for (const k of edgesMap.keys()) {
                flagEdge = true;
                for (const vo of edgesMap.values()) {
                    for (const j in vo) {
                        if (vo[j] === k) {
                            flagEdge = false;
                            break;
                        }
                    }
                }
                if (flagEdge) {
                    firstLayer.push(k);
                }
            }
            let firstLayerNode = null;

            for (let z in firstLayer) {
                firstLayerNode = nodesMap.get(firstLayer[z]);
                if (firstLayerNode) {
                    firstLayerNode.layer = 1;
                    g6Data.layerData[0].push(firstLayerNode);
                    recursionInitDataLayer(firstLayerNode, nodesMap, edgesMap);
                }
            }
        }

        if (nodesMap.size > 0) {
            if (!g6Data.layerData.length) {
                g6Data.layerData[0] = [];
            }
            let existsFlag = false;

            nodesMap.forEach((n) => {
                n.layer = 1;
                existsFlag = false;
                g6Data.layerData[0].forEach((ln: any) => {
                    if (ln.id === n.id) {existsFlag = true;}
                });
                if (!existsFlag) {g6Data.layerData[0].unshift(n);}
                const edge: any = {};

                edge.source = g6Data.start.id;
                edge.target = n.id;
                g6CircleConf.edges.push(edge);
            });
        }
        g6CircleConf.nodes.push(g6Data.start);
        let layerMax = 0;

        g6Data.layerData.forEach((data) => {
            if (data.length > layerMax) {layerMax = data.length;}
        });
        if (topologyType === 2) {
            g6Data.layerData[0].forEach((ld: any) => {
                edgeValue = g6Data.start.id + '-' + ld.id;
                if (!existsEdgeMap.get(edgeValue)) {
                    const edge: any = {};

                    edge.source = g6Data.start.id;
                    edge.target = ld.id;
                    g6CircleConf.edges.push(edge);
                }
            });
        }
        let layoutFlag = false;

        if (layerMax > nodeMaxSplit) {
            layoutFlag = true;
        } else {
            g6CircleConf.startDeg = 0;
        }
        for (let i = 0, len = g6Data.layerData.length; i < len; i++) {
            if (i > 0) {
                g6CircleConf.R += g6CircleConf.levelIncreaseSum;
            }
            initNodePosition(g6Data.layerData[i], layoutFlag, i + 1 === len);
        }
        const data = {
            nodes: g6CircleConf.nodes,
            edges: g6CircleConf.edges,
        };

        if (topologyType === 2) {initDataInit(data.nodes, dataEdgeMap);}
        graph?.read(data);
        if (flag) {g6Data.orgData = data;}
    };

    // 获取画布数据
    const getG6Data = async () => {
        abnormalFn(async () => {
            const { cstIds } = initConfig.current;
            const res = await amiFunc.netWorkMgnt.initData({
                cstIds: cstIds,
                time: selectedTime,
            });
            let currentNodes: InitDataNodesRow[] = [];
            const partNodes: InitDataNodesRow[] = [];
            let dcuSum = 0;

            if (initConfig.current.topologyType === 1 && res.nodes) {
                res.nodes.forEach((v) => {
                    currentNodes.push(v);
                    if (v.nodeType === 5) {
                        dcuSum++;
                    } else {
                        partNodes.push(v);
                    }
                });
            }
            if (initConfig.current.topologyType === 1) {
                if (dcuSum > dcuMax) {
                    currentNodes = partNodes;
                }
                drawG6(currentNodes, res.edges);
            }
        });
    };

    // 初始化模块数据
    const initModule = () => {
        abnormalFn(async () => {
            getG6Data();
            getCensus();
        });
        initConfig.current.topologyType = 1;
        setTopologyType(1);
    };

    // 初始化时间，获取时间列表
    const initTime = async () => {
        initConfig.current.topologyType = 1;
        setTopologyType(1);
        const { cstIds } = initConfig.current;

        await abnormalFn(async () => {
            const resTime = await amiFunc.netWorkMgnt.getLinkTimes({
                cstIds: cstIds,
                startDay: dateFormat('YYYY-MM-DD', timeSection[0]),
                endDay: dateFormat('YYYY-MM-DD', timeSection[1]),
            });

            setTimeOpt(resTime || []);
            setSelectedTime(resTime ? resTime[0] : '--');
            initConfig.current.selTime = resTime ? resTime[0] : '--';
            initModule();
        });
    };

    const getTitleInfo = (nodeType: number) => {
        switch (nodeType) {
            case 1: return Mes['titleLabelSystemsystem'];
            case 2: return Mes['titleLabelOrgorg'];
            case 3: return Mes['titleTableSectionsection'];
            case 4: return Mes['titleTableTransformernametransformername'];
            case 5: return Mes['titleTableDcudcu'];
            case 6: return Mes['titleLabelMetermeter'];
            case 7: return Mes['titleLabelRelayDevice'];
            default: return null;
        }
    };

    const getCensusInfo = (no: string) => {
        const cst = initConfig.current.censusList.find((v) => v.cstNo === no);

        return cst ? cst : null;
    };

    // 初始化节点提示
    const tooltip = () => new G6.Tooltip({
        itemTypes: [ nodeStr ],
        offsetX: 20,
        offsetY: 30,
        getContent: (e?: IG6GraphEvent) => {
            if (!e || !e.item) {return '';}
            const model = e.item?.getModel();
            let label = getTitleInfo(model.nodeType as number);

            if (label) {
                label += '：';
            }
            label += model.hideLabel as string;
            const outDiv = document.createElement('div');

            outDiv.style.width = 'fit-content';
            let content = "<ul class='g6-tip'><li>" + label + '</li>';

            if (model.nodeType === 6) {
                content += '<li>' + Mes['titleTableMeternometerno'] + '：' + model.no + '</li>';
                content += '<li>' + Mes['titleLabelSemaphoresemaphore'] + ': ';
                if (model?.semaphore as number > semaphores[semaphores.length - 1].end) {
                    content += '--';
                } else {
                    content += model.semaphore;
                }
                content += '</li>';
                content += '<li>' + Mes['titleLabelPhasephase'] + ': ';
                if (!model.phase || model.phase === 'empty') {
                    content += '--';
                } else {
                    content += model.phase;
                }
                content += '</li>';
            } else if (model.nodeType === 5) {
                const cst = getCensusInfo(model.no as string);

                if (cst) {
                    content += '<li>' + Mes['titleTableDcunodcuno'] + '：' + model.no + '</li>';
                    content += '<li>' + Mes['titleLabelMetersummetersum'] + '：' + cst.meterSum + '</li>';
                    content += '<li>' + Mes['titleLabelOnlinemetersumonlinemetersum'] + '：' + cst.onlineSum + '</li>';
                    content += '<li>' + Mes['titleLabelOfflinemetersumofflinemetersum'] + '：' + cst.offlineSum + '</li>';
                }
            }
            content += '</ul>';
            outDiv.innerHTML = content;
            return outDiv;
        },
    });

    // 接收发送的消息
    const OnDemand = async (data: any) => {
        const { mapPing } = initConfig.current;
        const row:any = mapPing.find((v) => v.groupId === data.guid);

        if (!row) {return;}
        if (data.name === 'otask-confirm') {
            try {
                const res = await amiFunc.netWorkMgnt.exePing(row);

                if (!res.result) {
                    message.warning(`${row.nodeType === 5 ? Mes['titleTableDcunodcuno'] : Mes['titleTableMeternometerno']}:${row.no},${Mes['titleLabelPingping']} ${Mes['titleTableIsfailisfail']}`);
                }
            } catch (err: any) {
                console.error(err);
                message.warning(`${row.nodeType === 5 ? Mes['titleTableDcunodcuno'] : Mes['titleTableMeternometerno']}:${row.no},${Mes['titleLabelPingping']} ${Mes['titleTableIsfailisfail']}`);
            }
        } else if (data.name === 'otask') {
            message.success(`${row.nodeType === 5 ? Mes['titleTableDcunodcuno'] : Mes['titleTableMeternometerno']}:${row.no},${Mes['titleLabelPingping']} ${Mes['titleTableSuccesssuccess']}`);
            initConfig.current.mapPing = mapPing.filter((v) => v.groupId !== data.guid);
        }
    };

    // 发送Ping
    const startPingConnect = async (row:PingForm, value: NodeVal) => {
        const { mapPing } = initConfig.current;
        let flag = mapPing.find((v) => v.no === value.no && v.nodeType === value.nodeType);

        if (flag) {
            return message.warning(Mes['hintTitlePingNoRepeat']);
        }
        const groupId = v4();
        const obj = {
            name: 'otask',
            guid: groupId,
            result: '',
        };

        bus.emit('sendMsg', '{"OBJ":' + JSON.stringify([ obj ]) + '}');
        mapPing.push({
            size: row.pingSize,
            count: row.pingCount,
            no: value.no,
            id: value.id,
            nodeType: value.nodeType,
            groupId: groupId,
        });
    };
        // 根据节点ID获取节点名称
    const getNode = (nodeId: string) => {
        let { graph } = initConfig.current;

        return graph?.findById(nodeId);
    };
    // 根据节点设置节点及边高亮（direction方向：1--向上查找；0--向下查找）
    const setNodeEdgeStyle = (node: any, lightNodes: any[], direction: number) => {
        const { graph, currentHoverId } = initConfig.current;

        if (lightNodes.indexOf(node.getID()) < 0) {
            lightNodes.push(node.getID());
            graph?.setItemState(node, 'hover', true);
            currentHoverId.push(node);
        }
        node.getEdges().forEach((e:any) => {
            let current = null; let next = null;

            if (direction === 1) {
                current = e.getTarget();
                next = e.getSource();
            } else {
                current = e.getSource();
                next = e.getTarget();
            }
            if (current.getID() === node.getID()) {
                graph?.setItemState(e, 'hover', true);
                currentHoverId.push(e);
                if (next.isVisible() && lightNodes.indexOf(next.getID()) < 0) {
                    if (direction) {
                        setNodeEdgeStyle(next, lightNodes, direction);
                    } else {
                        // 向下查找仅查找一层
                        graph?.setItemState(next, 'hover', true);
                        currentHoverId.push(next);
                    }
                }
            }
        });
    };
    // 初始化菜单
    const initNodeMenu = () => new G6.Menu({
        itemTypes: [ nodeStr ],
        getContent (e?: IG6GraphEvent) {
            if (!e || !e.item) {return '';}
            const model = e.item?.getModel();

            if (model.nodeType as number < 5) {return '';}
            let content = "<ul class='g6-ul'>";

            if (model.nodeType === 5) {
                content += "<li title='metertList'>" + Mes['titleLabelDcumeterlistdcumeterlist'] + '</li>';
            } else if (model.nodeType === 6) {
                content += "<li title='historyData'>" + Mes['titleLabelHisotryrecordhisotryrecord'] + '</li>';
            }
            if (model.nodeType !== 7) {
                content += "<li title='detail'>" + Mes['titleTableLast5gridcoldetaillast5gridcoldetail'] + '</li>';
            }
            content += "<li title='ping'>" + Mes['titleLabelPingping'] + '</li>';
            content += "<li title='nodeLinkInfo'>" + Mes['titleLabelDependencestructuredependencestructure'] + '</li></ul>';
            return content;
        },
        shouldBegin (e?: IG6GraphEvent) {
            if (!e || !e.item) {return false;}
            const model = e.item?.getModel();

            if (model.nodeType as number < 5) {
                return false;
            }
            return true;
        },
        handleMenuClick (target:any, item:any) {
            console.log(target, item);
            if (target?.title === 'detail') {
                const type = item._cfg?.model?.nodeType === 5 ? 'dcu' : 'meter';

                tRef.current?.openModel(type, item._cfg?.model?.id);
            } else if (target?.title === 'metertList') {
                mRef.current?.openModel({
                    type: 4,
                    title: Mes['titlePromptprompt'],
                    value: item._cfg?.model?.no,
                    height: 460,
                });
            } else if (target?.title === 'ping') {
                const type = item._cfg?.model?.nodeType === 5 ? Mes['titleTableDcunodcuno'] : Mes['titleTableMeternometerno'];

                mRef.current?.openModel({
                    type: 5,
                    title: `${Mes['titleLabelPingping']} ${type}(${item._cfg?.model?.no})`,
                    value: {
                        id: item._cfg?.model?.id,
                        no: item._cfg?.model?.no,
                        nodeType: item._cfg?.model?.nodeType,
                    },
                    width: 460,
                    height: 130,
                    otherFn: startPingConnect,
                });
            } else if (target?.title === 'historyData') {
                mRef.current?.openModel({
                    type: 6,
                    title: Mes['titlePromptprompt'],
                    value: {
                        meterAddr: item._cfg?.model?.meterAddr,
                        startDay: dateFormat('YYYY-MM-DD', timeSection[0]),
                        endDay: dateFormat('YYYY-MM-DD', timeSection[1]),
                    },
                    height: 420,
                    otherFn: startPingConnect,
                });
            } else if (target?.title === 'nodeLinkInfo') {
                const nodeId = item._cfg?.model?.id;
                const node = getNode(nodeId);
                let nodeIds = [];

                nodeIds.push(nodeId);
                setNodeEdgeStyle(node, nodeIds, 1);
                nodeIds = nodeIds.reverse();
                let links: any[] = [];

                nodeIds.forEach((id) => {
                    let model:any = getNode(id)?.getModel();
                    let obj:any = {};

                    obj.hideLabel = model?.hideLabel;
                    obj.title = getTitleInfo(model?.nodeType);
                    links.push(obj);
                });
                mRef.current?.openModel({
                    type: 7,
                    title: Mes['titlePromptprompt'],
                    value: links,
                    height: 'auto',
                });
            }
        },
    });

    // 设置关联节点及边高亮
    const lightNodeEdge = (node: any) => {
        const { graph, currentHoverId } = initConfig.current;

        graph?.setItemState(node, 'hover', true);
        let lightNodes = [];

        lightNodes.push(node.getID());
        currentHoverId.push(node);
        setNodeEdgeStyle(node, lightNodes, 1);
        setNodeEdgeStyle(node, lightNodes, 0);
    };
        // 取消高亮节点与边
    const outLightNodeEdge = () => {
        let { graph, currentHoverId } = initConfig.current;

        if (currentHoverId.length > 0) {
            currentHoverId.forEach((item) => {
                graph?.clearItemStates(item);
            });
            currentHoverId = [];
        }
    };
    // 添加或删除表计: operate 1--添加；0--展示组织架构
    const loadMeter = async (nodeId: string) => {
        let { currentMeterColorsMap } = initConfig.current;

        try {
            setG6DataStart(getNode(nodeId)?.getModel());
            const res = await amiFunc.netWorkMgnt.getMeterList({
                time: selectedTime,
                cstIds: nodeId,
            });

            if (res && res.nodes.length && res.edges.length) {
                drawG6(res.nodes, res.edges);
                const newSelectColor = deepClone(selectColor);

                for (const item of res.nodes) {
                    const row:any = item;

                    row.style = {};
                    let nodeModel = nodeModelInfo(row);

                    if (!currentMeterColorsMap?.get(nodeModel.style.fill)) {
                        currentMeterColorsMap?.set(nodeModel.style.fill, []);
                    }

                    if (!newSelectColor.find((v) => v === nodeModel.style.fill)) {
                        newSelectColor.push(nodeModel.style.fill);
                    }
                    currentMeterColorsMap?.get(nodeModel.style.fill).push(nodeModel.id);
                }
                setCurrentSelectColor(newSelectColor);
            }
        } catch (error: any) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }

    };
    // 初始化事件
    const graphOnEvent = () => {
        const graph = initConfig.current.graph;

        graph?.on('node:mouseenter', (evt:IG6GraphEvent) => {
            lightNodeEdge(evt.item);
        });
        graph?.on('node:mouseleave', () => {
            outLightNodeEdge();
        });
        graph?.on('edge:mouseenter', (evt: IG6GraphEvent) => {
            const item = evt.item as any;

            graph?.setItemState(item, 'hover', true);
            graph?.setItemState(item?.getSource(), 'hover', true);
            graph?.setItemState(item?.getTarget(), 'hover', true);
        });
        graph?.on('edge:mouseleave', (evt:any) => {
            graph?.clearItemStates(evt?.item);
            graph?.clearItemStates(evt?.item?.getSource());
            graph?.clearItemStates(evt?.item?.getTarget());
        });
        graph?.on('beforerender', () => {
            showLoading();
        });
        graph?.on('afterrender', () => {
            graph?.fitView(80);
            hideLoading();
        });
        graph?.on('node:click', (evt:any) => {
            outLightNodeEdge();
            const model = evt.item.getModel();
            const census = getCensusInfo(model.no);
            let {currentDuc, g6Data} = initConfig.current;

            if (model.nodeType === 5) {
                if (!census || !census.meterSum) {
                    message.warn(`${Mes['titleTableDcudcu']}：${model.hideLabel}${Mes['titleLabelNometernometer']}`);
                    return;
                }
                showLoading();
                if (currentDuc === model.id) {
                    initConfig.current.currentDuc = '';
                    initConfig.current.topologyType = 1;
                    setTopologyType(1);
                    graph?.read(g6Data.orgData);
                } else {
                    loadMeter(model.id);
                    initConfig.current.currentDuc = model.id;
                    initConfig.current.topologyType = 2;
                    setTopologyType(2);
                }
            }
        });
    };

    // 初始化画布
    const initG6 = () => {
        const canvasDom = document.querySelector('.netG6');

        initConfig.current.graph = new G6.Graph({
            container: 'canvas',
            width: canvasDom?.clientWidth,
            height: canvasDom?.clientHeight,
            maxZoom: 3,
            minZoom: 0.01,
            fitView: true,
            fitViewPadding: 20,
            animate: true,
            modes: {default: [ 'drag-canvas', 'zoom-canvas' ]},
            defaultNode: {
                anchorPoints: [ [ 0, 0 ], [ 0.5, 0 ], [ 1, 0 ], [ 1, 0.5 ], [ 1, 1 ], [ 0.5, 1 ], [ 0, 1 ], [ 0, 0.5 ], [ 0.5, 0.5 ] ],
                labelCfg: {
                    style: {
                        fill: defaultColor,
                    },
                },
                size: nodeSize,
                style: {
                    lineWidth: 1,
                    stroke: defaultColor,
                    cursor: 'pointer',
                },
            },
            defaultEdge: {
                style: {
                    stroke: defaultColor,
                    fill: defaultColor,
                    lineWidth: 1,
                    endArrow: {
                        path: G6.Arrow.vee(20, 30, 20),
                        d: 20,
                    },
                    lineAppendWidth: 8,
                    cursor: 'pointer',
                },
            },
            nodeStateStyles: {
                hover: {
                    stroke: hoverEdgeColor,
                    lineWidth: 8,
                    shadowColor: shadowColor,
                    shadowBlur: 20,
                },
            },
            edgeStateStyles: {
                hover: {
                    stroke: hoverEdgeColor,
                    lineWidth: 8,
                    shadowColor: shadowColor,
                    shadowBlur: 20,
                },
            },
            plugins: [ new G6.Grid(), tooltip(), initNodeMenu(), new G6.Minimap() ],
        });
        graphOnEvent();
    };


    const onNodeCheck = (row: any) => {
        console.log(row);
        const cstIds = row.map((v: any) => v?.deviceGuid);

        initConfig.current.cstIds = cstIds.join(',');
        initTime();
    };

    const onSearch = (val:string) => {
        console.log(val);
        if (!val) {
            return message.warning(Mes['messageAlarmInputinput']);
        }
        const { graph } = initConfig.current;
        const nodes:NodeConfig[] = graph?.save().nodes as NodeConfig[];

        nodes?.forEach((n:any) => {
            if (n.no === val) {
                lightNodeEdge(getNode(n.id));
                return;
            }
        });
    };

    const selectColorFn = (c: string) => {
        const row = selectColor.find((v) => v === c);
        let newSelectColor = [];

        if (row) {
            newSelectColor = selectColor.filter((v) => v !== c);
        } else {
            newSelectColor = deepClone(selectColor);
            newSelectColor.push(c);
        }
        setCurrentSelectColor(newSelectColor);
        const { currentMeterColorsMap, graph } = initConfig.current;

        if (!currentMeterColorsMap) {return;}
        for (let x of currentMeterColorsMap?.keys()) {
            let flag = false;

            if (newSelectColor.find((v) => v === x)) {
                flag = true;
            }
            const list = currentMeterColorsMap.get(x);

            for (let y in list) {
                if (!y) {continue;}
                if (flag) {
                    graph?.showItem(list[y]);
                } else {
                    graph?.hideItem(list[y]);
                }
            }
        }
    };
    // 时间选择
    const selectTimeChange = (val:string) => {
        setSelectedTime(val);
        initConfig.current.selTime = val;
    };

    // 下载数据
    const handleDownload = () => {
        const { cstIds } = initConfig.current;

        window.location.href = `/v1/network-management/export-data?cstIds=${cstIds}&startDay=${dateFormat('YYYY-MM-DD', timeSection[0])}&endDay=${dateFormat('YYYY-MM-DD', timeSection[1])}`;
    };

    useEffect(() => {
        initG6();
        initTime();
    }, []);

    useEffect(() => {
        bus.on('otask', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('otask-confirm', async (row: any) => {
            try {
                OnDemand(row);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        return () => { // 离开页面销毁监听
            bus.removeAllListeners('otask');
            bus.removeAllListeners('otask-confirm');
            bus.removeAllListeners('otask-log');
        };
    }, []);

    return (
        <>
            <div className='netWork'>
                <DeviceTree cRef={cRef} onNodeCheck={onNodeCheck} checkbox={false} />
                <div className='wrapRight border'>
                    <div className='content'>
                        <div className='condition borderBot'>
                            <Row gutter={24} justify='space-between'>
                                <Col span={9}>
                                    <Row gutter={24}>
                                        <Col span={6}>
                                            <label>{Mes['labelTitleTimeZone']}:</label>
                                        </Col>
                                        <Col span={16}>
                                            <RangePicker
                                                format='YYYY-MM-DD'
                                                value={timeSection}
                                                onChange={timeSectionChange} />
                                        </Col>
                                        <Col span={2}>
                                            {
                                                topoType === 1 ? (<Button type='primary' icon={<SearchOutlined />} onClick={initTime} />) : null
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={4}>
                                    <Select value={selectedTime} style={{width: '100%'}} onChange={selectTimeChange}>
                                        {
                                            timeOpt.map((v) => (<Option key={v} value={v}>{ v }</Option>))
                                        }
                                    </Select>
                                </Col>
                                <Col span={2}>
                                    <Button type='primary' className='flotR' onClick={handlePingResult}>{ Mes['titleLabelPingresultpingresult'] }</Button>
                                </Col>
                            </Row>
                        </div>
                        <div className='intro borderBot'>
                            {
                                topoType === 1 ? (<ul>
                                    <li>
                                        <i className='graph star'></i>
                                        <span>{Mes['titleLabelSystemsystem']}</span>
                                    </li>
                                    <li>
                                        <i className='graph triangle'></i>
                                        <span>{Mes['titleLabelStationstation']}</span>
                                    </li>
                                    <li>
                                        <i className='graph diamond'></i>
                                        <span>{Mes['labelTitleFeeder']}</span>
                                    </li>
                                    <li>
                                        <i className='graph ellipse'></i>
                                        <span>{Mes['titleTableTransformertransformer']}</span>
                                    </li>
                                    <li>
                                        <i className='graph square'></i>
                                        <span>{Mes['titleTableDcudcu']}</span>
                                    </li>
                                    <li>
                                        <Button type='primary' onClick={handleShowCensus}>{ Mes['btnTitleShowCensus'] }</Button>

                                    </li>
                                    <li>
                                        <Button type='primary' onClick={handlePhaseCensus}>{ Mes['btnTitlePhaseCensus'] }</Button>
                                    </li>
                                    <li></li>
                                </ul>) : (<ul>
                                    <li>
                                        <i className='graph square'></i>
                                        <span>{Mes['titleTableDcudcu']}</span>
                                    </li>
                                    <li>
                                        <i className='graph circle'></i>
                                        <span>{Mes['titleLabelMetermeter']}</span>
                                    </li>
                                    <li>
                                        <i className='graph rect'></i>
                                        <span>{Mes['titleLabelRelayDevice']}</span>
                                    </li>
                                    <li>
                                        <Search onSearch={onSearch} style={{ width: 150 }} enterButton />
                                    </li>
                                    <li>
                                        <Button
                                            type='primary'
                                            icon={<DownloadOutlined />}
                                            size='small'
                                            onClick={handleDownload}
                                            title={Mes['btnDowndown']} />
                                    </li>
                                    <li>
                                        <Button
                                            type='primary'
                                            onClick={handleDataCount}>{Mes['btnTitleDataCount']}</Button>
                                    </li>
                                    <li>
                                        <span className='title' title={Mes['labelTitleSemaphoreStrongWeak']}>{ Mes['titleLabelSemaphoresemaphore'] }</span>
                                        {
                                            semaphores.map((v, i) => (
                                                <span
                                                    key={i}
                                                    className={`color ${getCurrentClass(v.color)}`}
                                                    style={{ backgroundColor: v.color }}
                                                    onClick={() => selectColorFn(v.color)}
                                                ></span>
                                            ))
                                        }
                                    </li>
                                    <li>
                                        <span className='title' title={Mes['labelTitleOfflineMeter']}>{ Mes['labelTitleOfflineMeter'] }</span>
                                        <span
                                            className={`color ${getCurrentClass(offlineSemaphore.color)}`}
                                            style={{ backgroundColor: offlineSemaphore.color }}
                                            onClick={() => selectColorFn(offlineSemaphore.color)}
                                        ></span>
                                    </li>
                                    <li></li>
                                </ul>)
                            }

                        </div>
                        <div className='netG6'>
                            <div id='canvas'></div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalTable mRef={mRef} />
            <TerminalInfo cRef={tRef} />
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(NetMangemant);
