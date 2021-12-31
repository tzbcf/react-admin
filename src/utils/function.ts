/**
 * FileName : function.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-28 18:09:46
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import { IsEmptyObejct } from './utils';

/**
 * 添加根节点数转换函数
 */
import { UserNode } from 'src/api/user/type';

export type CascaderData = {
  value: string;
  label: string;
  children?: CascaderData[];
}

export const nodeDataFormatCascader = (nodeList: UserNode[], rootNode: CascaderData[], parentId: string|null = null) => {
    const node = nodeList.filter((v: UserNode) => v.PARENTID === parentId);

    node.forEach((item:UserNode) => {
        const findNode = nodeList.find((v:UserNode) => v.PARENTID === item.ID);
        const obj: CascaderData = {
            label: item.NAME,
            value: item.ID,
        };

        if (findNode) {
            obj.children = [];
            rootNode.push(obj);
            nodeDataFormatCascader(nodeList, obj.children, item.ID);
        } else {
            rootNode.push(obj);
        }
    });
};
import { Key } from 'rc-tree/es/interface';
// 原始数据中获取选中数据
export const devicedIntersection = (data: any[], keyList: Key[], nodeList: any[]) => {
    data.forEach((v) => {
        const item = keyList.find((key) => v.deviceGuid === key);

        if (item) {
            nodeList.push(v);
        }
        if (v.children && v.children.length) {
            devicedIntersection(v.children, keyList, nodeList);
        }
    });
};

// 将设备树数据不同类型的树设置为禁选
export const forbiddenNodeCheck = (treeData: any[], deviceModel: string, type: boolean, typeKey:string) => treeData.map((v) => {
    if (!type) {
        if (v[typeKey] !== deviceModel && deviceModel) {
            v.disabled = true;
        } else {
            v.disabled = false;
        }
    } else {
        if ((v.nodeType === '1' || v.nodeType === '4') && v.children && v.children.length) {
            v.children = forbiddenNodeCheck(v.children, deviceModel, type, typeKey);
        }
        if (!parseInt(v.nodeType, 10)) {
            if (v[typeKey] !== deviceModel && deviceModel) {
                v.disabled = true;
            } else {
                v.disabled = false;
            }
        }
    }
    return v;
});


// 随抄内容数据转换
import { ProtocolDataList } from 'src/api/AmiFunction/onDemandReading/type';
export type NodeChildProperty = {
    key: string;
    no: string;
    id: string;
    title: string;
    tooltip: string; // 气泡提示
    dataType: string|null; // 下发参数类型
    resultDataType: string;
    returnType?:string; // 返回值展示类型  0:输出参数    1：输入参数
    protocalCommand: string;
    paramSn: string|null; // PROTOCAL_BYTE_DESE_SN 来自表 CFG_PROTOCAL_STATUS_WORD 的 COMMAND_DEFINE_SN  说明参数每个字节的含义
    defaultValue: string|null;
    maxValue: string|null;
    minValue: string|null;
    dataFormat: string | null;
    parentId: string;
    bitSQ?:string;
    inputParamCount: string;
    outputParamCount: string;
    PARAMETER_FLAG?:string;
    unit: string;
    nodeType:number;
    commandFN: string;
    priority: string;
}
export type NodeProperty = {
    title: String;
    key: string;
    children: NodeChildProperty[];
}
export type TypeNodeAttr = {
    [key: string]: NodeProperty
}
export const constructCommandData = (list: ProtocolDataList[] = [], typeNodeMap: TypeNodeAttr = {}): NodeProperty[] => {
    console.log('ssd-----');
    if (!list.length) {
        return [];
    }
    for (const item of list) {
        const type = item.TYPE;
        const SCHEME_NAME = item.SCHEME_NAME;
        let parentNode:NodeProperty|null = null;

        if (parseInt(type, 10) === 9) {
            if (!typeNodeMap.hasOwnProperty(`${type}${SCHEME_NAME}`)) {
                typeNodeMap[`${type}${SCHEME_NAME}`] = {title: SCHEME_NAME, key: '9', children: []};
            }
            parentNode = typeNodeMap[`${type}${SCHEME_NAME}`];
        } else {
            parentNode = typeNodeMap[type];
        }
        if (parentNode && IsEmptyObejct(parentNode) && typeof parentNode.children !== undefined) {
            parentNode.children.push({
                key: type + item['NO'],
                no: item['NO'],
                id: item['NO'],
                title: item['NAME'],
                tooltip: item['NAME'] + '(' + item['AFN'] + ')', // 气泡提示
                dataType: item['DATA_TYPE'], // 下发参数类型
                resultDataType: item['RESULT_DATA_TYPE'],
                // returnType:list[i]["PARAMETER_FLAG"],            //返回值展示类型  0:输出参数    1：输入参数
                protocalCommand: item['SN_PROTOCAL_COMMAND'],
                paramSn: item['PROTOCAL_BYTE_DESE_SN'], // PROTOCAL_BYTE_DESE_SN 来自表 CFG_PROTOCAL_STATUS_WORD 的 COMMAND_DEFINE_SN  说明参数每个字节的含义
                defaultValue: item['DEFAULT_VALUE'],
                maxValue: item['MAX_VALUE'],
                minValue: item['MIN_VALUE'],
                dataFormat: item['DATA_FORMAT'],
                // bitSQ:list[i]["BITSQ"],
                inputParamCount: item['INPUT_PARAM_COUNT'],
                outputParamCount: item['OUTPUT_PARAM_COUNT'],
                // PARAMETER_FLAG:list[i]["PARAMETER_FLAG"],
                unit: item['UNIT'],
                nodeType: 1,
                commandFN: item['FN'],
                priority: item['PRIORITY'],
                parentId: parentNode.key,
            });
        }
    }
    return Object.keys(typeNodeMap).map((key: string) => {
        if (typeNodeMap[key].children.length) {
            typeNodeMap[key].title = `${typeNodeMap[key].title}(${typeNodeMap[key].children.length})`;
            return typeNodeMap[key];
        }
    })
        .filter((v) => v) as NodeProperty [];
};

// 获取所有数组下面的children
export const arrFormatChild = (arr:any[]) => {
    const list = [];

    for (const v of arr) {
        for (const o of v.children) {
            list.push(o);
        }
    }
    return list;
};

// 将数据变成select的value,name形式
export type Options = {
    value: string;
    name: string;
}
export const formatArrOptions = <T>(arr: T[], key: string, name: string) => arr.map((v) => {
    if (typeof v[key] !== undefined && typeof v[name] !== undefined) {
        return {
            value: v[key],
            name: v[name],
        };
    }
}).filter((v) => v) as Options[];

// 升级模块key,text,value合并
export interface optText extends Options {
    key: string;
}
export const keyTextFormatVal = <T extends Object> (val: T, keyText: { [key: string]: string }):optText[] => Object.keys(val).map((key: string) => ({
    value: val[key],
    name: keyText[key],
    key,
}));
export const queryTaskFormatTreeData = <T>(data: T[], groupTaskFormatTitle:(val:any)=>string) => data.map((v) => ({
    key: v['GROUP_ID'],
    title: groupTaskFormatTitle(v),
    ...v,
}));

import { message } from 'antd';
export const abnormalFn = async (fn: any, val?:any) => {
    try {
        if (typeof fn === 'function') {
            await fn(val);
        }
    } catch (error) {
        console.error(error);
        message.error(typeof error === 'string' ? error : 'Program exception error');
    }
};

/**
 * 线路转换
 */

import { MeterGroupList } from 'src/api/customer&Device/meterMgnt/type';
import { GetDstListData } from 'src/api/basicData/transformMgt/type';
import { valueArr } from './initDynamicForm';
export type OptGroupList = valueArr;
export const resCastOption = (res:MeterGroupList[]|GetDstListData[]):valueArr[] => {
    const obj = {};
    let id = 'CLASSICAL_DETAIL_GUID';
    let name = 'CLASSICAL_DETAIL_NAME';

    if ('ID' in res[0]) {
        id = 'ID';
        name = 'NAME';
    }

    res.forEach((v) => {
        if (obj[v.GNAME]) {
            obj[v.GNAME].children.push({
                value: v[id],
                name: v[name],
            });
        } else {
            obj[v.GNAME] = {
                label: v.GNAME,
                value: v[id],
                children: [],
            };
            obj[v.GNAME].children.push({
                value: v[id],
                name: v[name],
            });
        }
    });
    return Object.keys(obj).map((v) => obj[v]);
};

// 递归查找多叉树结构数据
/**
 *
 * @param treeData // 多叉树数据
 * @param key // 查找的属性名
 * @param value // 查找的值
 * @param child // 子集属性名
 */

export const findManyTreeRow = (treeData: any[], key: string, value: any, child: string = 'children') => {
    for (const item of treeData) {
        if (item[key] === value) {
            return item;
        } else {
            findManyTreeRow(item[child], key, value, child);
        }
    }
};

// 递归查找链式key值

export const findParentKeyArr = (arr: any[], childKey:string, parentKey:string, value:any, list:any[]) => {
    for (const item of arr) {
        if (item[childKey] && item[childKey] === value && item[parentKey]) {
            list.unshift(item[parentKey]);
            findParentKeyArr(arr, childKey, parentKey, item[parentKey], list);
        }
    }
};
