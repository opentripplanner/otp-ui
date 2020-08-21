import { getTransitFare, isTransit } from "../itinerary";

describe("util > itinerary", () => {
  it("isTransit should work", () => {
    expect(isTransit("CAR")).toBeFalsy();
  });

  it("getTransitFare should return defaults with missing fare", () => {
    const { centsToString, dollarsToString, transitFare } = getTransitFare(
      null
    );
    // Make sure cents to string and dollars to string return same result
    expect(dollarsToString(1)).toEqual(centsToString(100));
    // Snapshot tests
    expect(centsToString(100)).toMatchSnapshot();
    expect(centsToString(transitFare)).toMatchSnapshot();
    expect(dollarsToString(1)).toMatchSnapshot();
    // transit fare value should be zero
    expect(transitFare).toMatchSnapshot();
  });

  it("getTransitFare should work with valid fare component", () => {
    const fareComponent = {
      currency: {
        currency: "USD",
        defaultFractionDigits: 2,
        currencyCode: "USD",
        symbol: "$"
      },
      cents: 575
    };
    const { centsToString, dollarsToString, transitFare } = getTransitFare(
      fareComponent
    );
    // Make sure cents to string and dollars to string return same result
    expect(dollarsToString(transitFare / 100)).toEqual(
      centsToString(transitFare)
    );
    // Snapshot tests
    expect(centsToString(transitFare)).toMatchSnapshot();
    expect(transitFare).toMatchSnapshot();
  });
});
