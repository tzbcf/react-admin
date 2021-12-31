/**
 * 语言切换公共组件
 */
// eslint-disable-next-line no-use-before-define
import React from 'react';
import { message, Select } from 'antd';
import { connect } from 'react-redux';
import { LANG_SWITCH, ACTION } from 'src/store/common/language';
import * as api from 'src/api';
import useFetchState from 'src/utils/useFetchState';
import { showLoading, hideLoading } from 'src/components/common/loding';
import { LangMessage } from 'src/store/common/language';
const { Option } = Select;

type Props = {
    dispatch: React.Dispatch<ACTION>;
    locale: string;
    className: string;
    Mes: LangMessage;
}

const Lang: React.FC<Props> = (props) => {
    const { locale, dispatch, className, Mes } = props;

    const [ lang, setLang ] = useFetchState(localStorage.getItem('language') || 'Languages');

    const handleChange = async (res: string) => {
        showLoading();
        try {
            setLang(res);
            const data = await api.lang.getLangResource(res);

            dispatch({
                type: LANG_SWITCH,
                value: {
                    locale: res,
                    message: data,
                },
            });
            localStorage.setItem('language', res);
        } catch (error) {
            console.error(error);
            message.error(typeof error === 'string' ? error : Mes['messageAlarmRequestfailrequestfail']);
        }
        hideLoading();
    };

    return (
        <Select
            placeholder='Languages'
            defaultValue={locale || lang}
            bordered={false}
            onChange={handleChange}
            className={ `${className} flexCenter w100`}>
            <Option value='en_US'>English</Option>
            <Option value='es_ES'>España</Option>
            <Option value='zh_CN'>简体中文</Option>
            <Option value='fr_FR'>En français</Option>
        </Select>
    );
};

export default connect((state: any) => ({
    locale: state.langSwitch.locale,
    Mes: state.langSwitch.message,
}))(Lang);
