import { useState } from "react";
import L from "leaflet";
import { compareCoords } from "./coordinates";

const VIEW_RADIUS = 1000;

/** callback used to fly (zoom) the map to some coordinates (e.g., selected vehicle) */
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

/** callback used to move the map to coordinates -- offsets of UI panes can be specified */
export function recenterPanToOffset(panOffsetX=0, panOffsetY=0) {
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

/** callback used to move the map to some coordinates (e.g., selected vehicle) */
export function recenterPanTo() {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (!compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      if (map) map.panTo(newCoord);
    }
  };
  return onRecenterMap;
}
