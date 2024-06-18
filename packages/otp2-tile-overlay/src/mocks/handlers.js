/* eslint-disable import/no-webpack-loader-syntax */
import { http } from "msw";

import tilejson from "./tilejson.json";

const seventy = new URL("./4770-6206.pbf", import.meta.url);
const seventyOne = new URL("./4771-6206.pbf", import.meta.url);
const seventyTwo = new URL("./4772-6206.pbf", import.meta.url);

export default [
  http.get(
    "https://fake-otp-server.com/otp/routers/default/vectorTiles/stops/tilejson.json",
    () => {
      return new Response(JSON.stringify(tilejson));
    }
  ),
  http.get(
    "https://fake-otp-server.com/otp/routers/default/vectorTiles/stops/14/4770/6206.pbf",
    async () => {
      const buffer = await fetch(seventy).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),
  http.get(
    "https://fake-otp-server.com/otp/routers/default/vectorTiles/stops/14/4771/6206.pbf",
    async () => {
      const buffer = await fetch(seventyOne).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  ),

  http.get(
    "https://fake-otp-server.com/otp/routers/default/vectorTiles/stops/14/4772/6206.pbf",
    async () => {
      const buffer = await fetch(seventyTwo).then(resp => resp.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Length": buffer.byteLength.toString(),
          "Content-Type": "application/x-protobuf"
        }
      });
    }
  )
];
