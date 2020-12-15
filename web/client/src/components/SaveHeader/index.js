import React, { useRef, useEffect } from 'react'
import { Save16 } from '@carbon/icons-react'

const onScreenReaderClick = (event, handler) => {
  if (event.key === 'Enter' || event.keyCode === 32) handler()
}

const SaveHeader = ({ onSave, onCancel, title, canSave }) => {
  const focus = useRef()

  // focus on title when this component loads
  useEffect(() => {
    // disabled due to this being triggered by canSave props change
    // please uncomment if you fix this problem, cheers
    // focus.current.focus()
  })

  return (
    <div className="save-header">
      <span tabIndex={0} ref={focus} className="save-header_title">
        {title}
      </span>
      <span className="save-header_buttons">
        <span
          className="save-header_save-button"
          tabIndex={0}
          aria-disabled={!canSave}
          data-disabled={!canSave}
          aria-label="save"
          role="button"
          onKeyDown={(event) => {
            if (onSave && canSave) onScreenReaderClick(event, onSave)
          }}
          onClick={() => {
            if (onSave && canSave) onSave()
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
