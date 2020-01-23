/* eslint-disable no-unused-vars */
import polyline from "@mapbox/polyline";

/**
 * geojson uses [lon,lat] (e.g., [X, Y]) in representing coordinates
 * this utility function reverses the point order to be [lat, lon] (or [Y, X])
 *
 * @return array of reversed points in the line geom
 */
export function reverseGeojsonPointsInGeom(geom) {
  const revPoints = [];
  for (let i = 0; i < geom.coordinates.length; i++) {
    const c = geom.coordinates[i].reverse();
    revPoints.push(c);
  }
  return revPoints;
}

/**
 * OTP encodes polylines - this method will decode such geometries
 * @param geom
 * @return decoded polyline
 */
export function decodePolyline(geom) {
  let retVal = geom;
  if (geom && geom.points) {
    retVal = polyline.decode(geom.points);
  }
  return retVal;
}

/**
 * find a vehicle within a list of vehicles
 * @param vehicleList - list of vehciles to be searched
 * @param queryId - either trip or vehcile id (string) to search list
 * @param defVal - return value when not found or errors happen
 */
export function findVehicle(vehicleList, queryId, defVal = null) {
  let retVal = defVal;

  try {
    vehicleList.some(v => {
      if (queryId === v.vehicleId || queryId === v.tripId) {
        retVal = v;
        return true;
      }
      return false;
    });
  } catch (e) {
    console.log(e);
  }
  return retVal;
}

/**
 * query real-time vehicles, and return the results in the set* parameter callbacks
 *
 * @param setVehicleData - callback where vehicles array will be passed
 * @param setTrackedVehicle - callback where a tracked vehicle will be captured
 * @param trackId - trip or vehicle id of target vehicle to track
 * @param url - url of the vehicle service
 *
 * TODO: add geometry crap to this util
 */
export function fetchVehicles(setVehicleData, setTrackedVehicle, trackId, url) {
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
          // step 2: find vehicle record via either tripId or vehicleId
          const tracked = findVehicle(vehicleList, trackId);

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

/**
 *
 * @param url
 * @param agencyId
 * @param patternId
 * @returns {*}
 */
function fetchVehiclePattern(url, agencyId, patternId, cache) {
  if (!agencyId) agencyId = "TRIMET";
  if (!patternId) patternId = "433758";

  /**
   * https://newplanner.trimet.org/ws/ti/v0/index/patterns/TRIMET:433758/geometry/geojson
   * https://newplanner.trimet.org/ws/ti/v0/index/patterns/{agency}:{pattern}/geometry/geojson
   */
  function makePatternUrl() {
    url = "https://newplanner.trimet.org/ws/ti/v0/index/patterns";
    return `${url}/${agencyId}:${patternId}/geometry/geojson`;
  }

  function cachePatternEncoded(pat, key) {
    const geom = pat.points;
    const pts = polyline.decode(geom);
    this.patterns[key] = pts;
  }

  /**
   * will cache the [[lat,lon], [lat,lon], etc...] coords
   * note: geojson uses [lon,lat] (e.g., [X, Y], so must reverse that to match encoded coords
   */
  function cachePatternGeojson(pat, key) {
    const revPoints = reverseGeojsonPointsInGeom(pat);
    // patterns[key] = revPoints;
    return revPoints;
  }

  /*
  function xcachePatternGeojson(pat, cache) {
    const revCoords = [];
    for (let i = 0; i < pat.coordinates.length; i++) {
      const c = pat.coordinates[i].reverse();
      revCoords.push(c);
    }
    const key = `${agencyId}:${patternId}`;
    cache[key] = revCoords;
  }

  let retVal = null;

  const geomWsUrl = makePatternUrl(vehicle, ap);

  console.log(`Calling GEO URL: ${geomWsUrl}`);
  fetch(geomWsUrl)
    .then(res => {
      retVal = res.json();
      return retVal;
    })
    .then(json => {

    })
    .catch(error => {
      console.log(`VEH GEOMETRY fetch() error: ${error}`);
    });

  return retVal;
*/
}

// export function getVehicleGeometry(setVehicleData, setTrackedVehicle, trackId, url) {}

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

export function directions(dir) {
  function isNorthbound(heading) {
    return heading <= 45.0 || heading >= 315.0;
  }

  function isSouthbound(heading) {
    return heading >= 135.0 && heading <= 225.0;
  }

  function isEastbound(heading) {
    return heading > 45.0 && heading < 135.0;
  }

  function isWestbound(heading) {
    return heading > 225.0 && heading < 315.0;
  }

  let retVal = "";
  if (isNorthbound(dir)) retVal = "Northbound";
  else if (isSouthbound(dir)) retVal = "Southbound";
  else if (isEastbound(dir)) retVal = "Eastbound";
  else if (isWestbound(dir)) retVal = "Northbound";
  else retVal = "Roundbound";

  return retVal;
}
