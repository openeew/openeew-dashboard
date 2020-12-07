import React from 'react'

const Field = ({ title, value }) => {
  return (
    <div className="field">
      <p className="field_title">{title}</p>
      <span>{value}</span>
    </div>
  )
}

export default Field
