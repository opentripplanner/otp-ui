import { useState, useRef, useEffect, useCallback } from "react";
import { checkRefreshInteval } from "./fetch";
import * as data from "./data";

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
 * trackedVehicleState
 *
 * use this hook when you want your layer to track a vehicle
 * (and potentially show the route geometry of this vehicle)
 *
 * @param fetchPatternCallback() that I'll used to fetch a vehicles' pattern geom
 * @param initial vehicle record
 * @param initial route pattern
 * @return [pattern, getTrackedVehicle(), updateTrackedVehicle()]
 */
export function trackedVehicleState(
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

  const getRoutePattern = (vehicle) => {
    if (fetchPatternCallback && vehicle) {
      const pid = routePatternRef.current ? routePatternRef.current.id : null;
      const cached = vehicle.tripId === pid;
      if (!cached)
        fetchPatternCallback(vehicle, setRoutePattern);
    }

    return routePatternRef.current;
  };

  /**
   * accept a vehicle record and two booleans to control how state is updated
   *
   * @param vehicle record
   * @param stopTracking boolean (e.g., 'stop tracking' - if this vehicle is tracking, then stop)
   * @param updatePattern boolean (default true)
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
      if (updatePattern)
        getRoutePattern(vehicle);
    }
  };

  /**
   * return both the tracked vehicle state variable (using will cause a redraw)
   * and the ref to that vehcicle.
   * Note: the ref is a handle to the most recent state of the tracked vehicle, which can be used
   * by routines outside of the react tree (don't ask me ... it's strange, hacky stuff).
   */
  const getTrackedVehicle = () => {
    return [trackedVehicle, trackedVehicleRef.current];
  };

  return [getRoutePattern, getTrackedVehicle, updateTrackedVehicle];
}

/**
 *
 * @param fetchVehiclesCallback
 * @param getTrackedVehicle
 * @param updateTrackedVehicle
 * @param refreshDelay
 * @return vehicleList[] state variable
 */
export function vehicleListUpdater(
  fetchVehiclesCallback,
  getTrackedVehicle,
  updateTrackedVehicle,
  trackedVehicleId=null,
  refreshDelay=null
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
      const queryId = data.getVehicleId(trackedRef) || trackedVehicleId;
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
