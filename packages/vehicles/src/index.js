import React from "react";
import PropTypes from "prop-types";
import { MapLayer, FeatureGroup, withLeaflet } from "react-leaflet";

import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
import { throttle } from "throttle-debounce";

import VehicleLayer from "./VehicleLayer";
import VehicleGeometry from "./VehicleGeometry";
import * as utils from "./utils";

/**
 * Vehicles is the main component to fetch and display realtime transit vehicles on a map.  It is this
 * component that makes all the calls to various data services, and the sends that data as props to be
 * rendered by the sub-components of the vehicles package.
 *
 * NOTE: The backend calls for the vehicle and pattern geometries is based on GTFS and GTFS-RT data,
 * via the use of http://gtfsdb.com and associated services (e.g., implementations are not limited to
 * just TriMet / proprietary services)
 */
class Vehicles extends MapLayer {
  state = {
    mapZoom: 0,
    vehicleData: null,
    trackedVehicle: null,
    trackedGeometry: null
  };

  componentDidMount() {
    // register this layer with base-map, so it will call the onOverlayX and onViewportZ methods
    const { registerOverlay } = this.props;
    utils.callIfValid(registerOverlay)(this);

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
    // set tracked vehicle via a prop change
    if (prevProps.tracked !== this.props.tracked) {
      this.setTrackedVehicle(this.props.tracked);
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
      this.getLeafletContext().map.panTo(ll);
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
    if (t && t.vehicleId) retVal = t.vehicleId;
    return retVal;
  };

  /** callback for the vehicle fetch utility to send the list of vehicles to */
  setVehicleData = (vehicleList, trackedId) => {
    this.setState({ vehicleData: vehicleList });
    this.setTrackedVehicle(trackedId, true);
  };

  setTrackedVehicle = (trackedId, clearFirst) => {
    // step 0: clear out the old tracked vehicle
    if (clearFirst) this.setState({ trackedVehicle: null });

    // step 1: find the tracked vehicle record via an id (trip or vehicle id)
    const vehicle = utils.findVehicleById(this.state.vehicleData, trackedId);
    if (vehicle) {
      // step 2: set tracked vehicle state
      this.setState({ trackedVehicle: vehicle });

      // step 3: recenter map
      this.recenterMap();

      // step 4: find the line geometry for the tracked vehicle
      if (vehicle.shapeId) {
        try {
          const patternId = `${vehicle.agencyId}:${vehicle.shapeId}`;
          if (!this.isPatternCached(patternId)) {
            // step 5: need to fetch the line (route pattern / shape) geometry
            console.log(">>>>>>>>>>>>>>>>>>");
            console.log(patternId);
            utils.fetchVehiclePattern(
              this.setTrackedGeomData,
              patternId,
              this.props.geometryUrl
            );
          }
        } catch (e) {
          console.log(e);
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

  fetchVehicleInterval = null;

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
        />
        <VehicleGeometry
          trackedVehicle={this.state.trackedVehicle}
          pattern={this.state.trackedGeometry}
          color={this.props.color}
          highlight={this.props.highlight}
          lowlight={this.props.lowlight}
        />
      </FeatureGroup>
    );
  }
}

Vehicles.defaultProps = {
  highlight: VehicleGeometry.defaultProps.highlight,
  lowlight: VehicleGeometry.defaultProps.lowlight,
  color: null,

  geometryUrl: "https://newplanner.trimet.org/ws/ti/v0/index",
  vehicleUrl: "https://maps.trimet.org/gtfs/rt/vehicles/",
  vehicleQuery: "routes/all",
  refreshDelay: 5000,

  tracked: null,
  recenterMap: false,
  hasTooltip: true,
  hasPopup: true
};

Vehicles.propTypes = {
  highlight: leafletPathType,
  lowlight: leafletPathType,
  color: PropTypes.string,
  geometryUrl: PropTypes.string,
  vehicleUrl: PropTypes.string,
  vehicleQuery: PropTypes.string,
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string,
  recenterMap: PropTypes.bool,
  hasTooltip: PropTypes.bool,
  hasPopup: PropTypes.bool
};

export default withLeaflet(Vehicles);
