import React from 'react';
import './App.scss';
import Dashboard from './content/Dashboard';
import Login from './content/Login';
import AppContext, { useAppContext } from './context/app';

function App() {
  return <AppContext.Provider value={useAppContext()}>
    <Dashboard />
    <Login />
  </AppContext.Provider>
}

export default App;
