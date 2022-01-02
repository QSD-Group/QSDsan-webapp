import PropTypes from 'prop-types'
import React from 'react'

import StretchRow from './Stretch'
import { classNames } from '../../utils'

function GuideRow({ title, titleClass, children }) {
  return (
    <StretchRow>
      <div className={classNames('text-alma text-lg font-bold', titleClass)}>
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
