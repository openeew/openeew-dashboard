import React from 'react'
import Title from '../Title'
import { Close24 } from '@carbon/icons-react'

const RightInformationPanel = ({ title, onRequestClose, children }) => {
  return (
    <div className="right-information-panel">
      <div className="right-information-panel__header">
        <Title>{title}</Title>
        <button
          className="right-information-panel__close"
          onClick={onRequestClose}
        >
          <Close24 />
        </button>
      </div>
      <div className="right-information-panel__content">{children}</div>
    </div>
  )
}

export default RightInformationPanel
