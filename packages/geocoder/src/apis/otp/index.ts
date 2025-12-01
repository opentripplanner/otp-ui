
import { normalize  } from "@conveyal/lonlat"
// eslint-disable-next-line prettier/prettier
import type { LonLatOutput } from "@conveyal/lonlat"
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "../../geocoders/types"

type FetchArgs = {
  url: string
  focusLongitude?: string
  focusLatitude?: string
  query: string
}

type OTPGeocoderStop = {
  agencies?: { id: string, name: string }[]
  code?: string,
  coordinate: {
    lat: number,
    lon: number,
  },
  feedPublisher?: { name: string }
  id: string,
  modes: string[]
  name: string,
  type: "STOP" | "STATION"
}

type OTPGeocoderResponse = {
  results: {
    primary: OTPGeocoderStop
    // Secondaries is always defined: https://github.com/opentripplanner/OpenTripPlanner/pull/5879
    secondaries: OTPGeocoderStop[]
  }[]
} | undefined


function run({ query, focusLatitude, focusLongitude, url }: FetchArgs): Promise<OTPGeocoderResponse> {
  // TODO: is there a cleaner way to implement this? Some sort of dynamic query bulider? Is it worth it for a URL which is unlikely to change soon?
  return fetch(`${url}/geocode/stopClusters?query=${query}${focusLongitude ? `&focusLongitude=${focusLongitude}` : ""}${focusLatitude ? `&focusLatitude=${focusLatitude}` : ""}`)
    .then(res => res.text())
    .then(res => {
      let parsed = { results: [] }

      try {
        parsed = JSON.parse(`{"results": ${res}}`)

        // Unforunate way to swallow errors
        if (!Array.isArray(parsed.results)) {
          console.warn(`Invalid response from OTP: ${res}`)
          parsed = { results:[] }
        }
      } catch (e) {
        console.warn("Invalid response from OTP Geocoder!")
      }

      return parsed
    });
}

/**
 * Search for an address using
 * OTP Geocoder
 *
 * @param  {Object} $0
 * @param  {string} $0.url  The OTP instance, ending with /default/
 * @param  {string} $0.text query
 * @return {Promise}        A Promise that'll get resolved with the autocomplete result
 */
async function autocomplete({
  url,
  focusPoint,
  text
}: AutocompleteQuery): Promise<OTPGeocoderResponse> {
  let shortenedText = text;
  // If this magic string is found, don't send it to the geocoder. 
  const IGNORED_MAGIC_STRING = "stop id "
  if (text.toLowerCase().indexOf(IGNORED_MAGIC_STRING) > -1) {
    shortenedText = text.toLowerCase().split(IGNORED_MAGIC_STRING)[1]
  }

  // Re-write focus point for OTP, if it is present
  const focus = { focusLatitude: null, focusLongitude: null }
  if (focusPoint) {
    const { lat, lon }: LonLatOutput = normalize(focusPoint);
    focus.focusLongitude = lon.toString();
    focus.focusLatitude = lat.toString();
  }

  return run({
    query: shortenedText,
    url,
    ...focus,
  })
}

async function search(args: SearchQuery): Promise<OTPGeocoderResponse> {
  return autocomplete(args);
}

function reverse(): Promise<OTPGeocoderResponse> { console.warn("Not implemented"); return null }


export { autocomplete, reverse, search };
export type { OTPGeocoderResponse }
