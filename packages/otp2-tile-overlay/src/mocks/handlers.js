/* eslint-disable import/no-webpack-loader-syntax */
import { http } from "msw";

import atlTilejson from "./atl/tilejson.json";
import phlTilejson from "./phl/tilejson.json";

const atl21743278 = new URL("./atl/2174-3278.pbf", import.meta.url);
const atl21743279 = new URL("./atl/2174-3279.pbf", import.meta.url);

const phl47706205 = new URL("./phl/4770-6205.pbf", import.meta.url);
const phl47716205 = new URL("./phl/4771-6205.pbf", import.meta.url);

function fetchTile(tileLocalUrl) {
  return async () => {
    const buffer = await fetch(tileLocalUrl).then(resp => resp.arrayBuffer());
    return new Response(buffer, {
      headers: {
        "Content-Length": buffer.byteLength.toString(),
        "Content-Type": "application/x-protobuf"
      }
    });
  };
}

export default [
  // PHL stop tiles
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops,stations/tilejson.json",
    () => new Response(JSON.stringify(phlTilejson))
  ),
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops,stations/14/4770/6205.pbf",
    fetchTile(phl47706205)
  ),
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops,stations/14/4771/6205.pbf",
    fetchTile(phl47716205)
  ),

  // ATL areaStop tiles
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/stops,areaStops/tilejson.json",
    () => new Response(JSON.stringify(atlTilejson))
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/stops,areaStops/13/2174/3278.pbf",
    fetchTile(atl21743278)
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/stops,areaStops/13/2174/3279.pbf",
    fetchTile(atl21743279)
  )
];
