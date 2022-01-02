import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import QSDsanLogo from '../../assets/logo/qsdsan_full.png'
import { getConfig } from '../../states/api'

function Header() {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const updateConfig = async () => {
      const config = await getConfig()
      setMenu(config.menu)
    }
    updateConfig()
  }, [])

  return (
    <>
      <section>
        <div className="sr-only">Home Top Header</div>
        <div className="text-center font-bold">
          <Link to="/">
            <img className="h-28 m-auto" alt="QSDsan" src={QSDsanLogo} />
          </Link>
        </div>
      </section>
      <section className="py-2 px-4 text-center">
        <div className="flex flex-row justify-center">
          {
            menu.map((menuItem, idx) => (
              menuItem.external
                ? <a key={menuItem.href} href={menuItem.href} className="mx-2 p-2 hover:text-gray-500 transition-color" target="_blank" rel="noreferrer">{menuItem.name}</a>
                : <Link key={menuItem.href} to={menuItem.href} className="mx-2 p-2 hover:text-gray-500 transition-color">{menuItem.name}</Link>
              // menuItem.contrast
              //   ? <Link to={menuItem.href} className="bg-illini-orange">{menuItem.name}</Link>
              //   : <Link to={menuItem.href}>{menuItem.name}</Link>
            ))
          }
        </div>
      </section>
    </>
  )
}

export default Header
