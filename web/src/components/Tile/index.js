import React from 'react';
import { Tile } from 'carbon-components-react';

export default function index({ title, main, small }) {
  return (
    <Tile>
      {title}
      <div className="tile__secondary">
        <h1>{main}</h1>
        <small>{small}</small>
      </div>
    </Tile>
  );
}
