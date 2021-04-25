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

export const toggleCollapsed = (state: INITSTATE = initState, action: ACTION) => {
  console.log('-------action', action)
  switch (action.type) {
    case COLLAPSED_TOGGLE:
      return {...state, collapsed: action.value};
    default:
      return state;
  }
}