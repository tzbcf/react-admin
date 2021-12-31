// eslint-disable-next-line no-use-before-define
import React, {useEffect} from 'react';
import OverviewCom from '../homeCom/Overview';
import { connect } from 'react-redux';
import { LangMessage } from 'src/store/common/language';
import FrozenData from '../homeCom/FrozenData';
import QuickOperations from '../homeCom/Quickperations';
import FilesOverview from '../homeCom/FilesOverview';
import { notification } from 'antd';

type Props = {
    mes: LangMessage;
};

const MdrHomePage: React.FC<Props> = (props) => {
    const { mes } = props;
    // 展示分辨率推荐
    const openNotification = () => {
        const args: any = {
            message: mes['alertTitleRecommendedtips'],
            description: (<p>{mes['alertTextSystemRecommendResolution']}: <span style={{ color: 'red' }}>1440*900</span></p>),
            duration: 2,
            placement: 'bottomRight',
        };

        notification.info(args);
    };

    useEffect(() => {
        openNotification();
    }, []);
    return (
        <div id='mdrHomepage'>
            <div className='left'>
                <OverviewCom />
                <QuickOperations />
                <FilesOverview />
            </div>
            <div className='right'>
                <FrozenData type='Daily' />
                <FrozenData type='Monthly' />
                <FrozenData type='Curve' />
            </div>
        </div>
    );
};

export default connect((state: any) => ({
    mes: state.langSwitch.message,
}))(MdrHomePage);
