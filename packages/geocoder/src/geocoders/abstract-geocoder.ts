import { fromCoordinates } from "@conveyal/lonlat";

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { LonLatInput } from "@conveyal/lonlat"
import type { Feature, FeatureCollection } from "geojson"

type Rect = {
  maxLat: number | string
  maxLon: number | string
  minLat: number | string
  minLon: number | string
}

type Boundary = {
  country?: string
  rect?: Rect
}

type GeocoderAPI = {
  search: (query: SearchQuery) => Promise<Array<JSON>>,
  reverse: (query: ReverseQuery) => Promise<Array<JSON>>,
  autocomplete: (query: AutocompleteQuery) => Promise<Array<JSON>>
}

export type GeocoderConfig = {
  apiKey?: string,
  baseUrl?: string,
  boundary?: Boundary,
  focusPoint?: LonLatInput,
  options?: RequestInit
}

export type ReverseQuery = {
  apiKey?: string,
  point?: LonLatInput,
  options?: RequestInit,
  format?: boolean
  url?: string
}

export type AutocompleteQuery = {
  apiKey?: string,
  options?: RequestInit,
  size?: number | string,
  text?: string,
  boundary?: Boundary,
  focusPoint?: LonLatInput,
  format?: boolean,
  url?: string
}

export type SearchQuery = {
  apiKey?: string,
  options?: RequestInit,
  size?: number | string,
  text?: string,
  boundary?: Boundary,
  focusPoint?: LonLatInput,
  format?: boolean
  url?: string
}

export type MultiGeocoderResponse = FeatureCollection & {
  ismorphicMapzenSearchQuery?: string,
}

export type SingleGeocoderResponse = {
  ismorphicMapzenSearchQuery?: string,
  lat: number,
  lon: number,
  name: string,
  rawGeocodedFeature: Feature
}
/**
 * Create customized geocoder functions given a certain geocoding API, the
 * config for the geocoder and response rewrite functions specific to this
 * application. Any geocoder api that is added is expected to have an API that
 * behaves very closely to https://github.com/conveyal/isomorphic-mapzen-search
 */
export default class Geocoder {
  geocoderConfig: GeocoderConfig;

  api: GeocoderAPI

  constructor(geocoderApi: GeocoderAPI, geocoderConfig: GeocoderConfig) {
    this.api = geocoderApi;
    this.geocoderConfig = geocoderConfig;
  }

  /**
   * Perform an autocomplete query. Eg, using partial text of a possible
   * address or POI, attempt to find possible matches.
   */
  autocomplete(query: AutocompleteQuery): Promise<MultiGeocoderResponse> {
    return this.api
      .autocomplete(this.getAutocompleteQuery(query))
      .then(this.rewriteAutocompleteResponse);
  }

  /**
   * Get an application-specific data structure from a given feature. The
   * feature is either the result of an autocomplete or a search query. This
   * function returns a Promise because sometimes an asynchronous action
   * needs to be taken to translate a feature into a location. For example,
   * the ArcGIS autocomplete service returns results that lack full address
   * data and GPS and it is expected that an extra call to the `search` API is
   * done to obtain that detailed data.
   */
  getLocationFromGeocodedFeature(feature: Feature): Promise<SingleGeocoderResponse> {
    if (feature.geometry.type === "Point") {
      const location: SingleGeocoderResponse = {
        ...fromCoordinates(feature.geometry.coordinates),
        name: feature.properties.label,
        rawGeocodedFeature: feature
      } 
      return Promise.resolve(location);
    }
    return Promise.reject(new Error("Feature is not of type Point."))
  }

  /**
   * Do a reverse-geocode. ie get address information and attributes given a
   * GPS coordinate.
   */
  reverse(query: ReverseQuery): Promise<SingleGeocoderResponse> {
    return this.api
      .reverse(this.getReverseQuery(query))
      .then(this.rewriteReverseResponse);
  }

  /**
   * Perform a search query. A search query is different from autocomplete in
   * that it is assumed that the text provided is more or less a complete
   * well-fromatted address.
   */
  search(query: SearchQuery): Promise<MultiGeocoderResponse> {
    return this.api
      .search(this.getSearchQuery(query))
      .then(this.rewriteSearchResponse);
  }

  /**
   * Default autocomplete query generator
   */
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      options
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
      options,
      // TODO: Hard coding something like an /autocomplete endpoint path in here is not very abstract. 
      url: baseUrl ? `${baseUrl}/autocomplete` : undefined,
      ...query
    };
  }

  /**
   * Default reverse query generator
   */
  getReverseQuery(query: ReverseQuery): ReverseQuery {
    const { apiKey, baseUrl, options } = this.geocoderConfig;
    return {
      apiKey,
      format: true,
      options,
      url: baseUrl ? `${baseUrl}/reverse` : undefined,
      ...query
    };
  }

  /**
   * Default search query generator.
   */
  getSearchQuery(query: SearchQuery): SearchQuery {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      options
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
      options,
      url: baseUrl ? `${baseUrl}/search` : undefined,
      format: false, // keep as returned GeoJSON,
      ...query
    };
  }

  /**
   * Default rewriter for autocomplete responses
   */
  rewriteAutocompleteResponse(response: unknown): MultiGeocoderResponse {
    return response as MultiGeocoderResponse;
  }

  /**
   * Default rewriter for reverse responses
   */
  rewriteReverseResponse(response: unknown): SingleGeocoderResponse {
    return response as SingleGeocoderResponse;
  }

  /**
   * Default rewriter for search responses
   */
  rewriteSearchResponse(response: unknown): MultiGeocoderResponse {
    return response as MultiGeocoderResponse;
  }
}
