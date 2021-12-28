import { stringify } from "querystring"
import { normalize } from "@conveyal/lonlat"

// Prettier does not support typescript annotation
// eslint-disable-next-line prettier/prettier
import type { LonLatOutput } from "@conveyal/lonlat"
import type { AutocompleteQuery, ReverseQuery, SearchQuery } from "../../geocoders/abstract-geocoder"

const geocodeUrl = "https://geocode.search.hereapi.com/v1/geocode"
const autocompleteUrl = "https://autosuggest.search.hereapi.com/v1/autosuggest"
const reverseUrl = "https://revgeocode.search.hereapi.com/v1/revgeocode"

type HereQuery = {
  at?: string,
  in?: string,
  limit?: number | string,
  q?: string,
  qq?: string,
  lang?: string,
  politicalView?: string,
  show?: string,
  apiKey: string
}

// These types are standardized for the other geocoders in this library.
// Perhaps we could extract them out somewhere and reuse them in the other libraries? 
type HereFetchArgs = {
  options: RequestInit // Built-in Typing
  query: HereQuery
  url: string
}

type JSONArrayPromise = Promise<Array<JSON>>

function GeocoderException(message: string) {
  this.message = message;
  this.name = "GeocoderException"
}

function run({
  options,
  query,
  url
}: HereFetchArgs): JSONArrayPromise {
  return fetch(`${url}?${stringify(query)}`, options)
    .then((res) => res.json())
}

/**
 * Search for an address using
 * Here's {@link https://mapzen.com/documentation/search/autocomplete/|Autocomplete}
 * service.
 *
 * @param {Object} $0
 * @param  {string} $0.apiKey                     The Here API Key
 * @param  {Object} $0.focusPoint
 * @param  {Object} $0.boundary
 * @param {number} [$0.size=20]
 * @param  {Object} $0.options                    options to pass to fetch (e.g., custom headers)
 * @param  {string} $0.text                       query text
 * @return {Promise}                              A Promise that'll get resolved with the autocomplete result
 */
function autocomplete({
  apiKey,
  focusPoint,
  boundary,
  size = 20,
  options,
  text
}: AutocompleteQuery): JSONArrayPromise {
  // build query
  const query: HereQuery = { apiKey, q: text, limit: size, show: "details" }

  if (focusPoint) {
    const { lat, lon }: LonLatOutput = normalize(focusPoint)
    query.at = `${lat},${lon}`
  }

  if (boundary) {
    if (focusPoint) throw new GeocoderException("Only one of focusPoint, boundary is allowed for Here API.")
    if (boundary.country) query.in = `countryCode:${boundary.country}`
    if (boundary.rect) {
      query.in = `bbox:${[
        boundary.rect.minLon,
        boundary.rect.minLat,
        boundary.rect.maxLon,
        boundary.rect.maxLat
      ].join(",")}`
    }
  }
  return run({
    options,
    query,
    url: autocompleteUrl
  })
}

/**
 * Search for an address using
 * HERE's {@link https://mapzen.com/documentation/search/search/|Search}
 * service. NOTE: Here does not support a boundary for Search queries, unlike Pelias.
 *
 * @param {Object} $0
 * @param {string} $0.apiKey                    The Here API key
 * @param {Object} $0.focusPoint
 * @param  {Object} $0.options                  options to pass to fetch (e.g., custom headers)
 * @param {number} [$0.size=10]
 * @param {string} $0.text                      The address text to query for
 * @return {Promise}                            A Promise that'll get resolved with search result
 */
function search({
  apiKey,
  focusPoint,
  options,
  size = 10,
  text,
}: SearchQuery): JSONArrayPromise {
  
  if (!text) return Promise.resolve([])
  
  const query: HereQuery = {
    apiKey,
    limit: size,
    q: text
  }

  if (focusPoint) {
    const { lat, lon }: LonLatOutput = normalize(focusPoint)
    query.at = `${lat},${lon}`
  }

  return run({ options, query, url: geocodeUrl })
}

/**
 * Search for an address using
 * HERE's {@link https://mapzen.com/documentation/search/search/|Search}
 * service.
 *
 * @param {Object} $0
 * @param {string} $0.apiKey                    The Here API key
 * @param {Object} $0.point
 * @param  {Object} $0.options                  options to pass to fetch (e.g., custom headers)
 * @return {Promise}                            A Promise that'll get resolved with search result
 */
function reverse({
  apiKey,
  point,
  options,
}: ReverseQuery): JSONArrayPromise {
  const query: HereQuery = {
    apiKey,
  }

  if (point) {
    const { lat, lon }: LonLatOutput = normalize(point)
    query.at = `${lat},${lon}`
  } else {
    throw new GeocoderException("No point provided for reverse geocoder.")
  }

  return run({ options, query, url: reverseUrl })
}

export {
  autocomplete,
  search,
  reverse
}