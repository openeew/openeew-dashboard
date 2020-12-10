import React from 'react'
import EventsMap from '../../components/EventsMap'
import EarthquakeList from '../../components/EarthquakeList'
import Tile from '../../components/Tile'

const Events = () => {
  return (
    <>
      <EventsMap />
      <div className="bx--row events-page-heading__container marb-3">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>
    </>
  )
}

export default Events
