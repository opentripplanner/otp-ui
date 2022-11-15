import { Briefcase } from "@styled-icons/fa-solid/Briefcase";
import { Popup } from "@opentripplanner/base-map";
import {
  ClearLocationArg,
  Location,
  MapLocationActionArg,
  UserLocationAndType
} from "@opentripplanner/types";
import { FormattedMessage, useIntl } from "react-intl";
import { Home } from "@styled-icons/fa-solid/Home";
import { MapMarkerAlt } from "@styled-icons/fa-solid/MapMarkerAlt";
import { Marker, MarkerDragEvent } from "react-map-gl";
import { Sync } from "@styled-icons/fa-solid/Sync";
import { Times } from "@styled-icons/fa-solid/Times";
import coreUtils from "@opentripplanner/core-utils";
import flatten from "flat";
import React, { ComponentType, useState } from "react";

import * as S from "./styled";

// Load the default messages.
import defaultEnglishMessages from "../i18n/en-US.yml";

interface Props {
  clearLocation: (arg: ClearLocationArg) => void;
  forgetPlace: (type: string) => void;
  location?: Location;
  locations: Location[];
  MapMarkerIcon: ComponentType<UserLocationAndType>;
  rememberPlace: (arg: UserLocationAndType) => void;
  setLocation: (arg: MapLocationActionArg) => void;
  showUserSettings: boolean;
  type: string;
}

interface IconProps {
  type: string;
}

// HACK: We should flatten the messages loaded above because
// the YAML loaders behave differently between webpack and our version of jest:
// - the yaml loader for webpack returns a nested object,
// - the yaml loader for jest returns messages with flattened ids.
const defaultMessages: Record<string, string> = flatten(defaultEnglishMessages);

/**
 * These icons are used to render common icons for user locations. These will
 * only show up in applications that allow saving user locations.
 */
function UserLocationInnerIcon({ type }: IconProps) {
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

/**
 * Wrapper for icon that includes spacing.
 */
function UserLocationIcon({ type }: IconProps) {
  return (
    <S.IconWrapper>
      <UserLocationInnerIcon type={type} />
    </S.IconWrapper>
  );
}

const Endpoint = (props: Props): JSX.Element => {
  const intl = useIntl();

  const rememberAsHome = (): void => {
    const { location: propsLocation, rememberPlace } = props;
    const location = {
      ...propsLocation,
      icon: "home",
      id: "home",
      type: "home"
    };
    rememberPlace({ type: "home", location });
  };

  const rememberAsWork = (): void => {
    const { location: propsLocation, rememberPlace } = props;
    const location = {
      ...propsLocation,
      icon: "briefcase",
      id: "work",
      type: "work"
    };
    rememberPlace({ type: "work", location });
  };

  const forgetHome = (): void => {
    const { forgetPlace } = props;
    forgetPlace("home");
  };

  const forgetWork = (): void => {
    const { forgetPlace } = props;
    forgetPlace("work");
  };

  const clearLocation = (): void => {
    const { clearLocation: propsClearLocation, type } = props;
    propsClearLocation({ locationType: type });
  };

  const swapLocation = (): void => {
    const { location, setLocation, type } = props;
    clearLocation();
    const otherType = type === "from" ? "to" : "from";
    setLocation({ locationType: otherType, location });
  };

  const onDragEnd = (e: MarkerDragEvent) => {
    const { setLocation, type } = props;
    const rawLocation = e.lngLat;
    const coordinates = {
      lat: rawLocation.lat,
      lon: rawLocation.lng
    };

    const location = {
      ...coordinates,
      name: intl.formatMessage(
        {
          defaultMessage: defaultMessages["otpUi.EndpointsOverlay.coordinates"],
          description:
            "Formats rendering coordinates for a locale using the correct number separator",
          // FIXME: Combine with the same method at
          // https://github.com/opentripplanner/otp-react-redux/blob/6d5bc90e57843822809b0dff397bad19d66aeb43/lib/components/form/user-settings.js#L34
          // and move this potentially shared message to an appropriate package.
          id: "otpUi.EndpointsOverlay.coordinates"
        },
        coordinates
      )
    };
    setLocation({ locationType: type, location, reverseGeocode: true });
  };

  const [showPopup, setShowPopup] = useState(false);
  const { location, locations, MapMarkerIcon, showUserSettings, type } = props;
  if (!(location && location.lat && location.lon)) return null;
  const match = locations.find(l => coreUtils.map.matchLatLon(l, location));
  const isWork = match && match.type === "work";
  const isHome = match && match.type === "home";
  const iconHtml = <MapMarkerIcon location={location} type={type} />;
  const otherType = type === "from" ? "to" : "from";
  const icon = isWork ? "briefcase" : isHome ? "home" : "map-marker";
  return (
    // We have to use the standard marker here since we need to adjust state
    // after and during drag
    <Marker
      anchor="center"
      draggable
      latitude={location.lat}
      longitude={location.lon}
      onDragEnd={onDragEnd}
      onDragStart={() => setShowPopup(false)}
      onClick={() => setShowPopup(true)}
    >
      {iconHtml}
      {showPopup && showUserSettings && (
        <Popup
          onClose={() => setShowPopup(false)}
          latitude={location.lat}
          longitude={location.lon}
        >
          <div>
            <strong>
              <UserLocationIcon type={icon} />
              {location.name}
            </strong>
            <div>
              <S.Button
                disabled={isWork}
                onClick={isHome ? forgetHome : rememberAsHome}
              >
                {isHome ? (
                  <>
                    <UserLocationIcon type="times" />
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages["otpUi.EndpointsOverlay.forgetHome"]
                      }
                      description="Button text to forget the home location"
                      id="otpUi.EndpointsOverlay.forgetHome"
                    />
                  </>
                ) : (
                  <>
                    <UserLocationIcon type="home" />
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages["otpUi.EndpointsOverlay.saveAsHome"]
                      }
                      description="Button text to save the location as home location"
                      id="otpUi.EndpointsOverlay.saveAsHome"
                    />
                  </>
                )}
              </S.Button>
            </div>
            <div>
              <S.Button
                disabled={isHome}
                onClick={isWork ? forgetWork : rememberAsWork}
              >
                {isWork ? (
                  <>
                    <UserLocationIcon type="times" />
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages["otpUi.EndpointsOverlay.forgetWork"]
                      }
                      description="Button text to forget the work location"
                      id="otpUi.EndpointsOverlay.forgetWork"
                    />
                  </>
                ) : (
                  <>
                    <UserLocationIcon type="briefcase" />
                    <FormattedMessage
                      defaultMessage={
                        defaultMessages["otpUi.EndpointsOverlay.saveAsWork"]
                      }
                      description="Button text to save the location as work location"
                      id="otpUi.EndpointsOverlay.saveAsWork"
                    />
                  </>
                )}
              </S.Button>
            </div>
            <div>
              <S.Button onClick={clearLocation}>
                <UserLocationIcon type="times" />
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.EndpointsOverlay.clearLocation"]
                  }
                  description="Button text to clear the from/to location"
                  id="otpUi.EndpointsOverlay.clearLocation"
                  values={{ locationType: type }}
                />
              </S.Button>
            </div>
            <div>
              <S.Button onClick={swapLocation}>
                <UserLocationIcon type="refresh" />
                <FormattedMessage
                  defaultMessage={
                    defaultMessages["otpUi.EndpointsOverlay.swapLocation"]
                  }
                  description="Button text to swap the from/to location"
                  id="otpUi.EndpointsOverlay.swapLocation"
                  values={{ locationType: otherType }}
                />
              </S.Button>
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default Endpoint;
