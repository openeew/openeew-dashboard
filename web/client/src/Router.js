import React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Dashboard from './content/Dashboard'
import Login from './content/Login'

const Router = () => {
  return (
    <BrowserRouter>
      <div className="app-content">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default Router
