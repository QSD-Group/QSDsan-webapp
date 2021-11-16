import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { getConfig } from '../states/api'

const menuItemClass = 'mx-2 p-2 hover:text-gray-500 transition-color'

function HeaderNav() {
  const [menu, setMenu] = useState([])

  useEffect(() => {
    const updateConfig = async () => {
      const config = await getConfig()
      setMenu(config.menu)
    }
    updateConfig()
  }, []) // runs only once (since deps is just [])

  return (
    <section className="py-2 px-4 text-center">
      <div className="flex flex-row justify-center">
        {
          menu.map((menuItem) => (
            menuItem.external
              ? <a href={menuItem.href} className={menuItemClass} target="_blank" rel="noreferrer">{menuItem.name}</a>
              : <Link to={menuItem.href} className={menuItemClass}>{menuItem.name}</Link>
            // menuItem.contrast
            //   ? <Link to={menuItem.href} className="bg-illini-orange">{menuItem.name}</Link>
            //   : <Link to={menuItem.href}>{menuItem.name}</Link>
          ))
        }
      </div>
    </section>
  )
}

export default HeaderNav
