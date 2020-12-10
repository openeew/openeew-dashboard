import React from 'react'
import {
  StructuredListRow,
  StructuredListCell,
  StructuredListWrapper,
  StructuredListBody,
} from 'carbon-components-react'

const EarthquakeList = () => {
  return (
    <div className="earthquake-list__container">
      <StructuredListWrapper className="earthquake-list">
        <StructuredListBody>
          <StructuredListRow label key={`row-${1}`}>
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
          <StructuredListRow label key={`row-${2}`}>
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
          <StructuredListRow label key={`row-${3}`}>
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
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  )
}

export default EarthquakeList
