import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Shell from '../../components/Shell';
import Events from '../Events';

function Dashboard() {
  const [isSideNavExpanded, sideNavToggle] = useState(false);

  return (
    <>
      <Shell
        isSideNavExpanded={isSideNavExpanded}
        sideNavToggle={sideNavToggle}
      />
      <main
        className={`dashboard__container ${
          isSideNavExpanded ? 'dashboard__container--sideNavExpanded' : ''
        }`}
      >
        <Switch>
          <Route path="/events" component={Events} />
        </Switch>
      </main>
    </>
  );
}

export default Dashboard;
