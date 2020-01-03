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
