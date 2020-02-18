import React from "react";
import PropTypes from "prop-types";
import { MapLayer, FeatureGroup, withLeaflet } from "react-leaflet";

import { leafletPathType } from "@opentripplanner/core-utils/src/types";
import callIfValid from "@opentripplanner/base-map/src/util";
import { throttle } from "throttle-debounce";

import VehicleLayer from "./VehicleLayer";
import VehicleGeometry from "./VehicleGeometry";
import * as utils from "./utils";

/**
 * Vehicles is the main component to fetch and display realtime transit vehicles on a map.  It is
 * this component that makes all the calls to various data services, and the sends that data as
 * props to be rendered by the sub-components of the vehicles package.
 *
 * NOTE: The backend calls for the vehicle and pattern geometries are based on GTFS and GTFS-RT
 * data, via the use of the OSS http://gtfsdb.com and associated services (e.g., implementations
 * are not limited to any proprietary service)
 */
class Vehicles extends MapLayer {
  state = {
    mapZoom: 0,
    vehicleData: null,
    trackedVehicle: null,
    trackedGeometry: null
  };

  // class variables
  fetchVehicleInterval = null;

  componentDidMount() {
    // register this layer with base-map, so it will call the onOverlayX and onViewportZ methods
    const { registerOverlay } = this.props;
    callIfValid(registerOverlay)(this);

    if (this.props.visible) {
      this.startFetchingVehicles();
    }

    // initialize zoom state here? (may trigger render again.)
    const zoom = this.getLeafletContext().map.getZoom();
    this.setMapZoom(zoom);
  }

  componentWillUnmount() {
    this.stopFetchingVehicles();
  }

  componentDidUpdate(prevProps) {
    // get new vehicles if the query param is updated
    if (prevProps.vehicleQuery !== this.props.vehicleQuery) {
      // also make sure to check / change the tracker
      let tracked = this.getTrackedVehicleId();
      if (prevProps.tracked !== this.props.tracked)
        tracked = this.props.tracked;
      utils.fetchVehicles(
        this.setVehicleData,
        tracked,
        this.props.vehicleUrl,
        this.props.vehicleQuery
      );
    }

    // update the tracked vehicle when the tracker is changed
    if (prevProps.tracked !== this.props.tracked) {
      this.setTrackedVehicle(this.props.tracked, true);
    }
  }

  /** BaseMap: onOverlayAdded will notify this layer whenever this layer gets added to BaseMap */
  onOverlayAdded = () => {
    this.startFetchingVehicles();
  };

  /** BaseMap: onOverlayRemoved will notify this layer when removed to BaseMap */
  onOverlayRemoved = () => {
    this.stopFetchingVehicles();
  };

  /** BaseMap: onViewportChanged notified whenever the BaseMap's center or zoom changes */
  onViewportChanged = viewport => {
    this.setMapZoom(viewport.zoom);
  };

  /** needed: extending ReactLeaflet's MapLayer */
  createLeafletElement() {}

  /** needed: extending MapLayer */
  updateLeafletElement() {}

  /**
   * set zoom, used for changing icons ..
   * note: limit (throttle) so we don't overwhelm React with tons of state changes zoomming in
   */
  setMapZoom = throttle(500, zoom => {
    this.setState({ mapZoom: zoom });
  });

  /** pan the map to the tracked vehicle's coordinates */
  recenterMap = () => {
    if (this.props.recenterMap && this.state.trackedVehicle) {
      const v = this.state.trackedVehicle;
      const ll = [v.lat, v.lon];
      const map = this.getLeafletContext().map;
      const { panOffsetX, panOffsetY } = this.props;
      map.panToOffset(ll, panOffsetX, panOffsetY);
    }
  };

  /** return leaflet handle, ala so we can make calls to Leaflet, ala map.panTo(), etc... */
  getLeafletContext = () => {
    return this.props.leaflet;
  };

  /** return the vehicle id of the vehicle being tracked */
  getTrackedVehicleId = () => {
    let retVal = null;
    const t = this.state.trackedVehicle;
    if (t) {
      if (t.blockId) retVal = t.blockId;
      else if (t.tripId) retVal = t.tripId;
      else retVal = t.vehicleId;
    }
    return retVal;
  };

  /** callback for the vehicle fetch utility to send the list of vehicles to */
  setVehicleData = (vehicleList, trackedId) => {
    // step 1: set/update the vehicle list state
    this.setState({ vehicleData: vehicleList });

    // step 2: share the vehicle list with a registered callback
    const { onVehicleListUpdate } = this.props;
    if (onVehicleListUpdate && typeof onVehicleListUpdate === "function") {
      onVehicleListUpdate(vehicleList);
    }

    // step 3: update the tracked vehicle
    this.setTrackedVehicle(trackedId, true);
  };

  /** callback for tracking a vehicle */
  setTrackedVehicle = (trackedId, clearFirst) => {
    // step 1: optionally clear the tracker state
    if (clearFirst) this.setState({ trackedVehicle: null });

    // step 2: find the tracked vehicle record via an id (trip or vehicle id)
    const vehicle = utils.findVehicleById(this.state.vehicleData, trackedId);
    if (vehicle) {
      // step 3: set tracked vehicle state
      this.setState({ trackedVehicle: vehicle });

      // step 4: share tracked vehicle record with a registered callback
      const { onTrackedVehicleUpdate } = this.props;
      if (
        onTrackedVehicleUpdate &&
        typeof onTrackedVehicleUpdate === "function"
      ) {
        onTrackedVehicleUpdate(vehicle);
      }

      // step 5: recenter map
      this.recenterMap();

      // step 6: find the line geometry for the tracked vehicle
      if (vehicle.shapeId) {
        try {
          const patternId = `${vehicle.agencyId}:${vehicle.shapeId}`;
          if (!this.isPatternCached(patternId)) {
            // step 7: need to fetch the line (route pattern / shape) geometry
            // console.log(">>>>>>>>>>>>>>>>>>" + patternId);
            utils.fetchVehiclePattern(
              this.setTrackedGeomData,
              patternId,
              this.props.geometryUrl
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  /** callback function where the tracked geometry stored */
  setTrackedGeomData = (patternId, data) => {
    // note to self: 'data' looks strange below ... it's the linter / object short hand
    this.setState({ trackedGeometry: { id: patternId, data } });
  };

  /**
   * if the needed geometry is available from a previous fetch, use that
   * TODO: add a caching mechanism ... current cache
   */
  isPatternCached = patternId => {
    let retVal = false;
    if (this.state.trackedGeometry && patternId)
      if (patternId === this.state.trackedGeometry.id) retVal = true;
    return retVal;
  };

  /** create an interval that will periodically query vehicle position data */
  startFetchingVehicles() {
    if (this.fetchVehicleInterval === null) {
      utils.fetchVehicles(
        this.setVehicleData,
        this.props.tracked,
        this.props.vehicleUrl,
        this.props.vehicleQuery
      );

      // set up a timer to refresh vehicle data on an interval
      const refreshDelay = utils.checkRefreshInteval(this.props.refreshDelay);

      this.fetchVehicleInterval = setInterval(() => {
        utils.fetchVehicles(
          this.setVehicleData,
          this.getTrackedVehicleId(),
          this.props.vehicleUrl,
          this.props.vehicleQuery
        );
      }, refreshDelay);
    }
  }

  /** stop / clear the interval created above, and clear other state elements related to the vehicles */
  stopFetchingVehicles() {
    if (this.fetchVehicleInterval) {
      clearInterval(this.fetchVehicleInterval);
      this.fetchVehicleInterval = null;
    }

    this.setTrackedVehicle(null, true);
  }

  render() {
    return (
      <FeatureGroup>
        <VehicleLayer
          vehicles={this.state.vehicleData}
          trackedVehicle={this.state.trackedVehicle}
          setTracked={this.setTrackedVehicle}
          hasTooltip={this.props.hasTooltip}
          hasPopup={this.props.hasPopup}
          color={this.props.color}
          highlightColor={this.props.highlightColor}
        />
        <VehicleGeometry
          trackedVehicle={this.state.trackedVehicle}
          pattern={this.state.trackedGeometry}
          highlightColor={this.props.highlightColor}
          lowlightColor={this.props.lowlightColor}
          highlight={this.props.highlight}
          lowlight={this.props.lowlight}
        />
      </FeatureGroup>
    );
  }
}

Vehicles.defaultProps = {
  onTrackedVehicleUpdate: null,
  onVehicleListUpdate: null,

  highlight: VehicleGeometry.defaultProps.highlight,
  lowlight: VehicleGeometry.defaultProps.lowlight,

  color: null,
  highlightColor: null,
  lowlightColor: null,

  vehicleQuery: "routes/all",
  refreshDelay: 5000,

  tracked: null,
  recenterMap: false,
  panOffsetX: 0,
  panOffsetY: 0,

  hasTooltip: true,
  hasPopup: true
};

Vehicles.propTypes = {
  geometryUrl: PropTypes.string.isRequired,
  vehicleUrl: PropTypes.string.isRequired,

  onTrackedVehicleUpdate: PropTypes.func,
  onVehicleListUpdate: PropTypes.func,

  highlight: leafletPathType,
  lowlight: leafletPathType,
  color: PropTypes.string,
  highlightColor: PropTypes.string,
  vehicleQuery: PropTypes.string,
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string,
  recenterMap: PropTypes.bool,
  panOffsetX: PropTypes.number,
  panOffsetY: PropTypes.number,
  hasTooltip: PropTypes.bool,
  hasPopup: PropTypes.bool
};

export default withLeaflet(Vehicles);
