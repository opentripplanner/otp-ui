import { LngLatBounds } from "maplibre-gl";

/**
 * Method to test if an object not only exists but contains entries
 */
// eslint-disable-next-line import/prefer-default-export
export function objectExistsAndPopulated<
  T extends LngLatBounds | Record<string, unknown>
>(o: T | undefined): o is T {
  return !!o && Object.keys(o).length > 0;
}
