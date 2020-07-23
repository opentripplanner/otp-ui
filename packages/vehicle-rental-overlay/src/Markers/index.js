import { divIcon } from "leaflet";
import memoize from "lodash.memoize";
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { CircleMarker, Marker } from "react-leaflet";

import { floatingBikeIcon, hubIcons } from "../bike-icons";
import * as Styled from "../styled";

// Prop types reused across components.
const entityPropType = PropTypes.shape();
const templatePropTypes = {
  children: PropTypes.node,
  entity: entityPropType.isRequired
};
const templateDefaultProps = {
  children: null
};

/**
 * A basic circle marker that takes size and color props,
 * in addition to a entity source and a PopupSlot.
 */
const Circle = ({
  children,
  entity: station,
  fillColor,
  radius,
  strokeColor
}) => {
  const newStrokeColor = strokeColor || fillColor;

  return (
    <CircleMarker
      center={[station.y, station.x]}
      color={newStrokeColor}
      fillColor={fillColor}
      fillOpacity={1}
      radius={radius}
      weight={1}
    >
      {children}
    </CircleMarker>
  );
};
Circle.propTypes = {
  children: PropTypes.node,
  entity: entityPropType.isRequired,
  fillColor: PropTypes.string,
  radius: PropTypes.number.isRequired,
  strokeColor: PropTypes.string
};
Circle.defaultProps = {
  children: null,
  fillColor: "gray",
  strokeColor: null
};
/**
 * Helper function to create a Circle component template with fixed size and color props.
 */
Circle.template = (size, fillColor, strokeColor) => {
  const Template = ({ children, entity }) => (
    <Circle
      entity={entity}
      fillColor={fillColor}
      radius={size}
      strokeColor={strokeColor}
    >
      {children}
    </Circle>
  );
  Template.propTypes = templatePropTypes;
  Template.defaultProps = templateDefaultProps;
  return Template;
};

/**
 * A component that renders rental bike entities
 * either as a bike or a bike dock (or hub, showing spaces available).
 */
const HubAndFloatingBike = ({ children, entity: station }) => {
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
 * A basic leaflet marker that takes a color props,
 * in addition to a entity source and a PopupSlot.
 */
const GenericMarker = ({ children, entity: station, fillColor }) => {
  const markerIcon = getStationMarkerByColor(fillColor);

  return (
    <Marker icon={markerIcon} position={[station.y, station.x]}>
      {children}
    </Marker>
  );
};
GenericMarker.propTypes = {
  children: PropTypes.node,
  entity: entityPropType.isRequired,
  fillColor: PropTypes.string
};
GenericMarker.defaultProps = {
  children: null,
  fillColor: "gray"
};
/**
 * Helper function to create a GenericMarker component template with fixed size and color props.
 */
GenericMarker.template = fillColor => {
  const Template = ({ children, entity }) => (
    <GenericMarker entity={entity} fillColor={fillColor}>
      {children}
    </GenericMarker>
  );
  Template.propTypes = templatePropTypes;
  Template.defaultProps = templateDefaultProps;
  return Template;
};

export default {
  Circle,
  HubAndFloatingBike,
  Marker: GenericMarker
};
