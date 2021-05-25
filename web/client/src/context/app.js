import { createContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import GithubAPI from '../rest/github'

export default createContext({})

export const earthquakes = [
  {
    pos: [-104.3533, 20.65],
    magnitude: 1,
    locationText: 'Lorem ipsum dolor',
    country: 'Mexico',
    date: new Date().getTime(),
    alertDelay: 1,
  },
  {
    pos: [-99.3533, 20.65],
    magnitude: 2,
    locationText: 'Lorem ipsum dolor',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 7 * 1000,
    alertDelay: 5,
  },
  {
    pos: [-102.3533, 25.65],
    magnitude: 3,
    locationText: 'Lorem ipsum dolor',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 30 * 1000,
    alertDelay: 3,
  },
  {
    pos: [-96.01, 16.01],
    magnitude: 4,
    locationText: 'Lorem ipsum dolor',
    country: 'Mexico',
    date: new Date().getTime() - 86400 * 90 * 1000,
    alertDelay: 4,
  },
  {
    pos: [-108.01, 28.01],
    magnitude: 5,
    locationText: 'Lorem ipsum dolor',
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
    isAuth: false,
    firstName: '',
    lastName: '',
    email: '',
  })
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    setToasts(toasts.concat(toast))
  }

  const removeToast = (removeIndex) => {
    setToasts(toasts.map((t, i) => i !== removeIndex))
  }

  const [currentFirmwareInfo, setCurrentFirmwareInfo] = useState({
    ver: null,
    error: '',
  })

  useEffect(() => {
    const callGithubAPI = async () => {
      let verNum = null

      try {
        verNum = await GithubAPI.getCurrentFirmwareVer()
      } catch (error) {
        setCurrentFirmwareInfo({
          verNum,
          error,
        })
      }

      setCurrentFirmwareInfo({
        verNum,
        error: '',
      })
    }

    callGithubAPI()
  }, [])

  return {
    currentUser,
    setCurrentUser,
    addToast,
    removeToast,
    toasts,
    currentFirmwareInfo,
    t,
  }
}
