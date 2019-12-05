import * as Storage from "../utils/storage";

const useStorage = () => {
  const storeItem = (key, object) => {
    Storage.storeItem(key, object);
  };

  const getItem = (key, notFoundValue = null) => {
    return Storage.getItem(key, notFoundValue);
  };

  const removeItem = key => {
    Storage.removeItem(key);
  };

  return { storeItem, getItem, removeItem };
};

export default useStorage;
