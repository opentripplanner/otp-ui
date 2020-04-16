const DEFAULT_REFRESH_TIME = 10000;

/**
 * get refresh values (default 10 seconds), and convert from secs to millisecs
 */
export function checkRefreshInteval(inverval, defInterval=DEFAULT_REFRESH_TIME) {
  let retVal = defInterval;
  if (inverval) {
    let r = inverval;
    if (typeof r === "string") r = parseInt(r, 10);
    if (r > 0 && r <= 100) r *= 1000;
    if (r >= 1000 && r <= 100000) retVal = r;
    else retVal = defInterval;
  }
  return retVal;
}

export const handleHttpResponse = response => {
  if (!response.ok) {
    /* TODO: Is there anything special we want to do with server side errors? */
    throw new Error(`Error fetching data. Status code: ${response.status}`);
  }
  /*
    TODO: Trimet bubbles up their own error messages from time to time
    and we'll want to grab those inside the `errorMessage` property
  */
  return response.json();
};

export const handleGlobalError = error => {
  /*
      TODO: More descriptive error handling here...
      maybe dispatch error event, display error message dialog
    */
  throw error;
};

/**
 * get linestring examples (using either pattern id or trip id):
 *
 * https://newplanner.trimet.org/ws/ti/v0/index/patterns/TRIMET:440496/geometry/geojson
 * or
 * https://newplanner.trimet.org/ws/ti/v0/index/patterns/trip/TRIMET:440496/geometry/geojson
 */
export const fetchRouteGeometry = async (config, id) =>
  fetch(
    `${config.host}${config.path}/${config.agency}:${id}${config.suffix}`
  )
    .then(handleHttpResponse)
    .catch(handleGlobalError);

/**
 * get vehicle positions -- example
 * https://maps.trimet.org/gtfs/rt/vehicles/routes/15?__time__=1585453880389
 */
export const fetchVehicles = async (config, query) =>
  fetch(
    `${config.host}${config.path}/${query.type}${
      /* eslint-disable prefer-template */
      query.ids.length ? "/" + query.ids.join() : "/all"
    }`
  )
    .then(handleHttpResponse)
    .catch(handleGlobalError);
