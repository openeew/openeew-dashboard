import React, { useEffect, useState, useCallback } from 'react'
import { Dropdown } from 'carbon-components-react'
import SensorsTable from '../../components/SensorsTable'
import { useLazyQuery } from '@apollo/client'
import SensorsMap from '../../components/SensorsMap'
import { sensorGroupDropdownItems } from './dropdownItems'

import { GET_SENSORS } from '../../graphql/queries'

const Sensors = () => {
  const [execQuery, { data, loading, error }] = useLazyQuery(GET_SENSORS, {
    errorPolicy: 'all',
  })

  const [pageSize, setPageSize] = useState(5)
  const [page, setPage] = useState(1)
  const [sensors, setSensors] = useState([])
  const [currentlyVisibleSensors, setCurrentlyVisibleSensors] = useState([])

  useEffect(() => {
    execQuery()
  }, [execQuery])

  useEffect(() => {
    if (data && data.sensors) {
      setSensors(data.sensors)
    }
  }, [data])

  useEffect(() => {
    setCurrentlyVisibleSensors(
      sensors.slice((page - 1) * pageSize, page * pageSize)
    )
  }, [page, pageSize, sensors])

  const onPaginationChange = (paginationInfo) => {
    setPage(paginationInfo.page)
    setPageSize(paginationInfo.pageSize)
  }

  const setFilter = (e) => {
    if (e.selectedItem.id === 'my-sensors') {
      setSensors(sensors.filter((sensor) => sensor.isUserOwner))
    } else {
      setSensors(data.sensors)
    }
  }

  console.log(data)
  console.log(error)

  return (
    <div className="sensors-page">
      <p className="title" tabIndex={0}>
        Sensors
      </p>
      <Dropdown
        id="sensor-group-dropdown"
        className="sensor-group-dropdown"
        label={sensorGroupDropdownItems[0].text}
        itemToString={(item) => (item ? item.text : '')}
        items={sensorGroupDropdownItems}
        onChange={setFilter}
      />

      <div className="sensors-map__container">
        <SensorsMap sensors={sensors} />
      </div>

      <div className="sensors-table__container">
        <SensorsTable
          loading={loading}
          sensors={sensors}
          onPaginationChange={onPaginationChange}
          page={page}
          pageSize={pageSize}
          currentlyVisibleSensors={currentlyVisibleSensors}
        />
      </div>
    </div>
  )
}

export default Sensors
