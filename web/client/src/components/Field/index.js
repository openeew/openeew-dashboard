import React from 'react'

const Field = ({ title, value }) => {
  return (
    <div
      className="field"
      tabIndex={0}
      aria-label={`field with title "${title}" and value "${value}"`}
    >
      <p className="field_title">{title}</p>
      <span>{value}</span>
    </div>
  )
}

export default Field
