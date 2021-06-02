import zhCN from 'src/assets/langLocales/zhCN';
import es_ES from 'src/assets/langLocales/es_ES';
import en_US from 'src/assets/langLocales/en_US';

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

const messageObject: Message = {
  'zhCN': zhCN,
  'en_US': en_US,
  'es_ES': es_ES
}

type ACTION = {
  type: string
  value: string
}

export const LANG_SWITCH = 'lang_switch'; // menu展开与缩小的切换

export const langSwitch = (state: INITSTATE = initState, action: ACTION) => {
  switch (action.type) {
    case LANG_SWITCH:
      return {...state, locale: action.value, message: messageObject[action.value] };
    default:
      return state;
  }
}