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
  entity: entityPropType.isRequired
};

const Circle = ({
  entity: station,
  fillColor,
  radius,
  PopupSlot,
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
      {PopupSlot && <PopupSlot />}
    </CircleMarker>
  );
};
Circle.propTypes = {
  entity: entityPropType.isRequired,
  fillColor: PropTypes.string,
  radius: PropTypes.number.isRequired,
  PopupSlot: PropTypes.elementType,
  strokeColor: PropTypes.string
};
Circle.defaultProps = {
  fillColor: "gray",
  PopupSlot: null,
  strokeColor: null
};
Circle.template = (size, fillColor, strokeColor) => {
  const CircleInner = ({ entity }) => (
    <Circle
      entity={entity}
      fillColor={fillColor}
      radius={size}
      strokeColor={strokeColor}
    />
  );
  CircleInner.propTypes = templatePropTypes;
  return CircleInner;
};

const HubAndFloatingBike = ({ entity: station, PopupSlot }) => {
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
      {PopupSlot && <PopupSlot />}
    </Marker>
  );
};
HubAndFloatingBike.propTypes = {
  entity: entityPropType.isRequired,
  PopupSlot: PropTypes.elementType
};
HubAndFloatingBike.defaultProps = {
  PopupSlot: null
};

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

const GenericMarker = ({ entity: station, fillColor, PopupSlot }) => {
  const markerIcon = getStationMarkerByColor(fillColor);

  return (
    <Marker icon={markerIcon} position={[station.y, station.x]}>
      {PopupSlot && <PopupSlot />}
    </Marker>
  );
};
GenericMarker.propTypes = {
  entity: entityPropType.isRequired,
  fillColor: PropTypes.string,
  PopupSlot: PropTypes.elementType
};
GenericMarker.defaultProps = {
  fillColor: "gray",
  PopupSlot: null
};
GenericMarker.template = fillColor => {
  const MarkerInner = ({ entity }) => (
    <GenericMarker entity={entity} fillColor={fillColor} />
  );
  MarkerInner.propTypes = templatePropTypes;
  return MarkerInner;
};

export default {
  Circle,
  HubAndFloatingBike,
  Marker: GenericMarker
};
