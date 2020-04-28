import { formatDurationWithSeconds } from "@opentripplanner/core-utils/lib/time";
import * as utils from "../src/utils";

export function makeRandomDate() {
  const secs = Date.now() % 379;
  const prettyDate = formatDurationWithSeconds(secs);
  return prettyDate;
}

const VEHICLE_API_CONFIG = {
  host: "https://maps.trimet.org",
  path: "/gtfs/rt/vehicles",
  defRoutes: "all"
};

const ALT_VEHICLE_API_CONFIG = {
  host: "https://developer.trimet.org",
  path: "/ws/v2/vehicles/appid/12A1B6835DC871375825C3AD1", // please use own appid
  defRoutes: ""
};

const GEOM_SHAPE_API_CONFIG = {
  host: "https://maps.trimet.org",
  path: "/ti/index/patterns",
  agency: "TRIMET",
  suffix: "/geometry/geojson"
};

const GEOM_TRIP_API_CONFIG = {
  host: "https://maps.trimet.org",
  path: "/ti/index/patterns/trip",
  agency: "TRIMET",
  suffix: "/geometry/geojson"
};

let DEF_ROUTES = "100,90,190,200,290,20,57";

export function setDefRoutes(dr) {
  if (dr && dr.length > 0) DEF_ROUTES = dr;
}

export async function fetchVehicles(routes) {
  if (!routes) routes = DEF_ROUTES;

  let retVal = [];
  try {
    const routeList = routes.replace(/\s+/g, "").split(",");
    const f = await utils.fetchVehicles(VEHICLE_API_CONFIG, {
      type: "routes",
      ids: routeList
    });
    retVal = await f;
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

export async function fetchAltVehicles(routes) {
  if (!routes) routes = DEF_ROUTES;
  let retVal = [];
  try {
    const routeList = routes.replace(/\s+/g, "").split(",");
    const f = await utils.fetchVehicles(ALT_VEHICLE_API_CONFIG, {
      type: "routes",
      ids: routeList
    });
    const data = await f;
    retVal = utils.convertAltData(data);
  } catch (e) {
    console.error(e);
  }
  return retVal;
}

export async function fetchPattern(vehicle, setter) {
  try {
    let geojson;
    if (vehicle.shapeId && vehicle.shapeId.length > 0)
      geojson = await utils.fetchRouteGeometry(
        GEOM_SHAPE_API_CONFIG,
        vehicle.shapeId
      );
    else
      geojson = await utils.fetchRouteGeometry(
        GEOM_TRIP_API_CONFIG,
        vehicle.tripId
      );
    const pattern = utils.makePattern(geojson, vehicle.tripId);
    if (setter) setter(pattern);
  } catch (e) {
    console.error(e);
  }
}
