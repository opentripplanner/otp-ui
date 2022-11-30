import { fromCoordinates } from "@conveyal/lonlat";

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { Feature } from "geojson"
import type { GeocoderConfig, ReverseQuery, AutocompleteQuery, SearchQuery, MultiGeocoderResponse, SingleGeocoderResponse, SingleOrMultiGeocoderResponse } from "./types"

/**
 * The exact format of the Geocoder response depends on the specific geocoder implementation
 */
type GeocoderAPI = {
  autocomplete: (query: AutocompleteQuery) => Promise<unknown>;
  reverse: (query: ReverseQuery) => Promise<unknown>;
  search: (query: SearchQuery) => Promise<unknown>;
};

/**
 * Create customized geocoder functions given a certain geocoding API, the
 * config for the geocoder and response rewrite functions specific to this
 * application. Any geocoder API that is added is expected to have an API that
 * behaves very closely to https://github.com/conveyal/isomorphic-mapzen-search
 */
export default class Geocoder {
  geocoderConfig: GeocoderConfig;

  api: GeocoderAPI;

  constructor(geocoderApi?: GeocoderAPI, geocoderConfig?: GeocoderConfig) {
    this.api = geocoderApi;
    this.geocoderConfig = geocoderConfig;
  }

  /**
   * Perform an autocomplete query, e.g. using partial text of a possible
   * address or POI, attempt to find possible matches.
   */
  autocomplete(query: AutocompleteQuery): Promise<MultiGeocoderResponse> {
    return this.api
      .autocomplete(this.getAutocompleteQuery(query))
      .then(this.rewriteAutocompleteResponse.bind(this));
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
  getLocationFromGeocodedFeature(
    feature: Feature
  ): Promise<SingleGeocoderResponse> {
    if (feature.geometry.type === "Point") {
      const location: SingleGeocoderResponse = {
        ...fromCoordinates(feature.geometry.coordinates),
        name: feature.properties.label,
        rawGeocodedFeature: feature
      };
      return Promise.resolve(location);
    }
    return Promise.reject(new Error("Feature is not of type Point."));
  }

  /**
   * Do a reverse-geocode, i.e. get address information and attributes given a
   * GPS coordinate.
   */
  reverse(query: ReverseQuery): Promise<MultiGeocoderResponse | SingleGeocoderResponse> {
    return this.api
      .reverse(this.getReverseQuery(query))
      .then(this.rewriteReverseResponse.bind(this));
  }

  /**
   * Perform a search query. A search query is different from autocomplete in
   * that it is assumed that the text provided is more or less a complete
   * well-formatted address.
   */
  search(query: SearchQuery): Promise<MultiGeocoderResponse> {
    return this.api
      .search(this.getSearchQuery(query))
      .then(this.rewriteSearchResponse.bind(this));
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
      format: !this.geocoderConfig?.reverseUseFeatureCollection, // keep result as GeoJSON if we're supposed to have a feature collection
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
   * Response type is unknown because it depends on the specific Geocoder implementation.
   */
  rewriteAutocompleteResponse(response: unknown): MultiGeocoderResponse {
    return response as MultiGeocoderResponse;
  }

  /**
   * Default rewriter for reverse responses
   * Response type is unknown because it depends on the specific Geocoder implementation.
   * Reverse response can use either Single or MultiGeocoderResponse based on GeocoderConfig.reverseUseFeatureCollection
   */
  rewriteReverseResponse(response: unknown): SingleOrMultiGeocoderResponse {
    return response as SingleOrMultiGeocoderResponse;
  }

  /**
   * Default rewriter for search responses
   * Response type is unknown because it depends on the specific Geocoder implementation.
   */
  rewriteSearchResponse(response: unknown): MultiGeocoderResponse {
    return response as MultiGeocoderResponse;
  }
}
