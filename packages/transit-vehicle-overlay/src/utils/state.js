import { useState } from "react";

/**
 * use this hook when you want your layer to update after otp-ui' base-map zoom events fire
 * this component will capture and save zoom events from otp-ui's base-map component to state
 * :return: zoom level (number from leaflet) and the callback for base-map's onViewportChanged
 */
export function zoomState(initialZoom = 13) {
  const [mapZoom, setMapZoom] = useState(initialZoom);

  const onViewportChanged = ({ zoom }) => {
    // console.info(`zoom level ${zoom}`);
    setMapZoom(zoom);
  };

  return [mapZoom, onViewportChanged];
}

/**
 * use this hook when you want your layer to ...
 * :return:
 */
export function trackedVehicleState(
  fetchPatternCallback = null,
  initVehicle = null,
  initPattern = null
) {
  const [trackedVehicle, setTrackedVehicle] = useState(initVehicle);
  const [routePattern, setRoutePattern] = useState(initPattern);

  const trackVehicleCallback = (vehicle, isTracking) => {
    if (isTracking) {
      setTrackedVehicle(null);
      setRoutePattern(null);
    } else if (vehicle) {
      setTrackedVehicle(vehicle);
      if (fetchPatternCallback) {
        const pattern = fetchPatternCallback(vehicle);
        if (pattern) {
          setRoutePattern(pattern);
        }
      }
    }
  };

  return [trackedVehicle, routePattern, trackVehicleCallback];
}
