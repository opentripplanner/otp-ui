import React from "react";
import { Marker, CircleMarker, Popup, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { action } from "@storybook/addon-actions";
// import { withInfo } from "@storybook/addon-info";

import BaseMap, { defaultMapConfig } from ".";
import SelectVehicles from "../mocks/SelectVehicles";

import "../assets/map.css";

export default {
  title: "Map"
  // decorat r=.addDecorator(withInfo)
};

const mapConfig = {
  ...defaultMapConfig,
  initLat: 33.758189,
  initLon: -84.38361,
  initZoom: 13
};

const center = [mapConfig.initLat, mapConfig.initLon];

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

const samplePopup = (
  <div>
    <h1>Popup Title</h1>
    <p>Sample popup content.</p>
  </div>
);

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

const sampleMarkers = (
  <CircleMarker center={center} radius={100} interactive={false}>
    <Marker position={center} />
  </CircleMarker>
);

const onClick = action("onClick");

export const empty = () => <BaseMap mapConfig={mapConfig} />;

export const withSampleMarkers = () => (
  <BaseMap mapConfig={mapConfig}>{sampleMarkers}</BaseMap>
);

export const withTwoOverlaysFromTrimetTransitComponents = () => (
  <div>
    <div>Click the layers button to toggle layers.</div>
    <BaseMap mapConfig={mapConfig}>
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
    </BaseMap>
  </div>
);

export const withOverlaysOverlappingOtherMarkers = () => (
  <div>
    <div>
      You should be able to see the tooltip and interact with the dots inside
      the blue circle.
    </div>
    <BaseMap mapConfig={mapConfig}>
      <AllVehiclesOverlay name="Simple vehicle layer" />
      <SelectVehicles name="Fancier vehicle layer" visible />
      {sampleMarkers}
    </BaseMap>
  </div>
);

export const customLocationPopupContent = () => (
  <BaseMap
    mapConfig={mapConfig}
    popupLocation={center}
    popupContent={samplePopup}
  />
);

export const onClickEvent = () => (
  <BaseMap mapConfig={mapConfig} onClick={onClick}></BaseMap>
);
