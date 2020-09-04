import React from 'react';
import Tile from '../../components/Tile';
import AccelerationsChart from '../../components/AccelerationsChart';
import { Button } from 'carbon-components-react';
import API from '../../rest/api';
import { Query } from 'react-apollo';
import { MAX_ACC } from '../../graphql/queries';

const POLL_INTERVAL = 1000;

function Sensors() {
  return (
    <div className="bx--grid bx--grid--full-width dashboard-content sensors-page">
      {/* Tiles */}
      <div className="bx--row sensors-page__r1">
        <div className="bx--col-lg-4 bx--col-md-4 sensors-page__tile">
          <Tile title="Status" main={'1'} small={'Online'}></Tile>
        </div>

        <div className="bx--col-lg-4 bx--col-md-4 sensors-page__tile">
          <Query query={MAX_ACC} pollInterval={POLL_INTERVAL}>
            {({ loading, error, data }) => {
              if (loading) return <div>Fetching</div>;
              if (error || !data) return <div>Error</div>;

              return (
                <Tile
                  title="Peak Acceleration"
                  main={data.maxAcc}
                  small={'Gals (cm/s)' + String.fromCharCode(178)}
                ></Tile>
              );
            }}
          </Query>
        </div>
      </div>

      {/* Chart */}
      <div className="bx--row sensors-page__r2">
        <div className="bx--col-lg-16">
          <AccelerationsChart />
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
