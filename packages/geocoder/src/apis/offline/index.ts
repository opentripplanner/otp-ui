import uFuzzy from "@leeoniya/ufuzzy";

export type OfflineResponse = {
  label: string;
  lat: number;
  lon: number;
  street?: string;
  neighbourhood?: string;
  locality?: string;
  region_a?: string;
  synonyms?: string[];
}[];

type OfflineQuery = {
  items: OfflineResponse;
  text?: string;
};
/**
 * Search for an address using offline geocoder
 *
 * @param  {Object} $0
 * @param  {string} $0.text query
 * @para   {Object} $0.items list of items to search
 * @return {Promise}        A Promise that'll get resolved with the autocomplete result
 */
async function autocomplete({
  items,
  text
}: OfflineQuery): Promise<OfflineResponse> {
  // eslint-disable-next-line new-cap
  const u = new uFuzzy();

  const haystackMap = items.flatMap<[string, number]>((item, idx) => {
    const allTerms = [item.label, ...(item.synonyms ?? [])]
    // old eslint doesn't support satisfies syntax
    // eslint-disable-next-line prettier/prettier
    return allTerms.map(term => [term, idx] satisfies [string, number])
  })

  const matchedIdxs = u.filter(haystackMap.map(i => i[0]), text);
  const resultIdxs = matchedIdxs.reduce((results, matchIdx) => {
    const itemIdx = haystackMap[matchIdx][1]
    return results.add(itemIdx)
  }, new Set<number>())
  return [...resultIdxs].map(i => items[i])
}

function search(args: OfflineQuery): Promise<OfflineResponse> {
  return autocomplete(args);
}
function reverse(): Promise<unknown> {
  console.warn("Not implemented");
  return null;
}

export { autocomplete, reverse, search };
