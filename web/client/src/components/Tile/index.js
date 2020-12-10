import React from 'react'
import { Tile } from 'carbon-components-react'

const _Tile = ({ title, main, small }) => {
  return (
    <Tile>
      <h2 className="tile_heading" tabIndex={0} aria-label={title}>
        {title}
      </h2>

      <div className="tile__secondary" tabIndex={0}>
        <h3>{main}</h3>
        <small>{small}</small>
      </div>
    </Tile>
  )
}

export default _Tile
