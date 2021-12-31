/**
 * 业务上层布局组件
 */
// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import Routers from 'src/router/router';
import Menu from 'src/components/menu';
import { connect } from 'react-redux';
import HeaderDom from 'src/components/header';
import MenuTabs from 'src/components/menu/menuTabs';
import News from 'src/components/header/news';
import { Layout, message } from 'antd';
import Scoket from 'src/utils/websocket';
import bus from 'src/utils/eventBus';
import './index.less';

const { Header, Content } = Layout;

type Props = {
    newsShow: boolean;
};

const Main = (props: Props) => {
    const { newsShow } = props;
    const ws = new Scoket();

    // websocket链接与离开销毁
    useEffect(() => {
        ws.connection();

        return () => {
            ws.onClose();
        };
    }, []);

    // webscoket发送消息
    useEffect(() => {
        bus.on('sendMsg', async (data) => {
            try {
                ws.sendMessage(data);
            } catch (error: any) {
                message.error(error.String());
            }
        });
        return () => {
            bus.removeAllListeners('sendMsg');
        };
    }, []);

    return (
        <Layout className='home'>
            {/* 头部 */}
            <Header className='header'>
                <HeaderDom />
            </Header>
            <Layout className='layoutSider'>
                {/* 菜单 */}
                <Menu />
                <Layout className='layoutMain'>
                    <div className='layoutContent'>
                        {/* 菜单标签 */}
                        <MenuTabs />
                        {/* 主要业务模块 */}
                        <Content className='routerContent'>
                            <Routers />
                        </Content>
                    </div>
                    {/* 消息 */}
                    {newsShow && <News />}
                </Layout>
            </Layout>
        </Layout>
    );
};

export default connect((state: any) => ({
    newsShow: state.toggleNews.newsShow,
}))(Main);
