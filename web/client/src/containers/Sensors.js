import React, { Component } from 'react';
import Sensors from '../content/Dashboard/sensors';

export default class SensorsContainer extends Component {
  state = {
    maxAcc: 0,
  };

  setMaxAcc = (newMax) => {
    this.setState({ maxAcc: newMax });
  };

  render() {
    return (
      <Sensors maxAcc={this.state.maxAcc} setMaxAcc={this.setMaxAcc}></Sensors>
    );
  }
}
