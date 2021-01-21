import React from 'react'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import Dashboard from './content/Dashboard'
import Login from './content/Login'

const Router = () => {
  return (
    <BrowserRouter>
      <div className="app-content">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/events" component={Dashboard} />
          <Route exact path="/access" component={Dashboard} />
          <Route exact path="/settings" component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default Router
