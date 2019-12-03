import update from "immutability-helper";
import { LIGHT_THEME } from "./constants";

const INITIAL_STATE = {
  theme: LIGHT_THEME
};

export const createReducer = () => {
  return (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "SET_THEME":
        return update(state, { theme: { $set: action.payload } });
      default:
        return state;
    }
  };
};

export default createReducer;
