/* eslint-disable no-console */
// Prefix to use with local storage keys.
const STORAGE_PREFIX = "otp";

/**
 * Store a javascript object at the specified key.
 */
export function storeItem(key: string, object: unknown): void {
  window.localStorage.setItem(
    `${STORAGE_PREFIX}.${key}`,
    JSON.stringify(object)
  );
}

/**
 * Retrieve a javascript object at the specified key. If not found, defaults to
 * null or, the optionally provided notFoundValue.
 */
export function getItem(key: string, notFoundValue: unknown = null): unknown {
  let itemAsString: string;
  try {
    itemAsString = window.localStorage.getItem(`${STORAGE_PREFIX}.${key}`);
    const json = JSON.parse(itemAsString);
    if (json) return json;
    return notFoundValue;
  } catch (e) {
    // Catch any errors associated with parsing bad JSON.
    console.warn(e, itemAsString);
    return notFoundValue;
  }
}

/**
 * Remove item at specified key.
 */
export function removeItem(key: string): void {
  window.localStorage.removeItem(`${STORAGE_PREFIX}.${key}`);
}

/**
 * Generate a random ID. This might not quite be a UUID, but it serves our
 * purposes for now.
 */
export function randId(): string {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}
