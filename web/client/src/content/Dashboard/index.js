import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Shell from '../../components/Shell';
import Events from '../Events';

function Dashboard(props) {
  const [isSideNavExpanded, sideNavToggle] = useState(false);

  useEffect(() => {
    if (props.location.pathname === '/') {
      props.history.push('/events');
    }
  }, [props.history, props.location.pathname]);

  return (
    <>
      <Shell
        isSideNavExpanded={isSideNavExpanded}
        sideNavToggle={sideNavToggle}
      />
      <main
        className={`dashboard__container bx--grid bx--grid--full-width ${
          isSideNavExpanded ? 'dashboard__container--sideNavExpanded' : ''
        }`}
      >
        <Switch>
          <Route exact path="/events" component={Events} />
        </Switch>
      </main>
    </>
  );
}

export default Dashboard;
