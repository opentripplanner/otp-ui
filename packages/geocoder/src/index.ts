import * as arcgis from "@conveyal/geocoder-arcgis-geojson";
import * as pelias from "isomorphic-mapzen-search";
import memoize from "lodash.memoize";
import * as arcgis11 from "./apis/arcgis11"
import * as here from "./apis/here";
import * as photon from "./apis/photon";
import * as otp from "./apis/otp";
import * as offline from "./apis/offline";

import ArcGISGeocoder from "./geocoders/arcgis";
import ArcGIS11Geocoder from "./geocoders/arcgis11";
import NoApiGeocoder from "./geocoders/noapi";
import PeliasGeocoder from "./geocoders/pelias";
import PeliasWithARCGISResolverGeocoder from "./geocoders/pelias-witharcgis";
import HereGeocoder from "./geocoders/here";
import PhotonGeocoder from "./geocoders/photon";
import OTPGeocoder from "./geocoders/otp";

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, GeocoderConfig, ReverseQuery, SearchQuery, SingleGeocoderResponse } from "./geocoders/types"
import OfflineGeocoder from "./geocoders/offline";

// Create a memoized getter to avoid recreating new geocoders each time.
const getGeocoder = memoize((geocoderConfig: GeocoderConfig & { type: string }) => {
  if (!geocoderConfig || !geocoderConfig.type) {
    return new NoApiGeocoder();
  }
  const { type } = geocoderConfig;
  switch (type) {
    case "ARCGIS":
      return new ArcGISGeocoder(arcgis, geocoderConfig);
    case "ARCGIS-11":
      return new ArcGIS11Geocoder(arcgis11, geocoderConfig);
    case "PELIAS":
      return new PeliasGeocoder(pelias, geocoderConfig);
    // This is a very specific case where a pelias stitch instance needs to use the
    // magicKey against an esri instance
    case "PELIAS-ARCGIS-RESOLVER":
      return new PeliasWithARCGISResolverGeocoder(pelias, geocoderConfig);
    case "HERE":
      return new HereGeocoder(here, geocoderConfig);
    case "PHOTON":
      return new PhotonGeocoder(photon, geocoderConfig);
    case "OTP":
      return new OTPGeocoder(otp, geocoderConfig);
    case "OFFLINE":
      return new OfflineGeocoder(offline, geocoderConfig);
    default:
      console.error(`Unknown geocoder type: "${type}". Using NoApiGeocoder.`);
      return new NoApiGeocoder();
  }
});

export default getGeocoder;
export type {
  AutocompleteQuery,
  GeocoderConfig,
  ReverseQuery,
  SearchQuery,
  SingleGeocoderResponse
};
