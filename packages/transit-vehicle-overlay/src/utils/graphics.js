import React from "react";
import ReactDOMServer from "react-dom/server";
import styled from "styled-components";
import L from "leaflet";
import cloneDeep from "lodash.clonedeep";

/** helper to render a React .svg structure, ala icons/Bus.js as a leaflet marker */
export function renderAsImage(
  icon,
  size = [22, 22],
  anchor = null,
  pop = null,
  tt = null,
  cls = ""
) {
  const x = size[0];
  const y = size[1];

  // debugger;
  if (!pop) pop = [0, 0];
  if (!tt) tt = [0, 0];
  if (!anchor) anchor = [Math.round(x / 2), Math.round(y / 2)];

  const retVal = L.divIcon({
    html: ReactDOMServer.renderToString(icon),
    className: cls,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: pop,
    tooltipAnchor: tt
  });
  return retVal;
}

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

/**
 * makes a circular marker icon with a vehicle image based on mode
 */
export function makeVehicleIcon(
  Styled,
  mode,
  color,
  highlightColor,
  isTracked
) {
  let icon;
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
      icon = isTracked ? (
        <Styled.TrackedBus color={color} colorselected={highlightColor} />
      ) : (
        <Styled.NormBus color={color} colorselected={highlightColor} />
      );
      break;
    default:
      icon = isTracked ? (
        <Styled.TrackedShape color={color} colorselected={highlightColor} />
      ) : (
        <Styled.Shape color={color} colorselected={highlightColor} />
      );
      break;
  }
  return icon;
}

/**
 * different icons per mode is repeated in multiple places. This helper function is reused
 * in multiple places to apply a normal and tracked style, based on various transit modes
 *
 * @param normal
 * @param tracked
 * @param busIcon
 * @param railIcon
 * @param tramIcon
 * @param streetcarIcon
 * @param gondolaIcon
 * @return {*[]}
 */
export function makeModeStyles(
  normal,
  tracked,
  busIcon,
  railIcon,
  tramIcon,
  streetcarIcon,
  gondolaIcon
) {
  if (!railIcon) railIcon = busIcon;
  if (!tramIcon) tramIcon = railIcon;
  if (!streetcarIcon) streetcarIcon = railIcon;
  if (!gondolaIcon) gondolaIcon = busIcon;

  const NormBus = styled(busIcon)`
    ${normal}
  `;

  const TrackedBus = styled(NormBus)`
    ${tracked}
  `;

  const NormRail = styled(railIcon)`
    ${normal}
  `;

  const TrackedRail = styled(NormRail)`
    ${tracked}
  `;

  const NormTram = styled(tramIcon)`
    ${normal}
  `;

  const TrackedTram = styled(NormTram)`
    ${tracked}
  `;

  const NormSC = styled(streetcarIcon)`
    ${normal}
  `;

  const TrackedSC = styled(NormSC)`
    ${tracked}
  `;

  const NormGond = styled(gondolaIcon)`
    ${normal}
  `;

  const TrackedGond = styled(NormGond)`
    ${tracked}
  `;

  return [
    NormBus,
    TrackedBus,
    NormRail,
    TrackedRail,
    NormTram,
    TrackedTram,
    NormSC,
    TrackedSC,
    NormGond,
    TrackedGond
  ];
}
