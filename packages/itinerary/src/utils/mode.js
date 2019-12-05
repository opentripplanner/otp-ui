import {
  DEFAULT_MODE_BORDER_COLOR,
  DEFAULT_ROUTE_COLOR
} from "../common/constants";

export const toModeColor = (mode, routeColor) => {
  switch (mode) {
    case "WALK":
      return `#e9e9e9`;
    case "BICYCLE":
    case "BICYCLE_RENT":
      return `red`;
    case "CAR":
      return `grey`;
    case "MICROMOBILITY":
    case "MICROMOBILITY_RENT":
      return `#f5a729`;
    default:
      return routeColor || DEFAULT_ROUTE_COLOR;
  }
};

export const toModeBorderColor = (mode, routeColor) => {
  switch (mode) {
    case "WALK":
      return `#484848`;
    case "BICYCLE":
    case "BICYCLE_RENT":
      return `red`;
    case "CAR":
      return `grey`;
    case "MICROMOBILITY":
    case "MICROMOBILITY_RENT":
      return `#f5a729`;
    default:
      return routeColor || DEFAULT_MODE_BORDER_COLOR;
  }
};

export const toModeBorder = (mode, routeColor) => {
  switch (mode) {
    case "WALK":
    case "BICYCLE":
    case "BICYCLE_RENT":
    case "CAR":
    case "MICROMOBILITY":
    case "MICROMOBILITY_RENT":
      return `dotted 4px ${toModeBorderColor(mode, routeColor)}`;
    default:
      return `solid 8px ${toModeBorderColor(mode, routeColor)}`;
  }
};
