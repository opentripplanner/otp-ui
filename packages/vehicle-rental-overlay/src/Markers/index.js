import PropTypes from "prop-types";
import React from "react";
import { CircleMarker } from "react-leaflet";

// Common props for markers.
const markerProps = {
  dockStrokeColor: PropTypes.string,
  entity: PropTypes.shape({}).isRequired,
  fillColor: PropTypes.string.isRequired,
  pixels: PropTypes.number.isRequired,
  PopupSlot: PropTypes.elementType,
  strokeColor: PropTypes.string
};

const defaultMarkerProps = {
  dockStrokeColor: null,
  PopupSlot: null,
  strokeColor: null
};

const Circle = ({
  dockStrokeColor,
  entity: station,
  fillColor,
  pixels,
  PopupSlot,
  strokeColor
}) => {
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
      {PopupSlot && <PopupSlot />}
    </CircleMarker>
  );
};
Circle.propTypes = markerProps;
Circle.defaultProps = defaultMarkerProps;

export default {
  Circle
};
