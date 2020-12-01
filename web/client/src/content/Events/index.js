import React from 'react';
import EventsMap from '../../components/EventsMap';

const index = () => {
  return (
    <>
      <div className="bx--row events-page-heading__container">
        <div className="bx--col-16">
          <h1 className="dashboard-page__heading">Events</h1>
        </div>
      </div>

      <div className="bx--row">
        <div className="bx--col-xlg-12">
          <EventsMap />
        </div>
        <div className="bx--col-xlg-4"></div>
      </div>
    </>
  );
};

index.propTypes = {};

export default index;
