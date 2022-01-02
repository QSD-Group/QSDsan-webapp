import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import './styles/index.css'
import App from './pages/App'
import reportWebVitals from './reportWebVitals'
import { getAllProducts } from './states/actions'
import reducer from './states/reducers'

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') middleware.push(createLogger())

const store = createStore(reducer, applyMiddleware(...middleware))
store.dispatch(getAllProducts())

ReactDOM.render(
  // eslint-disable-next-line react/jsx-filename-extension
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
