import { gql } from '@apollo/client'

export const GET_SENSORS = gql`
  query GetSensors {
    sensors {
      id
      activated
      lastCheckin
      firmwareVer
      latitude
      longitude
      uuid
      status
      isUserOwner
    }
  }
`
