import { useEffect, useRef, memo } from 'react'
import { ZoomIn16, ZoomOut16 } from '@carbon/icons-react'
import mapboxgl from 'mapbox-gl'
import { keyboardOnlySubmit } from '../../utils'

const DEFAULT_LATITUDE = 28
const DEFAULT_LONGITUDE = -90
const DEFAULT_ZOOM = 2.3

const transformToGeoJSON = (sensors) => {
  console.log(sensors)
  const geoJSONsensors = sensors
    .filter((s) => s.latitude && s.longitude)
    .map((sensor) => {
      return {
        type: 'Feature',
        properties: {
          id: sensor.id,
          highlighted: false,
          pos: [parseFloat(sensor.longitude), parseFloat(sensor.latitude)],
          isUserOwner: sensor.isUserOwner ? 1 : 0,
          statusColor: sensor.statusColor,
        },
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(sensor.longitude),
            parseFloat(sensor.latitude),
          ],
        },
      }
    })

  return geoJSONsensors
}

const SensorsMap = ({ sensors, setDisplayedSensor, setShouldShowSideMenu }) => {
  let mapWrapper = useRef()
  let map = useRef()

  useEffect(() => {
    if (sensors.length > 0) {
      map.current = new mapboxgl.Map({
        container: mapWrapper,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [DEFAULT_LONGITUDE, DEFAULT_LATITUDE],
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
        preserveDrawingBuffer: true,
      }).addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        })
      )

      map.current.once('load', () => {
        map.current.resize()

        map.current.addSource('sensors', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: transformToGeoJSON(sensors),
          },
        })

        map.current.addLayer({
          id: 'sensors',
          type: 'circle',
          source: 'sensors',
          paint: {
            'circle-blur': 0,
            'circle-opacity': {
              base: 1,
              stops: [
                [DEFAULT_ZOOM, 1],
                [12, 0.7],
              ],
            },
            'circle-radius': {
              base: 10,
              stops: [
                [DEFAULT_ZOOM, 5],
                [8, 5],
                [12, 50],
              ],
            },
            'circle-color': [
              'match',
              ['get', 'statusColor'],
              'green',
              '#3DC04E',
              'yellow',
              '#c9bc0d',
              '#c9bc0d',
            ],
          },
        })

        map.current.addLayer({
          id: 'ownedSensors',
          type: 'circle',
          source: 'sensors',
          paint: {
            'circle-radius': {
              base: 7,
              stops: [
                [DEFAULT_ZOOM, 5],
                [8, 5],
                [12, 55],
              ],
            },
            'circle-opacity': 0,
            'circle-stroke-width': [
              'match',
              ['get', 'isUserOwner'],
              1,
              2,
              0,
              0,
              0,
            ],
            'circle-stroke-color': '#e5dfdf',
          },
        })

        map.current.on('mouseenter', 'sensors', function (e) {
          if (e.features[0].properties.isUserOwner) {
            map.current.getCanvas().style.cursor = 'pointer'
          }

          map.current.setFeatureState(
            {
              source: 'sensors',
              id: e.features[0].properties.id,
            },
            {
              hover: true,
            }
          )
        })

        map.current.on('mouseleave', 'sensors', function () {
          map.current.getCanvas().style.cursor = ''
        })

        map.current.on('click', 'sensors', function (e) {
          const clickedSensor = sensors.filter(
            (sensor) => sensor.id === e.features[0].properties.id
          )[0]

          if (clickedSensor.isUserOwner) {
            setDisplayedSensor(
              sensors.filter(
                (sensor) => sensor.id === e.features[0].properties.id
              )[0]
            )
            setShouldShowSideMenu(true)
          }
        })
      })
    }
  }, [sensors])

  const zoomIn = () => {
    map.current.flyTo({ zoom: map.current.getZoom() + 1 })
  }
  const zoomOut = () => {
    map.current.flyTo({ zoom: map.current.getZoom() - 1 })
  }

  return (
    <>
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
    </>
  )
}

export default memo(SensorsMap)
