import React from "react";
import PropTypes from "prop-types";

import VehicleLayer from "./vehicle-layer";
import { getVehicles, checkRefreshInteval } from "./vehicle-utils";

function VehicleAction(props) {
  const refreshDelay = checkRefreshInteval(props.refreshDelay);

  const [vehicleData, setVehicleData] = React.useState(null);

  // the code below w/in useEffect is a simplified version of what's in vehcile-action.js / VechicleAction component
  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    let interval = null;
    if (vehicleData == null) {
      getVehicles(setVehicleData);
      interval = setInterval(() => {
        getVehicles(setVehicleData);
      }, refreshDelay);
    }

    return () => {
      // before vehicle view component unmounts, clear the interval...
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);

  const retVal = (
    <VehicleLayer
      vehicles={vehicleData}
      {...props}
    />
  );
  return retVal;
}

VehicleAction.propTypes = {
  refreshDelay: PropTypes.number
};

export default VehicleAction;