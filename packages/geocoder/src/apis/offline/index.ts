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
  if (!text) return [];

  const itemsWithSynonyms = [];
  const synonymIndicies = [];

  // Add synonyms to full list
  // TODO: can this be done in a cleaner way?
  items.forEach((item, idx) => {
    itemsWithSynonyms.push(item.label);
    synonymIndicies.push(idx);
    if (item?.synonyms) {
      item.synonyms.forEach(synonym => {
        itemsWithSynonyms.push(synonym);
        synonymIndicies.push(idx);
      });
    }
  });

  // eslint-disable-next-line new-cap
  const u = new uFuzzy();

  const idxs = u.filter(itemsWithSynonyms, text);

  return Array.from(new Set(idxs.map(index => items[synonymIndicies[index]])));
}

function search(args: OfflineQuery): Promise<OfflineResponse> {
  return autocomplete(args);
}
function reverse(): Promise<unknown> {
  console.warn("Not implemented");
  return null;
}

export { autocomplete, reverse, search };
