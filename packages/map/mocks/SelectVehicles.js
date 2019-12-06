import "leaflet";
import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

import VehicleMarker from "./VehicleMarker";

const vehicleData = [
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433108", "stopSequence": 31, "stopId": "10121", "id": "523+537", "routeShortName": "MAX Blue", "vehicleId": "523+537", "routeColor": null, "lon": -84.399852, "routeId": "100", "status": "IN_TRANSIT_TO", "blockId": "9024", "agencyId": "TRIMET", "seconds": 7, "serviceId": "A.556", "directionId": "1", "lat": 33.749081, "tripId": "9530557", "routeLongName": "Blue to Hillsboro", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 234.0},
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433090", "stopSequence": 1, "stopId": "9848", "id": "210+318", "routeShortName": "MAX Blue", "vehicleId": "210+318", "routeColor": null, "lon": -84.391074, "routeId": "100", "status": "STOPPED_AT", "blockId": "9025", "agencyId": "TRIMET", "seconds": 26, "serviceId": "A.556", "directionId": "0", "lat": 33.752137, "tripId": "9529799", "routeLongName": "Blue to Gresham", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 180.0},
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433108", "stopSequence": 16, "stopId": "8373", "id": "241+307", "routeShortName": "MAX Blue", "vehicleId": "241+307", "routeColor": null, "lon": -84.308856, "routeId": "100", "status": "IN_TRANSIT_TO", "blockId": "9026", "agencyId": "TRIMET", "seconds": 21, "serviceId": "A.556", "directionId": "1", "lat": 33.757645, "tripId": "9530561", "routeLongName": "Blue to Hillsboro", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 278.0},
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433108", "stopSequence": 2, "stopId": "8360", "id": "238+303", "routeShortName": "MAX Blue", "vehicleId": "238+303", "routeColor": null, "lon": -84.126933, "routeId": "100", "status": "STOPPED_AT", "blockId": "9027", "agencyId": "TRIMET", "seconds": 14, "serviceId": "A.556", "directionId": "1", "lat": 33.732605, "tripId": "9530564", "routeLongName": "Blue to Hillsboro", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 285.0},
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433113", "stopSequence": 18, "stopId": "10117", "id": "243+251", "routeShortName": "MAX Blue", "vehicleId": "243+251", "routeColor": null, "lon": -84.391895, "routeId": "100", "status": "IN_TRANSIT_TO", "blockId": "9028", "agencyId": "TRIMET", "seconds": 38, "serviceId": "A.556", "directionId": "1", "lat": 33.749573, "tripId": "9530558", "routeLongName": "Blue to SW 170th", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 204.0},
  // eslint-disable-next-line prettier/prettier
  {"shapeId": "433090", "stopSequence": 44, "stopId": "13450", "id": "117+244", "routeShortName": "MAX Blue", "vehicleId": "117+244", "routeColor": null, "lon": -84.141048, "routeId": "100", "status": "STOPPED_AT", "blockId": "9030", "agencyId": "TRIMET", "seconds": 8, "serviceId": "A.556", "directionId": "0", "lat": 33.737893, "tripId": "9529787", "routeLongName": "Blue to Gresham", "routeType": "TRAM", "reportDate": "12/06/19 8:40 AM", "routeTextColor": null, "heading": 120.0},
];

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

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidUpdate() {
    this.trackVehicle();
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
        this.state.trackedVehicle = v; // update the state with newest vehicle
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
    const { vehicles } = this.state;

    return (
      <FeatureGroup id="vehicles fg">
        {vehicles &&
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
