// 默认英语。使用英语模块
const initState = {
    locale: '',
    message: undefined,
};


export type LangMessage = {
  [index: string]: string
}

export type INITSTATE = {
  locale: string,
  message: LangMessage | undefined
}

type LangValue = {
  locale: string;
  message: any;
}

export type ACTION = {
  type: string
  value: LangValue
}

export const LANG_SWITCH = 'lang_switch';

/**
 * 语言切换
 * @param {INITSTATE} state 状态值
 * @param {ACTION} action 切换器
 * @returns {state} 返回state
 */
export const langSwitch = (state: INITSTATE = initState, action: ACTION) => {
    switch (action.type) {
        case LANG_SWITCH:
            return {...state, locale: action.value.locale, message: action.value.message };
        default:
            return state;
    }
};
