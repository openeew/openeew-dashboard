import React from 'react'
import EventsMap from '../../components/EventsMap'
import { Dropdown } from 'carbon-components-react'
import EarthquakeList from '../../components/EarthquakeList'

const items = [
  { id: 'timeframe-past-7', text: 'Past 7 Days' },
  { id: 'timeframe-past-30', text: 'Past 30 Days' },
  { id: 'timeframe-past-90', text: 'Past 90 Days' },
  { id: 'timeframe-past-year', text: 'Past Year' },
]

const Events = () => {
  return (
    <>
      <EventsMap />
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
          <EarthquakeList />
        </div>
      </div>
      <div className="bx--row events-page-heading__container marb-3">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>
    </>
  )
}

export default Events
