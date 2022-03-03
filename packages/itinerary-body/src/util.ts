import flatten from "flat";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
export const defaultMessages: Record<string, string> = flatten(
  defaultEnglishMessages
);

/**
 * the GTFS spec indicates that the route color should not have a leading hash
 * symbol, so add one if the routeColor exists and doesn't start with a hash
 * symbol.
 */
export const toSafeRouteColor = (routeColor: string): string => {
  return (
    routeColor && (routeColor.startsWith("#") ? routeColor : `#${routeColor}`)
  );
};

export const toModeColor = (mode: string, routeColor: string): string => {
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
      return toSafeRouteColor(routeColor) || "#084c8d";
  }
};

export const toModeBorderColor = (mode: string, routeColor: string): string => {
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
      return toSafeRouteColor(routeColor) || "#008ab0";
  }
};

export const toModeBorder = (mode: string, routeColor: string): string => {
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
