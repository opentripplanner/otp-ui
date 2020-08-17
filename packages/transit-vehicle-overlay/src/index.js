import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup } from "react-leaflet";

import {
  transitVehicleType,
  zoomBasedSymbolType
} from "@opentripplanner/core-utils/lib/types";
import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";

import { Circle, CircledVehicle } from "./components/markers/ModeCircles";
import RouteGeometry from "./components/RouteGeometry";
import VehicleGeometry from "./components/VehicleGeometry";
import * as utils from "./utils";

/**
 * presentational component for rendering transit vehicle positions atop a map
 * will show both point positions for a collection of vehicles, as well as being
 * able to render a 'selected' vehicle (and it's route pattern trace)
 */
export default function TransitVehicleOverlay(props) {
  const {
    center,
    name,
    selectedVehicle,
    showOnlyTracked,
    symbols,
    vehicleList,
    visible,
    zoom,

    // VehicleGeometry
    color,
    highlightColor,
    onRecenterMap,
    onVehicleClicked,
    PopupSlot,
    TooltipSlot,

    // RouteGeometry
    highlight,
    lowlight,
    lowlightColor, // note: highlightColor above
    pattern
  } = props;
  utils.linterIgnoreTheseProps(name, visible, center);

  /**
   * This helper method will be passed to the ZoomBasedMarkers symbolTranform prop.
   * It wraps symbols originally defined in the symbols prop
   * with the VehicleGeometry component that handles the leaflet plumbing,
   * and forwards to VehicleGeometry the relevant props from TransitVehicleOverlay.
   */
  const makeVehicleGeometryWrapper = Symbol => {
    const VehicleGeometryWrapper = ({ entity: vehicle, zoom: renderZoom }) => {
      return (
        <VehicleGeometry
          color={color}
          highlightColor={highlightColor}
          isTracked={
            selectedVehicle && selectedVehicle.tripId === vehicle.tripId
          }
          MarkerSlot={Symbol}
          onRecenterMap={onRecenterMap}
          onVehicleClicked={onVehicleClicked}
          PopupSlot={PopupSlot}
          TooltipSlot={TooltipSlot}
          vehicle={vehicle}
          zoom={renderZoom}
        />
      );
    };

    VehicleGeometryWrapper.propTypes = {
      entity: transitVehicleType.isRequired,
      zoom: PropTypes.number.isRequired
    };

    return VehicleGeometryWrapper;
  };

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
      {vl && symbols && (
        <ZoomBasedMarkers
          entities={vl}
          symbols={symbols}
          symbolTransform={makeVehicleGeometryWrapper}
          zoom={zoom}
        />
      )}

      {showPattern && (
        <RouteGeometry
          highlight={highlight}
          highlightColor={highlightColor}
          lowlight={lowlight}
          lowlightColor={lowlightColor}
          pattern={pattern}
          selectedVehicle={selectedVehicle}
          zoom={zoom}
        />
      )}
    </FeatureGroup>
  );
}

TransitVehicleOverlay.propTypes = {
  /** providing a name will allow this layer to be registered in the base-map layer switcher */
  name: PropTypes.string,

  /** initial visibility value to determine if the layer is 'on' or off in layer switcher */
  visible: PropTypes.bool,

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

  /**
   * A list of symbol definitions for the vehicles to be rendered,
   * where symbols are custom leaflet marker components with the signature
   * ({vehicle: object, onVehicleClicked: vehicle => {}, children: Element}) => Element.
   */
  symbols: PropTypes.arrayOf(zoomBasedSymbolType),

  // ////// VehicleGeometry types ////////

  /** callback to return vehicle record when a marker is clicked */
  onVehicleClicked: VehicleGeometry.propTypes.onVehicleClicked,

  /** map recenter option (e.g., panTo() or flyTo(), etc...) when tracked vehicle moves */
  onRecenterMap: VehicleGeometry.propTypes.onRecenterMap,

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
  name: "Real-time Buses and Trains",
  visible: true,
  zoom: 13,
  center: null,
  vehicleList: null,
  selectedVehicle: null,
  showOnlyTracked: false,
  symbols: [
    {
      minZoom: 0,
      symbol: Circle
    },
    {
      minZoom: 14,
      symbol: CircledVehicle
    }
  ],

  // VehicleGeometry defaults
  color: VehicleGeometry.defaultProps.color,
  highlightColor: VehicleGeometry.defaultProps.highlightColor,
  onVehicleClicked: VehicleGeometry.defaultProps.onVehicleClicked,
  onRecenterMap: VehicleGeometry.defaultProps.onRecenterMap,
  PopupSlot: VehicleGeometry.defaultProps.PopupSlot,
  TooltipSlot: VehicleGeometry.defaultProps.TooltipSlot,

  // RouteGeometry defaults
  pattern: RouteGeometry.defaultProps.pattern,
  // highlightColor - VehicleGeometry see above
  lowlightColor: RouteGeometry.defaultProps.lowlightColor,
  highlight: RouteGeometry.defaultProps.highlight,
  lowlight: RouteGeometry.defaultProps.lowlight
};
