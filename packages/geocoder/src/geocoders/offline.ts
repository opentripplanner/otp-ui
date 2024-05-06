import Geocoder from "./abstract-geocoder";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "..";
import { MultiGeocoderResponse } from "./types";
import { OfflineResponse } from "../apis/offline";

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

  rewriteAutocompleteResponse(response: OfflineResponse): MultiGeocoderResponse {
    return {
      features: response?.map((r, index) => ({
        geometry: { type: "Point", coordinates: [r.lon, r.lat] },
        properties: {
          id: `custom-${index}`,
          label: r.label,
          layer: "custom",
          name: r.label,
          source: "offline",
        },
        type: "Feature"
      })),
      type: "FeatureCollection"
    };
  }


  rewriteSearchResponse(response: OfflineResponse): MultiGeocoderResponse {
    return this.rewriteAutocompleteResponse(response);
  }
}
