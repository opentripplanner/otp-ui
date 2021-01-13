import lonlat from "@conveyal/lonlat";

/**
 * Create customized geocoder functions given a certain geocoding API, the
 * config for the geocoder and response rewrite functions specific to this
 * application. Any geocoder api that is added is expected to have an API that
 * behaves very closely to https://github.com/conveyal/isomorphic-mapzen-search
 */
export default class Geocoder {
  constructor(geocoderApi, geocoderConfig) {
    this.api = geocoderApi;
    this.geocoderConfig = geocoderConfig;
  }

  /**
   * Perform an autocomplete query. Eg, using partial text of a possible
   * address or POI, attempt to find possible matches.
   */
  autocomplete(query) {
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
  getLocationFromGeocodedFeature(feature) {
    const location = lonlat.fromCoordinates(feature.geometry.coordinates);
    location.name = feature.properties.label;
    location.rawGeocodedFeature = feature;
    return Promise.resolve(location);
  }

  /**
   * Do a reverse-geocode. ie get address information and attributes given a
   * GPS coordinate.
   */
  reverse(query) {
    return this.api
      .reverse(this.getReverseQuery(query))
      .then(this.rewriteReverseResponse);
  }

  /**
   * Perform a search query. A search query is different from autocomplete in
   * that it is assumed that the text provided is more or less a complete
   * well-fromatted address.
   */
  search(query) {
    return this.api
      .search(this.getSearchQuery(query))
      .then(this.rewriteSearchResponse);
  }

  /**
   * Default autocomplete query generator
   */
  getAutocompleteQuery(query) {
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
      url: baseUrl ? `${baseUrl}/autocomplete` : undefined,
      ...query
    };
  }

  /**
   * Default reverse query generator
   */
  getReverseQuery(query) {
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
  getSearchQuery(query) {
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
  rewriteAutocompleteResponse(response) {
    return response;
  }

  /**
   * Default rewriter for reverse responses
   */
  rewriteReverseResponse(response) {
    return response;
  }

  /**
   * Default rewriter for search responses
   */
  rewriteSearchResponse(response) {
    return response;
  }
}
