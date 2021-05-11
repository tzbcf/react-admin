import React, {useEffect} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import langLocale from 'src/components/common/language/langLocale';
import { LANG_SWITCH } from 'src/store/common/language';
import Home from './layout/home';
import Login from './layout/login';
import Nofound from './layout/nofound';
import './App.css';

const App = (props: any) => {
  const locale = localStorage.getItem('language');
  const { dispatch } = props;

  useEffect(() => {
    if (locale) {
      console.log('------useEffect', locale)
      dispatch({
        type: LANG_SWITCH,
        value: locale
      });
    }
  }, [])
  return (
    <ConfigProvider locale={langLocale[locale ||props.locale]}>
      <Switch>
          <Route exact path='/' render={() => <Redirect to='/home/index' push />} />
          <Route path='/home' component={Home} />
          <Route path='/404' component={Nofound} />
          <Route path='/login' component={Login} />
          <Route component={Nofound} />
      </Switch>
    </ConfigProvider>
  );
}

export default connect((state: any) => {
  return {
    locale: state.langSwitch.locale
  }
})(App);
