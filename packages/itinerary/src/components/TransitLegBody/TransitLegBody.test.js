import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import MOCK_THEME from "../../common/__mocks__/theme";
import TransitLegBody from ".";
import itinerary from "../../__mocks__/itinerary";

describe("Transit Leg Body Component", () => {
  const setActiveLeg = jest.fn(() => {});
  const leg = itinerary.legs[1];
  const legIndex = 1;
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

  let sut;

  beforeEach(() => {
    sut = render(
      <ThemeProvider theme={MOCK_THEME}>
        <TransitLegBody
          leg={leg}
          legIndex={legIndex}
          setActiveLeg={setActiveLeg}
          longDateFormat={longDateFormat}
          operator={operator}
          timeFormat={timeFormat}
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
