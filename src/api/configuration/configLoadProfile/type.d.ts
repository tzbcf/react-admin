/**
 * FileName : type.d.ts
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-11-15 16:19:03
 * Description :
 * -----
 * Last Modified:
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

export type CaptureObjectData = {
    AFN_NAME: string;
    CAPTURE_OBJ_ATTRIBUTE_INDEX: string;
    CAPTURE_OBJ_CLASSID: string;
    CAPTURE_OBJ_DATA_INDEX: string;
    CAPTURE_OBJ_INDEX: number;
    CAPTURE_OBJ_OBIS: string;
    CAPTURE_UINT: string;
    GROUP_TYPE_NAME: string;
    METER_TYPE: string;
    REGISTER_TIME: string;
    SN_PROTOCOL_COMMAND: string;
    SN_PROTOCOL_COMMAND_CHILDREN: string;
    UNIT: string;
    rn__: number;
    FN_NAME: string;
};

export type CaptureObjectList = {
    total: number;
    rows: CaptureObjectData[];
}

export type DeviceTypeData = {
    SN: string;
    SN_METER_TYPE_NAME: string;
    SN_PROTOCOL: string;
}

export type ByMeterTypeData = {
    SN: string;
    SN_PROTOCAL: string;
}

export type DCUTypeData = {
    SN: string;
    CST_TYPE_NAME: string;
    SN_PROTOCOL: string;
}

export type MeterObjectFile = {
    AFN: string;
    AFN_NAME: string;
    CAPTURE_PERIOD: string;
    FN_NAME: string;
    GROUP_NAME: string;
    METER_TYPE: string;
    SN_METER_TYPE_NAME: string;
    SN_PROTOCAL: string;
    SN_PROTOCOL_COMMAND: string;
    STATUS_FLAG: string;
}

export type MeterObjectFileList = {
    total: number;
    rows: MeterObjectFile[];
}

export type GroupData = {
    GROUP_ID: string;
    GROUP_NAME: string;
}

export type GroupList = {
    total: number;
    result: GroupData[];
}

export type ExcuteCommandResult = {
    AFN: string;
    BUILD_DATE: string;
    DATA_TYPE: string;
    EMU_LIST: string;
    FN: string;
    FN_NAME: string;
    FN_XUHAO: number;
    INPUT_PARAM_COUNT: string;
    IS_EXECUTED: string;
    IS_SUCCESS: string;
    MAX_EXECUTE_TIMES: number;
    METER_NO: string;
    PARAMETERS: string;
    PARAMETER_FLAG: string;
    PROTOCAL_BYTE_DESE_SN: string;
    RETURN_DATA: string;
    SN: string;
    SN_PROTOCAL_COMMAND: string;
    rn__: number;
}

export type ExcuteCommandResultList = {
    total: number;
    rows: ExcuteCommandResult[];
}

export type ReturnResult = {
    param1: string;
    param2: string;
}

export type SendCommandResult = {
    flag: string;
    mes: string;
}

export type ProtocolItem = {
    AFN_NAME: string;
    AFN_NAME_OBIS: string;
    FN_NAME: string;
    METER_TYPE: string;
    SN: string;
    SN_PROTOCAL: string;
}
