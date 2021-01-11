import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Dashboard from './content/Dashboard'
import Login from './content/Login'

const Router = () => {
  return (
    <HashRouter>
      <div className="app-content">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </HashRouter>
  )
}

export default Router
