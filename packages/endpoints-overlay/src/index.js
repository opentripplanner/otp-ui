import { locationType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";

import Endpoint from "./endpoint";

function EndpointsOverlay({
  clearLocation,
  forgetPlace,
  fromLocation,
  locations,
  rememberPlace,
  setLocation,
  showUserSettings,
  toLocation
}) {
  return (
    <div>
      <Endpoint
        clearLocation={clearLocation}
        forgetPlace={forgetPlace}
        location={fromLocation}
        locations={locations}
        rememberPlace={rememberPlace}
        setLocation={setLocation}
        showUserSettings={showUserSettings}
        type="from"
      />
      <Endpoint
        clearLocation={clearLocation}
        forgetPlace={forgetPlace}
        location={toLocation}
        locations={locations}
        rememberPlace={rememberPlace}
        setLocation={setLocation}
        showUserSettings={showUserSettings}
        type="to"
      />
    </div>
  );
}

EndpointsOverlay.propTypes = {
  /**
   * Dispatched when a user clicks on the clear location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { type: "from/to" }
   */
  clearLocation: PropTypes.func,
  /**
   * Dispatched when a user clicks on the forget location button in the user
   * settings. Not needed unless user settings is activated. Dispatched with a
   * string argument representing the type of saved location.
   */
  forgetPlace: PropTypes.func,
  /**
   * The from location.
   */
  fromLocation: locationType.isRequired,
  /**
   * An array of location that the user has saved. Not needed unless user
   * settings is activated.
   */
  locations: PropTypes.arrayOf(locationType),
  /**
   * Dispatched when a user clicks on the remember place button in the user
   * settings. Not needed unless user settings is activated. Dispatched with an
   * argument in the form of:
   *
   * { location: {...location}, type: "home/work" }
   */
  rememberPlace: PropTypes.func,
  /**
   * Dispatched when a location is dragged somewhere else on the map. Dispatched
   * with an argument in the form of:
   *
   * { location: {...location}, reverseGeocode: true, type: "from/to" }
   */
  setLocation: PropTypes.func.isRequired,
  /**
   * Whether or not to show the user settings popup when an endpoint is clicked.
   */
  showUserSettings: PropTypes.bool,
  /**
   * To to location
   */
  toLocation: locationType.isRequired
};

const noop = () => {};

EndpointsOverlay.defaultProps = {
  clearLocation: noop,
  forgetPlace: noop,
  rememberPlace: noop,
  locations: [],
  showUserSettings: false
};

export default EndpointsOverlay;
