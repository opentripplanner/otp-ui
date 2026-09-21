/* eslint-disable import/no-webpack-loader-syntax */
import { http } from "msw";

import atlTilejson from "./atl/tilejson.json";
import phlTilejson from "./phl/tilejson.json";

const atl10881639 = new URL("./atl/1088-1639.pbf", import.meta.url);
const atl10881640 = new URL("./atl/1088-1640.pbf", import.meta.url);
const atl10891639 = new URL("./atl/1089-1639.pbf", import.meta.url);
const atl10891640 = new URL("./atl/1089-1640.pbf", import.meta.url);
const phl47706205 = new URL("./phl/4770-6205.pbf", import.meta.url);
const phl47716205 = new URL("./phl/4771-6205.pbf", import.meta.url);

export default [
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops/tilejson.json",
    () => {
      return new Response(JSON.stringify(phlTilejson));
    }
  ),
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops/14/4770/6205.pbf",
    async () => {
      const buffer = await fetch(phl47706205).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/phl/otp/routers/default/vectorTiles/stops/14/4771/6205.pbf",
    async () => {
      const buffer = await fetch(phl47716205).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),

  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/areaStops/tilejson.json",
    () => {
      return new Response(JSON.stringify(atlTilejson));
    }
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/areaStops/12/1088/1639.pbf",
    async () => {
      const buffer = await fetch(atl10881639).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/areaStops/12/1088/1640.pbf",
    async () => {
      const buffer = await fetch(atl10881640).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/areaStops/12/1089/1639.pbf",
    async () => {
      const buffer = await fetch(atl10891639).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/atl/otp/routers/default/vectorTiles/areaStops/12/1089/1640.pbf",
    async () => {
      const buffer = await fetch(atl10891640).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  )
];
