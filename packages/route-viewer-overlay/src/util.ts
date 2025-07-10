import { LngLatBounds } from "maplibre-gl";

/**
 * Method to test if an object not only exists but contains entries
 */
// eslint-disable-next-line import/prefer-default-export
export const objectExistsAndPopulated = (
  o: LngLatBounds | Record<string, unknown>
): boolean => {
  return !!o && Object.keys(o).length > 0;
};
