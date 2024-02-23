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
          layer: "custom",
          id: `custom-${index}`,
          source: "offline",
          name: r.label,
          label: r.label
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
