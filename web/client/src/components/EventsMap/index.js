import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { Dropdown, MultiSelect } from 'carbon-components-react';

const items = [
  { id: 'timeframe-past-7', text: 'Past 7 Days' },
  { id: 'timeframe-past-30', text: 'Past 30 Days' },
  { id: 'timeframe-past-90', text: 'Past 90 Days' },
  { id: 'timeframe-past-year', text: 'Past Year' },
];

mapboxgl.accessToken =
  'pk.eyJ1IjoicmRrZWxsZXk4IiwiYSI6ImNraTNuY3BvaDF5ZHQyeG5tOXE4cGNtczkifQ.ULS1cD11rugFckpcA_QUJg';

export default class EventsMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -99.3533,
      lat: 20.8857,
      zoom: 4.65,
    };
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapWrapper,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
      attributionControl: false,
    }).addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    );

    map.on('move', () => {
      console.log(
        map.getCenter().lng.toFixed(4),
        map.getCenter().lat.toFixed(4),
        map.getZoom().toFixed(2)
      );

      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    map.resize();

    map.on('load', function () {
      map.resize();
    });
  }

  render() {
    return (
      <>
        <div className="bx--row events-map-filter__container">
          <div className="bx--col-lg-4 events-map-filter">
            <Dropdown
              ariaLabel="Timeframe"
              id="events-map-dropdown"
              items={items}
              label={'Past 7 Days'}
              initialSelectedItem={items[0]}
              itemToString={(item) => (item ? item.text : '')}
            />
          </div>
          <div className="bx--col-lg-4 events-map-filter">
            <MultiSelect
              id={'events-multi'}
              useTitleInItem={false}
              label="Magnitude"
              invalid={false}
              invalidText="Invalid Selection"
              onChange={() => {}}
              items={[
                { id: 'mag-all', text: 'All' },
                { id: 'mag-sm', text: '0.0 - 2.9' },
                { id: 'mag-md', text: '3.0 - 5.9' },
                { id: 'mag-lg', text: '6.0 +' },
              ]}
              itemToString={(item) => (item ? item.text : '')}
              initialSelectedItems={[{ id: 'mag-all', text: 'All' }]}
            />
          </div>
        </div>
        <div className="bx--row events-map__row">
          <div className="bx--col-lg-16 events-map__container">
            <div ref={(el) => (this.mapWrapper = el)} className="map-wrapper" />
          </div>
        </div>
      </>
    );
  }
}
