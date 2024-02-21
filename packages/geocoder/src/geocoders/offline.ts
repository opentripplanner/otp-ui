import Geocoder from "./abstract-geocoder";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "..";
import { MultiGeocoderResponse } from "./types";

/**
 * Geocoder implementation for an offline geocoder.
 *
 * @extends Geocoder
 */
export default class OfflineGeocoder extends Geocoder {
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    return {
      ...query
    };
  }

  getSearchQuery(query: SearchQuery): SearchQuery {
    return {
      ...query
    };
  }

  rewriteAutocompleteResponse(response: MultiGeocoderResponse): MultiGeocoderResponse {
    return response;
  }


  rewriteSearchResponse(response: MultiGeocoderResponse): MultiGeocoderResponse {
    return response;
  }
}
