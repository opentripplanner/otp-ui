import uFuzzy from "@leeoniya/ufuzzy";

export type OfflineResponse = {
  label: string;
  lat: number;
  lon: number;
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
  const idxs = u.filter(
    items.map(item => item.label),
    text
  );

  return idxs.map(index => items[index]);
}

function search(args: OfflineQuery): Promise<OfflineResponse> {
  return autocomplete(args);
}
function reverse(): Promise<unknown> {
  console.warn("Not implemented");
  return null;
}

export { autocomplete, reverse, search };
