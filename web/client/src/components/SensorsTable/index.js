import headers from './headers'
import {
  DataTable,
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
  Modal,
  Loading,
} from 'carbon-components-react'

import SensorOverflowMenu from './SensorOverflowMenu'
import { Fragment, useContext, useEffect } from 'react'
import Tag from 'carbon-components-react/lib/components/Tag/Tag'

import { formatCoordinates, timeAgo } from '../../utils'
import SensorsInformationSidePanel from '../SensorsInformationSidePanel'
import AppContext from '../../context/app'

const formatRows = (rows) =>
  rows.map((row) => {
    let rowCopy = { ...row }
    rowCopy['id'] = '' + rowCopy['id']
    rowCopy['device_version'] = 'V' + rowCopy['device_version']
    rowCopy['connection_type'] = 'Wi-Fi'
    rowCopy['pos'] = rowCopy['latitude']
      ? `${rowCopy['latitude']} ${rowCopy['longitude']}`
      : 'Unavailable'
    rowCopy['lastCheckin'] = timeAgo.format(new Date(rowCopy['lastCheckin']))
    rowCopy['lastCheckinRaw'] = new Date(rowCopy['lastCheckin'])
    rowCopy['isUserOwner'] = new Date(rowCopy['isUserOwner'])

    // rowCopy['peak_acc'] += ' gals'
    return rowCopy
  })

const getSensorStatus = (timeAgo) => {
  if (!timeAgo) {
    return 'with-circle status-yellow'
  }

  const timeSegment = timeAgo.split(' ')[1].replace('s', '')

  if (['week', 'month', 'year'].includes(timeSegment)) {
    return 'with-circle status-yellow'
  }

  return 'with-circle status-green'
}

const getRowClasses = (cell, indexCells) => {
  if (indexCells === 1) {
    return getSensorStatus(cell.value)
  }
}

const SensorsTable = ({
  loading,
  sensors,
  page,
  pageSize,
  onPaginationChange,
  currentlyVisibleSensors,
  shouldShowSideMenu,
  shouldShowRemoveMenu,
  removeSensorLoading,
  displayedSensor,
  setShouldShowSideMenu,
  setShouldShowRemoveMenu,
  removeSensor,
  onModify,
  onRemove,
  onSensorHover,
  currentHoveredSensor,
}) => {
  const { t } = useContext(AppContext)

  useEffect(() => {
    document.body.className = shouldShowSideMenu ? 'body-no-scroll' : ''
  }, [shouldShowSideMenu])

  const onSideMenuClose = () => setShouldShowSideMenu(false)

  return (
    <>
      {shouldShowSideMenu && (
        <SensorsInformationSidePanel
          sensor={displayedSensor}
          onRequestClose={onSideMenuClose}
        />
      )}
      <Modal
        open={shouldShowRemoveMenu}
        modalHeading={t('content.sensors.sensorRemoveModal.removeSensor')}
        size="xs"
        secondaryButtonText={t('content.modal_basic.cancel')}
        primaryButtonText={t('content.modal_basic.confirm')}
        onRequestClose={() => setShouldShowRemoveMenu(false)}
        onRequestSubmit={removeSensor}
      >
        {removeSensorLoading ? <Loading /> : null}
        <p>{t('content.sensors.sensorRemoveModal.removeSensorText')}</p>
        <p className="mart-1">
          {t('content.sensors.sensorRemoveModal.removeSensorAdditional')}
        </p>
      </Modal>
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
                  // Make sure we don't try to display more than possible
                  .filter(
                    (_, rowIndex) =>
                      (page - 1) * pageSize + rowIndex < sensors.length
                  )
                  .map((row, rowIndex) => {
                    const sensorIndex = (page - 1) * pageSize + rowIndex

                    return (
                      <Fragment key={row.id}>
                        <TableExpandRow
                          {...getRowProps({ row })}
                          data-hovered={currentHoveredSensor === sensorIndex}
                          onMouseEnter={() => onSensorHover(sensorIndex)}
                          onMouseLeave={() => onSensorHover(undefined)}
                        >
                          {loading
                            ? null
                            : row.cells.map((cell, indexCells) => (
                                <TableCell
                                  key={cell.id}
                                  className={
                                    indexCells === 0
                                      ? 'sticky-column left'
                                      : undefined
                                  }
                                >
                                  <span
                                    tabIndex={0}
                                    className={getRowClasses(cell, indexCells)}
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
                                    sensors[sensorIndex].isUserOwner && (
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
                          {sensors[sensorIndex].isUserOwner ? (
                            <SensorOverflowMenu
                              id={row.id}
                              sensor={
                                formatRows(currentlyVisibleSensors)[rowIndex]
                              }
                              onModify={onModify}
                              onRemove={onRemove}
                            />
                          ) : (
                            <TableCell className="sticky-column right" />
                          )}
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
                    )
                  })}
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
    </>
  )
}

export default SensorsTable
