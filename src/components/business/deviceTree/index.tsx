/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-30 14:30:21
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { Tree, Pagination, Select, Input, Row, Col, Checkbox, message } from 'antd';
import { RoundIcon } from 'src/components/common/icon/customIcon';
import { deepClone } from 'src/utils/utils';
import { EventDataNode, Key } from 'rc-tree/es/interface';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { DeviceTreeRows, DeviceChildData } from 'src/api/common/type';
import useFetchState from 'src/utils/useFetchState';
import {forbiddenNodeCheck, devicedIntersection} from 'src/utils/function';
import { PaginationProps } from 'antd';
import { amiFunc, common } from 'src/api';
import { abnormalFn } from 'src/utils/function';
import { useDebounce } from 'src/utils/utils';
import { intersection, find, map } from 'lodash';
import ToLoad from 'src/components/common/toLoad';
import './index.less';

const { Option, OptGroup } = Select;
const { Search } = Input;

export interface DataNode {
    title: string;
    key: string;
    nodeType: string;
    deviceModel: string;
    parentId?: string;
    icon?: React.ReactNode;
    isLeaf?: boolean;
    children?: DataNode[];
    checkable?: boolean;
    disableCheckbox?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    metermodelno?: string;
}

export interface NodeTree extends EventDataNode {
    nodeType: string;
    deviceModel: string;
    parentId?: string;
    metermodelno?: string;
}

export type CRef = {
    clearCheckedKeys (): void;
    clearExpandedKeys (): void;
    refreshTree (): void;
    resetTreedata (data: DataNode[]): void;
    getTreeData (): DataNode[];
    defaultAddNextNode (item: DeviceTreeRows): Promise<DeviceChildData[]>;
    addNextNodeByLoading (item: DeviceTreeRows): Promise<DeviceChildData[] | null>;
    getReadTreeChildNode (item: DeviceTreeRows): Promise<DeviceChildData[] | null>;
    setSameTypeDevice (deviceModel: string): void;
    setFlagType (falg:boolean): void;
}

type Props = {
    isExpand?: boolean; // 是否展开, 默认不展开
    checkbox?: boolean; // 是否单选，默认单选
    selectOpt?: string[]; // 默认支持dcu,meter,group
    checkType?: boolean; // 是否只支持同类型选择。同类型多选时，使用。
    PAGESIZE?: number; // 一页多少行数据
    onNodeCheck?: (value: any[], node: NodeTree) => void; // Node点击后的事件，全选的参数中会带有集中器，如果只需要表计，需要判断
    movePage?: (page:number) => void; // tree翻页
    cRef: React.MutableRefObject<CRef | undefined>;
    calladdNextNode?: (item: DeviceTreeRows) => Promise<DeviceChildData[] | null>;
    checkNodeTypeKey?: string; // checkNodeTypeKey === 'metermodelno'时，取消所有选项，禁选不消失
}

type DeviceStatus = {
    onLine: number;
    offLine: number;
}

// 一级设备树转换
const treeFormat = (data: DeviceTreeRows[]): DataNode[] => data.map((v: DeviceTreeRows) => ({
    key: v.deviceGuid,
    title: `${v.deviceName} ${v.nodeType === '1' ? v.deviceModel : v.TYPE_ABBR}`,
    nodeType: v.nodeType,
    deviceModel: v.deviceModel,
    icon: <span className='random' style={{ backgroundColor: parseInt(v.onlineStatus, 10) ? 'rgb(58, 177, 122)' : 'rgb(213, 213, 225)' }}></span>,
}));

// 子集设备树转换
const treeChildFormat = (data: DeviceChildData[], checkType: boolean, checkNodeType: string, typeKey:string): DataNode[] => data.map((v: DeviceChildData) => ({
    key: v.deviceGuid,
    nodeType: v.nodeType,
    deviceModel: v.deviceModel,
    metermodelno: v.metermodelno,
    parentId: v.parentId,
    disabled: !!(checkType && checkNodeType && v[typeKey] !== checkNodeType),
    title: `${v.deviceNo} ${v.typeAbbr}`,
}));

// 通过下拉获取默认选择
const defaultSelectKey = (arr: string[]): string => {
    const item = arr.find((v: string) => v === 'DCU');

    if (item) {
        return 'c.CST_NO';
    } else {
        const val = arr.find((v: string) => v === 'Meter');

        if (val) {
            return 'METER_NO';
        }
        return 'CLASSICAL_DETAIL_NAME';
    }
};

const leve = {
    'c.CST_NO': '1',
    'c.CST_NAME': '1',
    'c.CST_ADDR': '1',
    'METER_NO': '0',
    'CLASSICAL_DETAIL_NAME': '4',
};

type TRef = {
    expandedSelKeys: string[];
    deviceModel: string;
    treeData: DataNode[];
    devicedList: DeviceTreeRows[];
}

const DeviceTree: React.FC<Props> = (props) => {
    const tRef = useRef<TRef>({
        expandedSelKeys: [],
        deviceModel: '',
        treeData: [],
        devicedList: [],
    });
    // 初始化
    const { isExpand = false, checkbox = true, cRef, selectOpt = [ 'DCU', 'Meter', 'Group' ], onNodeCheck, checkType = false, PAGESIZE = 15, movePage, calladdNextNode, checkNodeTypeKey = 'deviceModel' } = props;
    // 设备树数据
    const [ treeData, setTreeData ] = useFetchState<DataNode[]>([]);
    // 接口返回的设备列表数据
    const [ devicedList, setDevicedList ] = useFetchState<DeviceTreeRows[]>([]);
    // 选择的设备
    const [ checkedKeys, setCheckedKeys ] = useFetchState<React.Key[]>([]);
    // 设备树展开
    const [ expandedKeys, setExpandedKeys ] = useFetchState<string[]>([]);
    // 分组
    const [ selectedKeys, setSelectedKeys ] = useFetchState<string>(defaultSelectKey(selectOpt));
    // 在线选择
    const [ checkBox, setCheckBox ] = useFetchState<string[]>([ '0', '1' ]);
    // 设备分类
    const [ checkNodeType, setCheckNodeType ] = useFetchState<string>('');
    // 在线与离线数据
    const [ deviceStatus, setDeviceStatus ] = useFetchState<DeviceStatus>({
        onLine: 0,
        offLine: 0,
    });
    // 输入值
    const [ inputVal, setInputVal ] = useFetchState<string>('');
    // 分页在第几页
    const [ current, setCurrent ] = useFetchState<number>(1);
    // 分页总数
    const [ total, setTotal ] = useFetchState<number>(0);
    const [ flagType, setFlagType ] = useFetchState<boolean>(false);
    const [ treeStatus, setTreeStatus ] = useFetchState<number>(1);
    // 获取设备树数据
    const getTreeData = async (page = 1, pageSize = PAGESIZE, val: string|undefined = undefined) => {
        abnormalFn(async () => {
            setTreeStatus(0);
            let status = '';

            if (checkBox.length === 1) { // 单选
                status = checkBox[0];
            } else if (checkBox.length === 0) { // 都没选择时，要全选
                status = '';
                setCheckBox([ '0', '1' ]);
            }

            const res = await common.getDeviceTree({
                level: leve[selectedKeys],
                page,
                rows: pageSize,
                searchField: selectedKeys,
                fieldValue: typeof val === 'string' ? val : inputVal,
                deviceStatus: status,
            });

            const newTreeData = treeFormat(res.rows);

            if (selectedKeys === 'METER_NO') {
                const meterKeys = newTreeData?.map((v) => v.key) || [];
                const newExpandedKeys = [ ...tRef.current.expandedSelKeys, ...meterKeys ];

                tRef.current.expandedSelKeys = newExpandedKeys;
                setExpandedKeys(newExpandedKeys);
            }
            tRef.current.treeData = newTreeData;
            setTreeData(newTreeData);
            if (res.total !== total) {
                setTotal(res.total);
            }
            if (page !== current) {
                setCurrent(page);
            }
            if (!res.total) {
                setTreeStatus(2);
            } else {
                setTreeStatus(1);
            }
            setDeviceStatus({
                onLine: res.onlineTotal,
                offLine: res.offlineTotal,
            });

            setDevicedList(res.rows);
        });
    };

    // 分页配置
    const paginationOpt: PaginationProps = {
        simple: true,
        current: current,
        total: total,
        pageSize: PAGESIZE,
        onChange (page: number) {
            setCheckedKeys([]);
            tRef.current.expandedSelKeys = [];
            setExpandedKeys([]);
            getTreeData(page, PAGESIZE);
            if (movePage) {
                movePage(page);
            }
        },
    };

    // 子集判断是否添加
    const getChildTypeList = (childrenData: any[], checkedKeysList: Key[], checkTypeFlag: boolean, key:string = 'key') => {
        let { deviceModel } = tRef.current;

        childrenData.forEach((item: any) => {
            if (!item.disabled) { // 设置禁选的不能添加
                if (checkTypeFlag && !deviceModel) { // 如果要设置同类型，没有设置，设置类型
                    tRef.current.deviceModel = item[checkNodeTypeKey];
                    deviceModel = item[checkNodeTypeKey];
                }
                if (checkTypeFlag) { // 如果要设置同类型
                    if (deviceModel === item[checkNodeTypeKey]) { // 类型相同
                        checkedKeysList.push(item[key]);
                    }
                } else {
                    checkedKeysList.push(item[key]);
                }
            }
        }); // 集中器下所有表计选中
    };

    // 获取子集数据
    const getChildData = async (item: DeviceTreeRows): Promise<DeviceChildData[]> => {
        try {
            if (typeof calladdNextNode === 'function') {
                return await calladdNextNode(item) || [];
            }
            return await common.getDeviceChildNode({
                id: item?.deviceGuid,
                nodeType: item.nodeType,
                chiledNodeType: '0',
            });
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // 防抖点击事件函数
    // eslint-disable-next-line complexity
    const delayedCheck = useDebounce(async (checkedKeysValue: {
        checked: Key[];
        halfChecked: Key[];
    } | Key[], info: { checked:boolean, halfCheckedKeys?: Key[], checkedNodes: any[], node:any }) => {
        console.log('delayedCheck----');
        let checkedKeysList: Key[] = deepClone(checkedKeys);
        const newDevicedList = deepClone(devicedList);
        // const nodeList: DeviceTreeRows|DeviceChildData[] = [];

        console.log('newCheckNodes', checkedKeysValue);
        if (info.node.nodeType === '1' || info.node.nodeType === '4') { // 如果是集中器或分组

            if (isExpand) { // 是否展开
                if (checkbox) { // 如果表计单选，集中器不能选择
                    return;
                }
                if (info.node.expanded) { // 如果已经展开
                    if (info.checked) { // 如果为点击
                        checkedKeysList.push(info.node.key); // 将点击集中器设置为选中
                        getChildTypeList(info.node.children, checkedKeysList, checkType); // 集中器下所有表计选中
                    } else { // 如果为取消
                        const unCheckKey: Key[] = []; // 获取所有取消的key值

                        unCheckKey.push(info.node.key);
                        info.node.children.forEach((item: any) => unCheckKey.push(item.key)); // 集中器下所有表计选中
                        checkedKeysList = checkedKeysList.filter((key) => unCheckKey.every((it) => key !== it)) as Key[];
                    }
                } else { // 没有展开
                    let childDataKey: string[] = [];

                    if (info.node.children && info.node.children.length) { // 如果有子集
                        getChildTypeList(info.node.children, childDataKey, checkType); // 集中器下所有表计选中
                        const childExpandedKeys = info.node.children.map((v:any) => v.key);
                        const newExpandedKeys = [ ...expandedKeys, info.node.key, ...childExpandedKeys ];

                        console.log('t--------1');
                        setExpandedKeys(newExpandedKeys);
                        tRef.current.expandedSelKeys = newExpandedKeys;
                        if (info.node.children.length === childDataKey.length) {
                            childDataKey.push(info.node.key);
                        }
                    } else {
                        const childData = await getChildData({
                            deviceGuid: info.node.key,
                            nodeType: info.node.nodeType,
                        } as DeviceTreeRows);

                        if (childData.length) {
                            getChildTypeList(childData, childDataKey, checkType, 'deviceGuid'); // 集中器下所有表计选中
                            // 将加载的数据设置到设备树种
                            const treeList = deepClone(tRef.current.treeData);
                            const item = newDevicedList.find((v: DeviceTreeRows) => v.deviceGuid === info.node.key);
                            const deviceItem = treeList.find((v: DataNode) => v.key === info.node.key);
                            const childListData = treeChildFormat(childData, checkType, checkNodeType, checkNodeTypeKey);

                            if (deviceItem && item) {
                                deviceItem.children = childListData;
                                item.children = childData;
                            }
                            tRef.current.treeData = treeList;
                            tRef.current.devicedList = newDevicedList;
                            setTreeData(treeList);
                            setDevicedList(newDevicedList);
                            const newExpandedKeys = childData.map((v) => v.deviceGuid);
                            const setNewExpandedKeys = [ ...tRef.current.expandedSelKeys, info.node.key, ...newExpandedKeys ];

                            tRef.current.expandedSelKeys = setNewExpandedKeys;
                            console.log('t--------2');
                            setExpandedKeys(setNewExpandedKeys);
                        } else {
                            const newExpandedKeys = [ ...tRef.current.expandedSelKeys, info.node.key ];

                            tRef.current.expandedSelKeys = newExpandedKeys;
                            setExpandedKeys(newExpandedKeys);
                        }

                        if (childData.length === childDataKey.length) {
                            childDataKey.push(info.node.key);
                        }
                    }
                    if (info.checked) { // 如果为点击
                        childDataKey.forEach((key) => checkedKeysList.push(key)); // 集中器下所有表计选中
                    } else { // 如果为取消
                        checkedKeysList = checkedKeysList.filter((key) => childDataKey.every((it) => key !== it)) as Key[];
                    }
                }
                if (checkType) {
                    let deviceModel = tRef.current.deviceModel;

                    if (!checkedKeysList.length && !flagType) {
                        deviceModel = '';
                        setCheckNodeType('');
                        tRef.current.deviceModel = '';
                    }
                    const newTreeData = forbiddenNodeCheck(tRef.current.treeData, deviceModel, isExpand, checkNodeTypeKey);

                    tRef.current.treeData = newTreeData;
                    setTreeData(newTreeData);
                }
            } else {
                if (checkbox) { // 是否为单选
                    if (info.checked) { // 如果为点击
                        checkedKeysList.length = 0;
                        checkedKeysList.push(info.node.key);
                    } else { // 如果为取消
                        checkedKeysList.length = 0;
                    }
                } else {
                    if (info.checked) { // 如果为点击
                        checkedKeysList.push(info.node.key);
                    } else { // 如果为取消
                        checkedKeysList = checkedKeysList.filter((key) => key !== info.node.key);
                    }
                }
            }
        }
        if (info.node.nodeType === '0') {
            if (checkbox) {
                if (info.checked) {
                    checkedKeysList = [];
                    checkedKeysList.push(info.node.key);
                }
            } else {
                if (info.checked) { // 选中
                    checkedKeysList.push(info.node.key);
                    if (selectedKeys !== 'METER_NO') { // 一级节点是集中器的情况
                        const parentData = find(tRef.current.treeData, { key: info.node.parentId });
                        const parentChildKey = map(parentData?.children, 'key');
                        const intersectionkey = intersection(checkedKeysList, parentChildKey);

                        if (intersectionkey.length === parentChildKey.length) { // 如果该集中器下所有表计都被选中了，那么集中器也要选中
                            checkedKeysList.push(info.node.parentId);
                        }
                    }
                } else { // 取消
                    checkedKeysList = checkedKeysList.filter((key) => key !== info.node.key);
                    checkedKeysList = checkedKeysList.filter((key) => key !== info.node.parentId);
                }
                if (checkType) { // 如果需要同类型
                    let deviceModel = checkNodeType;

                    if (!deviceModel) { // 如果没有设置类型
                        deviceModel = info.node[checkNodeTypeKey];
                        setCheckNodeType(deviceModel);
                        tRef.current.deviceModel = deviceModel;
                    }
                    if (!checkedKeysList.length && !flagType) { // 如果选中为空，取消禁选
                        deviceModel = '';
                        setCheckNodeType('');
                        tRef.current.deviceModel = '';
                    }
                    const newTreeData = forbiddenNodeCheck(tRef.current.treeData, deviceModel, selectedKeys !== 'METER_NO' && isExpand, checkNodeTypeKey);

                    tRef.current.treeData = newTreeData;
                    setTreeData(newTreeData);
                }
            }
        }
        setCheckedKeys(checkedKeysList);
        if (typeof onNodeCheck === 'function') {
            const nodeList: DeviceTreeRows[] = [];

            devicedIntersection(newDevicedList, checkedKeysList, nodeList);

            onNodeCheck(nodeList, info.node);
        }
    }, 200);

    // 设备树选中
    const onCheck = (checkedKeysValue: {
        checked: Key[];
        halfChecked: Key[];
    } | Key[], info: { checked:boolean, halfCheckedKeys?: Key[], checkedNodes: any[], node:EventDataNode }) => {
        delayedCheck(checkedKeysValue, info);
    };

    // 设备树选择
    const onSelect = (selectedKeysValue: React.Key[]) => {
        console.log('onSelect', selectedKeysValue);
        console.log('------1', checkbox);
        console.log('------1', checkType);
    };

    // 加载子集
    const onLoadData = async ({ key }: EventDataNode) => {
        try {
            const treeList = deepClone(tRef.current.treeData);
            const item = devicedList.find((v: DeviceTreeRows) => v.deviceGuid === key);
            const deviceItem = treeList.find((v: DataNode) => v.key === key);

            if (item) {
                let data: DeviceChildData[] = await getChildData(item);


                if (deviceItem) {
                    const childData = treeChildFormat(data, checkType, checkNodeType, checkNodeTypeKey);

                    deviceItem.children = childData;
                    item.children = data;
                    const newExpandedKeys = data.map((v) => v.deviceGuid);
                    const { expandedSelKeys } = tRef.current;

                    console.log('t--------3');
                    setExpandedKeys([ ...expandedSelKeys, ...newExpandedKeys ]);
                    tRef.current.expandedSelKeys = [ ...expandedSelKeys, ...newExpandedKeys ];
                    tRef.current.treeData = treeList;
                    setTreeData(treeList);
                    setDevicedList(devicedList);
                }
            }
        } catch (e: any) {
            message.error(e);
        }
    };
    // 展开与收缩
    const onExpand = (expandedSelList:Key[], info:{
        expanded: boolean;
        node: any;
    }) => {
        const expandedSelKeys = deepClone(tRef.current.expandedSelKeys);

        if (!info.expanded) {
            const newExpandedKeys = expandedSelKeys.filter((v) => v !== info.node.key);

            tRef.current.expandedSelKeys = newExpandedKeys;
            console.log('t--------4');
            setExpandedKeys(newExpandedKeys);

        } else {
            console.log('t--------5');
            expandedSelKeys.push(info.node.key);
            setExpandedKeys(expandedSelKeys);
            tRef.current.expandedSelKeys = expandedSelKeys;
        }
    };

    // 下拉分组选择
    const handleChange = (value: string) => {
        setSelectedKeys(value);
    };

    // 搜索
    const onSearch = (value: string) => {
        setInputVal(value);
        getTreeData(1, PAGESIZE, value);
    };

    // 在线选择
    const checkChange = (value: CheckboxValueType[]) => {
        setCheckBox(value.map((v) => v.toString()));
    };

    const onLoad = (loadedKeys:Key[], info:any) => {
        console.log('ssss--', loadedKeys, info);
    };

    // 暴露给父级调用的方法
    useImperativeHandle(cRef, () => ({
        clearCheckedKeys () {
            setCheckedKeys([]);
        },
        clearExpandedKeys () {
            console.log('t-------6');
            setExpandedKeys([]);
        },
        refreshTree () {
            getTreeData();
        },
        resetTreedata (data: DataNode[]) {
            tRef.current.treeData = data;
            setTreeData(data);
        },
        getTreeData (): DataNode[] {
            return treeData;
        },
        async defaultAddNextNode (item:DeviceTreeRows) {
            return await common.getDeviceChildNode({
                id: item?.deviceGuid,
                nodeType: item.nodeType,
                chiledNodeType: '0',
            });
        },
        async addNextNodeByLoading (item: DeviceTreeRows) {
            return await common.getMeterNodeByDcuId({
                nodeType: item.nodeType,
                dcuId: item.deviceGuid,
            });
        },
        async getReadTreeChildNode (item: DeviceTreeRows) {
            return await amiFunc.onDemandReading.getDeviceTreeChildNode({
                id: item.deviceGuid,
                nodeType: item.nodeType,
                chiledNodeType: '0',
            });
        },
        setSameTypeDevice (deviceModel:string) {
            const newTreeData = forbiddenNodeCheck(deepClone(treeData), deviceModel, isExpand, checkNodeTypeKey);

            setCheckNodeType(deviceModel);
            tRef.current.treeData = newTreeData;
            setTreeData(newTreeData);
        },
        setFlagType (flag: boolean) {
            setFlagType(flag);
        },
    }));

    useEffect(() => {
        getTreeData();
    }, []);

    return (
        <div id='deviceTree'>
            <div className='container'>
                <div className='searchFrom'>
                    <div className='plr12 borderBot pb6'>
                        <Select value={selectedKeys} className='select' onChange={handleChange}>
                            {
                                selectOpt.map((v: string) => {
                                    if (v === 'DCU') {
                                        return (
                                            <OptGroup label='DCU' key='DCU'>
                                                <Option value='c.CST_NO' key='c.CST_NO'>Dcu No</Option>
                                                <Option value='c.CST_NAME' key='c.CST_NAME'>Dcu Name</Option>
                                                <Option value='c.CST_ADDR' key='c.CST_ADDR'>Dcu Address</Option>
                                            </OptGroup>
                                        );
                                    }
                                    if (v === 'Meter') {
                                        return (
                                            <OptGroup label='Meter' key='Meter'>
                                                <Option value='METER_NO' key='METER_NO'>Meter No</Option>
                                            </OptGroup>
                                        );
                                    }
                                    if (v === 'Group') {
                                        return (
                                            <OptGroup label='Group' key='Group'>
                                                <Option value='CLASSICAL_DETAIL_NAME' key='CLASSICAL_DETAIL_NAME'>Group Name</Option>
                                            </OptGroup>
                                        );
                                    }
                                })
                            }
                        </Select>
                    </div>
                    <div className='searchInput plr12 borderBot pb6'>
                        <Search placeholder='input search text' enterButton size='middle' onSearch={onSearch} />
                    </div>
                    <Checkbox.Group onChange={checkChange} value={checkBox}>
                        <Row justify='space-between'>
                            <Col className='flexCenter'>
                                <RoundIcon style={{color: '#3AB17A'}} />
                                <Checkbox value='1'>online device: { deviceStatus.onLine}</Checkbox>
                            </Col>
                            <Col className='flexCenter'>
                                <RoundIcon style={{color: 'rgb(213, 213, 225)'}} />
                                <Checkbox value='0'>offline device: { deviceStatus.offLine }</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </div>
                <div className='contentTree'>
                    <div className='scrollBox'>
                        {
                            treeStatus === 1 ? (
                                <Tree
                                    showIcon
                                    checkable
                                    onCheck={onCheck}
                                    checkedKeys={checkedKeys}
                                    expandedKeys={expandedKeys}
                                    onSelect={onSelect}
                                    loadData={isExpand ? onLoadData : undefined}
                                    onExpand={onExpand}
                                    treeData={treeData}
                                    onLoad={onLoad}
                                />
                            ) : treeStatus === 2 ? '没有数据' : (<ToLoad/>)
                        }
                    </div>
                </div>
            </div>
            <div className='treePagination'>
                <Pagination {...paginationOpt} />
            </div>
        </div>
    );
};

export default DeviceTree;
