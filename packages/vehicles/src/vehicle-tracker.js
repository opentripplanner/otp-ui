import React from "react";

class VehicleTracker extends React.Component {
  state = {
    buttonText: null
  };

  handleClick() {
    let txt = null;
    let veh = null;

    if (this.isTracking()) {
      txt = this.getButtonText(false);
      veh = null;
    } else {
      txt = this.getButtonText(true);
      veh = this.props.vehicle;
    }

    this.setState({ buttonText: txt });
    this.props.controller.setState({ trackedVehicle: veh });
  }

  isTracking() {
    const retVal = this.props.controller.isTrackingVehicle(this.props.vehicle);
    return retVal;
  }

  getButtonText(isTracked) {
    let buttonText = null;
    if (isTracked) buttonText = "Stop Tracking";
    else buttonText = "Track Vehicle";
    return buttonText;
  }

  render() {
    const buttonText = this.getButtonText(this.isTracking());
    return <button onClick={e => this.handleClick(e)}>{buttonText}</button>;
  }
}

export default VehicleTracker;
