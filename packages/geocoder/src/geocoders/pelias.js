import Geocoder from "./abstract-geocoder";

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
   */
  getAutocompleteQuery(query) {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
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
   */
  getSearchQuery(query) {
    const {
      apiKey,
      baseUrl,
      boundary,
      focusPoint,
      sources
    } = this.geocoderConfig;
    return {
      apiKey,
      boundary,
      focusPoint,
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
  rewriteReverseResponse(response) {
    const {
      "point.lat": lat,
      "point.lon": lon
    } = response.isomorphicMapzenSearchQuery;
    return {
      lat,
      lon,
      name: response[0].address
    };
  }
}
