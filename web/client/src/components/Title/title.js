import React from 'react'
import './title.scss'

const Title = ({ children }) => (
  <p className="title" tabIndex={0}>
    {children}
  </p>
)

export default Title
