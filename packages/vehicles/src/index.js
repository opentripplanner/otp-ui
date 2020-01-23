import React from "react";
import PropTypes from "prop-types";

import VehicleLayer from "./VehicleLayer";
import { checkRefreshInteval, fetchVehicles } from "./utils";

/**
 * TODO: describe
 * TODO: talk about gtfsdb and opensource
 */
function Vehicles(props) {
  const refreshDelay = checkRefreshInteval(props.refreshDelay);

  const [vehicleData, setVehicleData] = React.useState(null);
  const [trackedVehicle, setTrackedVehicle] = React.useState(null);

  // allows us to get a current handle on the trackedVehicle state
  const trackedVehicleRef = React.useRef(trackedVehicle);
  React.useEffect(() => {
    trackedVehicleRef.current = trackedVehicle;
  }, [trackedVehicle]);

  /** callback function where the setTrackedVehicle is stored */
  function setTrackedData(vehicle) {
    // todo check/grab geometry ... maybe delay setTrackedVehicle until we have said geom
    /*
    // step 1: vehicle geometry
    if(vehicle && vehicle.patternId) {
      // setVehicleGeometry(vehicle);
      const [trackedVehicleGeometry, setTrackedVehicleGeometry] = React.useState(null);
      if(cache[patternId] === null) {
          getVehicleGeometry(setTrackedVehicleGeometry, patternId);
      } else {
          setTrackedVehicleGeometry(cache[patternId]);
      }
    */
    // TODO: should setTrackedVehicle be both a vehicle and the route geometry?
    // setTrackedData({v: vehicle, g: geometry})?  ... thus only one state / one useEffect/Ref
    // step 2: set tracked vehicle
    setTrackedVehicle(vehicle);
  }

  function getTrackedVehicle() {
    let retVal = null;
    if (trackedVehicleRef && trackedVehicleRef.current)
      retVal = trackedVehicleRef.current;
    return retVal;
  }

  function getTrackedVehicleId() {
    let retVal = null;
    const t = getTrackedVehicle();
    if (t && t.vehicleId) retVal = t.vehicleId;
    return retVal;
  }

  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    let interval = null;
    if (vehicleData == null) {
      fetchVehicles(setVehicleData, setTrackedVehicle, props.tracked);
      interval = setInterval(() => {
        fetchVehicles(setVehicleData, setTrackedData, getTrackedVehicleId());
      }, refreshDelay);
    }

    return () => {
      // before vehicle view component un-mounts, clear the interval...
      if (interval) {
        clearInterval(interval);
        setTrackedVehicle(null);
        interval = null;
      }
    };
  }, []);

  const retVal = (
    <VehicleLayer
      vehicles={vehicleData}
      trackedVehicle={trackedVehicle}
      setTracked={setTrackedVehicle}
    />
  );
  return retVal;
}

Vehicles.defaultProps = {
  refreshDelay: 3000,
  tracked: "9605379"
};

Vehicles.propTypes = {
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string
};

export default Vehicles;
