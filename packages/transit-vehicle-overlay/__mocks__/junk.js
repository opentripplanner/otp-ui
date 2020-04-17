import { formatDurationWithSeconds } from "@opentripplanner/core-utils/lib/time";
import * as utils from "../src/utils";

export function makeRandomDate() {
  const secs = Date.now() % 379;
  const prettyDate = formatDurationWithSeconds(secs);
  return prettyDate;
}

const VEHICLE_API_CONFIG = {
  host: "https://maps.trimet.org",
  path: "/gtfs/rt/vehicles"
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

export async function fetchVehicles(routes = "100, 90, 20, 57") {
  let retVal = [];
  try {
    const routeList = routes.split(",");
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

export async function fetchVehiclesDeveloper(routes = "100, 90, 20, 57") {
  // TODO
  return fetchVehicles(routes);
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
