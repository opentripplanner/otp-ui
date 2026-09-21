/* eslint-disable import/no-webpack-loader-syntax */
import { http } from "msw";

import tilejson from "./tilejson.json";

const tile47706206 = new URL("./4770-6206.pbf", import.meta.url);
const tile47716206 = new URL("./4771-6206.pbf", import.meta.url);
const tile47726206 = new URL("./4772-6206.pbf", import.meta.url);

export default [
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/tilejson.json",
    () => {
      return new Response(JSON.stringify(tilejson));
    }
  ),
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/14/4770/6206.pbf",
    async () => {
      const buffer = await fetch(tile47706206).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/14/4771/6206.pbf",
    async () => {
      const buffer = await fetch(tile47716206).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),

  http.get(
    "http://localhost:5555/otp/routers/default/vectorTiles/stops/14/4772/6206.pbf",
    async () => {
      const buffer = await fetch(tile47726206).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  )
];
