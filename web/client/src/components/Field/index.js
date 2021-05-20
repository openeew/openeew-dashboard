import React from 'react'

const Field = ({ title, value, hasMargin, secondary }) => {
  return (
    <div
      className="field"
      tabIndex={0}
      aria-label={`field with title "${title}" and value "${value}"`}
      data-no-margin={hasMargin === false}
    >
      <p className="field_title">{title}</p>
      <span>{value}</span>
      {secondary ? <span className="secondary">{secondary}</span> : null}
    </div>
  )
}

export default Field
