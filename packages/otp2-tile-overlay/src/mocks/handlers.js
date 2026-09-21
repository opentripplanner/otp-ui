/* eslint-disable import/no-webpack-loader-syntax */
import { http } from "msw";

import tilejson from "./tilejson.json";

const tile47706205 = new URL("./4770-6205.pbf", import.meta.url);
const tile47716205 = new URL("./4771-6205.pbf", import.meta.url);

export default [
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/tilejson.json",
    () => {
      return new Response(JSON.stringify(tilejson));
    }
  ),
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/14/4770/6205.pbf",
    async () => {
      const buffer = await fetch(tile47706205).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/14/4771/6205.pbf",
    async () => {
      const buffer = await fetch(tile47716205).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  )
];
