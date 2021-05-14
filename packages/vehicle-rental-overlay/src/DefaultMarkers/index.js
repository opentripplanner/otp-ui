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
 * - SharedBikeCircle
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
 * Renders a shared bike or shared bike dock as a circle
 * with predefined colors and size.
 */
export const SharedBikeCircle = ({
  dockStrokeColor,
  fillColor = "gray",
  pixels,
  strokeColor
}) => {
  const GeneratedMarker = ({ children, entity: station }) => {
    let newStrokeColor = strokeColor || fillColor;

    if (!station.isFloatingBike) {
      newStrokeColor = dockStrokeColor || strokeColor;
    }

    return (
      <CircleMarker
        center={[station.y, station.x]}
        color={newStrokeColor}
        fillColor={fillColor}
        fillOpacity={1}
        radius={pixels - (station.isFloatingBike ? 1 : 0)}
        weight={1}
      >
        {children}
      </CircleMarker>
    );
  };

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
    const capacity = station.bikesAvailable + station.spacesAvailable;
    if (capacity === 0) return null;
    const pctFull = station.bikesAvailable / capacity;
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
