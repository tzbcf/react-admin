/**
 * FileName : index.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-09-30 14:05:44
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */
import onDemandReading from './onDemandReading';
import firmwareUpgrade from './firmwareUpgrade';
import remoteControl from './connectAndDisConnect';
import deviceMonitor from './deviceMonitoring';
import taskMgnt from './taskMgnt';
import abnormalMgnt from './abnormalMgnt';
import meterParamControl from './meterParam';
import meterReadRate from './meterReadRate';
import netWorkMgnt from './netWorkMgnt';

export default {
    onDemandReading,
    firmwareUpgrade,
    remoteControl,
    deviceMonitor,
    taskMgnt,
    abnormalMgnt,
    meterParamControl,
    meterReadRate,
    netWorkMgnt,
};
