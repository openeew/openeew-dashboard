import React, { useRef, useEffect } from 'react'
import { Save16 } from '@carbon/icons-react'

const onScreenReaderClick = (event, handler) => {
  if (event.key === 'Enter' || event.keyCode === 32) handler()
}

const SaveHeader = ({ onSave, onCancel, title }) => {
  const focus = useRef()

  // focus on title when this component loads
  useEffect(() => {
    focus.current.focus()
  })

  return (
    <div className="save-header">
      <span tabIndex={0} autofocus={true} ref={focus}>
        {title}
      </span>
      <span className="save-header_buttons">
        <span
          className="save-header_save-button"
          tabIndex={0}
          aria-label="save"
          role="button"
          onKeyDown={(event) => {
            if (onSave) onScreenReaderClick(event, onSave)
          }}
          onClick={() => {
            if (onSave) onSave()
          }}
        >
          Save <Save16 style={{ marginLeft: 5 }} />
        </span>
        <span
          onClick={() => {
            if (onCancel) onCancel()
          }}
          tabIndex={0}
          aria-label="cancel"
          role="button"
          onKeyDown={(event) => {
            if (onSave) onScreenReaderClick(event, onSave)
          }}
        >
          Cancel
        </span>
      </span>
    </div>
  )
}

export default SaveHeader
