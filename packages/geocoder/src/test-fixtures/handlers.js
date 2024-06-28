import { http } from "msw";

import hereAutocomplete from "./here/autosuggest-response.json";
import hereGeocode from "./here/search-response.json";
import hereReverse from "./here/reverse-response.json";
import peliasAutocomplete from "./pelias/autocomplete-response.json";
import peliasGeocode from "./pelias/search-response.json";
import peliasReverse from "./pelias/reverse-response.json";

export default [
  http.get("https://autosuggest.search.hereapi.com/v1/autosuggest", () => {
    return new Response(JSON.stringify(hereAutocomplete));
  }),
  http.get("https://geocode.search.hereapi.com/v1/geocode", () => {
    return new Response(JSON.stringify(hereGeocode));
  }),
  http.get("https://revgeocode.search.hereapi.com/v1/revgeocode", () => {
    return new Response(JSON.stringify(hereReverse));
  }),
  http.get("https://api.geocode.earth/v1/autocomplete", () => {
    return new Response(JSON.stringify(peliasAutocomplete));
  }),
  http.get("https://api.geocode.earth/v1/search", () => {
    return new Response(JSON.stringify(peliasGeocode));
  }),
  http.get("https://api.geocode.earth/v1/reverse", () => {
    return new Response(JSON.stringify(peliasReverse));
  })
];
