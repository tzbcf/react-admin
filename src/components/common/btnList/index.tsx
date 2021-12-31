/*
 * FileName : index.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-06 15:12:10
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Button } from 'antd';
import {
    DownloadOutlined,
    EditOutlined,
    SaveOutlined,
    WalletOutlined,
    PlusOutlined,
    PlusSquareOutlined,
    UserAddOutlined,
    FormOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    PrinterOutlined,
    PlayCircleOutlined,
    UndoOutlined,
    SyncOutlined,
    UploadOutlined,
    SwapOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    ToolOutlined,
    SendOutlined,
    ReadOutlined,
    ToTopOutlined,
    RedoOutlined,
    VerticalAlignTopOutlined,
} from '@ant-design/icons';
import './index.less';
export type BtnConfig = {
    type: string;
    btnType?: 'link' | 'text' | 'ghost' | 'primary' | 'default' | 'dashed' | undefined;
    size?: 'large' | 'middle' | 'small';
    title?: string;
    shape?: 'circle' | 'round' ;
    onClick: (v: any) => any;
};

type Props = {
    btnList: BtnConfig[];
};

const btnIconList = {
    Edit: <EditOutlined />,
    Download: <DownloadOutlined />,
    Save: <SaveOutlined />,
    Import: <ToTopOutlined />,
    Template: <WalletOutlined />,
    Add: <PlusOutlined />,
    BatchAdd: <PlusSquareOutlined />,
    CostomerAdd: <UserAddOutlined />,
    BatchEdit: <FormOutlined />,
    BatchDel: <CloseCircleOutlined />,
    Del: <DeleteOutlined />,
    Print: <PrinterOutlined />,
    Start: <PlayCircleOutlined />,
    Restart: <UndoOutlined />,
    Refresh: <SyncOutlined />,
    Export: <UploadOutlined />,
    BatchSync: <SwapOutlined />,
    Search: <SearchOutlined />,
    Confirm: <CheckCircleOutlined />,
    Install: <ToolOutlined />,
    Send: <SendOutlined />,
    Read: <ReadOutlined />,
    Redo: <RedoOutlined />,
    TopOut: <VerticalAlignTopOutlined />,
};

const BtnList: React.FC<Props> = (props) => {
    const { btnList } = props;

    return (
        <div id='btnList'>
            {btnList
                .map((v: BtnConfig, n: number) => {
                    if (btnIconList[v.type]) {
                        return <Button
                            type={v.btnType}
                            title={v.title || v.type}
                            icon={btnIconList[v.type]}
                            key={n}
                            size={v.size || 'small'}
                            shape={v.shape}
                            onClick={v.onClick}
                        ></Button>;
                    }
                })
                .filter((v) => v)}
        </div>
    );
};

export default BtnList;
