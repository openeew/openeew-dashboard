import React, { Component, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Field from '../Field'
import { setTakeEventsMapSnapshot, earthquakes } from '../../context/app'
import { Button } from 'carbon-components-react'
import { filterTime, formatTime, keyboardOnlySubmit } from '../../utils'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN

const magnitudeSizeFactor = 8
const tooltipOffset = 15

const EventsTooltip = ({
  map,
  currentEarthquake,
  onHide,
  onRequestViewEvent,
  takeMapSnapshot,
  tooltipLeft,
}) => {
  const formatDate = (date) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    return `${da} ${mo}, ${ye}`
  }

  let tooltipParentRef = useRef()
  let tooltipContentRef = useRef()
  let [height, setHeight] = useState(undefined)
  let [position, setPosition] = useState(undefined)

  const earthquakeScreenPos = map.project(currentEarthquake.pos)
  // the position the tooltip would take if the position was set to 'bottom'
  const bottomYPos =
    earthquakeScreenPos.y +
    tooltipOffset +
    currentEarthquake.magnitude * magnitudeSizeFactor

  useEffect(() => {
    if (tooltipParentRef.current && tooltipContentRef.current) {
      setHeight(tooltipContentRef.current.offsetHeight)
      let topPlusHeight = bottomYPos + tooltipContentRef.current.offsetHeight
      if (topPlusHeight > window.innerHeight) setPosition('top')
      else setPosition('bottom')
    }
  }, [bottomYPos])

  const tooltipTop =
    position === 'bottom'
      ? bottomYPos
      : earthquakeScreenPos.y -
        tooltipOffset -
        height -
        currentEarthquake.magnitude * magnitudeSizeFactor

  const date = new Date(currentEarthquake.date)
  const formattedDate = formatDate(date)
  const formattedTime = formatTime(date)

  return (
    <div
      className="earthquake-tooltip"
      style={{
        top: isNaN(tooltipTop) ? 0 : tooltipTop,
        left: tooltipLeft,
      }}
      ref={tooltipParentRef}
    >
      <div ref={tooltipContentRef}>
        <img
          src="triangle.svg"
          alt=""
          className="earthquake-tooltip__arrow"
          data-position={position}
        />
        <span className="earthquake-tooltip__header">Event summary</span>
        <h3>{currentEarthquake.magnitude.toFixed(1)}</h3>
        <Field
          title="Location"
          value={currentEarthquake.locationText}
          hasMargin={false}
        />
        <div className="earthquake-tooltip__inline">
          <Field title="Date" hasMargin={false} value={formattedDate} />
          <Field title="Time" hasMargin={false} value={formattedTime} />
        </div>
        <div className="earthquake-tooltip__inline-flex">
          <span
            className="earthquake-tooltip__btn-cancel"
            onClick={onHide}
            onKeyDown={(e) => keyboardOnlySubmit(e, onHide)}
            tabIndex={0}
          >
            Cancel
          </span>
          <Button
            size="small"
            onClick={() => {
              onRequestViewEvent(
                currentEarthquake,
                takeMapSnapshot(currentEarthquake.pos)
              )
              onHide()
            }}
          >
            View details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default class EventsMap extends Component {
  tooltipParentRef
  tooltipContentRef

  constructor(props) {
    super(props)
    this.state = {
      lng: -99.3533,
      lat: 20.8857,
      zoom: 4.65,
      tooltipTop: 0,
      tooltipLeft: 0,
      showTooltip: false,
      currentEarthquake: undefined,
    }
    this.takeMapSnapshot = this.takeMapSnapshot.bind(this)
    setTakeEventsMapSnapshot(this.takeMapSnapshot)
  }

  // move map center to 'pos', set zoom, take snapshot, move back to original pos and zoom
  // and return snapshot image data url
  takeMapSnapshot(pos) {
    const currentPos = { lng: this.state.lng, lat: this.state.lat }
    this.map.setCenter({ lng: pos[0], lat: pos[1] })
    this.map.setZoom(6)
    this.map._render()
    const toReturn = this.map.getCanvas().toDataURL()
    this.map.setCenter(currentPos)
    this.map.setZoom(this.state.zoom)
    return toReturn
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      attributionControl: false,
      preserveDrawingBuffer: true,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    )

    this.map.on('load', () => {
      this.map.resize()

      let earthquakePoints = earthquakes.map((earthquake, index) => {
        return {
          type: 'Feature',
          properties: {
            id: earthquake.pos.toString(),
            magnitude: earthquake.magnitude,
            locationText: earthquake.locationText,
            date: earthquake.date,
            highlighted: false,
            visible: filterTime(earthquake.date, this.props.selectedTimeFilter),
            pos: earthquake.pos,
            country: earthquake.country,
          },
          geometry: {
            type: 'Point',
            coordinates: earthquake.pos,
          },
        }
      })

      this.earthquakeSources = {
        type: 'FeatureCollection',
        features: earthquakePoints,
      }

      this.map.addSource('earthquakes', {
        type: 'geojson',
        data: this.earthquakeSources,
      })

      this.map.on('click', 'earthquakes', (e) => {
        const earthquakeData = e.features[0].properties

        if (!earthquakeData.visible) return

        const earthquake = {
          magnitude: earthquakeData.magnitude,
          locationText: earthquakeData.locationText,
          date: earthquakeData.date,
          pos: JSON.parse(earthquakeData.pos),
          country: earthquakeData.country,
        }
        const earthquakeScreenPos = this.map.project(earthquake.pos)
        this.setState({
          tooltipLeft: earthquakeScreenPos.x,
          showTooltip: true,
          currentEarthquake: earthquake,
        })
      })

      this.map.on('mouseenter', 'earthquakes', (e) => {
        if (!e.features[0].properties.visible) return
        const index = this.earthquakeSources.features
          .map((s) => s.properties.id)
          .indexOf(e.features[0].properties.id)
        this.props.onEarthquakeHighlight(index)
        this.map.getCanvas().style.cursor = 'pointer'
      })
      this.map.on('mouseleave', 'earthquakes', (e) => {
        if (!this.state.showTooltip) this.props.onEarthquakeHighlight(undefined)
        this.map.getCanvas().style.cursor = ''
      })

      this.map.addLayer({
        id: 'earthquakes',
        type: 'circle',
        source: 'earthquakes',
        paint: {
          'circle-radius': ['*', magnitudeSizeFactor, ['get', 'magnitude']],
          'circle-color': [
            'case',
            ['boolean', ['get', 'highlighted'], false],
            '#fff', // on hover
            '#FFD47A', // default
          ],
          'circle-opacity': [
            'case',
            ['boolean', ['get', 'visible'], false],
            1,
            0,
          ],
        },
      })
    })

    this.map.on('move', () => {
      this.setState({
        showTooltip: false,
      })

      this.setState({
        lng: this.map.getCenter().lng.toFixed(4),
        lat: this.map.getCenter().lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2),
      })
    })

    this.map.resize()
  }

  render() {
    if (
      this.map !== undefined &&
      this.map.getSource('earthquakes') !== undefined
    ) {
      let data = this.earthquakeSources
      data.features = data.features.map((feature, index) => {
        feature.properties.highlighted =
          index === this.props.highlightedEventIndex
        feature.properties.visible = filterTime(
          feature.properties.date,
          this.props.selectedTimeFilter
        )
        return feature
      })
      this.map.getSource('earthquakes').setData(data)
    }

    return (
      <>
        <div ref={(el) => (this.mapWrapper = el)} className="map-wrapper" />
        {/* set context for Events.js to use the takeMapSnapshot method*/}
        {this.state.showTooltip && (
          <EventsTooltip
            map={this.map}
            currentEarthquake={this.state.currentEarthquake}
            onHide={() => {
              this.props.onEarthquakeHighlight(undefined)
              this.setState({ showTooltip: false })
            }}
            tooltipTop={this.state.tooltipTop}
            tooltipLeft={this.state.tooltipLeft}
            onRequestViewEvent={this.props.onRequestViewEvent}
            takeMapSnapshot={this.takeMapSnapshot}
          />
        )}
      </>
    )
  }
}
