import React, { useState } from 'react'
import EventsMap from '../../components/EventsMap'
import { Dropdown } from 'carbon-components-react'
import EarthquakeList from '../../components/EarthquakeList'
import RightInformationPanel from '../../components/RightInformationPanel'
import { CheckmarkFilled16 } from '@carbon/icons-react'
import Field from '../../components/Field'
import { takeEventsMapSnapshot } from '../../context/app'

const items = [
  { id: 'timeframe-past-7', text: 'Past 7 Days' },
  { id: 'timeframe-past-30', text: 'Past 30 Days' },
  { id: 'timeframe-past-90', text: 'Past 90 Days' },
  { id: 'timeframe-past-year', text: 'Past Year' },
]

const Events = () => {
  const [isViewingEvent, setViewingEvent] = useState(false)
  const [event, setEvent] = useState(undefined)
  const [mapDataURL, setMapDataURL] = useState(undefined)
  const [highlightedEventIndex, setHighlightedEventIndex] = useState(undefined)

  return (
    <div>
      <EventsMap
        highlightedEventIndex={highlightedEventIndex}
        onEarthquakeHighlight={(index) => setHighlightedEventIndex(index)}
        onRequestViewEvent={(event, mapSnapshot) => {
          setViewingEvent(true)
          setMapDataURL(mapSnapshot)
          setEvent(event)
        }}
      />
      <div className="events-panel">
        <Dropdown
          id="timeperiod-dropdown"
          items={items}
          itemToString={(item) => (item ? item.text : '')}
          label={items[0].text}
          size="sm"
        />
        <div className="events-panel__information">
          <div>
            <h4>8</h4>
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
          />
        </div>
      </div>
      <div className="bx--row events-page-heading__container marb-3">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>
      {isViewingEvent &&
        (() => {
          const date = new Date(event.date)
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
            <RightInformationPanel
              title="Event details"
              onRequestClose={() => setViewingEvent(false)}
            >
              <span className="event-details__alert-issued-timing">
                <CheckmarkFilled16 />
                Alert issued 6s after detection
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
                <Field
                  title="Date"
                  value={`${da} ${mo}, ${ye}`}
                  hasMargin={false}
                />
                <Field title="Time" value={time} hasMargin={false} />
                <Field
                  title="Location"
                  value={event.locationText}
                  hasMargin={false}
                />
                <Field
                  title="Coordinates"
                  value={`${event.pos[1].toFixed(2)}°N, ${event.pos[0].toFixed(
                    2
                  )}°E`}
                  hasMargin={false}
                />
              </div>
              <img
                width={400}
                className="event-details__map"
                src={mapDataURL}
                alt=""
              />
            </RightInformationPanel>
          )
        })()}
    </div>
  )
}

export default Events
