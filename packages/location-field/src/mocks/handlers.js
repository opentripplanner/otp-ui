import { rest } from "msw";

import autocomplete from "./autocomplete.json";

export default [
  rest.get(
    "https://ws-st.trimet.org/pelias/v1/autocomplete",
    (req, res, ctx) => {
      return res(ctx.json(autocomplete));
    }
  )
];
