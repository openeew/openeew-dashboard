import { createContext, useState } from 'react';

export default createContext({});

export const useAppContext = () => {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  return {
    currentUser, setCurrentUser
  }
}
