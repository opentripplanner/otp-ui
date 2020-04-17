import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import { transitVehicleType } from "@opentripplanner/core-utils/lib/types";
import VehicleGeometry from "./components/VehicleGeometry";
import RouteGeometry from "./components/RouteGeometry";
import * as utils from "./utils";

export default function TransitVehicleOverlay(props) {
  const {
    zoom,
    vehicleList,
    selectedVehicle,

    // VehicleGeometry
    color,
    highlightColor,
    onVehicleClicked,
    onRecenterMap,
    MarkerSlot,
    PopupSlot,
    TooltipSlot,

    // RouteGeometry
    pattern,
    lowlightColor, // note: highlightColor above
    highlight,
    lowlight
  } = props;

  return (
    <FeatureGroup>
      {vehicleList &&
        vehicleList.map(v => (
          <VehicleGeometry
            zoom={zoom}
            key={v.id}
            vehicle={v}
            isTracked={selectedVehicle && selectedVehicle.id === v.id}
            onVehicleClicked={onVehicleClicked}
            onRecenterMap={onRecenterMap}
            MarkerSlot={MarkerSlot}
            PopupSlot={PopupSlot}
            TooltipSlot={TooltipSlot}
            color={color}
            highlightColor={highlightColor}
          />
        ))}
      {pattern && (
        <RouteGeometry
          zoom={zoom}
          selectedVehicle={selectedVehicle}
          pattern={pattern}
          highlightColor={highlightColor}
          lowlightColor={lowlightColor}
          highlight={highlight}
          lowlight={lowlight}
        />
      )}
    </FeatureGroup>
  );
}

TransitVehicleOverlay.propTypes = {
  zoom: PropTypes.number,
  vehicleList: PropTypes.arrayOf(transitVehicleType),
  selectedVehicle: transitVehicleType,

  // VehicleGeometry types
  color: VehicleGeometry.propTypes.color,
  highlightColor: VehicleGeometry.propTypes.highlightColor,
  onVehicleClicked: VehicleGeometry.propTypes.onVehicleClicked,
  onRecenterMap: VehicleGeometry.propTypes.onRecenterMap,
  MarkerSlot: VehicleGeometry.propTypes.MarkerSlot,
  PopupSlot: VehicleGeometry.propTypes.PopupSlot,
  TooltipSlot: VehicleGeometry.propTypes.TooltipSlot,

  // RouteGeometry types
  pattern: RouteGeometry.propTypes.pattern,
  // highlightColor - VehicleGeometry see above
  lowlightColor: RouteGeometry.propTypes.lowlightColor,
  highlight: RouteGeometry.propTypes.highlight,
  lowlight: RouteGeometry.propTypes.lowlight
};

TransitVehicleOverlay.defaultProps = {
  zoom: 14,
  vehicleList: null,
  selectedVehicle: null,

  // VehicleGeometry defaults
  color: VehicleGeometry.defaultProps.color,
  highlightColor: VehicleGeometry.defaultProps.highlightColor,
  onVehicleClicked: VehicleGeometry.defaultProps.onVehicleClicked,
  onRecenterMap: VehicleGeometry.defaultProps.onRecenterMap,
  MarkerSlot: VehicleGeometry.defaultProps.MarkerSlot,
  PopupSlot: VehicleGeometry.defaultProps.PopupSlot,
  TooltipSlot: VehicleGeometry.defaultProps.TooltipSlot,

  // RouteGeometry defaults
  pattern: RouteGeometry.defaultProps.pattern,
  // highlightColor - VehicleGeometry see above
  lowlightColor: RouteGeometry.defaultProps.lowlightColor,
  highlight: RouteGeometry.defaultProps.highlight,
  lowlight: RouteGeometry.defaultProps.lowlight
};
