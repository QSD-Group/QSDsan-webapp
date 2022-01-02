// import Lottie from 'lottie-react'
import React from 'react'
import Helmet from 'react-helmet'

import lottieSearchNotFound from '../assets/lottie/73061-search-not-found.json'

export default function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found! - QSDsan</title>
      </Helmet>
      <section className="max-w-7xl m-auto p-4 text-center">
        <div className="inline-block p-10 border border-indigo-500 border-opacity-25 rounded-lg">
          {
            // <Lottie className="h-60" animationData={lottieSearchNotFound} />
          }
          <div className="text-xl">Page Not Found!</div>
        </div>
      </section>
    </>
  )
}
