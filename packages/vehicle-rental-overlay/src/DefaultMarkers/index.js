import { divIcon } from "leaflet";
import memoize from "lodash.memoize";
import { stationType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Marker } from "react-leaflet";

import { floatingBikeIcon, hubIcons } from "../bike-icons";
import * as Styled from "../styled";

/**
 * This file contains default marker types for rental vehicles,
 * that can be used when defining the VehicleRentalOverlay's symbol prop:
 * - Circle
 * - GenericMarker
 * - HubAndFloatingBike
 */

// Prop types reused across components.
const templatePropTypes = {
  /** The children of the component. */
  children: PropTypes.node,
  /** The rental vehicle or station to render. */
  entity: stationType.isRequired
};
const templateDefaultProps = {
  children: null
};

/**
 * Helper function to create a Circle component to render entities
 * using a fixed size, fill color, and stroke color.
 * Usage: Circle({ fillColor: "#FF56BB", size: 4, strokeColor: "#000000" })
 */
export const Circle = ({ fillColor = "gray", size, strokeColor }) => {
  const newStrokeColor = strokeColor || fillColor;

  const GeneratedMarker = ({ children, entity: station }) => (
    <CircleMarker
      center={[station.y, station.x]}
      color={newStrokeColor}
      fillColor={fillColor}
      fillOpacity={1}
      radius={size}
      weight={1}
    >
      {children}
    </CircleMarker>
  );

  GeneratedMarker.propTypes = templatePropTypes;
  GeneratedMarker.defaultProps = templateDefaultProps;
  return GeneratedMarker;
};

/**
 * A component that renders rental bike entities
 * either as a bike or a bike dock (or hub, showing spaces available).
 */
export const HubAndFloatingBike = ({ children, entity: station }) => {
  let icon;
  if (station.isFloatingBike) {
    icon = floatingBikeIcon;
  } else {
    const pctFull =
      station.bikesAvailable /
      (station.bikesAvailable + station.spacesAvailable);
    const i = Math.round(pctFull * 9);
    icon = hubIcons[i];
  }
  return (
    <Marker icon={icon} position={[station.y, station.x]}>
      {children}
    </Marker>
  );
};
HubAndFloatingBike.propTypes = templatePropTypes;
HubAndFloatingBike.defaultProps = templateDefaultProps;

/**
 * Creates and caches a leaflet element icon based on color.
 */
const getStationMarkerByColor = memoize(color =>
  divIcon({
    className: "",
    iconSize: [11, 16],
    popupAnchor: [0, -6],
    html: ReactDOMServer.renderToStaticMarkup(
      <Styled.StationMarker color={color} />
    )
  })
);

/**
 * Helper function to create a leaflet Marker component to render entities
 * using fixed fill color.
 * Usage: GenericMarker({ fillColor: "#F204B5" })
 */
export const GenericMarker = ({ fillColor = "gray" }) => {
  const markerIcon = getStationMarkerByColor(fillColor);

  const GeneratedMarker = ({ children, entity: station }) => (
    <Marker icon={markerIcon} position={[station.y, station.x]}>
      {children}
    </Marker>
  );
  GeneratedMarker.propTypes = templatePropTypes;
  GeneratedMarker.defaultProps = templateDefaultProps;
  return GeneratedMarker;
};
