import { fromCoordinates, normalize } from "@conveyal/lonlat";

import Geocoder from "./abstract-geocoder";

/**
 * Geocoder implementation for the ArcGIS geocoder.
 * See https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm
 *
 * @extends Geocoder
 */
export default class ArcGISGeocoder extends Geocoder {
  getAutocompleteQuery(query) {
    const { apiKey, baseUrl, focusPoint, options } = this.geocoderConfig;
    return {
      apiKey,
      focusPoint,
      options,
      url: baseUrl,
      ...query
    };
  }

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
      url: baseUrl,
      format: false, // keep as returned GeoJSON,
      ...query
    };
  }

  getReverseQuery(query) {
    const { apiKey, options } = this.geocoderConfig;
    return {
      apiKey,
      format: !this.geocoderConfig?.reverseUseFeatureCollection, // keep result as GeoJSON if we're supposed to have a feature collection
      options,
      // ARCGIS-11 doesn't support reverse queries
      url:
        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/",
      ...query
    };
  }

  /**
   * Using the given magicKey and text, perform a search query to get detailed
   * address and GPS data. Return data in an application-specific location
   * format.
   */
  getLocationFromGeocodedFeature(feature) {
    const { baseUrl } = this.geocoderConfig;
    // If feature was returned from 'search' query, it will already be
    // structured properly.
    if (feature.geometry) {
      return Geocoder.prototype.getLocationFromGeocodedFeature(feature);
    }
    // If feature returned from autocomplete, we need to use the magicKey to get
    // the location's coordinates.
    return this.api
      .search({ magicKey: feature.magicKey, text: feature.text, url: baseUrl })
      .then(response => {
        const firstFeature = response.features[0];
        const location = fromCoordinates(firstFeature.geometry.coordinates);
        location.name = firstFeature.properties.label;
        location.rawGeocodedFeature = firstFeature;
        return location;
      });
  }

  /**
   * Rewrite the response into an application-specific data format using the
   * first feature returned from the geocoder.
   */
  rewriteReverseResponse(response) {
    if (this.geocoderConfig?.reverseUseFeatureCollection) return response;

    const { features, query } = response;
    const { lat, lon } = normalize(query);
    const firstFeature = features[0];
    return {
      lat,
      lon,
      name: firstFeature.properties.label,
      rawGeocodedFeature: firstFeature
    };
  }
}
