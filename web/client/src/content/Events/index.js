import React, { useState } from 'react'
import EventsMap from '../../components/EventsMap'
import { Dropdown } from 'carbon-components-react'
import EarthquakeList from '../../components/EarthquakeList'
import RightInformationPanel from '../../components/RightInformationPanel'
import { CheckmarkFilled16 } from '@carbon/icons-react'
import Field from '../../components/Field'
import { earthquakes, takeEventsMapSnapshot } from '../../context/app'
import {formatCoordinates, formatDate, formatTime} from '../../utils'

const dayInSeconds = 86400

const items = [
  { id: 'timeframe-past-7', text: 'Past 7 Days', timePeriod: dayInSeconds * 7 },
  {
    id: 'timeframe-past-30',
    text: 'Past 30 Days',
    timePeriod: dayInSeconds * 30,
  },
  {
    id: 'timeframe-past-90',
    text: 'Past 90 Days',
    timePeriod: dayInSeconds * 90,
  },
  {
    id: 'timeframe-past-year',
    text: 'Past Year',
    timePeriod: dayInSeconds * 365,
  },
]
const defaultTimeFilterIndex = 0

const Events = () => {
  const [isViewingEvent, setViewingEvent] = useState(false)
  const [event, setEvent] = useState(undefined)
  const [mapDataURL, setMapDataURL] = useState(undefined)
  const [highlightedEventIndex, setHighlightedEventIndex] = useState(undefined)
  const [selectedTimeFilter, setSelectedTimeFilter] = useState(
    items[defaultTimeFilterIndex]
  )

  return (
    <div className="events-page">
      <div className="bx--row events-page-heading__container marb-3">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>
      <div className="events-container">
        <EventsMap
          highlightedEventIndex={highlightedEventIndex}
          onEarthquakeHighlight={(index) => setHighlightedEventIndex(index)}
          onRequestViewEvent={(event, mapSnapshot) => {
            setViewingEvent(true)
            setMapDataURL(mapSnapshot)
            setEvent(event)
          }}
          selectedTimeFilter={selectedTimeFilter}
        />
        <div className="events-panel">
          <Dropdown
            id="timeperiod-dropdown"
            items={items}
            itemToString={(item) => (item ? item.text : '')}
            label={items[0].text}
            value={selectedTimeFilter}
            onChange={(e) => setSelectedTimeFilter(e.selectedItem)}
            size="sm"
          />
          <div className="events-panel__information">
            <div>
              <h4>{earthquakes.length}</h4>
              <span>Earthquakes detected</span>
            </div>
            <div>
              <h4>2,400</h4>
              <span>Subscribers alerted</span>
            </div>
          </div>
          <div className="events-page-earthquake-list__container">
            <EarthquakeList
              onEventView={(event) => {
                setViewingEvent(true)
                setMapDataURL(takeEventsMapSnapshot(event.pos))
                setEvent(event)
              }}
              onRowHover={(row) => setHighlightedEventIndex(row)}
              highlightedRow={highlightedEventIndex}
              selectedTimeFilter={selectedTimeFilter}
            />
          </div>
        </div>
      </div>
      {isViewingEvent &&
        (() => {
          const date = new Date(event.date)
          const formattedDate = formatDate(date)
          const formattedTime = formatTime(date)
          return (
            <RightInformationPanel
              title="Event details"
              onRequestClose={() => setViewingEvent(false)}
            >
              <span className="event-details__alert-issued-timing" tabIndex={0}>
                <CheckmarkFilled16 />
                Alert issued {event.alertDelay}s after detection
              </span>
              <div className="event-details__field-grid">
                <Field
                  title="Magnitude"
                  value={event.magnitude.toFixed(1)}
                  hasMargin={false}
                />
                <Field
                  title="Country"
                  value={event.country}
                  hasMargin={false}
                />
                <Field title="Date" value={formattedDate} hasMargin={false} />
                <Field title="Time" value={formattedTime} hasMargin={false} />
                <Field
                  title="Location"
                  value={event.locationText}
                  hasMargin={false}
                />
                <Field
                  title="Coordinates"
                  value={formatCoordinates(event.pos)}
                  hasMargin={false}
                />
              </div>
              <img className="event-details__map" src={mapDataURL} alt="" />
            </RightInformationPanel>
          )
        })()}
    </div>
  )
}

export default Events
