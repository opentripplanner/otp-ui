import polyline from "@mapbox/polyline";
import L from "leaflet";

/**
 * panToOffset will allow you to pan the map and adjust for something like a floating
 * left nav bar, or a page header with an offset center
 *
 * @note adapted from Peter's code: https://gist.github.com/missinglink/7620340
 *
 * @param latlng
 * @param offsetX & offsetY: defaults to [0, 0] ([X, Y] pixel offsets center) a positive x
 * offset to shift the center to the right, and a positive y offset to shift the center to the
 * bottom. Negatives will move to the center point left and top.
 * @param options: pan options https://leafletjs.com/reference.html#pan-options
 * @return return value from a call to https://leafletjs.com/reference.html#map-panto
 */
L.Map.prototype.panToOffset = function(latlng, offsetX, offsetY, options) {
  const x =
    this.latLngToContainerPoint(latlng).x - (parseInt(offsetX, 10) || 0);
  const y =
    this.latLngToContainerPoint(latlng).y - (parseInt(offsetY, 10) || 0);
  const point = this.containerPointToLatLng([x, y]);
  /* eslint-disable-next-line no-underscore-dangle */
  return this.setView(point, this._zoom, { pan: options });
};

/** deep copy */
export function deep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * will take an input object (e.g., probably a defaultProp representing a leaflet style),
 * deep copy that object, and return back a new obj with the .color set
 *
 * @param color
 * @return deep copied object with color set
 */
export function setColor(color, obj) {
  const retVal = deep(obj);
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
 * Checks if a parameter is actually a function.
 * @param {*} fn The function to call.
 * @returns fn if fn is a function, or a dummy function.
 * TODO: copied from map ... should be in core-utils?
 */
export function callIfValid(fn) {
  if (typeof fn === "function") return fn;
  return () => {};
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
        if (queryId === v.vehicleId || queryId === v.tripId) {
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
    (vehicleA.vehicleId === vehicleB.vehicleId ||
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
export function fetchVehicles(setData, trackedId, baseUrl, query) {
  // build url
  baseUrl = baseUrl || "https://maps.trimet.org/gtfs/rt/vehicles/";
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
        // step 1: set the vehicle list (triggers vehicle points redraw)
        // console.log(`updating state with ${vehicleList.length} vehicles`);
        setData(vehicleList, trackedId);
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
 * https://newplanner.trimet.org/ws/ti/v0/index/patterns/TRIMET:433758/geometry/geojson
 * https://newplanner.trimet.org/ws/ti/v0/index/patterns/{agency}:{pattern}/geometry/geojson
 *
 * @param setPatternData
 * @param patternId
 * @param tiUrl
 * @param geojson
 */
export function fetchVehiclePattern(
  setPatternData,
  patternId,
  tiUrl,
  geojson = "/geojson"
) {
  if (!tiUrl) tiUrl = "https://newplanner.trimet.org/ws/ti/v0/index";
  const url = `${tiUrl}/patterns/${patternId}/geometry${geojson}`;

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
