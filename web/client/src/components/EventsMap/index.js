import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'

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
      </>
    )
  }
}
