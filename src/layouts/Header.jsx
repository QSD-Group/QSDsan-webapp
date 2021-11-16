import React from 'react'
import { Link } from 'react-router-dom'

import qsdsanLogo from '../assets/logo/qsdsan_full.png'

function Header() {
  return (
    <section className="max-w-7xl m-auto p-4">
      <div className="sr-only">Home Top Header</div>
      <div className="text-center font-bold">
        <Link to="/">
          <img className="h-28 m-auto" alt="QSDsan" src={qsdsanLogo} />
        </Link>
      </div>
    </section>
  )
}

export default Header
