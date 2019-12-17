import React from "react";
import { Marker, Popup, FeatureGroup } from "react-leaflet";
import L from "leaflet";

const vehicleData = require("./vehicle-data/all-vehicles.json");

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
