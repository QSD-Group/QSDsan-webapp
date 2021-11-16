import React from 'react'
import { Link } from 'react-router-dom'

import Header from '../layouts/Header'
import HeaderNav from '../layouts/HeaderNav'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header />
      <HeaderNav />

      <section className="max-w-7xl m-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          <Link to="/bwaise" className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Bwaise</p>
            <p className="text-indigo-500 group-hover:text-gray-500">Sanitation Alternatives in Bwaise, Uganda</p>
          </Link>

          <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Bwaise</p>
            <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
          </div>

          <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Bwaise</p>
            <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
          </div>

          <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Bwaise</p>
            <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
