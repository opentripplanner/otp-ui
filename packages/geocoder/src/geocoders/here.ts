// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { Feature } from "geojson"
import type { HereResponse, Item } from "../apis/here/types";
import type { MultiGeocoderResponse, SingleOrMultiGeocoderResponse } from "./types";

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
    },
    type: "Feature"
  };
};

export default class HereGeocoder extends Geocoder {
  rewriteReverseResponse({ items, point }: HereResponse): SingleOrMultiGeocoderResponse {
    if (this.geocoderConfig?.reverseUseFeatureCollection) {
      return {
        features: items.map(convertHereToGeojson),
        type: "FeatureCollection",
      }
    } 
    // Render the result as a single geocoder response
    const firstItem = items[0];
    return {
      ...point,
      name: firstItem.title,
      rawGeocodedFeature: convertHereToGeojson(firstItem)
    }
    
  }

  rewriteAutocompleteResponse(response: HereResponse): MultiGeocoderResponse {
    const { items } = response;
    return {
      features: items
      // Here has various types of responses, some of which are not locations.
      // We only want the actual places, so throw out any without a position.
      ?.filter(item => !!item.position)
      .map(convertHereToGeojson),
      type: "FeatureCollection"
    };
  }

  rewriteSearchResponse({ items }: HereResponse): MultiGeocoderResponse {
    return {
      features: items.map(convertHereToGeojson),
      type: "FeatureCollection"
    };
  }
}
