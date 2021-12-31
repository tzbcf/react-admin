/*
 * FileName : news.tsx
 * ProjectName : admin
 * Author : terrorblade
 * Created Date: 2021-07-07 16:11:35
 * Description :
 * -----
 * Last Modified: 2021-12-16 15:42:46
 * Modified By :
 * -----
 * Copyright (c) 2021 Magina Corporation. All rights reserved.
 */

// eslint-disable-next-line no-use-before-define
import React, {useEffect } from 'react';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import { useHistory } from 'react-router-dom';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { NEW_TOGGLE } from 'src/store/common/news';
import { message, Select, Button, Modal } from 'antd';
import { common } from 'src/api';
import { GetAlarmList } from 'src/api/common/type';
import useFetchState from 'src/utils/useFetchState';
import './index.less';
import { dateFormat } from 'src/utils/utils';
const { Option } = Select;
const { confirm } = Modal;

type Props = {
    Mes: LangMessage;
    dispatch: any;
};

const News: React.FC<Props> = (props: Props) => {
    const { Mes, dispatch } = props;
    const history = useHistory();
    // 报警数量
    const [ count, setCount ] = useFetchState<number>(0);
    const [ alarmList, setAlarmList ] = useFetchState<GetAlarmList[]>([]);
    const [ alarmType, setAlarmType ] = useFetchState<string>('ALL');
    // 右边消息弹出与关闭
    const newsClose = () => {
        dispatch({
            type: NEW_TOGGLE,
            value: false,
        });
    };
    // 获取报警数量
    const getAlarmCount = async (): Promise<void> => {
        const res = await common.getAlarmDataSum(alarmType);

        setCount(res[0]);
    };
    // 获取报警列表
    const getAlarmList = async (): Promise<void> => {
        const res = await common.getTodayAlarmData(alarmType);

        setAlarmList(res);
    };
    // 获取报警数据
    const getAlarmData = async () => {
        try {
            Promise.all([ getAlarmList(), getAlarmCount() ]);
        } catch (e: any) {
            message.error(e.toString());
        }
    };
    // 查看详情
    const lookAlarmDetails = () => {
        history.push('/home/collectReport/meterAlarmEvent');
    };
    // 报警更新
    const updateAlarm = async (rows: GetAlarmList) => {
        try {
            await common.updateAlarmStatus({
                guid: rows.SN,
                alarmType: rows.ALARM_TYPE,
            });
            await getAlarmList();
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
    };
    // 报警确认弹窗
    const updateStatusConfirm = async (rows: GetAlarmList) => {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk () {
                updateAlarm(rows);
            },
        });
    };
    // 报警类型切换
    const selectChange = (value: string) => {
        setAlarmType(value);
    };

    useEffect(() => {
        getAlarmData();
    }, [ alarmType ]);

    return (
        <div id='news'>
            <div className='flexCenter flexBetween pv10h20'>
                <div>
                    <span className='pr10'>{Mes['titleAlarmInformation']}</span>
                    <i className='count'>{ count }</i>
                </div>
                <div>
                    <Select defaultValue='ALL' className='pr10' onChange={selectChange}>
                        <Option value='ALL'>ALL</Option>
                        <Option value='Meter'>Meter</Option>
                        <Option value='DCU'>DCU</Option>
                    </Select>
                    <CloseOutlined onClick={() => newsClose()} />
                </div>
            </div>
            <div className='alarmList p6 scrollbar'>
                <ul>
                    {
                        alarmList.map((v: GetAlarmList, i: number) => (
                            <li key={i}>
                                <div className='top flexCenter flexBetween p6'>
                                    <span>NO.{i + 1}</span>
                                    <div>
                                        <Button type='primary' onClick={() => updateStatusConfirm(v)}>confirm</Button>
                                        <Button type='primary' onClick={lookAlarmDetails}>details</Button>
                                    </div>
                                </div>
                                <div className='info p6'>
                                    <p>
                                        <span>Alarm type:</span>
                                        <span>{ v.ALARM_TYPE }</span>
                                    </p>
                                    <p>
                                        <span>Device Name:</span>
                                        <span> { v.DEVICE_ADDRESS } </span>
                                    </p>
                                    <p>
                                        <span>Start data:</span>
                                        <span>{
                                            typeof v.OCCUR_DATETIME === 'string' ? v.OCCUR_DATETIME : dateFormat('YYYY-MM-DD HH:mm:ss', new Date(v.OCCUR_DATETIME))
                                        }</span>
                                    </p>
                                    <p>
                                        <span>Staus:</span>
                                        <span className='red'>unconfirmed</span>
                                    </p>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    Mes: state.langSwitch.message,
}))(News);
