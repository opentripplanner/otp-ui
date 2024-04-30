import React, { useCallback, useMemo } from "react";
import { Popup } from "@opentripplanner/base-map";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { Location } from "@opentripplanner/types";
import { getEntryRelativeTo } from "./util";

type EndpointProps = {
  location?: Location;
  UserLocationIcon: any;
  isWork: boolean;
  isHome: boolean;
  forgetHome: () => void;
  rememberAsHome: () => void;
  forgetWork: () => void;
  rememberAsWork: () => void;
  clearLocation: () => void;
  swapLocation: () => void;
  setShowPopup: (arg: boolean) => void;
  type: string;
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
    text-decoration: underline;
    cursor: pointer;
  }
`;

function EndpointPopup({
  location,
  UserLocationIcon,
  isWork,
  isHome,
  forgetHome,
  rememberAsHome,
  forgetWork,
  rememberAsWork,
  clearLocation,
  swapLocation,
  setShowPopup,
  type
}: EndpointProps): JSX.Element {
  const otherType = type === "from" ? "to" : "from";
  const icon = isWork ? "briefcase" : isHome ? "home" : "map-marker";
  let keysDown: string[] = useMemo(() => [], []);

  const queryId = `${type}-endpoint-popup button`;

  const handleKeyDown = useCallback(
    e => {
      keysDown.push(e.key);
      const element = e.target as HTMLElement;
      switch (e.key) {
        case "Escape":
          setShowPopup(false);
          break;
        case "Tab":
          if (keysDown.includes("Shift")) {
            e.preventDefault();
            getEntryRelativeTo(queryId, element, -1)?.focus();
          } else {
            e.preventDefault();
            getEntryRelativeTo(queryId, element, 1)?.focus();
          }
          break;
        case " ":
          break;
        default:
      }
    },
    [setShowPopup, keysDown]
  );

  const handleKeyUp = (e: any) => {
    keysDown = keysDown.filter(key => key !== e.key);
  };
  return (
    <Popup latitude={location.lat} longitude={location.lon}>
      <div
        role="presentation"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        id={`${type}-endpoint-popup`}
      >
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
      </div>
    </Popup>
  );
}

export default EndpointPopup;
