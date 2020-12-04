import { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default createContext({});

export const useAppContext = () => {
  const { t } = useTranslation()
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  return {
    currentUser, setCurrentUser, t
  }
}
