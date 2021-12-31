const initState = {
    collapsed: false,
};

export type INITSTATE = {
  collapsed: boolean
}

type ACTION = {
  type: string
  value: boolean
}

export const COLLAPSED_TOGGLE = 'collapsed_toggle'; // menu展开与缩小的切换

/**
 * 状态切换
 * @param {INITSTATE} state 状态器
 * @param {ACTION} action 切换器
 * @returns {state} state
 */
export const toggleCollapsed = (state: INITSTATE = initState, action: ACTION) => {
    switch (action.type) {
        case COLLAPSED_TOGGLE:
            return {...state, collapsed: action.value};
        default:
            return state;
    }
};
