import React from "react";
import ReactDOMServer from "react-dom/server";

import L from "leaflet";

import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export default function makeVehicleIcon(mode) {
  let icon = null;
  switch (mode) {
    case "BUS":
      icon = <Bus />;
      break;
    case "TRAM":
      icon = <Max />;
      break;
    case "SC":
      icon = <Streetcar />;
      break;
    case "GONDOLA":
      icon = <AerialTram />;
      break;
    case "RAIL":
      icon = <Wes />;
      break;
    default:
      icon = <Bus />;
      break;
  }

  let retVal = null;
  if (icon != null)
    retVal = L.divIcon({
      html: ReactDOMServer.renderToString(icon),
      className: "",
      popupAnchor: [0, -12],
      tooltipAnchor: [11, 0],
      iconSize: [22, 22]
    });
  else
    retVal = L.divIcon({
      html: "<span>--></span>"
    });

  return retVal;
}
