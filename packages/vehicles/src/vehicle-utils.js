export function findVehicleRecord(vehicleList, trackId) {
  let retVal = null;
  if (vehicleList && trackId) {
    // TODO find logic
    // debugger
    retVal = vehicleList[10];
  }
  return retVal;
}

export function getVehicles(setState, setTrackedVehicle, trackId, url) {
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
          if (tracked) setTrackedVehicle(vehicleList[0]);
          else
            console.log(
              `WARN: couldn't find vehicle with id (trip/block/vehicle) of ${trackId}`
            );
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

/**
 * get refresh values (default 10 seconds), and convert from secs to millisecs
 */
export function checkRefreshInteval(inverval, defInterval = 10000) {
  let retVal = defInterval;
  if (inverval) {
    let r = inverval;
    if (r > 0 && r <= 100) r *= 1000;
    if (r >= 1000 && r < 100000) retVal = r;
    else retVal = defInterval;
  }
  return retVal;
}

/**
 * will build up a gtfsdb url for rt vehicles
 * certain rules exist around the various filters
 * url:
 *   https://maps.trimet.org/gtfs/rt/vehicles/routes/all
 */
export function makeWsUrl(
  url,
  routes = null,
  blocks = null,
  trips = null,
  stops = null
) {
  let filter = "";
  if (routes) filter = `/routes/${routes}`;
  else filter = "/routes/all";
  if (blocks) filter = `/blocks/${blocks}`;
  if (trips) filter = `/trips/${trips}`;
  if (stops) filter = `/stops/${stops}`;

  const retVal = url + filter;
  return retVal;
}

export function formatTime(seconds) {
  let retVal = "";
  if (seconds >= 60) {
    const min = Math.floor(seconds / 60);
    const sec = seconds - min * 60;
    const minStr = min === 1 ? "minute" : "minutes";

    if (sec > 0) retVal = `${min} ${minStr} & ${sec} seconds ago`;
    else retVal = `${min} ${minStr} ago`;
  } else {
    retVal = `${seconds} seconds ago`;
  }
  return retVal;
}
