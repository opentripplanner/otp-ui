import { divIcon } from "leaflet";
import {
  constructLocation,
  matchLatLon
} from "@opentripplanner/core-utils/lib/map";
import { locationType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Marker, Popup } from "react-leaflet";
import ReactDOMServer from "react-dom/server";
import {
  Briefcase,
  Home,
  MapMarkerAlt,
  Sync,
  Times
} from "styled-icons/fa-solid";

import * as Styled from "./styled";

function DefaultMapMarkerIcon({ location, type }) {
  return (
    <Styled.StackedIconContainer title={location.name}>
      {type === "from" ? (
        // From icon should have white circle background
        <>
          <Styled.StackedCircle size={24} />
          <Styled.StackedLocationIcon size={24} type={type} />
        </>
      ) : (
        <>
          <Styled.StackedToIcon size={24} type="to" />
          <Styled.ToIcon size={20} type={type} />
        </>
      )}
    </Styled.StackedIconContainer>
  );
}

DefaultMapMarkerIcon.propTypes = {
  location: locationType.isRequired,
  type: PropTypes.string.isRequired
};

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
    clearLocation({ type });
  };

  swapLocation = () => {
    const { location, setLocation, type } = this.props;
    this.clearLocation();
    const otherType = type === "from" ? "to" : "from";
    setLocation({ type: otherType, location });
  };

  onDragEnd = e => {
    const { setLocation, type } = this.props;
    const location = constructLocation(e.target.getLatLng());
    setLocation({ type, location, reverseGeocode: true });
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
    const match = locations.find(l => matchLatLon(l, location));
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
                      <UserLocationIcon type="times" /> Forget home
                    </span>
                  ) : (
                    <span>
                      <UserLocationIcon type="home" /> Save as home
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
                      <UserLocationIcon type="times" /> Forget work
                    </span>
                  ) : (
                    <span>
                      <UserLocationIcon type="briefcase" /> Save as work
                    </span>
                  )}
                </Styled.Button>
              </div>
              <div>
                <Styled.Button onClick={this.clearLocation}>
                  <UserLocationIcon type="times" /> Remove as {type} location
                </Styled.Button>
              </div>
              <div>
                <Styled.Button onClick={this.swapLocation}>
                  <UserLocationIcon type="refresh" /> Change to {otherType}{" "}
                  location
                </Styled.Button>
              </div>
            </div>
          </Popup>
        )}
      </Marker>
    );
  }
}

// See documenation in main index file for documenation on these props.
Endpoint.propTypes = {
  clearLocation: PropTypes.func.isRequired,
  forgetPlace: PropTypes.func.isRequired,
  location: locationType.isRequired,
  locations: PropTypes.arrayOf(locationType).isRequired,
  MapMarkerIcon: PropTypes.elementType,
  rememberPlace: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  showUserSettings: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired
};

Endpoint.defaultProps = {
  MapMarkerIcon: DefaultMapMarkerIcon
};
