import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import App from './app'
import store from './store'

Object.defineProperty(window, 'myH3', {
  value (selectot) {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.querySelector(selectot)
    )
  }
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#app')
)
