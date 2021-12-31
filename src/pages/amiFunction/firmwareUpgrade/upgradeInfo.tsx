/*
 * FileName : upgradeInfo.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-10-21 13:56:36
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React from 'react';
import { LangMessage } from 'src/store/common/language';
import { keyTextFormatVal, optText } from 'src/utils/function';
import { Row, Col } from 'antd';

export type PLanRowsInfo = {
  'Program_Name': string;
  'File_Type':string;
  'IP_Address':string;
  'User_Name':string;
  'File_Name':string;
  DEVICE_MODEL_NAME:string;
  IDENTIFIER:string;
  VERSION:string;
  ACTIVE_TIME:string;
  'Create_Time':string;
}

export type PlanAreaInfo = {
  dstName: string;
  failCount: number;
  lastCreationTime: string;
  deviceType: string;
}

type Props = {
  Mes: LangMessage;
  programBaseInfoObj: PLanRowsInfo;
  areaBaseInfoObj: PlanAreaInfo;
}

const keyTitle = {
    'Program_Name': 'titleTableProgramnameprogramname',
    'File_Type': 'titleTableFiletypefiletype',
    'IP_Address': 'titleTableUpgradeftpipupgradeftpip',
    'User_Name': 'titleTableUpgradeusernameupgradeusername',
    'File_Name': 'titleTableFilenamefilename',
    'DEVICE_MODEL_NAME': 'titleTableModelmodel',
    'IDENTIFIER': 'titleTableIdentifieridentifier',
    'VERSION': 'titleTableNewversionnewversion',
    'ACTIVE_TIME': 'titleTableGridactivetimegridactivetime',
    'Create_Time': 'titleTableOperatdateoperatdate',
    'dstName': 'titleTableAreanameareaname',
    'failCount': 'titleTableUpgradefailtotalupgradefailtotal',
    'lastCreationTime': 'titleTableUpgradetimeupgradetime',
    'deviceType': 'titleTableDevicetypedevicetype',
};

const UpgradeInfo: React.FC<Props> = (props) => {
    const { Mes, programBaseInfoObj, areaBaseInfoObj } = props;
    const programBaseInfoList = keyTextFormatVal<PLanRowsInfo>(programBaseInfoObj, keyTitle);
    const areaBaseInfoList = keyTextFormatVal<PlanAreaInfo>(areaBaseInfoObj, keyTitle);

    return (
        <div className='upgradeInfo'>
            <Row gutter={24} className='title'>
                <Col span={24}>{ Mes['titleProgramNameBaseInfo'] }</Col>
            </Row>
            <Row gutter={24} className='baseInfo'>
                {
                    programBaseInfoList.map((v: optText) => (
                        <Col span={12} key={v.key}>
                            <Row gutter={24}>
                                <Col span={12} className='label'>{ Mes[v.name] }:</Col>
                                <Col span={12} className='text'>{ v.value }</Col>
                            </Row>
                        </Col>
                    ))
                }
            </Row>
            <Row gutter={24} className='title'>
                <Col span={24}>{ Mes['titleAreaBaseInfo'] }</Col>
            </Row>
            <Row gutter={24} className='baseInfo'>
                {
                    areaBaseInfoList.map((v: optText) => (
                        <Col span={12} key={v.key}>
                            <Row gutter={24}>
                                <Col span={12} className='label'>{ Mes[v.name] }:</Col>
                                <Col span={12} className='text'>{ v.value }</Col>
                            </Row>
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

export default UpgradeInfo;


