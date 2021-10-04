import { toCoordinates, fromLatFirstString } from "@conveyal/lonlat";

import Geocoder from "./abstract-geocoder";

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
  autocomplete(query) {
    return this.parseCoordinateString(query.text);
  }

  /**
   * Always return the lat/lon.
   */
  reverse(query) {
    let { lat, lon } = query.point;
    lat = this.roundGPSDecimal(lat);
    lon = this.roundGPSDecimal(lon);
    const feature = { lat, lon, name: `${lat}, ${lon}` };
    return Promise.resolve({
      ...feature,
      rawGeocodedFeature: feature
    });
  }

  /**
   * Use coordinate string parser.
   */
  search(query) {
    return this.parseCoordinateString(query.text);
  }

  /**
   * Attempt to parse the input as a GPS coordinate. If parseable, return a
   * feature.
   */
  parseCoordinateString(string) {
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
      return Promise.resolve({ features: [] });
    }
    return Promise.resolve({ features: [feature] });
  }

  roundGPSDecimal(number) {
    const roundFactor = 100000;
    return Math.round(number * roundFactor) / roundFactor;
  }
}
