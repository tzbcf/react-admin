// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider, message } from 'antd';
import langLocale from 'src/components/common/language/langLocale';
import { LANG_SWITCH, ACTION, LangMessage } from 'src/store/common/language';
import Toload from 'src/components/common/toLoad';
import { lang } from 'src/api';
import Home from './layout/home';
import Login from './layout/login';
import Nofound from './layout/refused';
import NoAccess from './layout/refused/noAccess';
import ServiceException from './layout/refused/serviceException';
import useFetchState from 'src/utils/useFetchState';

type Props = {
    dispatch: React.Dispatch<ACTION>;
    locale: string;
    mes: LangMessage;
};
const App = (props: Props) => {
    const locale = localStorage.getItem('language') || 'en_US';
    const { dispatch, mes } = props;

    const [ loading, setLoading ] = useFetchState<boolean>(!!(!mes && locale));

    const getLangResource = async () => {
        try {
            const res = await lang.getLangResource(locale);

            await dispatch({
                type: LANG_SWITCH,
                value: {
                    locale: locale,
                    message: res,
                },
            });
            setLoading(false);
        } catch (error: any) {
            // setLoading(false);
            message.error(error.toString());
            console.error('error', error);
            // location.href = '/500';
        }
    };

    useEffect(() => {
        if (loading) {
            getLangResource();
        }
    }, []);
    return (
        <>
            {loading ? (
                <Toload />
            ) : (
                <ConfigProvider locale={langLocale[locale || props.locale]} componentSize='small'>
                    <Switch>
                        <Route exact path='/' render={() => <Redirect to='/home/mdrHomePage' push />} />
                        <Route path='/home' component={Home} />
                        <Route path='/404' component={Nofound} />
                        <Route path='/403' component={NoAccess} />
                        <Route path='/500' component={ServiceException} />
                        <Route path='/login' key='login' component={Login} />
                        <Route render={() => <Redirect to='/404' push />} />
                    </Switch>
                </ConfigProvider>
            )}
        </>
    );
};

export default connect((state: any) => ({
    locale: state.langSwitch.locale,
    mes: state.langSwitch.message,
}))(App);
