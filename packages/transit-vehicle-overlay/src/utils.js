import cloneDeep from "lodash.clonedeep";

if (typeof fetch === "undefined") require("isomorphic-fetch"); // eslint-disable-line

/**
 * will take an input object (e.g., probably a defaultProp representing a leaflet style),
 * deep copy that object, and return back a new obj with the .color set
 *
 * @param color
 * @return deep copied object with color set
 */
export function setColor(color, obj) {
  const retVal = cloneDeep(obj);
  retVal.color = color;
  return retVal;
}

/** return map zoom value from leaflet */
export function getZoom(leaflet, defZoom = 15) {
  let retVal = defZoom;
  try {
    retVal = leaflet.map.getZoom();
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

/** check 360 heading for a valid number */
export function checkHeading(heading) {
  if (heading === null || heading < 0 || heading >= 360) {
    heading = 0;
  }
  return heading;
}

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
 * find a vehicle based on an id (either vehicle or trip id) within a list of vehicles
 * @param vehicleList - list of vehciles to be searched
 * @param queryId - either trip or vehcile id (string) to search list
 * @param defVal - return value when not found or errors happen
 */
export function findVehicleById(vehicleList, queryId, defVal = null) {
  let retVal = defVal;
  try {
    if (vehicleList && queryId) {
      vehicleList.some(v => {
        if (queryId === v.blockId || queryId === v.tripId) {
          retVal = v;
          return true;
        }
        return false;
      });
    }
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

/**
 * do 2 vehicle have the same tracking ids
 * @param vehicleA
 * @param vehicleB
 * @returns boolean
 */
export function isTracked(vehicleA, vehicleB) {
  return (
    vehicleA &&
    vehicleB &&
    (vehicleA.blockId === vehicleB.blockId ||
      vehicleA.tripId === vehicleB.tripId)
  );
}

/** build a url from sub parts */
export function buildUrl(base, query) {
  let retVal = base;
  try {
    retVal = `${base}/${query}`.replace(/([^:]\/)\/+/g, "$1");
  } catch (e) {
    retVal = `${base}/${query}`;
  }
  return retVal;
}

/**
 * query real-time vehicles, and return the results in the set* parameter callbacks
 *
 * @param setData - callback where vehicles array will be passed
 * @param url - url of the vehicle service
 */
export function fetchVehicles(setData, baseUrl, query) {
  // build url
  query = query || "routes/all";
  let url = buildUrl(baseUrl, query);

  // append date to end of url (caching, etc...)
  const d = Date.now();
  url = url.indexOf("?") ? `${url}?` : `${url}&`;
  url = `${url}__time__=${d}`;

  fetch(url)
    .then(res => {
      if (!res.ok) {
        console.error(res.statusText);
        throw Error(res.statusText);
      }
      return res;
    })
    .then(res => res.json())
    .then(vehicleList => {
      if (vehicleList && vehicleList.length > 0) {
        // set the vehicle list (triggers vehicle points redraw)
        // console.log(`updating state with ${vehicleList.length} vehicles`);
        setData(vehicleList);
      } else {
        console.error("get vehicle data is suspect");
      }
    })
    .catch(error => {
      console.error(`VEH fetch() error: ${error} for ${url}`);
    });
}

/**
 * fetch line geometry for a given pattern
 *
 * @param setPatternData
 * @param patternId
 * @param tiUrl
 */
export function fetchVehiclePattern(setPatternData, patternId, tiUrl) {
  const url = `${tiUrl}/patterns/${patternId}/geometry/geojson`;

  // console.log(`Calling GEO URL: ${url}`);
  fetch(url)
    .then(res => res.json())
    .then(json => {
      const points = reverseGeojsonPointsInGeom(json);
      setPatternData(patternId, points);
    })
    .catch(error => {
      console.error(`VEH GEOMETRY fetch() error: ${error}`);
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
