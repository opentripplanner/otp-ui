import { toCoordinates, fromLatFirstString } from "@conveyal/lonlat";
// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { Feature } from "geojson";
import type { AutocompleteQuery, ReverseQuery, SearchQuery } from "..";
import Geocoder, { MultiGeocoderResponse, SingleGeocoderResponse } from "./abstract-geocoder";

/**
 * An implementation that doesn't use an API for geocoding. Merely allows
 * clicking on the map and finding GPS coordinates by typing them in.
 *
 * @extends Geocoder
 */
export default class NoApiGeocoder extends Geocoder {
  /**
   * Use coordinate string parser.
   */
  autocomplete(query: AutocompleteQuery): Promise<MultiGeocoderResponse> {
    return this.parseCoordinateString(query.text);
  }

  /**
   * Always return the lat/lon.
   */
  reverse(query: ReverseQuery): Promise<MultiGeocoderResponse | SingleGeocoderResponse> {
    let { lat, lon } = query.point;
    lat = this.roundGPSDecimal(lat);
    lon = this.roundGPSDecimal(lon);
    const feature: Feature = {
      geometry: { coordinates: [lat, lon], type: "Point" },
      properties: { name: `${lat}, ${lon}` },
      type: "Feature"
    };
    if (this.geocoderConfig?.reverseUseFeatureCollection) {
      return Promise.resolve({
        type: "FeatureCollection",
        features: [feature],
        rawGeocodedFeature: feature
      });
    }

    return Promise.resolve({
      lat,
      lon,
      name: feature.properties.name,
      rawGeocodedFeature: feature
    })
  }

  /**
   * Use coordinate string parser.
   */
  search(query: SearchQuery): Promise<MultiGeocoderResponse> {
    return this.parseCoordinateString(query.text);
  }

  /**
   * Attempt to parse the input as a GPS coordinate. If parseable, return a
   * feature.
   */
  parseCoordinateString(string: string): Promise<MultiGeocoderResponse> {
    let feature;
    try {
      feature = {
        geometry: {
          coordinates: toCoordinates(fromLatFirstString(string)),
          type: "Point"
        },
        properties: {
          label: string
        }
      };
    } catch (e) {
      return Promise.resolve({ features: [], type: "FeatureCollection" });
    }
    return Promise.resolve({ features: [feature], type: "FeatureCollection" });
  }

  roundGPSDecimal(number: number): number {
    const roundFactor = 100000;
    return Math.round(number * roundFactor) / roundFactor;
  }
}
