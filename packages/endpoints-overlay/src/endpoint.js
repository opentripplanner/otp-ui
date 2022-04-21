import flatten from "flat";
import { divIcon } from "leaflet";
import coreUtils from "@opentripplanner/core-utils";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Marker, Popup } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarkerAlt } from "@styled-icons/fa-solid/MapMarkerAlt";
import { Sync } from "@styled-icons/fa-solid/Sync";
import { Times } from "@styled-icons/fa-solid/Times";

import * as Styled from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages = flatten(defaultEnglishMessages);

/**
 * These icons are used to render common icons for user locations. These will
 * only show up in applications that allow saving user locations.
 */
function UserLocationIcon({ type }) {
  switch (type) {
    case "briefcase":
      return <Briefcase size={12} />;
    case "home":
      return <Home size={12} />;
    case "map-marker":
      return <MapMarkerAlt size={12} />;
    case "refresh":
      return <Sync size={12} />;
    case "times":
      return <Times size={12} />;
    default:
      return null;
  }
}

UserLocationIcon.propTypes = {
  type: PropTypes.string.isRequired
};

export default class Endpoint extends Component {
  rememberAsHome = () => {
    const { location: propsLocation, rememberPlace } = this.props;
    const location = { ...propsLocation };
    location.id = "home";
    location.icon = "home";
    location.type = "home";
    rememberPlace({ type: "home", location });
  };

  rememberAsWork = () => {
    const { location: propsLocation, rememberPlace } = this.props;
    const location = { ...propsLocation };
    location.id = "work";
    location.icon = "briefcase";
    location.type = "work";
    rememberPlace({ type: "work", location });
  };

  forgetHome = () => {
    const { forgetPlace } = this.props;
    forgetPlace("home");
  };

  forgetWork = () => {
    const { forgetPlace } = this.props;
    forgetPlace("work");
  };

  clearLocation = () => {
    const { clearLocation, type } = this.props;
    clearLocation({ locationType: type });
  };

  swapLocation = () => {
    const { location, setLocation, type } = this.props;
    this.clearLocation();
    const otherType = type === "from" ? "to" : "from";
    setLocation({ locationType: otherType, location });
  };

  onDragEnd = e => {
    const { setLocation, type } = this.props;
    // This method is depcreated. the latlng object should be fed into react intl
    const location = coreUtils.map.constructLocation(e.target.getLatLng());
    setLocation({ locationType: type, location, reverseGeocode: true });
  };

  render() {
    const {
      location,
      locations,
      MapMarkerIcon,
      showUserSettings,
      type
    } = this.props;
    const position =
      location && location.lat && location.lon
        ? [location.lat, location.lon]
        : null;
    if (!position) return null;
    const match = locations.find(l => coreUtils.map.matchLatLon(l, location));
    const isWork = match && match.type === "work";
    const isHome = match && match.type === "home";
    const iconHtml = ReactDOMServer.renderToStaticMarkup(
      <MapMarkerIcon location={location} type={type} />
    );
    const otherType = type === "from" ? "to" : "from";
    const icon = isWork ? "briefcase" : isHome ? "home" : "map-marker";
    return (
      <Marker
        draggable
        icon={divIcon({ html: iconHtml, className: "" })}
        position={position}
        onDragEnd={this.onDragEnd}
      >
        {showUserSettings && (
          <Popup>
            <div>
              <strong>
                <UserLocationIcon type={icon} /> {location.name}
              </strong>
              <div>
                <Styled.Button
                  disabled={isWork}
                  onClick={isHome ? this.forgetHome : this.rememberAsHome}
                >
                  {isHome ? (
                    <span>
                      <UserLocationIcon type="times" />{" "}
                      <FormattedMessage
                        defaultMessage={
                          defaultMessages["otpUi.EndpointsOverlay.forgetHome"]
                        }
                        description="Button text to forget the home location"
                        id="otpUi.EndpointsOverlay.forgetHome"
                      />
                    </span>
                  ) : (
                    <span>
                      <UserLocationIcon type="home" />{" "}
                      <FormattedMessage
                        defaultMessage={
                          defaultMessages["otpUi.EndpointsOverlay.saveAsHome"]
                        }
                        description="Button text to save the location as home location"
                        id="otpUi.EndpointsOverlay.saveAsHome"
                      />
                    </span>
                  )}
                </Styled.Button>
              </div>
              <div>
                <Styled.Button
                  disabled={isHome}
                  onClick={isWork ? this.forgetWork : this.rememberAsWork}
                >
                  {isWork ? (
                    <span>
                      <UserLocationIcon type="times" />{" "}
                      <FormattedMessage
                        defaultMessage={
                          defaultMessages["otpUi.EndpointsOverlay.forgetWork"]
                        }
                        description="Button text to forget the work location"
                        id="otpUi.EndpointsOverlay.forgetWork"
                      />
                    </span>
                  ) : (
                    <span>
                      <UserLocationIcon type="briefcase" />{" "}
                      <FormattedMessage
                        defaultMessage={
                          defaultMessages["otpUi.EndpointsOverlay.saveAsWork"]
                        }
                        description="Button text to save the location as work location"
                        id="otpUi.EndpointsOverlay.saveAsWork"
                      />
                    </span>
                  )}
                </Styled.Button>
              </div>
              <div>
                <Styled.Button onClick={this.clearLocation}>
                  <UserLocationIcon type="times" />{" "}
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.EndpointsOverlay.clearLocation"]
                    }
                    description="Button text to clear the from/to location"
                    id="otpUi.EndpointsOverlay.clearLocation"
                    values={{ locationType: type }}
                  />
                </Styled.Button>
              </div>
              <div>
                <Styled.Button onClick={this.swapLocation}>
                  <UserLocationIcon type="refresh" />{" "}
                  <FormattedMessage
                    defaultMessage={
                      defaultMessages["otpUi.EndpointsOverlay.swapLocation"]
                    }
                    description="Button text to swap the from/to location"
                    id="otpUi.EndpointsOverlay.swapLocation"
                    values={{ locationType: otherType }}
                  />
                </Styled.Button>
              </div>
            </div>
          </Popup>
        )}
      </Marker>
    );
  }
}

// See documentation in main index file for documentation on these props.
Endpoint.propTypes = {
  clearLocation: PropTypes.func.isRequired,
  forgetPlace: PropTypes.func.isRequired,
  location: coreUtils.types.locationType,
  locations: PropTypes.arrayOf(coreUtils.types.locationType).isRequired,
  MapMarkerIcon: PropTypes.elementType.isRequired,
  rememberPlace: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  showUserSettings: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

Endpoint.defaultProps = {
  location: undefined
};
