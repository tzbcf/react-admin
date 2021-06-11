/**
 * 语言切换公共组件
 */
import React, { useState } from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { LANG_SWITCH } from 'src/store/common/language';
const { Option } = Select;

const Lang = (props: any) => {
  const { locale, dispatch } = props;

  const [lang, setLang] = useState(localStorage.getItem('language') || 'Languages');

  const handleChange = (res: string) => {
    setLang(res);
    dispatch({
      type: LANG_SWITCH,
      value: res
    });
    localStorage.setItem('language', res);
  };

  return (
    <Select placeholder='Languages' value={locale || lang} bordered={false} onChange={handleChange} className='flexCenter w100'>
      <Option value='en_US'>English</Option>
      <Option value='es_ES'>España</Option>
      <Option value='zhCN'>简体中文</Option>
    </Select>
  );
};

export default connect((state: any) => {
  return {
    locale: state.langSwitch.locale
  }
})(Lang);
