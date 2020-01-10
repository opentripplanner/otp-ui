import React from "react";
import PropTypes from "prop-types";

import VehicleLayer from "./vehicle-layer";
import { checkRefreshInteval } from "./vehicle-utils";

function findVehicleRecord(vehicleList, trackId) {
  const retVal = null;
  trackId = 1;
  return retVal && trackId;
}

function getVehicles(setState, setTrackedVehicle, trackId, url) {
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
        console.log(`updating state with ${vehicleList.length} vehicles`);
        setState(vehicleList);

        if (trackId) {
          // step 1: find vehicle record via either trip_id, block_id or vehicle_id
          const tracked = findVehicleRecord(vehicleList, trackId);

          // step 2: add to state
          if (tracked) {
            setTrackedVehicle(tracked);
          } else {
            console.log(
              `WARN: couldn't find vehicle with id (trip/block/vehicle) of ${trackId}`
            );
          }
        } else {
          // step 3 (important): if not tracking, make sure a previous tracked vehicle is cleared from state
          setTrackedVehicle(null);
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

  // the code below w/in useEffect is a simplified version of what's in vehcile-action.js / VechicleAction component
  // note: we wrap the setInterval / clearInterval w/in a useEffect, since that will work our component lifecycle.
  React.useEffect(() => {
    // when state of vehicle data is null (new) set the data updates here
    // this makes sure we only have 1 updater interval (else chaos ensues)
    // NOTE: because we're setting state below, this function is going to get called multiple times by react
    //       if we don't have the gate of vehicleData == null, then we'll get multiple setInterval calls
    let interval = null;
    if (vehicleData == null) {
      getVehicles(
        setVehicleData,
        setTrackedVehicle,
        "either trip/block/vech number"
      );
      interval = setInterval(() => {
        getVehicles(
          setVehicleData,
          setTrackedVehicle,
          "either trip/block/vech number"
        );
      }, refreshDelay);
    }

    return () => {
      // before vehicle view component unmounts, clear the interval...
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

VehicleAction.propTypes = {
  refreshDelay: PropTypes.number
};

export default VehicleAction;
