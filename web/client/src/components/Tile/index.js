import React from 'react'
import { Tile } from 'carbon-components-react'

const _Tile = ({ title, main, small }) => {
  return (
    <Tile>
      <h2 className="tile_heading">{title}</h2>

      <div className="tile__secondary">
        <h3>{main}</h3>
        <small>{small}</small>
      </div>
    </Tile>
  )
}

export default _Tile
