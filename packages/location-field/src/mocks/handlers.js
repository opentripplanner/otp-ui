import { rest } from "msw";

import autocomplete from "./autocomplete.json";
import hereAutocomplete from "./hereAutocomplete.json";

export default [
  rest.get(
    "https://ws-st.trimet.org/pelias/v1/autocomplete",
    (req, res, ctx) => {
      return res(ctx.json(autocomplete));
    }
  ),
  rest.get(
    "https://autosuggest.search.hereapi.com/v1/autosuggest",
    (req, res, ctx) => {
      return res(ctx.json(hereAutocomplete));
    }
  )
];
