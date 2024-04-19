// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, MultiGeocoderResponse, SearchQuery } from "./types";

import Geocoder from "./abstract-geocoder";
import { OTPGeocoderResponse } from "../apis/otp";


const generateLabel = stop => {
  let brackets = ""
  if (stop?.agencies?.[0]?.name) {
    brackets += stop.agencies[0].name
  } else if (stop?.feedPublisher?.name) {
    brackets += stop.feedPublisher.name
  }
  if (stop?.code) {
    if (brackets !== "") brackets += " "
    brackets += stop.code
  }

  if (brackets === "") return stop.name

  return `${stop.name} (${brackets})`
}

/**
 * Allows fetching results from OTP instance with the geocoder endpoint enabled
 */
export default class OTPGeocoder extends Geocoder {
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const {
      baseUrl,
    } = this.geocoderConfig;
    return {
      url: baseUrl,
      ...query
    };
  }

  getSearchQuery(query: SearchQuery): SearchQuery {
      return this.getAutocompleteQuery(query)
  }


  rewriteAutocompleteResponse(response: OTPGeocoderResponse): MultiGeocoderResponse {
    return {
      features: response?.results?.map(stop => ({
        geometry: { type: "Point", coordinates: [stop.coordinate.lon, stop.coordinate.lat] },
        id: stop.id,
        // TODO: if non-stops are supported, these need to be detected here and 
        // this layer property updated accordingly
        properties: {
          layer: "stops",
          source: "otp",
          modes: stop.modes,
          name: stop.name,
          label: generateLabel(stop)
        },
        type: "Feature"
      })),
      type: "FeatureCollection"
    };
  }

}
