/* eslint-disable no-unused-vars */
/* stylelint-disable property-no-vendor-prefix */
/* stylelint-disable CssSyntaxError */
import React from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";

import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";

import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";

// note: want to make these props of styled, so props.colorSelected
// BTW, 'props.color' works, since that's an established prop of styled
// https://stackoverflow.com/questions/52321539/react-passing-props-with-styled-components
const color = "#000";
const colorSelected = "#00bfff";
const colorHighlight = "#ccee77";

export const VehicleCircle = styled(Circle)`
  color: ${props => props.color || color};
  background-color: ${props => props.color || color};
  border: 1px solid ${props => props.color || color};
  :hover {
    color: ${props => props.colorSelected || colorSelected};
    background-color: ${props => props.colorSelected || colorSelected};
    border: 1px solid ${props => props.colorHighlight || colorHighlight};
  }
  border-radius: 50%;
`;

export const TrackedVehicleCircle = styled(VehicleCircle)`
  color: ${props => props.colorSelected || colorSelected};
  background-color: ${props => props.colorSelected || colorSelected};
`;


/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export function makeVehicleIcon(mode) {
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


// popup button
export const Button = styled.button`
  color: navy;
  border: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;

  :hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;



/*
 TODO: expand information in popopu -- see trip itinerary
 below is from itinerary-body / styled
 export const TransparentButton = styled.button`
 export const ViewButton = styled(TransparentButton)`
*/