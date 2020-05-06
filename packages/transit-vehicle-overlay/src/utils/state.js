import { useState, useRef, useEffect, useCallback } from "react";
import { checkRefreshInteval } from "./fetch";
import * as data from "./data";

/**
 * Use the state variable returned by this hook when you want the vehicle component to
 * re-paint after otp-ui map zoom events.
 *
 * e.g., send the mapZoom down to the vehicles component as a prop, and the component will
 * then redraw every time the map's zoom level changes.
 *
 * @return zoom level (state variable) and the onViewportChanged cb for base-map
 */
export function useZoomState(initialZoom = 14) {
  const [mapZoom, setMapZoom] = useState(initialZoom);

  const onViewportChanged = ({ zoom }) => {
    // console.info(`zoom level ${zoom}`);
    setMapZoom(zoom);
  };

  return [mapZoom, onViewportChanged];
}

/**
 * Use the state variables returned by this hook when you want the vehicle component to
 * re-paint after otp-ui map and pan zoom events.
 *
 * e.g., you can send mapZoom and mapCenter down to the vehicles component as props, which
 * will then make React redraw the vehicles component
 *
 * @return zoom level, center [x,y] (state variables) and the onViewportChanged cb for base-map
 */
export function useViewState(initialZoom = 14) {
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [mapCenter, setMapCenter] = useState([0.0, 0.0]);

  const onViewportChanged = ({ zoom, center }) => {
    // console.info(`zoom level ${zoom}`);
    setMapZoom(zoom);
    setMapCenter(center);
  };

  return [mapZoom, mapCenter, onViewportChanged];
}

/**
 * useTrackedVehicleState
 *
 * use this hook when you want your layer to track a vehicle
 * (and potentially show the route geometry of this vehicle)
 *
 * NOTE: about the useState, useRef, useEffect, etc... mumbo jumbo
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/#refs-to-the-rescue
 *
 * @param fetchPatternCallback -  used to fetch a vehicles' pattern geom
 * @param initVehicle
 * @param initPattern
 * @return [getRoutePattern(), getTrackedVehicle(), updateTrackedVehicle()]
 */
export function useTrackedVehicleState(
  fetchPatternCallback = null,
  initVehicle = null,
  initPattern = null
) {
  const [trackedVehicle, setTrackedVehicle] = useState(initVehicle);
  const [routePattern, setRoutePattern] = useState(initPattern);
  const trackedVehicleRef = useRef(trackedVehicle);
  const routePatternRef = useRef(routePattern);

  // a ref + useEffect give a handle on the current trackedVehicle state in util functions, etc...
  useEffect(() => {
    trackedVehicleRef.current = trackedVehicle;
  }, [trackedVehicle]);

  useEffect(() => {
    routePatternRef.current = routePattern;
  }, [routePattern]);

  const getRoutePattern = vehicle => {
    if (fetchPatternCallback && vehicle) {
      const patternId = routePatternRef.current
        ? routePatternRef.current.id
        : null;
      const cached = vehicle.tripId === patternId;
      if (!cached) fetchPatternCallback(vehicle, setRoutePattern);
    }

    return routePatternRef.current;
  };

  /**
   * accept a vehicle record and two booleans to control how state is updated
   *
   * @param vehicle - tracked vehicle record
   * @param stopTracking - boolean (e.g., 'stop tracking' - if this vehicle is tracking, then stop)
   * @param updatePattern - boolean (default true)
   */
  const updateTrackedVehicle = (
    vehicle,
    stopTracking,
    updatePattern = true
  ) => {
    if (stopTracking) {
      setTrackedVehicle(null);
      setRoutePattern(null);
    } else if (vehicle) {
      setTrackedVehicle(vehicle);
      if (updatePattern) getRoutePattern(vehicle);
    }
  };

  /**
   * return both the tracked vehicle state variable (using will cause a redraw)
   * and the ref to that vehicle.
   *
   * Note: the ref is a handle to the most recent state of the tracked vehicle, which can be used
   * by routines outside of the react tree (don't ask me ... it's strange, hacky stuff).
   */
  const getTrackedVehicle = () => {
    return [trackedVehicle, trackedVehicleRef.current];
  };

  return [getRoutePattern, getTrackedVehicle, updateTrackedVehicle];
}

/**
 * useVehicleListUpdater - get vehicles from a service based on a refresh interval
 *
 * @param fetchVehiclesCallback
 * @param getTrackedVehicle
 * @param updateTrackedVehicle
 * @param refreshDelay
 * @return vehicleList[] (state variable)
 */
export function useVehicleListUpdater(
  fetchVehiclesCallback,
  getTrackedVehicle,
  updateTrackedVehicle,
  refreshDelay = null
) {
  const [vehicleList, setVehicleList] = useState([]);
  refreshDelay = checkRefreshInteval(refreshDelay);

  const fetchData = useCallback(async () => {
    const vehicles = await fetchVehiclesCallback();
    if (vehicles) {
      // todo: could maybe DQ vehicles data here before updating our vehicles list
      setVehicleList(vehicles);
      const [trackedVehicle, trackedRef] = getTrackedVehicle();
      data.linterIgnoreTheseProps(trackedVehicle);

      // update the tracked vehicle with latest position
      const queryId = data.getVehicleId(trackedRef);
      if (queryId && updateTrackedVehicle) {
        const t = data.findVehicleById(vehicles, queryId);
        if (t) updateTrackedVehicle(t, false, true);
      }
    }
  }, [fetchVehiclesCallback]);

  useEffect(() => {
    const onInterval = async () => {
      // todo: why assignment to newVehicles -- not used?
      const newVehicles = await fetchData();
      data.linterIgnoreTheseProps(newVehicles);
    };
    onInterval();
    const intervalId = setInterval(onInterval, refreshDelay);
    return () => clearInterval(intervalId);
  }, [fetchData, refreshDelay]);

  return vehicleList;
}
