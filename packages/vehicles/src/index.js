import React from "react";
import PropTypes from "prop-types";

import VehicleLayer from "./VehicleLayer";
// import { checkRefreshInteval, fetchVehicles } from "./utils";
import * as utils from "./utils";

/**
 * TODO: describe
 * TODO: talk about gtfsdb and opensource
 */
function Vehicles(props) {
  const refreshDelay = utils.checkRefreshInteval(props.refreshDelay);

  const [vehicleData, setVehicleData] = React.useState(null);

  const [trackedVehicle, setTrackedVehicle] = React.useState(null);
  const trackedVehicleRef = React.useRef(trackedVehicle);
  React.useEffect(() => {
    trackedVehicleRef.current = trackedVehicle;
  }, [trackedVehicle]); // allows us to get a current handle on the trackedVehicle state

  const [trackedGeometry, setTrackedGeometry] = React.useState(null);
  const trackedGeometryRef = React.useRef(trackedGeometry);
  React.useEffect(() => {
    trackedGeometryRef.current = trackedGeometry;
  }, [trackedGeometry]);

  /** callback function where the tracked geometry stored */
  function setTrackedGeomData(patternId, data) {
    setTrackedGeometry({ id: patternId, data });
  }

  function isPatternCached(patternId) {
    let retVal = false;
    if (trackedGeometryRef && trackedGeometryRef.current) {
      if (patternId === trackedGeometryRef.current.id) retVal = true;
    }
    return retVal;
  }

  /** callback function where the setVehicleData & setTrackedVehicle is stored */
  function setData(vehicleList, trackedId) {
    // step 1: set vehicle data
    setVehicleData(vehicleList);

    // step 2: tracked vehicle
    const vehicle = utils.findVehicle(vehicleList, trackedId);
    if (vehicle) {
      setTrackedVehicle(vehicle);

      // step 3: tracked vehicle geometry
      if (vehicle.shapeId) {
        try {
          const patternId = `${vehicle.agencyId}:${vehicle.shapeId}`;
          if (!isPatternCached(patternId)) {
            console.log(">>>>>>>>>>>>>>>>>>");
            console.log(patternId);
            utils.fetchVehiclePattern(setTrackedGeomData, patternId);
            console.log(trackedGeometryRef);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
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
      utils.fetchVehicles(setData, props.tracked);
      interval = setInterval(() => {
        utils.fetchVehicles(setData, getTrackedVehicleId());
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
