import React from 'react'

const Field = ({ title, value, hasMargin }) => {
  return (
    <div
      className="field"
      tabIndex={0}
      aria-label={`field with title "${title}" and value "${value}"`}
      data-no-margin={hasMargin === false}
    >
      <p className="field_title">{title}</p>
      <span>{value}</span>
    </div>
  )
}

export default Field
