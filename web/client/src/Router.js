import React from 'react'
import { Switch, Route, Router } from 'react-router-dom'
// import { Router } from 'react-router'
import Dashboard from './content/Dashboard'
import Login from './content/Login'
import Onboard from './content/Onboard'

import history from './history'

const _Router = () => {
  return (
    <Router history={history}>
      <div className="app-content">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/onboard" component={Onboard} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  )
}

export default _Router
