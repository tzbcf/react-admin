/*
 * FileName : modalTable.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-30 15:55:29
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, { useImperativeHandle } from 'react';
import { connect } from 'react-redux';
import useFetchState from 'src/utils/useFetchState';
import { LangMessage } from 'src/store/common/language';
import PingReaultDialog from './pingReault';
import ShowCensusDialog, { CensusCallBackFn } from './showCensus';
import { CensusData } from 'src/api/AmiFunction/netWorkMgnt/type';
import PhaseCensusDialog, { PhaseCensusCallBackFn } from './phaseCensus';
import MeterListDialog from './metertList';
import PingDialog, { callbackFn, SendFn, NodeVal, WsNodeVal, PingForm } from './pingDialog';
import HistoryChart, { HistoryDataParams } from './historyChart';
import DataCount, {DataCountObj} from './dataCount';
import NodeLink, {NodeList} from './nodeLink';

import { Modal } from 'antd';

type ModalValue = CensusData |NodeVal|HistoryDataParams| NodeList|string |DataCountObj| null;


type CallbackFn = CensusCallBackFn | callbackFn | null;

export type {NodeVal, WsNodeVal, PingForm} ;

type ModalAttr = {
    title: string;
    type: number;
    value: ModalValue;
    width?: number;
    callback?: CallbackFn | PhaseCensusCallBackFn;
    otherFn?: SendFn;
    height?: number|string;
};

export interface MRef {
    openModel(value?: ModalAttr): void;
}

type Props = {
    Mes: LangMessage;
    mRef: React.MutableRefObject<MRef | undefined>; // 暴露给父级调用
};

const getModalContent = (attrObj: ModalAttr): React.ReactElement => {
    switch (attrObj.type) {
        case 1:
            return <PingReaultDialog />;
        case 2:
            return <ShowCensusDialog data={attrObj.value as CensusData} callback={attrObj.callback as CensusCallBackFn} />;
        case 3:
            return <PhaseCensusDialog callback={attrObj.callback as PhaseCensusCallBackFn} />;
        case 4:
            return <MeterListDialog dcuNo={attrObj.value as string} />;
        case 5:
            return <PingDialog callback={attrObj.callback as callbackFn} sendFn={attrObj.otherFn as SendFn} value={attrObj.value as NodeVal} />;
        case 6:
            return <HistoryChart value={attrObj.value as HistoryDataParams} />;
        case 7:
            return <NodeLink list={attrObj.value as NodeList} />;
        case 8:
            return <DataCount data={attrObj.value as DataCountObj} />;
        default:
            return <span></span>;
    }
};

const NetWorkModalTable: React.FC<Props> = (props) => {
    // const initModuleAttr = {
    //     title: '',
    //     type: 0,
    //     value: null,
    //     width: 800,
    // };
    const { mRef } = props;
    const [ isModalVisible, setIsModalVisible ] = useFetchState<boolean>(false);
    const [ modalAttr, setModalAttr ] = useFetchState<ModalAttr|null>(null);

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 暴露给父级调用的方法
    useImperativeHandle(mRef, () => ({
        openModel (values: ModalAttr) {
            console.log('1-----', values);
            if (values.type === 5) {
                values.callback = handleCancel;
            }
            setModalAttr(values);
            setIsModalVisible(true);
        },
    }));

    return (
        <>
            {
                modalAttr && (<Modal
                    title={modalAttr.title}
                    visible={isModalVisible}
                    width={modalAttr.width || 800}
                    className='net-modal'
                    onCancel={handleCancel} footer={[]}>
                    <div className='wrap-modal scrollbar' style={{height: modalAttr.height || 560}}>
                        {getModalContent(modalAttr)}
                    </div>
                </Modal>)
            }
        </>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
    subSysNo: state.userInfo.sysType,
}))(NetWorkModalTable);
