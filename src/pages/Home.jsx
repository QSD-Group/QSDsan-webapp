import React from 'react'
import Helmet from 'react-helmet'
import { Link } from 'react-router-dom'

import StretchRow from '../components/Row/Stretch'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>QSDsan</title>
      </Helmet>

      <StretchRow>
        <div className="grid grid-cols-3 gap-4">
          <Link to="/bwaise" className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:shadow-lg hover:border-red">
            <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Bwaise</p>
            <p className="text-indigo-500 group-hover:text-gray-500">Sanitation Alternatives in Bwaise, Uganda</p>
          </Link>

          {
            // <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            //   <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Empty</p>
            //   <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
            // </div>
            //
            // <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            // <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Empty</p>
            // <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
            // </div>
            //
            // <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer rounded-lg select-none overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
            // <p className="font-semibold text-lg text-indigo-600 group-hover:text-gray-900">Empty</p>
            // <p className="text-indigo-500 group-hover:text-gray-500">Create a new project from a variety of starting templates.</p>
            // </div>
          }
        </div>
      </StretchRow>
    </>
  )
}
