/**
 * various different strategies for moving the map when a tracked vehicle is moved
 * note, the 'offset' routine is for when you have something like a left nav hovering over your map,
 * and so the center of the map you like to use is offset from said left nav (e.g., true center
 * of the would be look skewed to the floating nav)
 *
 * About the 'doRecenter' parameter.  This boolean, when false, will not execute the map.panTo of
 * the tracked vehicle's coordinates.  Tracking a vehicle involves highlighting the vehicle on the
 * map, showing the pattern geometry of the vehicle and current progress along that pattern , and
 * optionally pan/zooms the map to that tracked vehicle.
 *
 * The 'doRecenter' param can be used to switch control the map.panTo on/off.  Once the
 * TransitVehicleOverlay component is mounted, the onRecenterMap (PropType.func) needs to be locked
 * in place, else Leaflet (or ReactLeaflet) throws a bunch of errors. So the doRecenter param to
 * this onRecenterMap function will control whether to map.panTo() or not call map.panTo().
 */
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
