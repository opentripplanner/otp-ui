import { http } from "msw";

import tiles from "./tiles.json";

export default [
  http.get(
    "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json",
    () => {
      return new Response(JSON.stringify(tiles));
    }
  )
];
