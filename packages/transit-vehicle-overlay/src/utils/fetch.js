const DEFAULT_REFRESH_INTERVAL = 10000;

/**
 * get refresh values (default 10 seconds), and convert from secs to millisecs
 */
export function checkRefreshInteval(
  inverval,
  defInterval = DEFAULT_REFRESH_INTERVAL
) {
  let retVal = defInterval;
  if (inverval) {
    let r = inverval;
    if (typeof r === "string") r = parseInt(r, 10);
    if (r > 0 && r <= 100) r *= 1000;
    if (r >= 1000 && r <= 100000) retVal = r;
    else retVal = defInterval;
  }
  return retVal;
}

export const handleHttpResponse = response => {
  if (!response.ok) {
    /*
    TODO: Is there anything special we want to do with server side errors?
    */
    throw new Error(`Error fetching data. Status code: ${response.status}`);
  }
  /*
    TODO: Trimet bubbles up their own error messages from time to time
    and we'll want to grab those inside the `errorMessage` property
  */
  return response.json();
};

export const handleGlobalError = error => {
  /*
      TODO: More descriptive error handling here...
      maybe dispatch error event, display error message dialog
    */
  throw error;
};

/**
 * get linestring example
 * https://newplanner.trimet.org/ws/ti/v0/index/patterns/TRIMET:440496/geometry/geojson
 */
export const fetchRouteGeometry = async (config, shapeId) =>
  fetch(
    `${config.host}${config.path}/${config.agency}:${shapeId}${config.suffix}`
  )
    .then(handleHttpResponse)
    .catch(handleGlobalError);

/**
 * get vehicle positions -- example
 * https://maps.trimet.org/gtfs/rt/vehicles/routes/15?__time__=1585453880389
 */
export const fetchVehicles = async (config, query) =>
  fetch(
    `${config.host}${config.path}/${query.type}${
      /* eslint-disable prefer-template */
      query.ids.length ? "/" + query.ids.join() : "/all"
    }`
  )
    .then(handleHttpResponse)
    .catch(handleGlobalError);

/*

export function fetchOverlay() {
  const [vehicleList, setVehicleList] = useState([]);
  const [routePattern, setRoutePattern] = useState(null);


}


  /**
   * set zoom, used for changing icons ..
   * note: limit (throttle) so we don't overwhelm React with tons of state changes zooming in
   *
  // NOTE: there's a lot of crap that can go wrong here
  //  a) the fly to combined with an open popup, will make the map go whacko ... worse will be
  //     an endless DoS attack on the vehicles service once in that state
  //  b) ???
  setMapZoom = throttle(500, zoom => {
    this.setState({ mapZoom: zoom });
    this.recenterMap();
  });
*/

/*
  const fetchData = useCallback(async () => {
    const vehicles = await fetchVehicles();
    setAllVehicles(vehicles);
    const selectedVehicle = trackingId && vehicles.find(
        v => v.blockId === String(trackingId) || v.tripId === String(trackingId)
    );
    setSelectedVehicle(selectedVehicle || null);

    if (selectedVehicle == null) {
      // clear any existing geom that's in state (thus clearing the map) if no vehicle is selected
      setRouteGeometry(null);
    } else if(routeGeometry == null || routeGeometry.id !== selectedVehicle.shapeId) {
      // selected a vehicle, so add that new geom to state (e.g., not already in state)
      const geojson = selectedVehicle && (await fetchRouteGeometry(selectedVehicle.shapeId));
      const pattern = utils.makePattern(geojson, selectedVehicle.shapeId);
      setRouteGeometry(pattern || null);
    }
    return selectedVehicle;
  }, [trackingId, fetchVehicles, fetchRouteGeometry]);

  useEffect(() => {
    const onInterval = async () => {
      const newVehicle = await fetchData();
      if (!newVehicle) return;
      if (onRecenterMap) {
        debugger;
        onRecenterMap(newVehicle.lat, newVehicle.lon);
      }
    };
    onInterval();
    const intervalId = setInterval(onInterval, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchData, onRecenterMap, refreshInterval]);




function realtimeExample(markers, popup, tooltip, recenter) {
  const [zoom, onViewportChanged] = utils.useZoomState();

  const VEHICLE_API_CONFIG = {
    host: "https://maps.trimet.org",
    path: "/gtfs/rt/vehicles"
  };

  const ROUTE_API_CONFIG = {
    host: "https://maps.trimet.org",
    path: "/ti/index/patterns",
    agency: "TRIMET",
    suffix: "/geometry/geojson"
  };

  const fv = useCallback(async () =>
    utils.fetchVehicles(VEHICLE_API_CONFIG, {
      type: "routes",
      ids: [100, 90, 20, 57]
    })
  );

  // This reference should never change during the lifecycle of the component
  const fr = useCallback(
    async id => utils.fetchRouteGeometry(ROUTE_API_CONFIG, id),
    []
  );

  const selected = text("track id (trip/block):", "9020");
  let map = null;

  return (
    <BaseMap center={portland} onViewportChanged={onViewportChanged}>
      {fetchOverlay(
        zoom,
        fv,
        fr,
        selected,
        setClicked,
        null, //recenter,
        markers,
        popup,
        tooltip
      )}
    </BaseMap>
  );
}

function realtimeAltServiceExample(markers, popup, tooltip, recenter) {
  const [zoom, onViewportChanged] = utils.useZoomState();

  // NOTE: if you use the TriMet services, please get your own app id
  // https://developer.trimet.org/ws/v2/vehicles/appid/12A1B6835DC871375825C3AD1/routes/100
  const VEHICLE_API_CONFIG = {
    host: "https://developer.trimet.org",
    path: "/ws/v2/vehicles/appid/12A1B6835DC871375825C3AD1"
  };

  // https://maps.trimet.org/ti/index/patterns/trip/TRIMET:9803461/geometry/geojson
  const ROUTE_API_CONFIG = {
    host: "https://maps.trimet.org",
    path: "/ti/index/patterns/trip",
    agency: "TRIMET",
    suffix: "/geometry/geojson"
  };
}

*/
