import React from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { Popup } from "@opentripplanner/base-map";
import { Location } from "@opentripplanner/types";

import FocusTrapWrapper from "./FocusTrapWrapper";

type EndpointProps = {
  clearLocation: () => void;
  forgetHome: () => void;
  forgetWork: () => void;
  location?: Location;
  isWork: boolean;
  isHome: boolean;
  rememberAsHome: () => void;
  rememberAsWork: () => void;
  setShowPopup?: (arg: boolean) => void;
  swapLocation: () => void;
  type: string;
  UserLocationIcon: any;
};

const Button = styled.button`
  background: none;
  border: none;
  color: navy;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding-left: 0.2em;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const EndpointPopupContent = ({
  clearLocation,
  location,
  forgetHome,
  forgetWork,
  isWork,
  isHome,
  rememberAsHome,
  rememberAsWork,
  swapLocation,
  type,
  UserLocationIcon
}: EndpointProps): JSX.Element => {
  const otherType = type === "from" ? "to" : "from";
  const icon = isWork ? "briefcase" : isHome ? "home" : "map-marker";
  return (
    <>
      <strong>
        <UserLocationIcon type={icon} />
        {location.name}
      </strong>
      <div>
        <Button
          disabled={isWork}
          onClick={isHome ? forgetHome : rememberAsHome}
        >
          {isHome ? (
            <>
              <UserLocationIcon type="times" />
              <FormattedMessage
                description="Button text to forget the home location"
                id="otpUi.EndpointsOverlay.forgetHome"
              />
            </>
          ) : (
            <>
              <UserLocationIcon type="home" />
              <FormattedMessage
                description="Button text to save the location as home location"
                id="otpUi.EndpointsOverlay.saveAsHome"
              />
            </>
          )}
        </Button>
      </div>
      <div>
        <Button
          disabled={isHome}
          onClick={isWork ? forgetWork : rememberAsWork}
        >
          {isWork ? (
            <>
              <UserLocationIcon type="times" />
              <FormattedMessage
                description="Button text to forget the work location"
                id="otpUi.EndpointsOverlay.forgetWork"
              />
            </>
          ) : (
            <>
              <UserLocationIcon type="briefcase" />
              <FormattedMessage
                description="Button text to save the location as work location"
                id="otpUi.EndpointsOverlay.saveAsWork"
              />
            </>
          )}
        </Button>
      </div>
      <div>
        <Button onClick={clearLocation}>
          <UserLocationIcon type="times" />
          <FormattedMessage
            description="Button text to clear the from/to location"
            id="otpUi.EndpointsOverlay.clearLocation"
            values={{ locationType: type }}
          />
        </Button>
      </div>
      <div>
        <Button onClick={swapLocation}>
          <UserLocationIcon type="refresh" />
          <FormattedMessage
            description="Button text to swap the from/to location"
            id="otpUi.EndpointsOverlay.swapLocation"
            values={{ locationType: otherType }}
          />
        </Button>
      </div>
    </>
  );
};

function EndpointPopup({
  clearLocation,
  location,
  forgetHome,
  forgetWork,
  isWork,
  isHome,
  rememberAsHome,
  rememberAsWork,
  setShowPopup,
  swapLocation,
  type,
  UserLocationIcon
}: EndpointProps): JSX.Element {
  return (
    <Popup latitude={location.lat} longitude={location.lon}>
      <FocusTrapWrapper
        closePopup={() => setShowPopup(false)}
        id={`${type}-endpoint-popup`}
      >
        <EndpointPopupContent
          clearLocation={clearLocation}
          location={location}
          forgetHome={forgetHome}
          forgetWork={forgetWork}
          isWork={isWork}
          isHome={isHome}
          rememberAsHome={rememberAsHome}
          rememberAsWork={rememberAsWork}
          swapLocation={swapLocation}
          type={type}
          UserLocationIcon={UserLocationIcon}
        />
      </FocusTrapWrapper>
    </Popup>
  );
}

export default EndpointPopup;
