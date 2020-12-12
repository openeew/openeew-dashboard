import React from 'react'
import {
  StructuredListRow,
  StructuredListCell,
  StructuredListWrapper,
  StructuredListBody,
} from 'carbon-components-react'
import { earthquakes } from '../../context/app'

const EarthquakeList = ({ onEventView, onRowHover, highlightedRow }) => (
  <div className="earthquake-list__container">
    <StructuredListWrapper className="earthquake-list">
      <StructuredListBody>
        {earthquakes.map((n, index) => {
          const date = new Date(n.date)
          const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
            date
          )
          const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(
            date
          )
          const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
            date
          )
          const time = new Intl.DateTimeFormat('en', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          }).format(date)
          return (
            <StructuredListRow
              label
              key={`row-${index}`}
              onClick={() => onEventView(earthquakes[index])}
              onFocus={() => onRowHover(index)}
              onMouseOver={() => onRowHover(index)}
              onMouseLeave={() => onRowHover(undefined)}
              data-sim-hover={highlightedRow === index}
            >
              <StructuredListCell className="earthquake-list__item-mag">
                {n.magnitude.toFixed(1)}
              </StructuredListCell>
              <StructuredListCell>
                <div className="earthquake-list__item-loc">
                  {n.locationText}
                </div>
                <div className="earthquake-list__item-time">
                  <span>{`${time}`}</span>
                  <span style={{ marginLeft: 5 }}>{`${da} ${mo}, ${ye}`}</span>
                </div>
              </StructuredListCell>
            </StructuredListRow>
          )
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  </div>
)

export default EarthquakeList
