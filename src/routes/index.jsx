import React, {
  useEffect, useRef, Suspense, lazy,
} from 'react'
import {
  BrowserRouter as Router, Route, Redirect, Switch,
  // useLocation, useHistory
} from 'react-router-dom'
import { createBrowserHistory } from 'history'

// ==== REDUX ====
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import reducer from '../states/reducers'
import { getAllProducts } from '../states/actions'

// ==== PAGES ====
const Home = lazy(() => import('../pages/Home'))
const Bwaise = lazy(() => import('../pages/Bwaise'))
const PageNotFound = lazy(() => import('../pages/404'))

const Containers = [
  {
    name: 'Home',
    path: '/',
    exact: true,
    comp: Home,
  },
  {
    name: 'Bwaise',
    path: '/bwaise',
    exact: true,
    comp: Bwaise,
  },
  {
    name: 'Page Not Found',
    path: '/404',
    exact: true,
    comp: PageNotFound,
  },
]

const useRouter = (callback) => {
  const history = createBrowserHistory()
  useEffect(() => {
    let currentUrl = `${history.location.pathname}${history.location.search}`
    const listen = history.listen((location) => {
      if (currentUrl !== `${location.pathname}${location.search}`) {
        callback()
      }
      currentUrl = `${location.pathname}${location.search}`
    })
    return () => {
      listen()
    }
  }, [callback, history])
}

const useRouterLocation = (callback) => {
  const history = createBrowserHistory()
  const savedCallback = useRef(() => {})
  useEffect(() => {
    savedCallback.current = callback
  })
  useEffect(() => {
    const currentCallback = () => {
      savedCallback.current()
    }
    const listen = history.listen(() => {
      currentCallback()
    })
    return () => {
      listen()
    }
  }, [history])
}

// eslint-disable-next-line react/prop-types
const RouterComp = ({ container, routeProps }) => <container.comp {...routeProps} />
// const RouterComp = ({ container, routeProps }) => {
//   const { pathname = '' } = useLocation()
//   if (container.name === 'Address' && isChainTypeError(pathname.substring(pathname.lastIndexOf('/') + 1))) {
//     return <SearchFail {...routeProps} address={pathname.substring(pathname.lastIndexOf('/') + 1)} />
//   }
//   return <container.comp {...routeProps} />
// }

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') middleware.push(createLogger())

const store = createStore(reducer, applyMiddleware(...middleware))
store.dispatch(getAllProducts())

export default function allRoutes() {
  // const dispatch = useDispatch()
  // const { components } = useAppState()
  // const { mobileMenuVisible } = components

  useRouter(() => {
    window.scrollTo(0, 0)
  })

  useRouterLocation(() => {
    // if (mobileMenuVisible) {
    //   dispatch({
    //     type: ComponentActions.UpdateHeaderMobileMenuVisible,
    //     payload: {
    //       mobileMenuVisible: false,
    //     },
    //   })
    // }
  })

  return (
    <Router basename="/">
      <Route
        render={(props) => (
          <div>
            {/* <Alert /> */}
            {/* <HeaderNav /> */}
            {/* <Sheet /> */}
            <Suspense fallback={<span />}>
              {/* eslint-disable-next-line react/prop-types */}
              <Switch location={props.location}>
                <Provider store={store}>
                  {
                    // TODO: Redirect wrong urls to 404 page
                  }
                  {Containers.map((container) => (
                    <Route
                      {...container}
                      key={container.name}
                      render={(routeProps) => <RouterComp container={container} routeProps={routeProps} />}
                    />
                  ))}
                </Provider>
              </Switch>
              {/* {!(isMobile() && mobileMenuVisible) && <Footer />} */}
            </Suspense>
          </div>
        )}
      />
    </Router>
  )
}

// allRoutes.PropTypes = {
//   location:
// }
