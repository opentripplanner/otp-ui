import { rest } from "msw";

import tiles from "./tiles.json";

export default [
  rest.get(
    "https://tiles.basemaps.cartocdn.com/vector/carto.streets/v1/tiles.json",
    (req, res, ctx) => {
      return res(ctx.json(tiles));
    }
  )
];
