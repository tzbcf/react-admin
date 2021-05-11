import zhCN from 'antd/lib/locale/zh_CN';
import en_US from 'antd/lib/locale/en_US';
import es_ES from 'antd/lib/locale/es_ES';
import { Locale } from 'antd/lib/locale-provider';
type LangLocale = {
  [index:string]: Locale
}
const langLocale: LangLocale = {
  'zhCN': zhCN,
  'en_US': en_US,
  'es_ES': es_ES
}
export default langLocale;