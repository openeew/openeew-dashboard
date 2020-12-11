import React from 'react'
import {
  StructuredListRow,
  StructuredListCell,
  StructuredListWrapper,
  StructuredListBody,
} from 'carbon-components-react'

const EarthquakeList = () => {
  const range = (n) => {
    let range = []
    for (let i = 0; i < n; i++) range.push(i)
    return range
  }

  return (
    <div className="earthquake-list__container">
      <StructuredListWrapper className="earthquake-list">
        <StructuredListBody>
          {range(50).map((n) => {
            const time = new Date(1000 * (Math.random() * 86400))
              .toISOString()
              .substr(11, 5)
            return (
              <StructuredListRow label key={`row-${n}`}>
                <StructuredListCell className="earthquake-list__item-mag">
                  {Math.round(Math.random() * 4) + 1}.0
                </StructuredListCell>
                <StructuredListCell>
                  <div className="earthquake-list__item-loc">
                    {Math.round(Math.random() * 15)} km S of Oaxaca •{' '}
                    <span className="earthquake-list__item-loc__city">
                      Mexico
                    </span>
                  </div>
                  <div className="earthquake-list__item-time">
                    <span>{time}pm cst</span>
                    <span style={{ marginLeft: 5 }}>Today</span>
                  </div>
                </StructuredListCell>
              </StructuredListRow>
            )
          })}
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  )
}

export default EarthquakeList
