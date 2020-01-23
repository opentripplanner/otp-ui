import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

import callIfValid from "../src/util";

import VehicleMarker from "./VehicleMarker";

const vehicleData = require("./vehicle-data/all-trimet.json"); // https://maps.trimet.org/gtfs/rt/vehicles/routes/all

/**
 * This component demonstrates an example map overlay that shows real-time transit vehicle locations on a leaflet map.
 * It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/SelectVehicles.js
 */
class SelectVehicles extends MapLayer {
  state = {
    selectedRoutes: [],
    selectedStop: null,
    routeData: [], // TBD Array of <RouteData > components, which comprise route and stop geo data
    mapZoom: 0,
    trackedVehicle: vehicleData[0],
    vehicles: vehicleData
  };

  // these zoom layers control which markers are shown (e.g. closeZoom is where icons are turned on)
  closeZoom = 15;

  midZoom = 13;

  farZoom = 10;

  /**
   * Implement method onOverlayAdded to get notified whenever this layer
   * gets added to BaseMap (e.g. when user clicks the map's layer control).
   * This method is optional.
   * @param e The event data. See https://leafletjs.com/reference-1.6.0.html#map-overlayadd for details.
   */
  onOverlayAdded = e => {
    callIfValid(this.props.onOverlayAdded)(e);
  };

  /**
   * Implement method onOverlayRemoved to get notified whenever this layer
   * gets removed from BaseMap (e.g. when user clicks the map's layer control).
   * This method is optional.
   * @param e The event data. See https://leafletjs.com/reference-1.6.0.html#map-overlayremove for details.
   */
  onOverlayRemoved = e => {
    callIfValid(this.props.onOverlayRemoved)(e);
  };

  /**
   * Implement method onViewportChanged to get notified whenever the BaseMap's center
   * or zoom level change (e.g. as the result of the user panning or zooming the map).
   * This method is optional.
   * @param viewport The viewport data. See https://github.com/PaulLeCam/react-leaflet/blob/master/example/components/viewport.js for details.
   */
  onViewportChanged = viewport => {
    this.setState({ mapZoom: viewport.zoom });
    callIfValid(this.props.onViewportChanged)(viewport);
  };

  componentDidMount() {
    console.log("SelectedVehicles::componentDidMount");
    const { registerOverlay } = this.props;
    callIfValid(registerOverlay)(this);

    // Initialize zoom state here? (may trigger render again.)
    const zoom = this.getLeafletContext().map.getZoom();
    this.setState({ mapZoom: zoom });
  }

  componentWillUnmount() {}

  componentDidUpdate() {
    // this.trackVehicle();
  }

  componentWillReceiveProps(/* nextProps */) {}

  /**
   * this method is used for backporting to React 15
   * v16:  return this.props.leaflet;
   * v15:  return this.context;
   */
  getLeafletContext() {
    return this.props.leaflet;
  }

  trackVehicle() {
    if (
      this.state.trackedVehicle != null &&
      this.state.trackedVehicle.id != null
    ) {
      const v = this.findVehicle(this.state.trackedVehicle.id);
      if (v != null) {
        const ll = [v.lat, v.lon];
        this.getLeafletContext().map.setView(ll);
        this.setState({ trackedVehicle: v }); // update the state with newest vehicle
      }
    }
  }

  isTrackingVehicle(vehicle) {
    return (
      this.state.trackedVehicle && this.state.trackedVehicle.id === vehicle.id
    );
  }

  findVehicle(id) {
    return this.state.vehicles.find(v => v.id === id);
  }

  // need to implement create interface (and update interface for older React-Leaflet versions)
  createLeafletElement(/* props */) {}

  updateLeafletElement(/* props */) {}

  render() {
    const { limit = 5 } = this.props;
    const { mapZoom } = this.state;
    let { vehicles } = this.state;
    vehicles = vehicles.slice(0, Math.min(limit, vehicles.length) - 1);
    return (
      <FeatureGroup id="vehicles fg">
        {mapZoom <= this.closeZoom &&
          mapZoom >= this.farZoom &&
          vehicles &&
          vehicles.map(v => (
            <VehicleMarker
              key={v.id}
              vehicle={v}
              controller={this}
              closeZoom={this.closeZoom}
              midZoom={this.midZoom}
              farZoom={this.farZoom}
            />
          ))}
      </FeatureGroup>
    );
  }
}

export default withLeaflet(SelectVehicles);
