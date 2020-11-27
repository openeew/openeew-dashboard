import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Dashboard from './content/Dashboard';
import AccountSettings from './content/AccountSettings';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Login from './content/Login';

function Router() {
  return (
    <BrowserRouter>
      <Login />
      <Header />
      <SideMenu />
      <div className="app-content">
        <Switch>
          <Route path="/settings">
            <AccountSettings />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Router;
