import { LatLngArray, Location, UserPosition } from "@opentripplanner/types";

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

// TRICKY: This method is used in query.js and in the context of
// otp-rr actions where the intl context is not available/does not apply.
export function coordsToString(coords: number[]): string {
  return coords.length && coords.map(c => (+c).toFixed(5)).join(", ");
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

export function matchLatLon(location1: Location, location2: Location): boolean {
  if (!location1 || !location2) return location1 === location2;
  return location1.lat === location2.lat && location1.lon === location2.lon;
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
