import { fromCoordinates } from "@conveyal/lonlat";
import PeliasGeocoder from "./pelias";
import Geocoder from "./abstract-geocoder";
import { search } from "../apis/arcgis11";

export default class PeliasWithARCGISResolverGeocoder extends PeliasGeocoder {
  /**
   * Using the given magicKey and text, perform a search query to get detailed
   * address and GPS data. Return data in an application-specific location
   * format.
   */
  getLocationFromGeocodedFeature(feature) {
    const { esriUrl } = this.geocoderConfig;
    // If feature was returned from 'search' query, it will already be
    // structured properly.
    if (feature.geometry) {
      return Geocoder.prototype.getLocationFromGeocodedFeature(feature);
    }
    // If feature returned from autocomplete, we need to use the magicKey to get
    // the location's coordinates.
    return search({
      magicKey: feature.magicKey,
      text: feature.text,
      url: esriUrl
    }).then(response => {
      const firstFeature = response.features[0];
      const location = fromCoordinates(firstFeature.geometry.coordinates);
      location.name = firstFeature.properties.label;
      location.rawGeocodedFeature = firstFeature;
      return location;
    });
  }
}
