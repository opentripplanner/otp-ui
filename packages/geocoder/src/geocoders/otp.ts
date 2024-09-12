// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, MultiGeocoderResponse, SearchQuery } from "./types";

import Geocoder from "./abstract-geocoder";
import { OTPGeocoderResponse } from "../apis/otp";

const generateLabel = stop => {
  // Check for a feed publisher / agency match
  const { agencies } =  stop 
  const feedPublisherAgency = agencies?.find(agency => agency.name === stop.feedPublisher?.name)

  // Check for a agency / stop agency id match
  const stopAgencyId = stop.id.split(":")?.[0]
  const stopAgency = agencies?.find(agency => agency.id.split(":")[0] === stopAgencyId)

  let brackets = "";
  if (feedPublisherAgency) {
    brackets += feedPublisherAgency.name
  } else if (stopAgency) {
    brackets += stopAgency.name
  } else if (stop?.agencies?.[0]?.name) {
    brackets += stop.agencies[0].name;
  } else if (stop?.feedPublisher?.name) {
    brackets += stop.feedPublisher.name;
  }
  if (stop?.code) {
    if (brackets !== "") brackets += " ";
    brackets += stop.code;
  }

  if (brackets === "") return stop.name;

  return `${stop.name} (${brackets})`;
};

/**
 * Allows fetching results from OTP instance with the geocoder endpoint enabled
 */
export default class OTPGeocoder extends Geocoder {
  getAutocompleteQuery(query: AutocompleteQuery): AutocompleteQuery {
    const { baseUrl } = this.geocoderConfig;
    return {
      url: baseUrl,
      ...query
    };
  }

  getSearchQuery(query: SearchQuery): SearchQuery {
    return this.getAutocompleteQuery(query);
  }

  rewriteAutocompleteResponse(
    response: OTPGeocoderResponse
  ): MultiGeocoderResponse {
    return {
      features: response?.results?.map(stop => {
        const { primary, secondaries } = stop;

        return {
          geometry: {
            type: "Point",
            coordinates: [primary.coordinate.lon, primary.coordinate.lat]
          },
          id: primary.id,
          // TODO: if non-stops are supported, these need to be detected here and
          // this layer property updated accordingly
          properties: {
            layer: "stops",
            source: "otp",
            modes: primary.modes,
            name: primary.name,
            label: generateLabel(primary),
            // Don't render labels for station children
            // TODO: filter out duplicates?
            secondaryLabels:
              primary.type !== "STATION"
                ? secondaries.map(s => generateLabel(s))
                : []
          },
          type: "Feature"
        };
      }),
      type: "FeatureCollection"
    };
  }
}
