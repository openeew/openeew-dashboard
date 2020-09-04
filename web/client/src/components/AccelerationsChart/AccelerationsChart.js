import React from 'react';
import { scaleLinear } from 'd3-scale';
import { line, curveBasis } from 'd3-shape';
import { Query } from 'react-apollo';
import { ACC_STREAM } from '../../graphql/queries';

// * SVG Viewbox
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 30;

// * Update interval (API mock data source updates every 1 sec)
const POLL_INTERVAL = 1000;

// * Max, min accelerations
const Y_DOMAIN = [-7.5, 7.5];

/**
 * TODO: renderPath recalculates the entire path on every update from one big array.
 * TODO: Find a way to optimize this.
 */
const renderPath = (data, axis) => {
  /**
   * * Merges all axis data into one big array
   */
  const rawAcc = data.map((d) => [...d[axis]]);
  const mergedAcc = [].concat.apply([], rawAcc);

  /**
   * * Each second of data has 32 readings & there's a maximum 50 seconds
   * * of data sent from the mock API. X values are evenly spaced, based
   * * on array indices, so maximum value should be 32 x 50 === 1600
   */
  const x = scaleLinear()
    .domain([1, 32 * 50])
    .range([0, VIEWBOX_WIDTH]);
  const y = scaleLinear().domain(Y_DOMAIN).range([VIEWBOX_HEIGHT, 0]);

  const lineBuilder = line()
    .curve(curveBasis)
    .x((d, i) => {
      return x(i + 1);
    })
    .y((d) => y(d));

  const renderedPath = lineBuilder(mergedAcc);

  return renderedPath;
};

const AccelerationsChart = () => {
  return (
    <Query query={ACC_STREAM} pollInterval={POLL_INTERVAL}>
      {({ loading, error, data, startPolling, stopPolling }) => {
        if (loading) return <div>Fetching</div>;
        if (error || !data) return <div>Error</div>;

        let dataToRender = data.accStream;

        return (
          <svg
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            style={{ backgroundColor: '#393939' }}
          >
            {/* x-axis */}
            <path
              strokeDasharray="0.5, 0.25"
              d="M 0 15 H 100"
              strokeWidth="0.015"
              stroke="white"
            />
            <path
              stroke="#33b1ff"
              fill="none"
              strokeLinecap="round"
              strokeWidth="0.15"
              d={renderPath(dataToRender, 'x')}
            ></path>
            <path
              stroke="#08bdba"
              fill="none"
              strokeLinecap="round"
              strokeWidth="0.15"
              d={renderPath(dataToRender, 'y')}
            ></path>
            <path
              stroke="#d4bbff"
              fill="none"
              strokeLinecap="round"
              strokeWidth="0.15"
              d={renderPath(dataToRender, 'z')}
            ></path>
          </svg>
        );
      }}
    </Query>
  );
};

export default AccelerationsChart;
