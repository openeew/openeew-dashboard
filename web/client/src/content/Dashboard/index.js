import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Shell from '../../components/Shell';
import AccountSettings from '../AccountSettings';
import Events from '../Events';

const Dashboard = ({ location, history }) => {
  const [isSideNavExpanded, sideNavToggle] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      history.push('/events');
    }
  }, [history, location.pathname]);

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
      >
        <Switch>
          <Route exact path="/events" component={Events} />
          <Route path="/settings" component={AccountSettings}></Route>
        </Switch>
      </main>
    </>
  );
};

export default Dashboard;
