import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MOCK_THEME from "~/packages/trip-planner/src/common/__mocks__/theme";
import ItineraryBody from ".";
import itinerary from "../../__mocks__/itinerary";
import config from "../../__mocks__/config";

const companies = "";
const timeOptions = { format: "h:mm a" };
const routingType = "ITINERARY";

// Originally from OTP MOD config
const longDateFormat = "MMMM D, YYYY";
// Originally from OTP MOD config
const operator = {
  id: "TRIMET",
  name: "TriMet",
  logo:
    "http://news.trimet.org/wordpress/wp-content/uploads/2019/04/TriMet-logo-300x300.png"
};
// Originally from OTP MOD config
const timeFormat = "h:mm a";
const customIcons = [];
const frameLeg = jest.fn(() => {});
const setActiveLeg = jest.fn(() => {});
const toRouteAbbreviation = r => r.toString();

describe("Itinerary Body Component", () => {
  let sut;

  beforeEach(() => {
    sut = render(
      <ThemeProvider theme={MOCK_THEME}>
        <ItineraryBody
          itinerary={itinerary}
          setActiveLeg={setActiveLeg}
          timeOptions={timeOptions}
          // Companies that come from the current query
          companies={companies}
          routingType={routingType}
          frameLeg={frameLeg}
          toRouteAbbreviation={toRouteAbbreviation}
          longDateFormat={longDateFormat}
          operator={operator}
          timeFormat={timeFormat}
          config={config}
          customIcons={customIcons}
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
