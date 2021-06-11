import zhCN from 'src/assets/langLocales/zhCN';
import es_ES from 'src/assets/langLocales/es_ES';
import en_US from 'src/assets/langLocales/en_US';

// 默认英语。使用英语模块
const initState = {
  locale: 'en_US',
  message: en_US
};


export type LangMessage = {
  [index: string]: string
}

type Message = {
  [index: string]: LangMessage
}

export type INITSTATE = {
  locale: string,
  message: LangMessage
}

/**
 * 目前支持三种语言：英语，西班牙语，中文，如需增加其他语种，在这添加
 * 以及在/src/components/common/language/index.tsx下面增加option其他语言选项
 */

const messageObject: Message = {
  'zhCN': zhCN,
  'en_US': en_US,
  'es_ES': es_ES
}

type ACTION = {
  type: string
  value: string
}

export const LANG_SWITCH = 'lang_switch';

/**
 * 语言的切换
 * @param state
 * @param action
 * @returns
 */
export const langSwitch = (state: INITSTATE = initState, action: ACTION) => {
  switch (action.type) {
    case LANG_SWITCH:
      return {...state, locale: action.value, message: messageObject[action.value] };
    default:
      return state;
  }
}