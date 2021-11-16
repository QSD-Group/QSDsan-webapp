import React, { useState, useEffect } from 'react'
import { Sprout32 } from '@carbon/icons-react'

import Header from '../layouts/Header'
import HeaderNav from '../layouts/HeaderNav'
// import Card from '../components/Card'

import allCountries from '../assets/data/allCountries.json'

export default function Bwaise() {
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <Header />
      <HeaderNav />

      <section className="max-w-7xl m-auto p-4">
        <h2 className="text-xl font-bold">Bwaise: Sanitation Alternatives in Bwaise, Uganda</h2>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 1</div>

        <div className="">
          <div className="sr-only">Step 1 Header</div>
          <div className="text-alma text-lg font-bold">Step 1: Begin by selecting the country (pre-configured) or the customized option</div>
        </div>

        <div className="mt-4">
          <div className="sr-only">Step 1 Body</div>
          <div className="flex">
            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Project Name:</div>
              <input id="project-name" placeholder="Enter Project Name" className="border py-1 px-2" />
            </div>

            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Country:</div>
              <select className="py-1 px-2">
                {
                  Object.keys(allCountries).map((abbr) => (<option key={abbr} value={abbr}>{allCountries[abbr]}</option>))
                }
              </select>
            </div>

            <div className="px-4">
              <div className="mb-2 text-alma font-semibold">Customize Options?</div>
              <input
                name="customize"
                type="checkbox"
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 2</div>

        <div className="">
          <div className="sr-only">Step 2 Header</div>
          <div className="text-alma text-lg font-bold">Step 2: Select the class of conservation practices that best describes the practice you would like to evaluate</div>
        </div>

        <div className="mt-4">
          <div className="sr-only">Step 2 Body</div>
          <div className="grid grid-cols-4 gap-4">
            <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
              <Sprout32 className="m-auto" />
              <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Cropland Management</p>
            </div>

            <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
              <Sprout32 className="m-auto" />
              <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            </div>

            <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
              <Sprout32 className="m-auto" />
              <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            </div>

            <div className="group px-6 py-5 border border-indigo-500 border-opacity-25 cursor-pointer select-none text-center overflow-hidden space-y-1 hover:bg-white hover:shadow-lg hover:border-transparent">
              <Sprout32 className="m-auto" />
              <p className="font-semibold text-indigo-600 group-hover:text-gray-900">Grazing Lands</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl m-auto p-4">
        <div className="sr-only">Step 3</div>
        <div className="">
          <div className="sr-only">Step Header</div>
          <div className="text-alma text-lg font-bold">Step 3: Select a NRCS Conservation Practice Standard and a Practice Implementation that best describes your system. You may add multiple practices. If you would like to add a practice under a different class of practices, return to Step 2.</div>
        </div>
      </section>
    </div>
  )
}
