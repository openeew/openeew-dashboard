import { useEffect, useRef, useState, Fragment } from 'react'

import {
  DataTable,
  Dropdown,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  OverflowMenu,
  OverflowMenuItem,
} from 'carbon-components-react'
import { ZoomIn16, ZoomOut16 } from '@carbon/icons-react'
import mapboxgl from 'mapbox-gl'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'
import { formatCoordinates, keyboardOnlySubmit } from '../../utils'

const sensorGroupDropdownItems = [
  {
    id: 'my-sensors',
    text: 'My sensors',
  },
]

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const randomHex = (size) =>
  [...Array(size)]
    .map(() =>
      Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase()
    )
    .join('')

let sensors = []
const nSensors = 50
for (let i = 0; i < nSensors; i++)
  sensors.push({
    id: randomHex(12),
    last_report: random(0, 11),
    user_is_owner: random(0, 101) >= 60,
    data_transmission: random(0, 101),
    country: 'Mexico',
    connection_type: 'WiFi',
    device_version: `1.${random(2, 5)}.0`,
    peak_acc: random(20, 40),
    earthquakes_detected: random(1, 6),
    pos: [random(-108.01, -96.01), random(16.01, 28.01)],
  })

const headers = [
  {
    header: 'Sensor ID',
    key: 'id',
  },
  {
    header: 'Last report',
    key: 'last_report',
  },
  {
    header: 'Data transmission',
    key: 'data_transmission',
  },
  {
    header: 'Country',
    key: 'country',
  },
  {
    header: 'Connection type',
    key: 'connection_type',
  },
  {
    header: 'Device version',
    key: 'device_version',
  },
  {
    header: 'Peak acc.',
    key: 'peak_acc',
  },
  {
    header: 'Coordinates',
    key: 'pos',
  },
  {
    header: 'Earthquakes detected',
    key: 'earthquakes_detected',
  },
]

const formatRows = (rows) =>
  rows.map((row) => {
    let rowCopy = { ...row }
    rowCopy['id'] = '' + rowCopy['id']
    rowCopy['device_version'] = 'V' + rowCopy['device_version']
    rowCopy['last_report'] += 's'
    rowCopy['data_transmission'] += '%'
    rowCopy['peak_acc'] += ' gals'
    return rowCopy
  })

const SensorsTable = () => {
  let [pageSize, setPageSize] = useState(5)
  let [page, setPage] = useState(1)

  const onPaginationChange = (paginationInfo) => {
    setPage(paginationInfo.page)
    setPageSize(paginationInfo.pageSize)
  }

  let currentlyVisibleSensors = sensors.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  const getRowClasses = (indexCells) => {
    if (indexCells === 1) return 'with-circle status-green'
  }

  return (
    <DataTable
      rows={formatRows(currentlyVisibleSensors)}
      headers={headers}
      className="sensors-table"
    >
      {({
        rows,
        headers,
        getRowProps,
        getHeaderProps,
        getTableProps,
        getTableContainerProps,
        getToolbarProps,
        onInputChange,
      }) => (
        <TableContainer {...getTableContainerProps()}>
          <TableToolbar
            {...getToolbarProps()}
            aria-label="data table toolbar"
            size="small"
          >
            <TableToolbarContent>
              <TableToolbarSearch
                expanded={true}
                onChange={onInputChange}
                placeHolderText="Search by Sensor ID"
              />
            </TableToolbarContent>
          </TableToolbar>
          <Table
            {...getTableProps()}
            overflowMenuOnHover={false}
            tabIndex={0}
            aria-label={'table'}
          >
            <TableHead>
              <TableRow>
                <TableExpandHeader />
                {headers.map((header, headerIndex) => (
                  <TableHeader
                    {...getHeaderProps({ header })}
                    tabIndex={0}
                    aria-label={`Header ${header.header}`}
                    key={`header-${header.header}`}
                    className={
                      headerIndex === 0 ? 'sticky-column left' : undefined
                    }
                  >
                    {header.header}
                  </TableHeader>
                ))}
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                // make sure we don't try to display more than possible
                .filter(
                  (_, rowIndex) =>
                    (page - 1) * pageSize + rowIndex < sensors.length
                )
                .map((row, rowIndex) => (
                  <Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell, indexCells) => (
                        <TableCell
                          key={cell.id}
                          className={
                            indexCells === 0 ? 'sticky-column left' : undefined
                          }
                        >
                          <span
                            tabIndex={0}
                            className={getRowClasses(indexCells)}
                            aria-label={`${headers[indexCells].header} is ${cell.value}`}
                          >
                            {indexCells === 0 ? (
                              <code>{cell.value}</code>
                            ) : Array.isArray(cell.value) ? (
                              formatCoordinates(cell.value)
                            ) : (
                              cell.value
                            )}
                          </span>
                          {indexCells === 0 &&
                            sensors[(page - 1) * pageSize + rowIndex]
                              .user_is_owner && (
                              <Tag
                                className="tag-owner"
                                tabIndex={0}
                                aria-label="My sensor"
                              >
                                My sensor
                              </Tag>
                            )}
                        </TableCell>
                      ))}
                      <TableCell
                        key={row.id + '-overflow'}
                        className="sticky-column right"
                      >
                        <OverflowMenu style={{ float: 'right' }} flipped>
                          <OverflowMenuItem
                            itemText="wow, a button"
                            onClick={() => alert('wow, an alert')}
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableExpandRow>
                    <TableExpandedRow
                      colSpan={headers.length + 2}
                      className="sensors-expandable-row"
                    >
                      <div className="sensor-chart" tabIndex={0}>
                        <p className="title dance" tabIndex={0} />
                      </div>
                    </TableExpandedRow>
                  </Fragment>
                ))}
            </TableBody>
          </Table>
          <Pagination
            backwardText="Previous page"
            forwardText="Next page"
            itemsPerPageText="Items per page:"
            page={1}
            pageNumberText="Page Number"
            pageSize={5}
            onChange={onPaginationChange}
            pageSizes={[5, 10, 15]}
            totalItems={sensors.length}
          />
        </TableContainer>
      )}
    </DataTable>
  )
}

let sensorPoints = sensors.map((sensor, index) => {
  return {
    type: 'Feature',
    properties: {
      id: sensor.pos.toString(),
      highlighted: false,
      pos: sensor.pos,
      country: sensor.country,
    },
    geometry: {
      type: 'Point',
      coordinates: sensor.pos,
    },
  }
})

let sensorSources = {
  type: 'FeatureCollection',
  features: sensorPoints,
}

const Sensors = () => {
  let mapWrapper = useRef()
  let [lng] = useState(-99.3533)
  let [lat] = useState(20.8857)
  let [zoom] = useState(4.65)
  let map = useRef()

  if (
    map.current !== undefined &&
    map.current.getSource('sensors') !== undefined
  ) {
    let data = sensorSources
    data.features = data.features.map((feature, index) => {
      feature.properties.highlighted = false
      return feature
    })
    map.current.getSource('sensors').setData(data)
  }

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
      preserveDrawingBuffer: true,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )

    map.current.on('load', () => {
      map.current.resize()

      map.current.addSource('sensors', {
        type: 'geojson',
        data: sensorSources,
      })

      map.current.addLayer({
        id: 'sensors',
        type: 'circle',
        source: 'sensors',
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'case',
            ['boolean', ['get', 'highlighted'], false],
            '#fff', // on hover
            '#3DC04E', // default
          ],
        },
      })
    })
    map.current.resize()
  })

  const zoomIn = () => {
    map.current.flyTo({ zoom: map.current.getZoom() + 1 })
  }
  const zoomOut = () => {
    map.current.flyTo({ zoom: map.current.getZoom() - 1 })
  }

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
      />
      <div className="sensors-map__container">
        <div className="sensors-map__header">
          <h4 className="sensors-map__title" tabIndex={0}>
            Sensor locations
          </h4>
          <div className="sensors-map__controls">
            <span
              tabIndex={0}
              onClick={zoomIn}
              onKeyDown={(e) => keyboardOnlySubmit(e, zoomIn)}
            >
              <ZoomIn16 />
            </span>
            <span
              tabIndex={0}
              onClick={zoomOut}
              onKeyDown={(e) => keyboardOnlySubmit(e, zoomOut)}
            >
              <ZoomOut16 />
            </span>
          </div>
        </div>
        <div ref={(el) => (mapWrapper = el)} className="map-wrapper" />
      </div>
      <SensorsTable />
    </div>
  )
}

export default Sensors
