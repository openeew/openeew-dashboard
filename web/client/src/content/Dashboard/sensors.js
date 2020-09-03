import React from 'react';
import Tile from '../../components/Tile';
import AccelerationsChart from '../../components/AccelerationsChart';
import { Button } from 'carbon-components-react';
import API from '../../rest/api';

function Sensors({ maxAcc, setMaxAcc }) {
  return (
    <div className="bx--grid bx--grid--full-width dashboard-content sensors-page">
      {/* Tiles */}
      <div className="bx--row sensors-page__r1">
        <div className="bx--col-lg-4 bx--col-md-4 sensors-page__tile">
          <Tile title="Status" main={'1'} small={'Online'}></Tile>
        </div>
        <div className="bx--col-lg-4 bx--col-md-4 sensors-page__tile">
          <Tile
            title="Peak Acceleration"
            main={maxAcc.toFixed(2)}
            small={'Gals (cm/s)' + String.fromCharCode(178)}
          ></Tile>
        </div>
      </div>

      {/* Chart */}
      <div className="bx--row sensors-page__r2">
        <div className="bx--col-lg-16">
          <AccelerationsChart maxAcc={maxAcc} setMaxAcc={setMaxAcc} />
        </div>
      </div>

      <div className="bx--row sensors-page__r3">
        <div className="bx--col-lg-16">
          <Button kind="primary" onClick={API.resetStream}>
            Reset Simulation
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bx--row sensors-page__r3"></div>
    </div>
  );
}

export default Sensors;
