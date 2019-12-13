import React from "react";
import { Marker, Popup, FeatureGroup } from "react-leaflet";
import L from "leaflet";

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

export default AllVehiclesOverlay;
