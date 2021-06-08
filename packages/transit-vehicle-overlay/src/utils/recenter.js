/** various different strategies for moving the map when a tracked vehicle is moved */

import { useState } from "react";
import L from "leaflet";
import { compareCoords } from "./coordinates";

const VIEW_RADIUS = 1000;

/** callback used to fly (zoom) the map to some coordinates (e.g., selected vehicle) */
export function recenterFlyTo(
  boundOptions,
  viewRadius = VIEW_RADIUS,
  doRecenter = true,
  pause = 700
) {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (doRecenter && !compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      const newBounds = L.latLng(lat, lon).toBounds(viewRadius);
      // note: there is a slight pause, so that other fetch then re-paint work can happen
      setTimeout(() => {
        if (map) map.flyToBounds(newBounds, boundOptions);
      }, pause);
    }
  };
  return onRecenterMap;
}

/** callback used to move the map to coordinates -- offsets of UI panes can be specified */
export function recenterPanToOffset(
  panOffsetX = 0,
  panOffsetY = 0,
  doRecenter = true,
  pause = 700
) {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (doRecenter && !compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      // note: there is a slight pause, so that other fetch then re-paint work can happen
      setTimeout(() => {
        if (map) map.panToOffset(newCoord, panOffsetX, panOffsetY);
      }, pause);
    }
  };
  return onRecenterMap;
}

/** callback used to move the map to some coordinates (e.g., selected vehicle) */
export function recenterPanTo(pause = 700) {
  const [coord, setCoord] = useState([0, 0]);

  // function that is being returned and able to be used to zoom to points
  const onRecenterMap = (map, lat, lon) => {
    const newCoord = [lat, lon];
    if (!compareCoords(coord, newCoord)) {
      setCoord(newCoord);
      // note: there is a slight pause, so that other fetch then re-paint work can happen
      setTimeout(() => {
        if (map) map.panTo(newCoord);
      }, pause);
    }
  };
  return onRecenterMap;
}
