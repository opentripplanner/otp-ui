import {
  calculateTncFares,
  getCompanyFromLeg,
  getTransitFare,
  isTransit
} from "../itinerary";

const bikeRentalItinerary = require("./__mocks__/bike-rental-itinerary.json");
const tncItinerary = require("./__mocks__/tnc-itinerary.json");

describe("util > itinerary", () => {
  it("isTransit should work", () => {
    expect(isTransit("CAR")).toBeFalsy();
  });

  it("getCompanyFromLeg should return company for bike rental leg", () => {
    const company = getCompanyFromLeg(bikeRentalItinerary.legs[1]);
    expect(company).toEqual("GBFS");
  });

  it("getCompanyFromLeg should return company for TNC leg", () => {
    const company = getCompanyFromLeg(tncItinerary.legs[0]);
    expect(company).toEqual("UBER");
  });

  it("getTransitFare should return defaults with missing fare", () => {
    const { transitFare } = getTransitFare(null);
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
    const { currencyCode, transitFare } = getTransitFare(fareComponent);
    expect(currencyCode).toEqual(fareComponent.currency.currencyCode);
    // Snapshot tests
    expect(transitFare).toMatchSnapshot();
  });

  it("calculateFare should return the correct currency code for TNC leg", () => {
    const fareResult = calculateTncFares(tncItinerary, true);
    expect(fareResult.currencyCode).toEqual("USD");
  });
});
