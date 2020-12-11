import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import { Dropdown } from 'carbon-components-react'
import EarthquakeList from '../EarthquakeList'

const items = [
  { id: 'timeframe-past-7', text: 'Past 7 Days' },
  { id: 'timeframe-past-30', text: 'Past 30 Days' },
  { id: 'timeframe-past-90', text: 'Past 90 Days' },
  { id: 'timeframe-past-year', text: 'Past Year' },
]

console.log(process.env.REACT_APP_MAPBOX_ACCESS_TOKEN)

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

export default class EventsMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lng: -99.3533,
      lat: 20.8857,
      zoom: 4.65,
    }
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      attributionControl: false,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )

    map.on('move', () => {
      console.log(
        map.getCenter().lng.toFixed(4),
        map.getCenter().lat.toFixed(4),
        map.getZoom().toFixed(2)
      )

      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      })
    })

    map.resize()

    map.on('load', () => {
      map.resize()
    })
  }

  render() {
    return (
      <>
        <div ref={(el) => (this.mapWrapper = el)} className="map-wrapper" />
        <div className="events-panel">
          <Dropdown
            id="timeperiod-dropdown"
            items={items}
            itemToString={(item) => (item ? item.text : '')}
            label={items[0].text}
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
      </>
    )
  }
}
