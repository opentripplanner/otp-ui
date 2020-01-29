import React from "react";
import PropTypes from "prop-types";
import { MapLayer, FeatureGroup, withLeaflet } from "react-leaflet";

import { leafletPathType } from "@opentripplanner/core-utils/lib/types";
import { throttle } from 'throttle-debounce';

import VehicleLayer from "./VehicleLayer";
import VehicleGeometry from "./VehicleGeometry";
import * as utils from "./utils";

/**
 * TODO: describe
 * TODO: talk about gtfsdb and opensource
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
      this._startRefreshing();
    }

    // initialize zoom state here? (may trigger render again.)
    const zoom = this.getLeafletContext().map.getZoom();
    this.setMapZoom(zoom);
  }

  componentWillUnmount() {
    this._stopRefreshing();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tracked !== this.props.tracked) {
      // set tracked vehicle via a prop change
      this.setTrackedVehicle2(this.state.vehicleData, this.props.tracked);
    }
  }

  // onOverlayAdded will notifiy this layer whenever this layer gets added to BaseMap
  onOverlayAdded = e => {
    this._startRefreshing();
  };

  // onOverlayRemoved will notify this layer when removed to BaseMap
  onOverlayRemoved = e => {
    this._stopRefreshing();
  };

  // onViewportChanged notified whenever the BaseMap's center or zoom changes
  onViewportChanged = viewport => {
    this.setMapZoom(viewport.zoom);
  };

  createLeafletElement() {}

  updateLeafletElement() {}

  // limit the number of times we'll call this method so we don't overwhelm React with a ton of state updates
  setMapZoom = throttle(500, (zoom) => {
    this.setState({ mapZoom: zoom });
  });

  recenterMap = () => {
    if (this.props.recenterMap && this.state.trackedVehicle) {
      const v = this.state.trackedVehicle;
      const ll = [v.lat, v.lon];
      this.getLeafletContext().map.panTo(ll);
    }
  };

  getLeafletContext = () => { return this.props.leaflet; };

  getTrackedVehicleId = () => {
    let retVal = null;
    const t = this.state.trackedVehicle;
    if (t && t.vehicleId) retVal = t.vehicleId;
    return retVal;
  };

  /** callback function where the tracked geometry stored */
  setTrackedGeomData = (patternId, data) => {
    console.log(patternId);
    this.setState({ trackedGeometry: { id: patternId, data: data } });
  };

  isPatternCached = (patternId) => {
    let retVal = false;
    if (this.state.trackedGeometry && patternId)
      if (patternId === this.state.trackedGeometry.id)
        retVal = true;
    return retVal;
  }

  setVehicleData = (vehicleList, trackedId) => {
    // step 1: set vehicle data
    this.setState({ vehicleData: vehicleList });
    this.setTrackedVehicle2(this.state.vehicleData, trackedId);
  };

  setTrackedVehicle = (vehicle, geomData) => {
    this.setState({ trackedVehicle: vehicle });
    // todo: add geom cache here
    this.setState({ trackedGeometry: geomData });
  };

  setTrackedVehicle2 = (vehicleList, trackedId) => {
    // step 1: tracked vehicle
    const vehicle = utils.findVehicleById(vehicleList, trackedId);
    if (vehicle) {

      // step 2: set tracked vehicle state
      this.setState({ trackedVehicle: vehicle });

      // step 3: recenter map
      this.recenterMap();

      // step 4: cache tracked vehicle geometry
      if (vehicle.shapeId) {
        try {
          const patternId = `${vehicle.agencyId}:${vehicle.shapeId}`;
          if (!this.isPatternCached(patternId)) {
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

  _refreshTimer = null;

  _startRefreshing() {
    if (this._refreshTimer === null) {
      utils.fetchVehicles(this.setVehicleData, this.props.tracked, this.props.vehicleUrl);

      // set up a timer to refresh vehicle data on an interval
      const refreshDelay = utils.checkRefreshInteval(this.props.refreshDelay);

      this._refreshTimer = setInterval(() => {
        utils.fetchVehicles(this.setVehicleData, this.getTrackedVehicleId(), this.props.vehicleUrl);
      }, refreshDelay);
    }
  };

  _stopRefreshing() {
    if(this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = null;
    }
    if(this.state.trackedVehicle !== null) {
      this.setTrackedVehicle(null, null);
    }
  }

  render() {
    return (
      <FeatureGroup>
        <VehicleLayer
          vehicles={this.state.vehicleData}
          trackedVehicle={this.state.trackedVehicle}
          setTracked={this.setTrackedVehicle}
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
  vehicleUrl: "https://maps.trimet.org/gtfs/rt/vehicles/routes/all",
  vehicleRoutes: "all",
  refreshDelay: 5000,
  tracked: null,
  recenterMap: false
};

Vehicles.propTypes = {
  highlight: leafletPathType,
  lowlight: leafletPathType,
  color: PropTypes.string,
  geometryUrl: PropTypes.string,
  vehicleUrl: PropTypes.string,
  vehicleRoutes: PropTypes.string,
  refreshDelay: PropTypes.number,
  tracked: PropTypes.string,
  recenterMap: PropTypes.bool
};

export default withLeaflet(Vehicles);
