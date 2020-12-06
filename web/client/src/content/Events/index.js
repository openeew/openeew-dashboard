import React from 'react'
import EventsMap from '../../components/EventsMap'
import EarthquakeList from '../../components/EarthquakeList'
import Tile from '../../components/Tile'

const Events = () => {
  return (
    <>
      <div className="bx--row events-page-heading__container marb-3">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>

      <div className="bx--row marb-3">
        <div className="bx--col-xlg-12">
          {/* Map */}
          <div className="marb-2">
            <EventsMap />
          </div>

          {/* Tiles under map*/}
          <div className="bx--row">
            <div className="bx--col no-padding-left">
              <Tile title="Earthquakes Detected" main="8" small="Earthquakes" />
            </div>
            <div className="bx--col no-padding-right">
              <Tile
                title="Subscribers Alerted"
                main="2400"
                small="Subscribers"
              />
            </div>
          </div>
        </div>

        {/* Earthquake List */}
        <div className="bx--col-xlg-4 events-page-earthquake-list__container">
          <EarthquakeList />
        </div>
      </div>
    </>
  )
}

export default Events
