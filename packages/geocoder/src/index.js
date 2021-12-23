import * as arcgis from "@conveyal/geocoder-arcgis-geojson";
import * as pelias from "isomorphic-mapzen-search";
import memoize from "lodash.memoize";
import * as here from "./apis/here-api";

import ArcGISGeocoder from "./geocoders/arcgis";
import NoApiGeocoder from "./geocoders/noapi";
import PeliasGeocoder from "./geocoders/pelias";
import HereGeocoder from "./geocoders/here";

// Create a memoized getter to avoid recreating new geocoders each time.
const getGeocoder = memoize(geocoderConfig => {
  if (!geocoderConfig || !geocoderConfig.type) {
    return new NoApiGeocoder();
  }
  const { type } = geocoderConfig;
  switch (type) {
    case "ARCGIS":
      return new ArcGISGeocoder(arcgis, geocoderConfig);
    case "PELIAS":
      return new PeliasGeocoder(pelias, geocoderConfig);
    case "HERE":
      return new HereGeocoder(here, geocoderConfig);
    default:
      console.error(`Unkown geocoder type: "${type}". Using NoApiGeocoder.`);
      return new NoApiGeocoder();
  }
});

export default getGeocoder;
