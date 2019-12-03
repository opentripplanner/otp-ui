export const transitModes = [
  "TRAM",
  "BUS",
  "SUBWAY",
  "FERRY",
  "RAIL",
  "GONDOLA"
];

export function isTransit(mode) {
  return transitModes.includes(mode) || mode === "TRANSIT";
}

// TODO: Is this a place where we can get these colors dynamically?
export function getMapColor(mode) {
  switch (mode) {
    case "WALK":
      return "#444";
    case "BICYCLE":
      return "#0073e5";
    case "SUBWAY":
      return "#f00";
    case "RAIL":
      return "#b00";
    case "BUS":
      return "#080";
    case "TRAM":
      return "#800";
    case "FERRY":
      return "#008";
    case "CAR":
      return "#444";
    case "MICROMOBILITY":
      return "#f5a729";
    default:
      return "#aaa";
  }
}

// TODO: temporary code; handle via migrated OTP i18n language table
export function getStepDirection(step) {
  switch (step.relativeDirection) {
    case "DEPART":
      return `Head ${step.absoluteDirection.toLowerCase()}`;
    case "LEFT":
      return "Left";
    case "HARD_LEFT":
      return "Hard left";
    case "SLIGHTLY_LEFT":
      return "Slight left";
    case "CONTINUE":
      return "Continue";
    case "SLIGHTLY_RIGHT":
      return "Slight right";
    case "RIGHT":
      return "Right";
    case "HARD_RIGHT":
      return "Hard right";
    case "CIRCLE_CLOCKWISE":
      return "Follow circle clockwise";
    case "CIRCLE_COUNTERCLOCKWISE":
      return "Follow circle counterclockwise";
    case "ELEVATOR":
      return "Take elevator";
    case "UTURN_LEFT":
      return "Left U-turn";
    case "UTURN_RIGHT":
      return "Right U-turn";
    default:
      return step.relativeDirection;
  }
}

export function getStepInstructions(step) {
  const conjunction = step.relativeDirection === "ELEVATOR" ? "to" : "on";
  return `${getStepDirection(step)} ${conjunction} ${step.streetName}`;
}

export function getStepStreetName(step) {
  if (step.streetName === "road") return "Unnamed Road";
  if (step.streetName === "path") return "Unnamed Path";
  return step.streetName;
}

/**
 * Get the configured company object for the given network string if the company
 * has been defined in the provided companies array config.
 */
function getCompanyForNetwork(networkString, companies = []) {
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
 * Returns mode name by checking the vertex type (VertexType class in OTP) for
 * the provided place. NOTE: this is currently only intended for vehicles at
 * the moment (not transit or walking).
 *
 * TODO: I18N
 * @param  {string} place place from itinerary leg
 */
export function getModeForPlace(place) {
  switch (place.vertexType) {
    case "CARSHARE":
      return "car";
    case "VEHICLERENTAL":
      return "E-scooter";
    // TODO: Should the type change depending on bike vertex type?
    case "BIKESHARE":
    case "BIKEPARK":
      return "bike";
    // If company offers more than one mode, default to `vehicle` string.
    default:
      return "vehicle";
  }
}

export function getPlaceName(place, companies) {
  // If address is provided (i.e. for carshare station, use it)
  if (place.address) return place.address.split(",")[0];
  if (place.networks && place.vertexType === "VEHICLERENTAL") {
    // For vehicle rental pick up, do not use the place name. Rather, use
    // company name + vehicle type (e.g., SPIN E-scooter). Place name is often just
    // a UUID that has no relevance to the actual vehicle. For bikeshare, however,
    // there are often hubs or bikes that have relevant names to the user.
    const company = getCompanyForNetwork(place.networks[0], companies);
    if (company) {
      return `${company.label} ${getModeForPlace(place)}`;
    }
  }
  // Default to place name
  return place.name;
}

export function toSentenceCase(str) {
  if (str == null) {
    return "";
  }
  const typedString = String(str);
  return (
    typedString.charAt(0).toUpperCase() + typedString.substr(1).toLowerCase()
  );
}

export function getLegModeLabel(leg) {
  switch (leg.mode) {
    case "BICYCLE_RENT":
      return "Biketown";
    case "CAR":
      return leg.hailedCar ? "Ride" : "Drive";
    case "GONDOLA":
      return "Aerial Tram";
    case "TRAM":
      if (leg.routeLongName.toLowerCase().indexOf("streetcar") !== -1)
        return "Streetcar";
      return "Light Rail";
    case "MICROMOBILITY":
      return "Ride";
    default:
      return toSentenceCase(leg.mode);
  }
}

/** Looks up an operator from the provided configuration */
export const getOperatorFromConfig = (id, config) =>
  config.operators.find(operator => operator.id === id) || null;
