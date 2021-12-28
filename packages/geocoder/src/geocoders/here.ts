// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { Feature } from "geojson"
import type { HereResponse, Item } from "../apis/here/types";
import type { SingleGeocoderResponse, MultiGeocoderResponse } from "./abstract-geocoder";

import Geocoder from "./abstract-geocoder";


const hereResultTypeToPeliasLayerMap = {
  place: "venue",
  houseNumber: "address"
};

const convertHereToGeojson = (hereFeature: Item): Feature => {
  const extraFields: { confidence?: number } = {} ;
  if (hereFeature.scoring) {
    extraFields.confidence = hereFeature.scoring.queryScore;
  }
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [hereFeature.position.lng, hereFeature.position.lat]
    },
    properties: {
      source: "here",
      label: hereFeature.address.label,
      country_code: hereFeature.address.countryCode,
      name: hereFeature.title,
      housenumber: hereFeature.address.houseNumber,
      street: hereFeature.address.street,
      postalcode: hereFeature.address.postalCode,
      country: hereFeature.address.countryName,
      region: hereFeature.address.state,
      county: hereFeature.address.county,
      country_a: hereFeature.address.countryCode,
      locality: hereFeature.address.city,
      neighbourhood: hereFeature.address.district,
      layer: hereResultTypeToPeliasLayerMap[hereFeature.resultType]
        ? hereResultTypeToPeliasLayerMap[hereFeature.resultType]
        : hereFeature.resultType,
      ...extraFields
    }
  };
};

export default class HereGeocoder extends Geocoder {
  rewriteReverseResponse({ items }: HereResponse): SingleGeocoderResponse {
    const firstFeature = items[0];
    const { lat, lng } = firstFeature.position;
    return {
      lat,
      lon: lng,
      name: firstFeature.title,
      rawGeocodedFeature: convertHereToGeojson(firstFeature)
    };
  }

  rewriteAutocompleteResponse(response: HereResponse): MultiGeocoderResponse {
    const { items } = response
    return {
      type: "FeatureCollection",
      features: items
        // Here can return continued query suggestions, which we do not support.
        .filter(item => item.resultType !== "chainQuery")
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
