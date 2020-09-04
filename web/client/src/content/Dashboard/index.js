import React from 'react';
import Header from '../../components/Header';
import Sensors from './sensors';
import SideMenu from '../../components/SideMenu';

function Dashboard() {
  return (
    <div>
      <Header />
      <SideMenu />
      <Sensors />
    </div>
  );
}

export default Dashboard;
