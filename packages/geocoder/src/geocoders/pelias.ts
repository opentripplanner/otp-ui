import Geocoder from "./abstract-geocoder";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "..";
import type { SingleOrMultiGeocoderResponse } from "./types";

const DEFAULT_LAYERS = "address,venue,street,intersection,stops,stations"

/**
 * Geocoder implementation for the Pelias geocoder.
 * See https://pelias.io
 *
 * @extends Geocoder
 */
export default class PeliasGeocoder extends Geocoder {
  /**
   * Generate an autocomplete query specifically for the Pelias API. The
   * `sources` parameter is a Pelias-specific option.
   * This function fills in some more fields of the query
   * from the existing values in the GeocoderConfig. 
   */
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      layers = DEFAULT_LAYERS,
      options,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
      layers,
      options,
      // explicitly send over null for sources if provided sources is not truthy
      // in order to avoid default isomorphic-mapzen-search sources form being
      // applied
      sources: sources || null,
      url: baseUrl ? `${baseUrl}/autocomplete` : undefined,
      ...query
    };
  }

  /**
   * Generate a search query specifically for the Pelias API. The
   * `sources` parameter is a Pelias-specific option.
   * This function fills in some more fields of the query
   * from the existing values in the GeocoderConfig. 
   */
  getSearchQuery(query: SearchQuery): SearchQuery {
    const {
      apiKey,
      baseUrl,
      boundary,
      layers = DEFAULT_LAYERS,
      focusPoint,
      options,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      layers,
      focusPoint,
      options,
      // explicitly send over null for sources if provided sources is not truthy
      // in order to avoid default isomorphic-mapzen-search sources form being
      // applied
      sources: sources || null,
      url: baseUrl ? `${baseUrl}/search` : undefined,
      format: false, // keep as returned GeoJSON,
      ...query
    };
  }

  /**
   * Rewrite the response into an application-specific data format using the
   * first feature returned from the geocoder.
   */
  rewriteReverseResponse(response): SingleOrMultiGeocoderResponse {
    if (this.geocoderConfig?.reverseUseFeatureCollection) return response
    const { lat, lon } = response.isomorphicMapzenSearchQuery.point;

    const firstFeature = response[0];
    return {
      lat,
      lon,
      name: firstFeature.label,
      rawGeocodedFeature: firstFeature
    };
  }
}
