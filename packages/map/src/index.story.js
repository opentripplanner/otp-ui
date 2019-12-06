import React from "react";
import { Marker, Popup, FeatureGroup } from "react-leaflet";
import L from "leaflet";

import BaseMap, { defaultMapConfig } from ".";
import SelectVehicles from "../mocks/SelectVehicles";

import "../assets/map.css";

export default { title: "Map" };

const mapConfig = {
  ...defaultMapConfig,
  initLat: 33.758189,
  initLon: -84.38361,
  initZoom: 13,
  showBeacon: false
};

const vehicleData = [
  {
    vehicleID: 1742,
    routeNumber: "40",
    latitude: 33.755558,
    longitude: -84.393716
  },
  {
    vehicleID: 7024,
    routeNumber: "03",
    latitude: 33.754399,
    longitude: -84.37547
  }
];

const AllVehiclesOverlay = () => {
  // Render is according to this file:
  // https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/AllVehicles.js
  return (
    <FeatureGroup className="vehicles">
      {vehicleData.map(vehicle => {
        const key = vehicle.vehicleID;
        const position = [vehicle.latitude, vehicle.longitude];

        return (
          <Marker
            class="marker"
            icon={L.divIcon({
              html: `<span>${vehicle.routeNumber}</span>`
            })}
            key={key}
            position={position}
          >
            <Popup>
              <span>VEH: {key}</span>
            </Popup>
          </Marker>
        );
      })}
    </FeatureGroup>
  );
};

export const noBeacon = () => <BaseMap mapConfig={mapConfig} />;
export const withBeacon = () => (
  <BaseMap mapConfig={{ ...mapConfig, showBeacon: true }} />
);
export const RTVehiclesDemo = () => (
  <BaseMap mapConfig={mapConfig}>
    <AllVehiclesOverlay name="Simple vehicle layer" />
    <SelectVehicles name="Fancier vehicle layer" visible />
  </BaseMap>
);
export const RTVehiclesDemoWithBeacon = () => (
  <BaseMap mapConfig={{ ...mapConfig, showBeacon: true }}>
    <AllVehiclesOverlay name="Simple vehicle layer" />
    <SelectVehicles name="Fancier vehicle layer" visible />
  </BaseMap>
);
