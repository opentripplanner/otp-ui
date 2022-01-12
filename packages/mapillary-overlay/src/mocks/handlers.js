import { rest } from "msw";

import region from "./mapillary-region.json";

export default [
  rest.get("https://graph.mapillary.com/images", (req, res, ctx) => {
    return res(ctx.json(region));
  })
];
