import clsx from 'clsx'
import PropTypes from 'prop-types'
import React from 'react'

import StretchRow from './Stretch'

function GuideRow({ title, titleClass, children }) {
  return (
    <StretchRow>
      <div className={clsx('text-alma text-lg font-bold', titleClass)}>
        {title}
      </div>
      <div className="mt-4">
        <div className="flex">
          {children}
        </div>
      </div>
    </StretchRow>
  )
}

GuideRow.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  titleClass: PropTypes.string,
}

GuideRow.defaultProps = {
  titleClass: '',
}

export default GuideRow
