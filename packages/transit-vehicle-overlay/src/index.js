import React, { Component } from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import {
  transitVehicleType,
  zoomBasedSymbolType
} from "@opentripplanner/core-utils/lib/types";

import ZoomBasedMarkers from "@opentripplanner/zoom-based-markers";
import VehicleGeometry from "./components/VehicleGeometry";
import RouteGeometry from "./components/RouteGeometry";
import * as utils from "./utils";

/**
 * presentational component for rendering transit vehicle positions atop a map
 * will show both point positions for a collection of vehicles, as well as being
 * able to render a 'selected' vehicle (and it's route pattern trace)
 */
export default class TransitVehicleOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = { symbols: this.wrapSymbols(props) };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateSymbols(this.wrapSymbols(this.props));
    }
  }

  /**
   * This helper method wraps symbols originally defined in the symbols prop
   * with a VehicleGeometryWrapper component that handles the leaflet plumbing,
   * and stores the result in this component's state.
   */
  wrapSymbols = props => {
    const {
      selectedVehicle,
      symbols,

      // VehicleGeometry
      onVehicleClicked,
      onRecenterMap,
      MarkerSlot: slot, // will be eventually replaced with symbols.
      PopupSlot,
      TooltipSlot,
      color,
      highlightColor
    } = props;

    /*
     * Function to wrap leaflet plumbing around the provided MarkerSlot.
     */
    const makeVehicleGeometryWrapper = MarkerSlot => {
      /**
       * This component is a wrapper around VehicleGeometry
       * to provide leaflet plumbing to components defined in the symbols prop.
       * It passes props from TransitVehicleOverlay VehicleGeometry and
       * has the signature required by ZoomBasedMarker.
       */
      const VehicleGeometryWrapper = ({ entity: v, zoom: z }) => (
        <VehicleGeometry
          zoom={z}
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
      );

      VehicleGeometryWrapper.propTypes = {
        entity: transitVehicleType.isRequired,
        zoom: PropTypes.number.isRequired
      };

      return VehicleGeometryWrapper;
    };

    // Insert VehicleGeometryWrapper around each raw symbol defined in symbols.
    // If no symbols are defined, use the slot for compatibility.
    // TODO: remove compatibility.

    const effectiveSymbols = symbols || [
      {
        minZoom: 0,
        symbol: slot
      }
    ];
    const newSymbols = effectiveSymbols.map(s => {
      // Make a new version of symbolByMode that has the original symbols
      // from s.symbolsByMode wrapper in a VehicleGeometryWrapper.
      let symbolByMode;
      if (s.symbolByMode) {
        Object.keys(s.symbolByMode).forEach(key => {
          const originalSymbol = s.symbolByMode[key];
          if (originalSymbol) {
            if (!symbolByMode) {
              symbolByMode = {};
            }
            symbolByMode[key] = makeVehicleGeometryWrapper(originalSymbol);
          }
        });
      }

      return {
        getMode: s.getMode,
        minZoom: s.minZoom,
        symbol: makeVehicleGeometryWrapper(s.symbol),
        symbolByMode
      };
    });

    return newSymbols;
  };

  updateSymbols = symbols => {
    this.setState({ symbols });
  };

  render() {
    const {
      name,
      visible,
      zoom,
      center,
      vehicleList,
      selectedVehicle,
      showOnlyTracked,

      // VehicleGeometry
      highlightColor,

      // RouteGeometry
      pattern,
      lowlightColor, // note: highlightColor above
      highlight,
      lowlight
    } = this.props;
    const { symbols } = this.state;

    utils.linterIgnoreTheseProps(name, visible, center);

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
          <ZoomBasedMarkers entities={vl} symbols={symbols} zoom={zoom} />
        )}

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
}

// The wrapSymbols(props) function defined in the component above
// extracts some of the the props below from its argument,
// so if you remove the eslint waiver below, you will see those props flagged while used.
/* eslint-disable react/no-unused-prop-types */

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

  /** A list of symbol definitions for the vehicles to be rendered. */
  symbols: PropTypes.arrayOf(zoomBasedSymbolType),

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
  name: "Real-time Buses and Trains",
  visible: true,
  zoom: 13,
  center: null,
  vehicleList: null,
  selectedVehicle: null,
  showOnlyTracked: false,
  symbols: null,

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
