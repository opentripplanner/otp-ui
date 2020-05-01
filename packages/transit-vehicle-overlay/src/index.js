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
    center,
    vehicleList,
    selectedVehicle,
    showOnlyTracked,

    // VehicleGeometry
    onVehicleClicked,
    onRecenterMap,
    MarkerSlot,
    PopupSlot,
    TooltipSlot,
    color,
    highlightColor,

    // RouteGeometry
    pattern,
    lowlightColor, // note: highlightColor above
    highlight,
    lowlight
  } = props;
  utils.linterIgnoreTheseProps(center);

  // when a vehicle is selected, pre-determine whether to show pattern and which vehicles
  let vl = vehicleList;
  let showPattern = false;
  if (
    selectedVehicle &&
    utils.findVehicleById(vehicleList, selectedVehicle.tripId)
  ) {
    if (showOnlyTracked) vl = [selectedVehicle];
    if (pattern) showPattern = true;
  }

  return (
    <FeatureGroup>
      {vl &&
        vl.map(v => (
          <VehicleGeometry
            zoom={zoom}
            key={v.id}
            vehicle={v}
            isTracked={selectedVehicle && selectedVehicle.tripId === v.tripId}
            onVehicleClicked={onVehicleClicked}
            onRecenterMap={onRecenterMap}
            MarkerSlot={MarkerSlot}
            PopupSlot={PopupSlot}
            TooltipSlot={TooltipSlot}
            color={color}
            highlightColor={highlightColor}
          />
        ))}
      {showPattern && (
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
  /** map zoom: used both to trigger re-renders and to style markers that rely on zoom */
  zoom: PropTypes.number,

  /** map center: used both to trigger re-renders */
  center: PropTypes.arrayOf(PropTypes.number),

  /** array of vehicle records - @see: core-utils/types/transitVehicleType */
  vehicleList: PropTypes.arrayOf(transitVehicleType),

  /** optional vehicle record for the tracked vehicle (same rec must be in vehicleList) */
  selectedVehicle: transitVehicleType,

  /** showOnlyTracked will hide all other vehicles, except the tracked vehicle */
  showOnlyTracked: PropTypes.bool,

  // ////// VehicleGeometry types ////////

  /** callback to return vehicle record when a marker is clicked */
  onVehicleClicked: VehicleGeometry.propTypes.onVehicleClicked,

  /** map recenter option (e.g., panTo() or flyTo(), etc...) when tracked vehicle moves */
  onRecenterMap: VehicleGeometry.propTypes.onRecenterMap,

  /** customizable markers used to represent the vehicles (see src/components/markers) */
  MarkerSlot: VehicleGeometry.propTypes.MarkerSlot,

  /** customizable marker popup (see src/components/popups) */
  PopupSlot: VehicleGeometry.propTypes.PopupSlot,

  /** customizable marker tooltips (see src/components/popups) */
  TooltipSlot: VehicleGeometry.propTypes.TooltipSlot,

  /** fill color (#AABBCC format) for all (non-tracked) map vehicle markers */
  color: VehicleGeometry.propTypes.color,

  /** fill color of tracked vehicle; *to be travelled* portion of tracked route geom */
  highlightColor: VehicleGeometry.propTypes.highlightColor,

  // ////// RouteGeometry types ////////

  /** line geometry, ala { id: <tripId>, data: [[lat, lon], [45.50,-122.41], etc..] } */
  pattern: RouteGeometry.propTypes.pattern,

  /** color of the *already travelled* tracked vehicle route (see highlightColor) */
  lowlightColor: RouteGeometry.propTypes.lowlightColor,

  /** line styling options for the to be traveled part of the line geom */
  highlight: RouteGeometry.propTypes.highlight,

  /** line styling options for the already traveled portion of the line geom */
  lowlight: RouteGeometry.propTypes.lowlight
};

TransitVehicleOverlay.defaultProps = {
  zoom: 13,
  center: null,
  vehicleList: null,
  selectedVehicle: null,
  showOnlyTracked: false,

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
