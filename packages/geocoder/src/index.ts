import * as arcgis from "@conveyal/geocoder-arcgis-geojson";
import * as pelias from "isomorphic-mapzen-search";
import memoize from "lodash.memoize";
import * as here from "./apis/here";
import * as photon from "./apis/photon";

import ArcGISGeocoder from "./geocoders/arcgis";
import NoApiGeocoder from "./geocoders/noapi";
import PeliasGeocoder from "./geocoders/pelias";
import HereGeocoder from "./geocoders/here";
import PhotonGeocoder from "./geocoders/photon";

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, GeocoderConfig, ReverseQuery, SearchQuery } from "./geocoders/types"

// Create a memoized getter to avoid recreating new geocoders each time.
const getGeocoder = memoize((geocoderConfig: GeocoderConfig & { type: string }) => {
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
    case "PHOTON":
      return new PhotonGeocoder(photon, geocoderConfig);
    default:
      console.error(`Unknown geocoder type: "${type}". Using NoApiGeocoder.`);
      return new NoApiGeocoder();
  }
});

export default getGeocoder;
export type { SearchQuery, AutocompleteQuery, ReverseQuery };
