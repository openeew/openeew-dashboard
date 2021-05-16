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
