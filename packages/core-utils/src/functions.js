/**
 * Checks if a parameter is actually a function.
 * @param {*} fn The function to call.
 * @returns fn if fn is a function, or a dummy function.
 */
// eslint-disable-next-line import/prefer-default-export
export function callIfValid(fn) {
  if (typeof fn === "function") return fn;
  return () => {};
}
