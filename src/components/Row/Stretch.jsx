import PropTypes from 'prop-types'
import React from 'react'

function StretchRow({ children }) {
  return (
    <section className="max-w-7xl m-auto p-4">
      {children}
    </section>
  )
}

StretchRow.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StretchRow
