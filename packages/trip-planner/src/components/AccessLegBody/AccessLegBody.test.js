import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MOCK_THEME from "~/packages/trip-planner/src/common/__mocks__/theme";
import AccessLegBody from ".";
import itinerary from "../../__mocks__/itinerary";
import config from "../../__mocks__/config";

describe("AccessLegBody Component", () => {
  let sut;

  const customIcons = [];
  const followsTransit = false;
  const leg = itinerary.legs[0];
  const timeOptions = { format: "h:mm a" };
  const legIndex = 0;
  const routingType = "ITINERARY";
  const setActiveLeg = jest.fn(() => {});

  beforeEach(() => {
    sut = render(
      <ThemeProvider theme={MOCK_THEME}>
        <AccessLegBody
          config={config}
          leg={leg}
          customIcons={customIcons}
          legIndex={legIndex}
          timeOptions={timeOptions}
          followsTransit={followsTransit}
          setActiveLeg={setActiveLeg}
          routingType={routingType}
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
