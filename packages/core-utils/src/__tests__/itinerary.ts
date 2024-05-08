import { ElevationProfile } from "@opentripplanner/types";
import {
  calculateTncFares,
  getCompanyFromLeg,
  getDisplayedStopId,
  getElevationProfile,
  getItineraryCost,
  getLegCost,
  getLegRouteLongName,
  getLegRouteName,
  getLegRouteShortName,
  isTransit,
  mapOldElevationComponentToNew
} from "../itinerary";

const bikeRentalItinerary = require("./__mocks__/bike-rental-itinerary.json");
const tncItinerary = require("./__mocks__/tnc-itinerary.json");
const fareProductItinerary = require("./__mocks__/fare-products-itinerary.json");

const basePlace = {
  lat: 0,
  lon: 0,
  name: "stop"
};

describe("util > itinerary", () => {
  describe("getElevationProfile", () => {
    it("should work with REST legacy data and GraphQL elevationProfile", () => {
      const legacyOutput = getElevationProfile(
        bikeRentalItinerary.legs[1].steps
      );
      const graphqlOutput = getElevationProfile(
        bikeRentalItinerary.legs[1].steps.map(step => ({
          ...step,
          elevationProfile: step.elevation.map(mapOldElevationComponentToNew),
          elevation: null
        }))
      );
      expect(legacyOutput).toEqual<ElevationProfile>(graphqlOutput);
    });
  });

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
      expect(company).toEqual("uber");
    });
  });

  describe("calculateTncFares", () => {
    it("should return the correct amounts and currency for an itinerary with TNC", () => {
      const fareResult = calculateTncFares(tncItinerary, true);
      expect(fareResult.currencyCode).toEqual("USD");
      expect(fareResult.maxTNCFare).toEqual(38);
      expect(fareResult.minTNCFare).toEqual(34);
    });
  });

  describe("getDisplayedStopId", () => {
    it("should return the stop code if one is provided", () => {
      const place = {
        ...basePlace,
        stopCode: "code123",
        stopId: "xagency:id123"
      };
      expect(getDisplayedStopId(place)).toEqual("code123");
      const stop = {
        ...basePlace,
        code: "code123",
        id: "xagency:id123"
      };
      expect(getDisplayedStopId(stop)).toEqual("code123");
    });
    it("should return the id part of stopId it contains and agencyId (and no stopCode is provided)", () => {
      const place = {
        ...basePlace,
        stopId: "xagency:id123"
      };
      expect(getDisplayedStopId(place)).toEqual("id123");
      const stop = {
        ...basePlace,
        id: "xagency:id123"
      };
      expect(getDisplayedStopId(stop)).toEqual("id123");
    });
    it("should return the whole stopId it does not contain an agency part (and no stopCode is provided)", () => {
      const place = {
        ...basePlace,
        stopId: "wholeid123"
      };
      expect(getDisplayedStopId(place)).toEqual("wholeid123");
      const stop = {
        ...basePlace,
        stopId: "wholeid123"
      };
      expect(getDisplayedStopId(stop)).toEqual("wholeid123");
    });
    it("should return null if stopId is null (and no stopCode is provided)", () => {
      expect(getDisplayedStopId(basePlace)).toBeFalsy();
    });
  });

  describe("getLegCost", () => {
    const leg = {
      fareProducts: [
        {
          id: "testId",
          product: {
            medium: { id: "cash" },
            name: "rideCost",
            price: { amount: 200, currency: "USD" },
            riderCategory: { id: "regular" }
          }
        },
        {
          id: "testId",
          product: {
            medium: { id: "cash" },
            name: "transfer",
            price: { amount: 50, currency: "USD" },
            riderCategory: { id: "regular" }
          }
        }
      ]
    };
    it("should return the total cost for a leg", () => {
      const result = getLegCost(leg, "cash", "regular");
      expect(result.price).toEqual({ amount: 200, currency: "USD" });
    });

    it("should return the transfer discount amount if a transfer was used", () => {
      const result = getLegCost(leg, "cash", "regular");
      expect(result.price).toEqual({ amount: 200, currency: "USD" });
      expect(result.transferAmount).toEqual({ amount: 50, currency: "USD" });
    });

    it("should return undefined if no fare products exist on the leg", () => {
      const emptyleg = {};
      const result = getLegCost(emptyleg, "cash", "regular");
      expect(result.price).toBeUndefined();
    });
    it("should return undefined if the keys are invalid", () => {
      const result = getLegCost(leg, "invalidkey", "invalidkey");
      expect(result.price).toBeUndefined();
    });
  });

  describe("getItineraryCost", () => {
    it("should calculate the total cost of an itinerary", () => {
      const result = getItineraryCost(
        fareProductItinerary.legs,
        "orca:cash",
        "orca:regular"
      );
      expect(result.amount).toEqual(5.75);
      expect(result.currency).toEqual({
        code: "USD",
        digits: 2
      });
    });
    it("should calculate the total cost of an itinerary will null ids", () => {
      const result = getItineraryCost(fareProductItinerary.legs, null, null);
      expect(result.amount).toEqual(2.75);
      expect(result.currency).toEqual({
        code: "USD",
        digits: 2
      });
    });
    it("should return undefined when the keys are invalid", () => {
      const result = getItineraryCost(
        fareProductItinerary.legs,
        "invalidkey",
        "invalidkey"
      );
      expect(result).toBeUndefined();
    });
    it("should exclude duplicated fareProduct uses based on ID", () => {
      const legsWithDuplicatedProducts = [...fareProductItinerary.legs];
      legsWithDuplicatedProducts[3].fareProducts =
        legsWithDuplicatedProducts[1].fareProducts;
      const result = getItineraryCost(
        fareProductItinerary.legs,
        "orca:cash",
        "orca:regular"
      );
      expect(result.amount).toEqual(2.75);
      expect(result.currency).toEqual({
        code: "USD",
        digits: 2
      });
    });
  });
  describe("getLegRouteShortName", () => {
    it("should extract a route short name from an OTP1 leg", () => {
      expect(getLegRouteShortName({ route: "15" })).toBe("15");
      expect(getLegRouteShortName({ route: "15", routeShortName: "31" })).toBe(
        "31"
      );
    });

    it("should extract a route short name from an OTP2 leg", () => {
      expect(
        getLegRouteShortName({
          route: { id: "id15", shortName: "15" },
          routeShortName: "31"
        })
      ).toBe("15");
    });
  });
  describe("getLegRouteLongName", () => {
    it("should extract a route long name from an OTP1 leg", () => {
      expect(getLegRouteLongName({ route: "15" })).toBeUndefined();
      expect(
        getLegRouteLongName({ route: "15", routeLongName: "Candler Road" })
      ).toBe("Candler Road");
    });
    it("should extract a route long name from an OTP2 leg", () => {
      expect(
        getLegRouteLongName({
          route: { id: "id15", longName: "15" },
          routeLongName: "31"
        })
      ).toBe("15");
    });
  });
  describe("getLegRouteName", () => {
    it("should extract a route name from an OTP1 leg where a route short name is provided", () => {
      expect(
        getLegRouteName({
          route: "15",
          routeShortName: "31",
          routeLongName: "Route 31"
        })
      ).toBe("31");
    });
    it("should extract a route name from an OTP1 leg where a route short name is not provided", () => {
      expect(
        getLegRouteName({
          routeLongName: "Route 31"
        })
      ).toBe("Route 31");
    });
    it("should extract a route name from an OTP2 leg where a route short name is provided", () => {
      expect(
        getLegRouteName({
          route: { id: "id15", longName: "15", shortName: "10" },
          routeLongName: "31"
        })
      ).toBe("10");
    });
    it("should extract a route name from an OTP2 leg where a route short name is not provided", () => {
      expect(
        getLegRouteName({
          route: { id: "id15", longName: "15" },
          routeLongName: "31",
          routeShortName: "31"
        })
      ).toBe("15");
    });
  });
});
