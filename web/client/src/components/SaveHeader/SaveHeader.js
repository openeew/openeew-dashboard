import React from "react";
import { Save16 } from '@carbon/icons-react';

import "./SaveHeader.scss";

function SaveHeader({ onSave, onCancel, title })
{
  return (
    <div className="save-header">
      <span>{title}</span>
      <span className="save-header_buttons">
        <span
          className="save-header_save-button"
          onClick={() => { if (onSave) onSave() }}
        >
          Save <Save16 style={{ marginLeft: 5 }} />
        </span>
        <span onClick={() => { if (onCancel) onCancel() }}>Cancel</span>
      </span>
    </div>
  )
}

export default SaveHeader;
