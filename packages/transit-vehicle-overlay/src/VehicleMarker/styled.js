import React from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";

import styled, { css } from "styled-components";
import { Circle } from "styled-icons/fa-solid";

import { AerialTram, Bus, Streetcar, Max, Wes } from "@opentripplanner/icons";

// note: want to make these props of styled, so props.colorselected
// BTW, 'props.color' works, since that's an established prop of styled
// https://stackoverflow.com/questions/52321539/react-passing-props-with-styled-components
const color = "#000";
const colorselected = "#00bfff";
const colorHighlight = "#ccee77";

const normal = css`
  color: ${props => props.color || color};
  background-color: #fff;
  border: 1px solid ${props => props.color || color};
  :hover {
    color: ${props => props.colorselected || colorselected};
    background-color: ${props => props.colorselected || colorselected};
    border: 1px solid ${props => props.colorHighlight || colorHighlight};
  }
  border-radius: 50%;
`;

const tracked = css`
  color: ${props => props.colorselected || colorselected};
  background-color: ${props => props.colorselected || colorselected};
`;

export const VehicleCircle = styled(Circle)`
  ${normal}
  background-color: #000;
`;

export const TrackedVehicleCircle = styled(VehicleCircle)`
  ${tracked}
`;

export const NormBus = styled(Bus)`
  ${normal}
`;

export const TrackedBus = styled(NormBus)`
  ${tracked}
`;

export const NormTram = styled(Max)`
  ${normal}
`;

export const TrackedTram = styled(NormTram)`
  ${tracked}
`;

export const NormSC = styled(Streetcar)`
  ${normal}
`;

export const TrackedSC = styled(NormSC)`
  ${tracked}
`;

export const NormGond = styled(AerialTram)`
  ${normal}
`;

export const TrackedGond = styled(NormGond)`
  ${tracked}
`;

export const NormRail = styled(Wes)`
  ${normal}
`;

export const TrackedRail = styled(NormRail)`
  ${tracked}
`;

/**
 * find icons based on gtfsdb mode types
 * TODO: both icon names and these modes need to align better to standards
 * TODO: icons using trimet stuff needs to get away from MAX / WES / AERIALTRAM names, etc...
 */
export function makeVehicleIcon(mode, selectColor, isTracked) {
  let icon = null;
  switch (mode) {
    case "TRAM":
      icon = isTracked ? (
        <TrackedTram colorselected={selectColor} />
      ) : (
        <NormTram colorselected={selectColor} />
      );
      break;
    case "SC":
      icon = isTracked ? (
        <TrackedSC colorselected={selectColor} />
      ) : (
        <NormSC colorselected={selectColor} />
      );
      break;
    case "GONDOLA":
      icon = isTracked ? (
        <TrackedGond colorselected={selectColor} />
      ) : (
        <NormGond colorselected={selectColor} />
      );
      break;
    case "RAIL":
      icon = isTracked ? (
        <TrackedRail colorselected={selectColor} />
      ) : (
        <NormRail colorselected={selectColor} />
      );
      break;
    case "BUS":
      icon = isTracked ? (
        <TrackedBus colorselected={selectColor} />
      ) : (
        <NormBus colorselected={selectColor} />
      );
      break;
    default:
      icon = isTracked ? (
        <TrackedBus colorselected={selectColor} />
      ) : (
        <NormBus colorselected={selectColor} />
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

export const TooltipStyle = styled.span``;

TooltipStyle.Title = styled.span`
  font-size: 110%;
  font-weight: bold;
`;

export const PopupStyle = styled.div`
  display: inline-block;
  box-sizing: border-box;
  > * {
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
  }
`;

PopupStyle.Title = styled.div`
  font-size: 110%;
  font-weight: bold;
  text-align: center;
`;

PopupStyle.Span = styled.span`
  font-size: 90%;
  display: block;
`;

PopupStyle.Button = styled.button`
  cursor: pointer;
  width: 100%;
  height: 100%;

  svg,
  img {
    vertical-align: middle;
    max-width: 1.25em;
    margin: 0 0.25em;
    height: 1.25em;
  }
  &.active {
    font-weight: 600;
    box-shadow: 0 0 2px 2px rgba(0, 64, 255, 0.5);
  }
  &.disabled {
    cursor: default;
  }
  &.disabled svg {
    fill: #ccc;
  }
`;
