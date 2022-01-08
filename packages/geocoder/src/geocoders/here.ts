// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { Feature } from "geojson"
import type { HereResponse, Item } from "../apis/here/types";
import type { MultiGeocoderResponse } from "./abstract-geocoder";

import Geocoder from "./abstract-geocoder";

const hereResultTypeToPeliasLayerMap = {
  houseNumber: "address",
  place: "venue"
};

const convertHereToGeojson = (hereFeature: Item): Feature => {
  const { scoring, categories, address, resultType, title, position } = hereFeature;
  const extraFields: { confidence?: number; addendum?: any } = {};
  if (scoring) {
    extraFields.confidence = scoring.queryScore;
  }
  if (categories) {
    extraFields.addendum = {
      categories
    };
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [position.lng, position.lat]
    },
    properties: {
      country: address.countryName,
      country_a: address.countryCode,
      country_code: address.countryCode,
      county: address.county,
      housenumber: address.houseNumber,
      label: address.label,
      layer: hereResultTypeToPeliasLayerMap[resultType]
        ? hereResultTypeToPeliasLayerMap[resultType]
        : resultType,
      ...extraFields,
      locality: address.city,
      name: title,
      neighbourhood: address.district,
      postalcode: address.postalCode,
      region: address.state,
      source: "here",
      street: address.street
    }
  };
};

export default class HereGeocoder extends Geocoder {
  rewriteReverseResponse({ items }: HereResponse): MultiGeocoderResponse {
    return {
      type: "FeatureCollection",
      features: items
        .map(convertHereToGeojson)
    }
  }

  rewriteAutocompleteResponse(response: HereResponse): MultiGeocoderResponse {
    const { items } = response;
    return {
      type: "FeatureCollection",
      features: items
        // Here can return continued query suggestions, which we do not support.
        ?.filter(item => item.resultType !== "chainQuery")
        .map(convertHereToGeojson)
    };
  }

  rewriteSearchResponse({ items }: HereResponse): MultiGeocoderResponse {
    return {
      type: "FeatureCollection",
      features: items.map(convertHereToGeojson)
    };
  }
}
