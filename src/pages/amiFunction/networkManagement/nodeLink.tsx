/*
 * FileName : nodeLink.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-12-08 19:14:43
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */


// eslint-disable-next-line no-use-before-define
import React from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { List } from 'antd';

type NodeListRow = {
    title: string;
    hideLabel: string;
}

export type NodeList = NodeListRow[];

type Props = {
  Mes: LangMessage;
  subSysNo: string;
  list: NodeList;
}
const NodeLink: React.FC<Props> = (props) => {
    const { list } = props;

    return (
        <List
            size='small'
            dataSource={list}
            renderItem={(item: NodeListRow, index: number) => <List.Item>{index + 1 }、{item.title}:{item.hideLabel}</List.Item>}
        />
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(NodeLink);


