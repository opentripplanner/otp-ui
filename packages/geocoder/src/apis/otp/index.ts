
// eslint-disable-next-line prettier/prettier
import type { AutocompleteQuery  } from "../../geocoders/types"

type FetchArgs = {
  url: string
  query: string
}

type OTPGeocoderResponse = { results:{
  lat: number,
  lng: number,
  description: string,
  id: string
}[] }


function run({  query, url }: FetchArgs): Promise<OTPGeocoderResponse> {
  // TODO: Support corners/osm nodes?
  return fetch(`${url}/geocode?corners=false&query=${query}`).then(res => res.text()).then(res => JSON.parse(`{"results": ${res}}`));
}

/**
 * Search for an address using
 * OTP Geocoder
 *
 * @param  {Object} $0
 * @param  {string} $0.url                    The OTP instance, ending with /default/
 * @param  {string} $0.text                       query
 * @return {Promise}                              A Promise that'll get resolved with the autocomplete result
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

function search(): Promise<unknown> { console.warn("Not implemented"); return null }
function reverse(): Promise<unknown> { console.warn("Not implemented"); return null }


export { autocomplete, reverse, search,  };
export type { OTPGeocoderResponse }
