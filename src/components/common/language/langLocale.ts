/**
 * antd组件的语言切换
 */
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';
import esES from 'antd/lib/locale/es_ES';
import { Locale } from 'antd/lib/locale-provider';
type LangLocale = {
  [index:string]: Locale
}
const langLocale: LangLocale = {
    'zh_CN': zhCN,
    'en_US': enUS,
    'es_ES': esES,
};

export default langLocale;
