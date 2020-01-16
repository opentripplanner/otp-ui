/* xxeslint-disable no-restricted-syntax */
/* lint rule ignored b/c it's stupid ... for in loop below is best */
import React from "react";
import PropTypes from "prop-types";

import VehicleLayer from "./VehicleLayer";
import { checkRefreshInteval } from "./utils";

function getVehicles(setVehicleData, setTrackedVehicle, trackId, url) {
  const d = Date.now();
  url = url || "https://maps.trimet.org/gtfs/rt/vehicles/routes/all";
  url = url.indexOf("?") ? `${url}?` : `${url}&`;
  url = `${url}__time__=${d}`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        console.log(res.statusText);
        throw Error(res.statusText);
      }
      return res;
    })
    .then(res => {
      const retVal = res.json();
      return retVal;
    })
    .then(vehicleList => {
      if (vehicleList && vehicleList.length > 0) {
        // step 1: set the vehicle list (triggers vehicle points redraw)
        console.log(`updating state with ${vehicleList.length} vehicles`);
        setVehicleData(vehicleList);

        if (trackId) {
          let tracked = null;

          // step 2: find vehicle record via either tripId or vehicleId
          vehicleList.some(v => {
            if (trackId === v.vehicleId || trackId === v.tripId) {
              tracked = v;
              return true;
            }
            return false
          });
          // step 3: add updated tracked vehicle to state (triggers pattern line redraw)
          if (tracked) {
            setTrackedVehicle(tracked);
          } else {
            console.log(`WARN: can't find tripId or vehicleId ${trackId}`);
          }
        }
      } else {
        console.log("get vehicle data is suspect");
      }
    })
    .catch(error => {
      console.log(`VEH fetch() error: ${error}`);
    });
}

function VehicleAction(props) {
  const refreshDelay = checkRefreshInteval(props.refreshDelay);

  const [vehicleData, setVehicleData] = React.useState(null);
  const [trackedVehicle, setTrackedVehicle] = React.useState(null);

  // allows us to get a current handle on the trackedVehicle state
  const trackedVehicleRef = React.useRef(trackedVehicle);
  React.useEffect(() => {
    trackedVehicleRef.current = trackedVehicle;
  }, [trackedVehicle]);

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
      getVehicles(setVehicleData, setTrackedVehicle, props.tracked);
      interval = setInterval(() => {
        getVehicles(setVehicleData, setTrackedVehicle, getTrackedVehicleId());
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

VehicleAction.defaultProps = {
  refreshDelay: 3000,
  tracked: "3942"
};

VehicleAction.propTypes = {
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string
};

export default VehicleAction;
