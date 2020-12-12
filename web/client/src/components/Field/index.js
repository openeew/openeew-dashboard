import React from 'react'

const Field = ({ title, value, hasMargin }) => {
  return (
    <div className="field" data-no-margin={hasMargin === false}>
      <p className="field_title">{title}</p>
      <span>{value}</span>
    </div>
  )
}

export default Field
