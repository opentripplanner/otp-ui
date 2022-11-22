import { GeoJsonProperties } from "geojson";
import Geocoder from "./abstract-geocoder";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "..";
import type { SingleOrMultiGeocoderResponse } from "./types";
import { MultiGeocoderResponse } from "./types";

const generateLabel = (properties: GeoJsonProperties): string => {
  const propertyList = [];
  ["name", "street", "district", "state", "postcode", "city", "country"].forEach((propertyName) => {
    if (typeof properties[propertyName] === "undefined") {
      return;
    }
    const value = `${properties[propertyName]}`;
    if (value.length > 0) {
      propertyList.push(value);
    }
  })
  return propertyList.join(", ");
}

/**
 * Geocoder implementation for the Photon geocoder.
 * See https://photon.io
 *
 * @extends Geocoder
 */
export default class PhotonGeocoder extends Geocoder {
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const {
      baseUrl,
      boundary,
      focusPoint,
      options
    } = this.geocoderConfig;
    return {
      boundary,
      focusPoint,
      options,
      url: baseUrl ? `${baseUrl}/autocomplete` : undefined,
      ...query
    };
  }

  getSearchQuery(query: SearchQuery): SearchQuery {
    const {
      baseUrl,
      boundary,
      focusPoint,
      options
    } = this.geocoderConfig;
    return {
      boundary,
      focusPoint,
      options,
      url: baseUrl ? `${baseUrl}/search` : undefined,
      ...query
    };
  }

  rewriteAutocompleteResponse(response: MultiGeocoderResponse): MultiGeocoderResponse {
    response.features.forEach((value) => {
      value.properties.label = generateLabel(value.properties);
    })
    return response;
  }

  /**
   * Rewrite the response into an application-specific data format using the
   * first feature returned from the geocoder.
   */
  rewriteReverseResponse(response): SingleOrMultiGeocoderResponse {
    if (this.geocoderConfig?.reverseUseFeatureCollection) {
      response.features.forEach((value) => {
        value.properties.label = generateLabel(value.properties);
      })
      return response as MultiGeocoderResponse;
    }

    const lat = response.point.lat;
    const lon = response.point.lng;

    const firstFeature = response.features[0];
    return {
      lat,
      lon,
      name: generateLabel(firstFeature.properties),
      rawGeocodedFeature: firstFeature
    };
  }

  rewriteSearchResponse(response: MultiGeocoderResponse): MultiGeocoderResponse {
    return this.rewriteAutocompleteResponse(response) as MultiGeocoderResponse;
  }
}
