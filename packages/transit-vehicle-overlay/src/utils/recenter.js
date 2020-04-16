import { useState } from "react";
import L from "leaflet";
import { compareCoords } from "./coordinates";

const VIEW_RADIUS = 1000;

/**
 * callback used to move the map to some coordinates (e.g., selected vehicle)
 * NOTE: the call needs to happen w/in a component under Leaflet context (ala useLeaflet hook)
 */
export function recenterFlyTo(boundOptions, viewRadius = VIEW_RADIUS) {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (!compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      const newBounds = L.latLng(lat, lon).toBounds(viewRadius);
      if (map) map.flyToBounds(newBounds, boundOptions);
    }
  };
  return onRecenterMap;
}

/**
 * callback used to move the map to some coordinates (e.g., selected vehicle)
 * NOTE: the call needs to happen w/in a component under Leaflet context (ala useLeaflet hook)
 */
export function recenterPanTo(panOffsetX = 0, panOffsetY = 0) {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (!compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      if (map) map.panToOffset(newCoord, panOffsetX, panOffsetY);
    }
  };
  return onRecenterMap;
}
