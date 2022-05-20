// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { LonLatInput } from "@conveyal/lonlat"
import type { Feature, FeatureCollection } from "geojson"

type Rect = {
  maxLat: number;
  maxLon: number;
  minLat: number;
  minLon: number;
};

type Boundary = {
  country?: string;
  rect?: Rect;
};

// These settings get added to the request to the geocoder
export type GeocoderConfig = {
  apiKey?: string;
  baseUrl?: string;
  boundary?: Boundary;
  focusPoint?: LonLatInput;
  options?: RequestInit;
  sources?: string;
  size?: number;
  reverseUseFeatureCollection?: boolean;
};

export type ReverseQuery = {
  apiKey?: string;
  format?: boolean;
  options?: RequestInit;
  point?: LonLatInput;
  url?: string;
  sources?: string;
};

export type AutocompleteQuery = {
  apiKey?: string;
  boundary?: Boundary;
  focusPoint?: LonLatInput;
  format?: boolean;
  options?: RequestInit;
  size?: number;
  text?: string;
  url?: string;
  sources?: string;
};

export type SearchQuery = {
  apiKey?: string;
  boundary?: Boundary;
  focusPoint?: LonLatInput;
  format?: boolean;
  options?: RequestInit;
  size?: number;
  text?: string;
  url?: string;
  sources?: string;
};

export type AnyGeocoderQuery = SearchQuery & AutocompleteQuery & ReverseQuery;

export type MultiGeocoderResponse = FeatureCollection & {
  isomorphicMapzenSearchQuery?: AnyGeocoderQuery;
};

export type SingleGeocoderResponse = {
  isomorphicMapzenSearchQuery?: AnyGeocoderQuery;
  lat: number;
  lon: number;
  name: string;
  rawGeocodedFeature: Feature;
};

export type SingleOrMultiGeocoderResponse = MultiGeocoderResponse | SingleGeocoderResponse;