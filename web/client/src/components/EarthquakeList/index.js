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
          {range(5).map((n) => (
            <StructuredListRow label key={`row-${n}`}>
              <StructuredListCell className="earthquake-list__item-mag">
                5.0
              </StructuredListCell>
              <StructuredListCell>
                <div className="earthquake-list__item-loc">
                  10 mi S of Oaxaca, Mexico
                </div>
                <div className="earthquake-list__item-time">
                  01:45:03 (CST) Nov 15, 2020
                </div>
              </StructuredListCell>

              <StructuredListCell>
                <div className="magnitude-box magnitude-box-lg" />
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  )
}

export default EarthquakeList
