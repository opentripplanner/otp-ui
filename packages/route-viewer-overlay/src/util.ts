/**
 * Method to test if an object not only exists but contains entries
 */
// eslint-disable-next-line import/prefer-default-export
export const objectExistsAndPopulated = (o: Record<any, unknown>): boolean => {
  return !!o && Object.keys(o).length > 0;
};
