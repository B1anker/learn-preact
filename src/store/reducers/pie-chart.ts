const initial = {
  mousePosition: [0, 0],
  mouseState: 'out',
  currentPie: 0,
  prevPie: -1
}

export default (state = initial, action) => {
  switch (action.type) {
    case 'CHANGE_MOUSE_POSITION':
      return {
        ...state,
        mousePosition: action.mousePosition
      }
    case 'CHANGE_MOUSE_STATE':
      const newState = {
        ...state,
        mouseState: action.mouseState
      }
      if (action.mouseState === 'out') {
        newState.prevPie = newState.currentPie
        newState.currentPie = -1
      }
      return newState
    case 'CHANGE_CURRENT_PIE':
      return {
        ...state,
        prevPie: state.currentPie === action.currentPie ? state.prevPie : state.currentPie,
        currentPie: action.currentPie,
        state: action.mouseState
      }
    case 'CHANGE_PIE_DATA':
      return {
        ...state,
        propsData: action.propsData
      }
    default:
      return state
  }
}
