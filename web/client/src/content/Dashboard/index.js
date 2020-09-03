import React from 'react';
import Header from '../../components/Header';
import SensorsContainer from '../../containers/Sensors';
import SideMenu from '../../components/SideMenu';

function Dashboard() {
  return (
    <div>
      <Header />
      <SideMenu />
      <SensorsContainer />
    </div>
  );
}

export default Dashboard;
