import {
  calculateTncFares,
  getCompanyFromLeg,
  getTransitFare,
  isTransit
} from "../itinerary";

const bikeRentalItinerary = require("./__mocks__/bike-rental-itinerary.json");
const tncItinerary = require("./__mocks__/tnc-itinerary.json");

describe("util > itinerary", () => {
  describe("isTransit", () => {
    it("should work", () => {
      expect(isTransit("CAR")).toBeFalsy();
      expect(isTransit("BUS")).toBeTruthy();
    });
  });

  describe("getCompanyFromLeg", () => {
    it("should return company for bike rental leg", () => {
      const company = getCompanyFromLeg(bikeRentalItinerary.legs[1]);
      expect(company).toEqual("GBFS");
    });

    it("should return company for TNC leg", () => {
      const company = getCompanyFromLeg(tncItinerary.legs[0]);
      expect(company).toEqual("UBER");
    });
  });

  describe("getTransitFare", () => {
    it("should return defaults with missing fare", () => {
      const { transitFare } = getTransitFare(null);
      // transit fare value should be zero
      expect(transitFare).toMatchSnapshot();
    });

    it("should work with valid fare component", () => {
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
  });

  describe("calculateTncFares", () => {
    it("should return the correct amounts and currency for an itinerary with TNC", () => {
      const fareResult = calculateTncFares(tncItinerary, true);
      expect(fareResult.currencyCode).toEqual("USD");
      expect(fareResult.maxTNCFare).toEqual(19);
      expect(fareResult.minTNCFare).toEqual(17);
    });
  });
});
