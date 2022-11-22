import { normalize } from "@conveyal/lonlat";
import { stringify } from "querystring";

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { LonLatOutput } from "@conveyal/lonlat"
import type { AutocompleteQuery, ReverseQuery, SearchQuery } from "../../geocoders/types"
import type { PhotonResponse } from "./types";

const AUTOCOMPLETE_URL =
    "https://photon.komoot.io/api";
const GEOCODE_URL = "https://photon.komoot.io/api";
const REVERSE_URL = "https://photon.komoot.io/reverse";

type PhotonQuery = {
  lon?: string;
  lat?: string;
  in?: string;
  lang?: string;
  limit?: number | string;
  politicalView?: string;
  q?: string;
  qq?: string;
  show?: string;
};

// These types are standardized for the other geocoders in this library.
// Perhaps we could extract them out somewhere and reuse them in the other libraries?
type PhotonFetchArgs = {
  options: RequestInit; // Built-in Typing
  query: PhotonQuery;
  url: string;
};

function GeocoderException(message: string) {
  this.message = message;
  this.name = "GeocoderException";
}

function run({ options, query, url }: PhotonFetchArgs): Promise<PhotonResponse> {
  return fetch(`${url}?${stringify(query)}`, options).then(res => res.json());
}

/**
 * Search for an address using
 * Komoot's Photon {@link https://github.com/komoot/photon}
 * service.
 *
 * @param  {Object} $0
 * @param  {Object} $0.boundary
 * @param  {Object} $0.focusPoint
 * @param  {Object} $0.options                    options to pass to fetch (e.g., custom headers)
 * @param  {number} [$0.size=20]
 * @param  {string} $0.text                       query text
 * @return {Promise}                              A Promise that'll get resolved with the autocomplete result
 */
async function autocomplete({
  boundary,
  focusPoint,
  options,
  size = 20,
  text
}: AutocompleteQuery): Promise<PhotonResponse> {
  // build query
  const query: PhotonQuery = { limit: size, q: text };

  if (focusPoint) {
    const { lat, lon }: LonLatOutput = normalize(focusPoint);
    query.lat = `${lat}`;
    query.lon = `${lon}`;
    const res = await run({
      options,
      query,
      url: AUTOCOMPLETE_URL
    });
    return res
  }
  if (boundary) {
    const { country, rect } = boundary;
    if (country) query.in = `countryCode:${country}`;
    if (rect) {
      query.in = `bbox:${[
        rect.minLon,
        rect.minLat,
        rect.maxLon,
        rect.maxLat
      ].join(",")}`;
    }
  }

  return run({
    options,
    query,
    url: AUTOCOMPLETE_URL
  });
}

/**
 * Search for an address using
 * Komoot's Photon {@link https://github.com/komoot/photon}
 * service.
 *
 * @param  {Object} $0
 * @param  {Object} $0.focusPoint
 * @param  {Object} $0.options                  options to pass to fetch (e.g., custom headers)
 * @param  {number} [$0.size=10]
 * @param  {string} $0.text                      The address text to query for
 * @return {Promise}                            A Promise that'll get resolved with search result
 */
function search({
  focusPoint,
  options,
  size = 10,
  text
}: SearchQuery): Promise<PhotonResponse> {
  if (!text) return Promise.resolve({ items: [] });

  const query: PhotonQuery = {
    limit: size,
    q: text
  };

  if (focusPoint) {
    const { lat, lon }: LonLatOutput = normalize(focusPoint);
    query.lat = `${lat}`;
    query.lon = `${lon}`;
  }

  return run({ options, query, url: GEOCODE_URL });
}

/**
 * Search for an address using
 * Komoot's Photon {@link https://github.com/komoot/photon} reverse
 * service.
 *
 * @param  {Object} $0
 * @param  {Object} $0.point
 * @param  {Object} $0.options                  options to pass to fetch (e.g., custom headers)
 * @return {Promise}                            A Promise that'll get resolved with search result
 */
function reverse({ options, point }: ReverseQuery): Promise<PhotonResponse> {
  const query: PhotonQuery = {
  };

  if (point) {
    const { lat, lon }: LonLatOutput = normalize(point);
    query.lat = `${lat}`;
    query.lon = `${lon}`;
  } else {
    throw new GeocoderException("No point provided for reverse geocoder.");
  }

  return run({ options, query, url: REVERSE_URL }).then(res => ({
    ...res,
    point
  }));
}

export { autocomplete, reverse, search };
