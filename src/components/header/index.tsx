/**
 * 头部组件
 */
// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Badge, Modal, Avatar, message, List } from 'antd';
import { useHistory } from 'react-router-dom';
import { FullscreenOutlined, FullscreenExitOutlined, BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { INITSTATE } from 'src/store/common/collapsed';
import useFetchState from 'src/utils/useFetchState';
// import Lang from 'src/components/common/language';
import { LangMessage } from 'src/store/common/language';
import logo5 from 'src/assets/imgs/common/logo5.png';
import overseas from 'src/assets/imgs/common/overseas.png';
import { NEW_TOGGLE, ACTION } from 'src/store/common/news';
import { fullScreen, exitFullscreen } from 'src/utils/utils';
import { MENUTABS_DELETE_ALL } from 'src/store/common/menuTabs';
import bus from 'src/utils/eventBus';
import { common, user } from 'src/api';
import * as UserName from 'src/store/common/user';
import newsNotice from './newsNotice';

interface Props extends INITSTATE {
    dispatch: React.Dispatch<any>;
    msg: LangMessage;
    newsShow: boolean;
    username: string;
    ip: string;
}

type Userprops = {
    msg: LangMessage;
    eventLeave: () => void;
    username: string;
    eventEnter: () => void;
    dispatch: React.Dispatch<ACTION|UserName.ACTION>
};

const UserMgt: React.FC<Userprops> = (userprops) => {
    const { msg, eventLeave, eventEnter, username, dispatch } = userprops;

    const history = useHistory();
    // 退出登陆
    const loginOut = async () => {
        try {
            await user.logout();
            dispatch({
                type: UserName.setUsername,
                value: UserName.initState,
            });
            dispatch({
                type: MENUTABS_DELETE_ALL,
                value: true,
            });
            history.push('/login');
        } catch (error: any) {
            message.error(error);
        }
    };

    // 修改密码
    const changePassword = () => {
        history.push('/login', {username: username});
    };

    return (
        <ul className='UserMgt' onMouseEnter={eventEnter} onMouseLeave={eventLeave}>
            <li key='1' onClick={changePassword}>
                { msg['btnTextChangePassword']}
            </li>
            <li key='2'>
                {msg['btnSettingsetting']}
            </li>
            <li onClick={loginOut} key='3'>
                {msg['btnTextSignOut']}
            </li>

        </ul>

    );
};

const Header: React.FC<Props> = (props) => {
    const { dispatch, msg, newsShow, username, ip } = props;
    const [ zoomState, setZoomState ] = useFetchState<boolean>(false);
    let [ news, serNews ] = useFetchState(0);
    const [ userMgtShow, setUserMgtShow ] = useFetchState<boolean>(false);

    // 全屏与退出
    const viewZoomToggle = () => {
        if (!zoomState) {
            fullScreen();
        } else {
            exitFullscreen();
        }
        setZoomState(!zoomState);
    };

    // 根据屏幕缩放与退出按键操作判断全屏与退出
    const judgeResize = () => {
        const doc: any = document;
        const isFull = !!(doc.webkitIsFullScreen || doc.mozFullScreen ||
            doc.msFullscreenElement || doc.fullscreenElement
        );

        if (isFull === false) {
            setZoomState(false);
        } else {
            setZoomState(true);
        }
    };

    // 增加屏幕缩放事件监听
    useEffect(() => {
        window.addEventListener('resize', judgeResize);
        return () => {window.removeEventListener('resize', judgeResize);};
    });

    // 打开消息列表弹窗
    const openNews = () => {
        serNews(0);
        dispatch({
            type: NEW_TOGGLE,
            value: !newsShow,
        });
    };

    // 鼠标移入头像显示下拉列表，操作退出修改密码等
    const eventMouseOver = () => {
        setUserMgtShow(true);
    };

    const eventMouseOut = () => {
        setUserMgtShow(false);
    };

    // 打开帮助弹窗
    const openHelp = async () => {
        try {
            const res = await common.getSystemVersion();

            const infoList = [
                {
                    label: 'Your IP Address',
                    text: ip,
                },
                {
                    label: 'Recommended resolution',
                    text: '1440*900',
                },
                {
                    label: 'MDR Version',
                    text: res.data[0].PARAMETER_VALUE,
                },
                {
                    label: 'MDR Build Time',
                    text: res.data[1].PARAMETER_VALUE,
                },
                {
                    label: 'MDR User Manuals',
                    text: 'MDR User Manuals.zip',
                },
            ];

            Modal.info({
                className: 'helpModel',
                title: (<p>Help</p>),
                content: (
                    <List size='large'
                        itemLayout='horizontal'
                        dataSource={infoList}
                        renderItem={(item, index) => (
                            <List.Item key={index}>
                                <span className='label'>{item.label}:</span>
                                {
                                    index === infoList.length - 1 ? (
                                        <a href='http://172.20.8.146:9085/v1/Manuals.zip' target='_blank' download className='fontColor' rel='noreferrer'>{ item.text}</a>
                                    ) : (<span className='text'>{ item.text }</span>)
                                }
                            </List.Item>
                        )}
                    />
                ),
            });
        } catch (e) {
            message.error('Sorry, something went wrong.');
        }
    };

    // 获取websocket数据
    useEffect(() => {
        bus.on('alarm-meter', async (row: any) => {
            try {
                console.log('alarm-meter-----', row);
                serNews(news += 1);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('alarm-dcu', async (row: any) => {
            try {
                console.log('alarm-dcu-----', row);
                serNews(news += 1);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('deviceOFF', async (row: any) => {
            try {
                console.log('deviceOFF-----', row);
                newsNotice(row, 'textDeviceOffline', msg);
                serNews(news += 1);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        bus.on('deviceON', async (row: any) => {
            try {
                console.log('deviceON-----', row);
                serNews(news += 1);
                newsNotice(row, 'textDeviceOnline', msg);
            } catch (error: any) {
                console.error(error.toString());
                message.error(error.toString());
            }
        });
        // newsNotice({
        //     result: '07312222',
        //     etime: '2022-1-5 10:10:10',
        // }, 'textDeviceOnline', msg);
        return () => {
        // 离开页面销毁监听
            bus.removeAllListeners('alarm-dcu');
            bus.removeAllListeners('deviceOFF');
            bus.removeAllListeners('deviceON');
            bus.removeAllListeners('alarm-meter');
        };
    }, []);


    return (
        <Row id='header' justify='space-between' gutter={24}>
            <Col span={6}>
                <Row gutter={24}>
                    <Col span={6}>
                        <img src={logo5} alt='logo' />
                    </Col>
                    <Col span={18}>
                        <img src={overseas} alt='title' />
                    </Col>
                </Row>
            </Col>
            <Col span={5}>
                <Row className='baseInfo' gutter={24}>
                    {/* 帮助 */}
                    <Col span={3}>
                        <a href='#' style={{color: '#fff'}} onClick={openHelp}>
                            <QuestionCircleOutlined />
                        </a>
                    </Col>
                    {/* 全屏与退出全屏 */}
                    <Col span={3} className='flexCenter'>{zoomState ? <FullscreenExitOutlined className='f20' onClick={viewZoomToggle} /> : <FullscreenOutlined onClick={viewZoomToggle} className='f20' />}</Col>
                    {/* 消息 */}
                    <Col span={4}>
                        <a href='#' onClick={openNews} className='news'>
                            <span className='avatar-item'>
                                <Badge count={news} size='small'>
                                    <BellOutlined className='f20' />
                                </Badge>
                            </span>
                        </a>
                    </Col>
                    {/* 用户信息 */}
                    <Col className='user' span={14}>
                        <div className='flex username' onMouseEnter={eventMouseOver} onMouseLeave={eventMouseOut}>
                            <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                            <span>{username}</span>
                        </div>
                        { userMgtShow && <UserMgt dispatch={dispatch} username={username} msg={msg} eventEnter={eventMouseOver} eventLeave={eventMouseOut} /> }
                    </Col>
                    {/* <Col className='flexCenter'>
                        <Lang className='whiteLang' />
                    </Col> */}
                </Row>
            </Col>
        </Row>
    );
};

export default connect((state: any) => ({
    collapsed: state.toggleCollapsed.collapsed,
    msg: state.langSwitch.message,
    newsShow: state.toggleNews.newsShow,
    username: state.userInfo.sysUser.username,
    ip: state.userInfo.ip,
}))(Header);
