export const changeMousePosition = (mousePosition) => {
  return {
    type: 'CHANGE_MOUSE_POSITION',
    mousePosition
  }
}

export const changeMouseState = (mouseState) => {
  return {
    type: 'CHANGE_MOUSE_STATE',
    mouseState
  }
}

export const changeCurrentPie = (currentPie, mouseState) => {
  return {
    type: 'CHANGE_CURRENT_PIE',
    currentPie,
    mouseState
  }
}

export const changePieData = (propsData) => {
  return {
    type: 'CHANGE_PIE_DATA',
    propsData
  }
}
