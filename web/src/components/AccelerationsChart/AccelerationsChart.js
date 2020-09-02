import React from 'react';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line, curveBasis } from 'd3-shape';
import { max } from 'd3-array';
import { Query } from 'react-apollo';
import { ACC_STREAM } from '../../graphql/queries';

const renderTimeScale = () => {
  const scale = scaleTime()
    .domain([new Date('1972-02-24 00:00:00'), new Date('1972-03-06 00:00:00')])
    .range([0, 500])(new Date('1972-03-04 00:00:00'));

  console.log(scale);
};

const renderPath = (data, axis) => {
  const rawAcc = data.map((d) => [...d[axis]]);
  const mergedAcc = [].concat.apply([], rawAcc);

  let x = scaleLinear().domain([1, 32]).range([0, 2]);
  let y = scaleLinear().domain([-7.5, 7.5]).range([30, 0]);

  if (!Array.isArray(data)) {
    data = [data];
  }

  const dataLine = line()
    .curve(curveBasis)
    .x((d, i) => {
      return x(i + 1);
    })
    .y((d) => y(d));

  let renderedline = dataLine(mergedAcc);

  return renderedline;
};

const AccelerationsChart = ({}) => {
  return (
    <Query query={ACC_STREAM} pollInterval={1000}>
      {({ loading, error, data, startPolling, stopPolling }) => {
        if (loading) return <div>Fetching</div>;
        if (error) {
          console.log(error);
        }
        if (error || !data) return <div>Error</div>;

        let dataToRender = data.accStream;

        // console.log('dataToRender', dataToRender);
        console.log(performance.memory);
        // renderTimeScale();

        return (
          <svg viewBox="0 0 100 30" style={{ backgroundColor: '#393939' }}>
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
