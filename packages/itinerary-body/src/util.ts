import flatten from "flat";
import { Company, FlexBookingInfo, Place } from "@opentripplanner/types";
import { IntlShape } from "react-intl";

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
    case "SCOOTER":
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
    case "SCOOTER":
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
    case "SCOOTER":
      return `dotted 4px ${toModeBorderColor(mode, routeColor)}`;
    default:
      return `solid 8px ${toModeBorderColor(mode, routeColor)}`;
  }
};

/**
 * FIXME: Move this method back to core-utils when package is localized.
 */
function getCompanyForNetwork(
  networkString: string,
  companies: Company[] = []
) {
  const company = companies.find(co => co.id === networkString);
  if (!company) {
    console.warn(
      `No company found in config.yml that matches rented vehicle network: ${networkString}`,
      companies
    );
  }
  return company;
}

/**
 * Generates a new place name for micromobility stations
 * @param place OTP Place from micromobility location
 * @param companies Configured micromobility companies
 * @param intl IntlShape object
 * @returns User facing string for place
 */
export function getPlaceName(
  place: Place,
  companies: Company[] = [],
  intl?: IntlShape
): string {
  // If address is provided (i.e. for carshare station, use it)
  if (place.address) return place.address.split(",")?.[0];
  if ((place.name.match(/-/g) || []).length > 3) {
    // Some vehicle rental pick up locations are just a UUID.
    // Other times, it can be a name with relevant information for the user.
    // Here we detect if the name is just a UUID and generate a better name.
    const company = getCompanyForNetwork(place.networks?.[0], companies);
    if (company && intl) {
      return intl.formatMessage(
        {
          defaultMessage: defaultMessages["otpUi.AccessLegBody.vehicleTitle"],
          description: "Formats rental vehicle company and type",
          id: "otpUi.AccessLegBody.vehicleTitle"
        },
        {
          company: company.label,
          modeType: place.vertexType
        }
      );
    }
  }
  // Default to place name
  return place.name;
}

/**
 * Helper function that assembles values for flex pickup/dropoff messages.
 */
export function getFlexMessageValues(
  info: FlexBookingInfo
): {
  hasPhone: boolean;
  leadDays?: number;
  phoneNumber?: string;
} {
  return {
    // There used to be a varaible `hasLeadTime` here. This should be brought back
    // if the leadTime check is ever to be more than just checking the value of
    // daysPrior (which can be done within react-intl)
    hasPhone: !!info?.contactInfo?.phoneNumber,
    leadDays: info.latestBookingTime.daysPrior,
    phoneNumber: info?.contactInfo?.phoneNumber
  };
}
