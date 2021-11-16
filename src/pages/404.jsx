import React from 'react'
import Lottie from 'lottie-react'

import Header from '../layouts/Header'
import HeaderNav from '../layouts/HeaderNav'
import lottieSearchNotFound from '../assets/lottie/73061-search-not-found.json'

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header />
      <HeaderNav />

      <section className="max-w-7xl m-auto p-4 text-center">
        <div className="inline-block p-10 border border-indigo-500 border-opacity-25 rounded-lg">
          <Lottie className="h-60" animationData={lottieSearchNotFound} />
          <div className="text-xl">Page Not Found!</div>
        </div>
      </section>
    </div>
  )
}
