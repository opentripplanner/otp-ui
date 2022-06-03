import React from "react";
import { Marker, Popup } from "react-map-gl";
import { LeafletStyleMarker } from "../src/styled";

const vehicleData = require("./vehicle-data/all-trimet.json");

/**
 * This component demonstrates a example map overlay that shows real-time transit vehicle locations on a leaflet map.
 * It is modeled after the component available in this file:
 * https://github.com/OpenTransitTools/transit-components/blob/master/lib/vehicles/AllVehicles.js
 */
const AllVehiclesOverlay = () => {
  const [showPopup, setShowPopup] = React.useState({
    key: null,
    latitude: null,
    longitude: null
  });

  return (
    <>
      {vehicleData.map(vehicle => {
        const { id: key, lat: latitude, lon: longitude } = vehicle;

        return (
          <Marker
            class="marker"
            key={key}
            latitude={latitude}
            longitude={longitude}
            onClick={() => setShowPopup({ key, longitude, latitude })}
          >
            <LeafletStyleMarker color="#333333" stroke={3} />
          </Marker>
        );
      })}
      {showPopup.key && (
        <Popup
          longitude={showPopup.longitude}
          latitude={showPopup.latitude}
          anchor="bottom"
          onClose={() => setShowPopup(false)}
        >
          <span>VEH: {showPopup.key}</span>
        </Popup>
      )}
    </>
  );
};

export default AllVehiclesOverlay;
