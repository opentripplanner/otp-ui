import { http } from "msw";

import autocomplete from "./autocomplete.json";
import hereAutocomplete from "./hereAutocomplete.json";

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default [
  http.get("https://ws-st.trimet.org/pelias/v1/autocomplete", () => {
    return new Response(JSON.stringify(autocomplete));
  }),
  http.get("https://slow.trimet.org/pelias/v1/autocomplete", async () => {
    await sleep(3000);
    return new Response(JSON.stringify(autocomplete));
  }),
  http.get("https://autosuggest.search.hereapi.com/v1/autosuggest", () => {
    return new Response(JSON.stringify(hereAutocomplete));
  })
];
