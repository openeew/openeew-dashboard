import { gql } from '@apollo/client'

export const SEND_EARTHQUAKE_TO_SENSOR = gql`
  mutation SendEarthquakeToSensor($sensorId: String!) {
    sendEarthquakeToSensor(sensorId: $sensorId) {
      success
    }
  }
`

export const STOP_EARTHQUAKE_TEST = gql`
  mutation stopEarthquakeTest($sensorId: String!) {
    stopEarthquakeTest(sensorId: $sensorId) {
      success
    }
  }
`

export const SEND_RESTART_SENSOR = gql`
  mutation sendRestartSensor($sensorId: String!) {
    sendRestartSensor(sensorId: $sensorId) {
      success
    }
  }
`

export const SEND_UPDATE_REQUEST = gql`
  mutation sendSensorUpdateRequest($sensorId: String!) {
    sendRestartSensor(sensorId: $sensorId) {
      success
    }
  }
`

export const SEND_SENSOR_REMOVE = gql`
  mutation sendSensorRemove($sensorId: String!) {
    sendSensorRemove(sensorId: $sensorId) {
      id
    }
  }
`

export const SEND_10_DATA = gql`
  mutation send10Data($sensorId: String!) {
    send10Data(sensorId: $sensorId) {
      success
    }
  }
`
