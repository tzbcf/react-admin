const initState = {
  collapsed: false
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
 * 左边导航栏的切换；collapsed为true时，展开，否则缩小
 * @param state
 * @param action
 * @returns
 */
export const toggleCollapsed = (state: INITSTATE = initState, action: ACTION) => {
  switch (action.type) {
    case COLLAPSED_TOGGLE:
      return {...state, collapsed: action.value};
    default:
      return state;
  }
}