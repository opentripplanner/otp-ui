import React from "react";

import TriMetLegIcon from "@opentripplanner/icons/lib/trimet-leg-icon";

import AerialTram from "./trimet/AerialTram";
import Bicycle from "./trimet/Bicycle";
import Bus from "./trimet/Bus";
import Car from "./trimet/Car";
import Ferry from "./trimet/Ferry";
import Max from "./trimet/Max";
import Micromobility from "./trimet/Micromobility";
import Walk from "./trimet/Walk";


export function getVehicles(setState, url) {
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
      // if(this.isNewer(res))
      const retVal = res.json();
      return retVal;
    })
    .then(json => {
      if (json && json.length > 0) {
        console.log(`updating state with ${json.length} vehicles`);
        setState(json);
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
 *
 */
function makeVehicleIcon(cls, mode, defStr) {
  let icon = null;
  switch(mode) {
    case "BUS":
      icon = <BusIcon/>;
      break;
    case "TRAM":
      icon = <TramIcon/>
      break;
    case "SC":
      icon = <StreetcarIcon/>;
      break;
    case "GONDOLA":
      icon = <GondolaIcon/>;
      break;
    case "RAIL":
      icon = <RailIcon/>;
      break;
    default:
      icon = <BusIcon/>;
      break;
  }

  let retVal = null;
  if(mode != null)
    retVal = L.divIcon({
      html: ReactDOMServer.renderToString(icon),
      className: cls,
      popupAnchor: [0, -11],
      tooltipAnchor: [0, -11],
      iconSize: [22, 22]
    });
  else
    retVal = L.divIcon({
      html: `<span>${defStr || 'fxp'}</span>`,
     });

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
