const initState = {
  a: 1
}

const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case 'Add':
      return {
        a: 1
      };
    default:
      return state;
  }
}

export default reducer;