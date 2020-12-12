import React, { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default createContext({})

export const earthquakes = [
  {
    pos: [-104.3533, 20.65],
    magnitude: 1,
    locationText: '3km South of Blah Blah town',
    country: 'Mexico',
    date: new Date().getTime(),
  },
  {
    pos: [-99.3533, 20.65],
    magnitude: 2,
    locationText: '15km South of Yadayada town',
    country: 'Mexico',
    date: new Date().getTime(),
  },
  {
    pos: [-102.3533, 25.65],
    magnitude: 3,
    locationText: '3km South of Lorem Ipsum',
    country: 'Mexico',
    date: new Date().getTime(),
  },
  {
    pos: [-96.01, 16.01],
    magnitude: 4,
    locationText: '3km East of Mexico City',
    country: 'Mexico',
    date: new Date().getTime(),
  },
]

export let takeEventsMapSnapshot = () => undefined
export let setTakeEventsMapSnapshot = (newFunction) =>
  (takeEventsMapSnapshot = newFunction)

export const useAppContext = () => {
  const { t } = useTranslation()
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  return {
    currentUser,
    setCurrentUser,
    t,
  }
}
