import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MOCK_THEME from "~/packages/trip-planner/src/common/__mocks__/theme";
import PlaceRow from ".";
import itinerary from "../../__mocks__/itinerary";
import config from "../../__mocks__/config";

describe("Place Row Component", () => {
  let sut;

  const customIcons = [];
  const leg = itinerary.legs[0];
  const legIndex = 0;
  const place = itinerary.legs[0].from;
  const time = itinerary.legs[0].startTime;
  const timeOptions = { format: "h:mm a" };
  const followsTransit = false;
  const routingType = "ITINERARY";
  const setActiveLeg = jest.fn(() => {});
  const frameLeg = jest.fn(() => {});
  const toRouteAbbreviation = jest.fn(r => r.toString());

  beforeEach(() => {
    sut = render(
      <ThemeProvider theme={MOCK_THEME}>
        <PlaceRow
          config={config}
          leg={leg}
          customIcons={customIcons}
          legIndex={legIndex}
          place={place}
          time={time}
          timeOptions={timeOptions}
          followsTransit={followsTransit}
          routingType={routingType}
          setActiveLeg={setActiveLeg}
          frameLeg={frameLeg}
          toRouteAbbreviation={toRouteAbbreviation}
        />
      </ThemeProvider>
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should match the snapshot", () => {
    const { asFragment } = sut;
    expect(asFragment()).toMatchSnapshot();
  });
});
