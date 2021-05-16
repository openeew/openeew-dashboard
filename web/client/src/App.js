import React from 'react'
import './App.scss'
import Router from './Router'
import AppContext, { useAppContext } from './context/app'

import Toasts from './components/Toasts'

const App = () => {
  return (
    <AppContext.Provider value={useAppContext()}>
      <Toasts />
      <Router />
    </AppContext.Provider>
  )
}

export default App
