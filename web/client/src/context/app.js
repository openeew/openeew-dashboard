import { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default createContext({})

export const earthquakes = [
  {
    pos: [-104.3533, 20.65],
    magnitude: 1,
    locationText: '3km South of Blah Blah town',
    country: 'Mexico',
    date: new Date().getTime(),
    alertDelay: 1,
  },
  {
    pos: [-99.3533, 20.65],
    magnitude: 2,
    locationText: '15km South of Yadayada town',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 7 * 1000,
    alertDelay: 5,
  },
  {
    pos: [-102.3533, 25.65],
    magnitude: 3,
    locationText: '3km South of Lorem Ipsum',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 30 * 1000,
    alertDelay: 3,
  },
  {
    pos: [-96.01, 16.01],
    magnitude: 4,
    locationText: '3km East of Mexico City',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 90 * 1000,
    alertDelay: 4,
  },
  {
    pos: [-108.01, 28.01],
    magnitude: 5,
    locationText: '3km East of Some Random Town',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 365 * 1000,
    alertDelay: 5,
  },
]

export let takeEventsMapSnapshot = () => undefined
export let setTakeEventsMapSnapshot = (newFunction) =>
  (takeEventsMapSnapshot = newFunction)

export const useAppContext = () => {
  const { t } = useTranslation()
  const [currentUser, setCurrentUser] = useState({
    firstName: 'Aaron',
    lastName: 'Williams',
    email: 'aaron.williams@gmail.com',
    userID: 'aaron32319',
    password: 'wouldntyouliketoknowweatherboy',
    confirmPassword: 'wouldntyouliketoknowweatherboy',
  })

  return {
    currentUser,
    setCurrentUser,
    t,
  }
}
