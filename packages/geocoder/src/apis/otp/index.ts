
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "../../geocoders/types"

type FetchArgs = {
  url: string
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


function run({ query, url }: FetchArgs): Promise<OTPGeocoderResponse> {
  return fetch(`${url}/geocode/stopClusters?query=${query}`)
    .then(res => res.text())
    .then(res => {
      let parsed = { results: [] }

      try {
        parsed = JSON.parse(`{"results": ${res}}`)
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
  text
}: AutocompleteQuery): Promise<OTPGeocoderResponse> {
  return run({
    query: text,
    url
  })
}

async function search(args: SearchQuery): Promise<OTPGeocoderResponse> {
  return autocomplete(args);
} 

function reverse(): Promise<OTPGeocoderResponse> { console.warn("Not implemented"); return null }


export { autocomplete, reverse, search };
export type { OTPGeocoderResponse }
