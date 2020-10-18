import { createContext, useState } from 'react';

export default createContext({});

export const useAppContext = () => {
  const [currentUser, setCurrentUser] = useState({})

  return {
    currentUser, setCurrentUser
  }
}
