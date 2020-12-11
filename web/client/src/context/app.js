import { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default createContext({})

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
