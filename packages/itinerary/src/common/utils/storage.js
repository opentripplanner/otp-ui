const STORAGE_PREFIX = "tora";

export function storeItem(key, object) {
  window.localStorage.setItem(
    `${STORAGE_PREFIX}.${key}`,
    JSON.stringify(object)
  );
}

export function getItem(key, notFoundValue = null) {
  let itemAsString;
  try {
    itemAsString = window.localStorage.getItem(`${STORAGE_PREFIX}.${key}`);
    const json = JSON.parse(itemAsString);
    if (json) return json;
    return notFoundValue;
  } catch (e) {
    return notFoundValue;
  }
}

export function removeItem(key) {
  window.localStorage.removeItem(`${STORAGE_PREFIX}.${key}`);
}
