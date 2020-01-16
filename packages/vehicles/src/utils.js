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
