import React, { useState, useEffect, useContext } from 'react'
import { Switch, Route } from 'react-router-dom'

import AppContext from '../../context/app'
import Shell from '../../components/Shell'
import AccountSettings from '../AccountSettings'
import Events from '../Events'
import Access from '../Access'
import AuthClient from '../../rest/auth'
import Header from '../../components/Header'

const Dashboard = ({ location, history }) => {
  const { currentUser, setCurrentUser } = useContext(AppContext)
  const [isSideNavExpanded, sideNavToggle] = useState(false)

  useEffect(() => {
    if (location.pathname === '/') {
      history.push('/events')
    }

    /**
     * Calls GET /user to find logged in user. If successful,
     * sets context to new user
     */
    const getUser = async () => {
      try {
        const user = await AuthClient.getCurrentUser()

        setCurrentUser({
          isAuth: true,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        })
      } catch (e) {
        if (location.pathname !== '/events') {
          history.push('/events')
        }
      }
    }
    // Only run getUser if user is not auth'd in context,
    // the location is something other than '/', and
    // there is an attemptSilentLogin flag in localStorage
    if (
      !currentUser.isAuth &&
      location.pathname !== '/' &&
      localStorage.getItem('attemptSilentLogin') === 'true'
    )
      getUser()
  }, [currentUser, setCurrentUser, history, location.pathname])

  if (currentUser.isAuth) {
    return (
      <>
        <Route
          path="/"
          render={(props) => (
            <Shell
              {...props}
              isSideNavExpanded={isSideNavExpanded}
              sideNavToggle={sideNavToggle}
            />
          )}
        />

        <main
          className={`dashboard__container bx--grid bx--grid--full-width ${
            isSideNavExpanded ? 'dashboard__container--sideNavExpanded' : ''
          }`}
          data-logged-in={true}
        >
          <Switch>
            <Route exact path="/events" component={Events} />
            <Route path="/settings" component={AccountSettings} />
            <Route path="/access" component={Access} />
          </Switch>
        </main>
      </>
    )
  }

  return (
    <>
      <Header history={history} />
      <main
        className={`dashboard__container bx--grid bx--grid--full-width ${
          isSideNavExpanded ? 'dashboard__container--sideNavExpanded' : ''
        }`}
        data-logged-in={false}
      >
        <Switch>
          <Route exact path="/events" component={Events} />
        </Switch>
      </main>
    </>
  )
}

export default Dashboard
