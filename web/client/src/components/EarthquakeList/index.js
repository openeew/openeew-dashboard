import React from 'react'
import {
  StructuredListRow,
  StructuredListCell,
  StructuredListWrapper,
  StructuredListBody,
} from 'carbon-components-react'
import { earthquakes } from '../../context/app'
import {
  filterTime,
  formatDate,
  formatTime,
  keyboardOnlySubmit,
} from '../../utils'

const EarthquakeList = ({
  onEventView,
  onRowHover,
  highlightedRow,
  selectedTimeFilter,
}) => (
  <div className="earthquake-list__container">
    <StructuredListWrapper className="earthquake-list">
      <StructuredListBody>
        {earthquakes.map((n, index) => {
          if (!filterTime(n.date, selectedTimeFilter))
            return <React.Fragment key={`row-${index}`} />
          const date = new Date(n.date)
          const formattedDate = formatDate(date)
          const formattedTime = formatTime(date)
          const onSubmit = () => onEventView(earthquakes[index])
          return (
            <StructuredListRow
              label
              key={`row-${index}`}
              onClick={onSubmit}
              onKeyDown={(e) => keyboardOnlySubmit(e, onSubmit)}
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
                  <span>{formattedTime}</span>
                  <span style={{ marginLeft: 5 }}>{formattedDate}</span>
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
