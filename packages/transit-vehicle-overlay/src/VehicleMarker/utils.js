import React from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";

import * as Styled from "./styled";

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export default function makeVehicleIcon(
  mode,
  color,
  highlightColor,
  isTracked
) {
  let icon = null;
  switch (mode) {
    case "TRAM":
      icon = isTracked ? (
        <Styled.TrackedTram color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormTram color={color} colorselected={highlightColor} />
      );
      break;
    case "SC":
      icon = isTracked ? (
        <Styled.TrackedSC color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormSC color={color} colorselected={highlightColor} />
      );
      break;
    case "GONDOLA":
      icon = isTracked ? (
        <Styled.TrackedGond color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormGond color={color} colorselected={highlightColor} />
      );
      break;
    case "RAIL":
      icon = isTracked ? (
        <Styled.TrackedRail color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormRail color={color} colorselected={highlightColor} />
      );
      break;
    case "BUS":
    default:
      icon = isTracked ? (
        <Styled.TrackedBus color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormBus color={color} colorselected={highlightColor} />
      );
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
