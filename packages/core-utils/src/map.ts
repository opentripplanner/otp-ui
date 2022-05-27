import {
  Company,
  Itinerary,
  LatLngArray,
  Leg,
  Location,
  TransitiveData,
  UserPosition
} from "@opentripplanner/types";
import {
  getPlaceName,
  isAccessMode,
  isFlex,
  isTransit,
  toSentenceCase
} from "./itinerary";

import {
  coordsToString,
  getDetailText,
  latlngToString,
  logDeprecationWarning
} from "./deprecated";

export { coordsToString, getDetailText, latlngToString };

export function currentPositionToLocation(
  currentPosition: UserPosition
): Location {
  if (currentPosition.error || !currentPosition.coords) {
    console.warn(
      "Cannot construct location from current position due to geolocation error or missing coordinates."
    );
    return null;
  }
  return {
    lat: currentPosition.coords.latitude,
    lon: currentPosition.coords.longitude,
    category: "CURRENT_LOCATION"
  };
}

export function stringToCoords(str: string): number[] {
  return (str && str.split(",").map(c => +c)) || [];
}

export function constructLocation(latlng: {
  lat: number;
  lng: number;
}): Location {
  return {
    lat: latlng.lat,
    lon: latlng.lng
  };
}

export function formatStoredPlaceName(
  location: Location,
  withDetails = true
): string {
  if (withDetails) {
    logDeprecationWarning("the formatStoredPlaceName withDetails parameter");
  }

  let displayName =
    location.type === "home" || location.type === "work"
      ? toSentenceCase(location.type)
      : location.name;
  if (withDetails) {
    const detailText = getDetailText(location);
    if (detailText) displayName += ` (${detailText})`;
  }
  return displayName;
}

export function matchLatLon(location1: Location, location2: Location): boolean {
  if (!location1 || !location2) return location1 === location2;
  return location1.lat === location2.lat && location1.lon === location2.lon;
}

/**
 * Converts an OTP itinerary object to a transtive.js itinerary object.
 * @param {*} itin Required OTP itinerary (see @opentripplanner/core-utils/types#itineraryType) to convert.
 * @param {*} companies Optional list of companies, used for labeling vehicle rental locations.
 * @param {*} getRouteLabel Optional function that takes an itinerary leg (see @opentripplanner/core-utils/types#legType)
 *                          and returns a string representing the route label to display for that leg.
 * @returns An itinerary in the transitive.js format.
 */
export function itineraryToTransitive(
  itin: Itinerary,
  companies: Company[],
  getRouteLabel: (leg: Leg) => string,
  disableFlexArc: boolean
): TransitiveData {
  const tdata = {
    journeys: [],
    streetEdges: [],
    places: [],
    patterns: [],
    routes: [],
    stops: []
  };
  const routes = {};
  const stops = {};
  let streetEdgeId = 0;
  let patternId = 0;

  const journey = {
    journey_id: "itin",
    // This string is not shown in the UI
    journey_name: "Iterarary-derived Journey",
    segments: []
  };

  // add 'from' and 'to' places to the tdata places array
  tdata.places.push({
    place_id: "from",
    place_lat: itin.legs[0].from.lat,
    place_lon: itin.legs[0].from.lon
  });
  tdata.places.push({
    place_id: "to",
    place_lat: itin.legs[itin.legs.length - 1].to.lat,
    place_lon: itin.legs[itin.legs.length - 1].to.lon
  });

  itin.legs.forEach((leg, idx) => {
    if (isAccessMode(leg.mode)) {
      let fromPlaceId: string;
      if (leg.from.bikeShareId) {
        fromPlaceId = `bicycle_rent_station_${leg.from.bikeShareId}`;
        if (
          // OTP2 Scooter case
          leg.mode === "SCOOTER"
        ) {
          fromPlaceId = `escooter_rent_station_${leg.from.bikeShareId}`;
        }
      } else if (leg.from.vertexType === "VEHICLERENTAL") {
        // OTP1 Scooter case
        fromPlaceId = `escooter_rent_station_${leg.from.name}`;
      } else if (
        leg.mode === "CAR" &&
        idx > 0 &&
        itin.legs[idx - 1].mode === "WALK"
      ) {
        // create a special place ID for car legs preceded by walking legs
        fromPlaceId = `itin_car_${streetEdgeId}_from`;
      } else if (!fromPlaceId) {
        fromPlaceId = `itin_street_${streetEdgeId}_from`;
      }

      let toPlaceId;
      if (leg.to.bikeShareId) {
        toPlaceId = `bicycle_rent_station_${leg.to.bikeShareId}`;
        // OTP2 scooter case
        // Need to check next leg since this is a "to" place "
        if (leg.mode === "SCOOTER" || itin.legs?.[idx + 1].mode === "SCOOTER") {
          toPlaceId = `escooter_rent_station_${leg.to.bikeShareId}`;
        }
      } else if (leg.to.vertexType === "VEHICLERENTAL") {
        toPlaceId = `escooter_rent_station_${leg.to.name}`;
      } else if (
        leg.mode === "CAR" &&
        idx < itin.legs.length - 1 &&
        itin.legs[idx + 1].mode === "WALK"
      ) {
        // create a special place ID for car legs followed by walking legs
        toPlaceId = `itin_car_${streetEdgeId}_to`;
      } else if (!toPlaceId) {
        toPlaceId = `itin_street_${streetEdgeId}_to`;
      }

      const segment = {
        arc: false,
        type: leg.mode,
        streetEdges: [streetEdgeId],
        from: { type: "PLACE", place_id: fromPlaceId },
        to: { type: "PLACE", place_id: toPlaceId }
      };
      // For TNC segments, draw using an arc
      if (leg.mode === "CAR" && leg.hailedCar) segment.arc = true;
      journey.segments.push(segment);

      tdata.streetEdges.push({
        edge_id: streetEdgeId,
        geometry: leg.legGeometry
      });
      tdata.places.push({
        place_id: fromPlaceId,
        // Do not label the from place in addition to the to place. Otherwise,
        // in some cases (bike rental station) the label for a single place will
        // appear twice on the rendered transitive view.
        // See https://github.com/conveyal/trimet-mod-otp/issues/152
        // place_name: leg.from.name,
        place_lat: leg.from.lat,
        place_lon: leg.from.lon
      });
      tdata.places.push({
        place_id: toPlaceId,
        // This string is not shown in the UI
        place_name: getPlaceName(leg.to, companies),
        place_lat: leg.to.lat,
        place_lon: leg.to.lon
      });
      streetEdgeId++;
    }

    if (isTransit(leg.mode)) {
      // Flex routes sometimes have the same from and to IDs, but
      // these stops still need to be rendered separately!
      if (leg.from.stopId === leg.to.stopId) {
        leg.to.stopId = `${leg.to.stopId}_flexed_to`;
      }
      // determine if we have valid inter-stop geometry
      const hasInterStopGeometry = !!leg.interStopGeometry;
      const hasLegGeometry = !!leg.legGeometry?.points;
      const hasIntermediateStopGeometry =
        hasInterStopGeometry &&
        leg.intermediateStops &&
        leg.interStopGeometry.length === leg.intermediateStops.length + 1;

      // create leg-specific pattern
      const ptnId = `ptn_${patternId}`;
      const pattern = {
        pattern_id: ptnId,
        // This string is not shown in the UI
        pattern_name: `Pattern ${patternId}`,
        route_id: leg.routeId,
        stops: []
      };

      // add 'from' stop to stops dictionary and pattern object
      stops[leg.from.stopId] = {
        stop_id: leg.from.stopId,
        stop_name: leg.from.name,
        stop_lat: leg.from.lat,
        stop_lon: leg.from.lon
      };
      pattern.stops.push({ stop_id: leg.from.stopId });

      // add intermediate stops to stops dictionary and pattern object
      // If there is no intermediateStopGeometry, do not add the intermediate stops
      // as it will be straight lines instead of the nice legGeometry (but only if
      // the legGeometry exists).
      if (
        leg.intermediateStops &&
        (hasIntermediateStopGeometry || !hasLegGeometry)
      ) {
        leg.intermediateStops.forEach((stop, i) => {
          stops[stop.stopId] = {
            stop_id: stop.stopId,
            stop_name: stop.name,
            stop_lat: stop.lat,
            stop_lon: stop.lon
          };
          pattern.stops.push({
            stop_id: stop.stopId,
            geometry:
              hasIntermediateStopGeometry && leg.interStopGeometry[i].points
          });
        });
      }

      // add 'to' stop to stops dictionary and pattern object
      stops[leg.to.stopId] = {
        stop_id: leg.to.stopId,
        stop_name: leg.to.name,
        stop_lat: leg.to.lat,
        stop_lon: leg.to.lon
      };
      pattern.stops.push({
        stop_id: leg.to.stopId,
        geometry:
          // Some legs don't have intermediateStopGeometry, but do have valid legGeometry
          (hasInterStopGeometry || hasLegGeometry) &&
          (hasIntermediateStopGeometry
            ? leg.interStopGeometry[leg.interStopGeometry.length - 1].points
            : leg.legGeometry.points)
      });

      // add route to the route dictionary
      // with a custom route label if specified.
      const routeLabel =
        typeof getRouteLabel === "function"
          ? getRouteLabel(leg)
          : leg.routeShortName;
      routes[leg.routeId] = {
        agency_id: leg.agencyId,
        route_id: leg.routeId,
        route_short_name: routeLabel || "",
        route_long_name: leg.routeLongName || "",
        route_type: leg.routeType,
        route_color: leg.routeColor
      };

      // add the pattern to the tdata patterns array
      tdata.patterns.push(pattern);

      // add the pattern reference to the journey object
      journey.segments.push({
        arc:
          typeof disableFlexArc === "undefined" ? isFlex(leg) : !disableFlexArc,
        type: "TRANSIT",
        patterns: [
          {
            pattern_id: ptnId,
            from_stop_index: 0,
            to_stop_index: hasIntermediateStopGeometry
              ? leg.intermediateStops.length + 2 - 1
              : 1
          }
        ]
      });

      patternId++;
    }
  });

  // add the routes and stops to the tdata arrays
  tdata.routes.push(...Object.values(routes));
  tdata.stops.push(...Object.values(stops));

  // add the journey to the tdata journeys array
  tdata.journeys.push(journey);

  // console.log('derived tdata', tdata);
  return tdata;
}

type TransitivePlaceRaw = {
  place_id: string;
};
export function isBikeshareStation(place: TransitivePlaceRaw): boolean {
  return place.place_id.lastIndexOf("bicycle_rent_station") !== -1;
}

export function isEScooterStation(place: TransitivePlaceRaw): boolean {
  return place.place_id.lastIndexOf("escooter_rent_station") !== -1;
}

export function isCarWalkTransition(place: TransitivePlaceRaw): boolean {
  return place.place_id.lastIndexOf("itin_car_") !== -1;
}

export function isValidLat(lat: number): boolean {
  return Number.isFinite(lat) && lat >= -90 && lat <= 90;
}

export function isValidLng(lng: number): boolean {
  return Number.isFinite(lng) && lng >= -180 && lng <= 180;
}

export function isValidLatLng(arr: LatLngArray): boolean {
  return (
    Array.isArray(arr) &&
    arr.length === 2 &&
    isValidLat(arr[0]) &&
    isValidLng(arr[1])
  );
}
