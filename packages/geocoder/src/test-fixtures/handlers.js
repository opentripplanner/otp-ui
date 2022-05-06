import { rest } from "msw";

import hereAutocomplete from "./here/autosuggest-response.json";
import hereGeocode from "./here/search-response.json";
import hereReverse from "./here/reverse-response.json";
import peliasAutocomplete from "./pelias/autocomplete-response.json";
import peliasGeocode from "./pelias/search-response.json";
import peliasReverse from "./pelias/reverse-response.json";

export default [
  rest.get(
    "https://autosuggest.search.hereapi.com/v1/autosuggest",
    (req, res, ctx) => {
      return res(ctx.json(hereAutocomplete));
    }
  ),
  rest.get("https://geocode.search.hereapi.com/v1/geocode", (req, res, ctx) => {
    return res(ctx.json(hereGeocode));
  }),
  rest.get(
    "https://revgeocode.search.hereapi.com/v1/revgeocode",
    (req, res, ctx) => {
      return res(ctx.json(hereReverse));
    }
  ),
  rest.get("https://api.geocode.earth/v1/autocomplete", (req, res, ctx) => {
    return res(ctx.json(peliasAutocomplete));
  }),
  rest.get("https://api.geocode.earth/v1/search", (req, res, ctx) => {
    return res(ctx.json(peliasGeocode));
  }),
  rest.get("https://api.geocode.earth/v1/reverse", (req, res, ctx) => {
    return res(ctx.json(peliasReverse));
  })
];
