
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery, SearchQuery } from "../../geocoders/types"

type FetchArgs = {
  url: string
  query: string
}

type OTPGeocoderResponse = {
  results: {
    coordinate: {
      lat: number,
      lon: number,
    },
    code?: string | undefined,
    name: string,
    id: string,
    agencies?: { id: string, name: string }[]
    feedPublisher?: { name: string }
    modes: string[]
  }[]
} | undefined


function run({ query, url }: FetchArgs): Promise<OTPGeocoderResponse> {
  return fetch(`${url}/geocode/stopClusters?query=${query}`)
    .then(res => res.text())
    .then(res => JSON.parse(`{"results": ${res}}`));
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
