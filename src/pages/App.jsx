import React, { Suspense, lazy } from 'react'
import Helmet from 'react-helmet'
import { Route, Redirect, Switch } from 'react-router-dom'

import Header from '../components/Header'
import { useRouter, useRouterLocation } from '../utils/hooks'

// ==== PAGES ====
const Home = lazy(() => import('./Home'))
const Bwaise = lazy(() => import('./Bwaise'))
const PageNotFound = lazy(() => import('./404'))

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

// eslint-disable-next-line react/prop-types
const RouterComp = ({ container, routeProps }) => <container.comp {...routeProps} />

/* eslint-disable react/prop-types */
const HeaderWrapper = ({ children }) => (<div className="max-w-7xl m-auto p-4">{children}</div>)

const BodyWrapper = ({ children }) => (<div className="w-full pb-10">{children}</div>)
/* eslint-enable react/prop-types */

export default function App() {
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
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>QSDsan</title>
        <link rel="canonical" href="https://qsdsan.com/" />
        <meta name="description" content="Nested component" />
      </Helmet>
      {/* <Notification /> */}
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <Route
          render={(props) => (
            <Suspense fallback={<span />}>
              {/* eslint-disable-next-line react/prop-types */}
              <Switch location={props.location}>
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
              </Switch>
              {/* {!(isMobile() && mobileMenuVisible) && <Footer />} */}
            </Suspense>
          )}
        />
      </BodyWrapper>
    </>
  )
}

// allRoutes.PropTypes = {
//   location:
// }
