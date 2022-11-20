import Geocoder from "./abstract-geocoder";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "..";
import type { SingleOrMultiGeocoderResponse } from "./types";
import { MultiGeocoderResponse } from "./types";

/**
 * Geocoder implementation for the Photon geocoder.
 * See https://photon.io
 *
 * @extends Geocoder
 */
export default class PhotonGeocoder extends Geocoder {
  /**
   * Generate an autocomplete query specifically for the Pelias API. The
   * `sources` parameter is a Pelias-specific option.
   * This function fills in some more fields of the query
   * from the existing values in the GeocoderConfig.
   */
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const {
      baseUrl,
      boundary,
      focusPoint,
      options,
      sources
    } = this.geocoderConfig;
    return {
      boundary,
      focusPoint,
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
      baseUrl,
      boundary,
      focusPoint,
      options,
      sources
    } = this.geocoderConfig;
    return {
      boundary,
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

    const { lat, lon } = response.point;

    const firstFeature = response.features[0];
    return {
      lat,
      lon,
      name: firstFeature.properties.name,
      rawGeocodedFeature: firstFeature
    };
  }

  rewriteAutocompleteResponse(response: MultiGeocoderResponse): MultiGeocoderResponse {
    response.features.forEach((value) => {
      value.properties.label = value.properties.name;
    })

    return response;

  }
}
