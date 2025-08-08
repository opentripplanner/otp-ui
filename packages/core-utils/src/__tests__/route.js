import {
  getMostReadableTextColor,
  getTransitOperatorFromLeg,
  getTransitOperatorFromOtpRoute,
  makeRouteComparator
} from "../route";

import { otp1Routes, otp2Routes } from "./__mocks__/routes.json";

function sortRoutes(...routes) {
  routes.sort(makeRouteComparator());
  return routes;
}

describe("util > route", () => {
  describe("getTransitOperatorFromLeg", () => {
    it("should get a transit operator", () => {
      const expectedTransitOperator = { agencyId: "abc", feedId: "1" };
      expect(
        getTransitOperatorFromLeg({ agencyId: "abc", routeId: "1:rr" }, [
          { agencyId: "abc", feedId: "2" },
          expectedTransitOperator
        ])
      ).toBe(expectedTransitOperator);
    });

    it("should return null if transit operator is not found", () => {
      expect(getTransitOperatorFromLeg("abc", [])).toBeNull();
    });
  });

  describe("getTransitOperatorFromOtp1Route", () => {
    const otpRoute = { agencyId: "abc", id: "1:abc" };
    it("should get a transit operator", () => {
      const expectedTransitOperator = { agencyId: "abc", feedId: "1" };
      expect(
        getTransitOperatorFromOtpRoute(otpRoute, [
          { agencyId: "abc", feedId: "2" },
          expectedTransitOperator
        ])
      ).toBe(expectedTransitOperator);
    });

    it("should return null if transit operator is not found", () => {
      expect(getTransitOperatorFromOtpRoute(otpRoute, [])).toBeNull();
    });
  });

  describe("routeComparator", () => {
    it("should sort routes based off of agencyName if no transitOperators are defined", () => {
      expect(sortRoutes(otp1Routes[15], otp1Routes[16])).toMatchSnapshot();
    });

    it("should sort routes based off of transitOperators sort value when a match is found", () => {
      const comparatorWithTransitOperators = makeRouteComparator([
        { agencyId: "abc", feedId: "1", order: 2 },
        { agencyId: "abc", feedId: "2", order: 1 }
      ]);
      const routes = [otp1Routes[15], otp1Routes[16]];
      expect(routes.sort(comparatorWithTransitOperators)).toMatchSnapshot();
    });

    it("should sort routes based off of sortOrder", () => {
      expect(sortRoutes(otp1Routes[0], otp1Routes[1])).toMatchSnapshot();
    });

    it("should prioritize OTP1 routes with valid sortOrder", () => {
      expect(sortRoutes(otp1Routes[1], otp1Routes[2])).toMatchSnapshot();
    });

    it("should prioritize OTP2 routes with valid sortOrder", () => {
      expect(
        sortRoutes(otp2Routes[0], otp2Routes[2], otp2Routes[3])
      ).toMatchSnapshot();
    });

    it("should sort routes based off of integer shortName", () => {
      expect(sortRoutes(otp1Routes[2], otp1Routes[3])).toMatchSnapshot();
    });

    it("should prioritize routes with alphabetic shortNames over integer shortNames", () => {
      expect(sortRoutes(otp1Routes[3], otp1Routes[4])).toMatchSnapshot();
    });

    it("should sort routes based off of shortNames", () => {
      expect(sortRoutes(otp1Routes[4], otp1Routes[5])).toMatchSnapshot();
    });

    it("should sort routes with alphanumeric shortNames", () => {
      expect(sortRoutes(otp1Routes[13], otp1Routes[14])).toMatchSnapshot();
    });

    it("should prioritize routes with shortNames over those with just longNames", () => {
      expect(sortRoutes(otp1Routes[5], otp1Routes[6])).toMatchSnapshot();
    });

    it("should sort routes based off of longNames", () => {
      expect(sortRoutes(otp1Routes[8], otp1Routes[9])).toMatchSnapshot();
    });
    it("should sort OTP1 routes on all of the criteria at once", () => {
      expect(sortRoutes(...otp1Routes)).toMatchSnapshot();
    });
    it("should sort OTP2 routes on all of the criteria at once", () => {
      expect(sortRoutes(...otp2Routes)).toMatchSnapshot();
    });

    it("should sort based off of route type", () => {
      expect(sortRoutes(otp1Routes[11], otp1Routes[12])).toMatchSnapshot();
    });
  });

  // These color pairings are taken from real agencies.
  // See the method jsdoc for more details.
  describe("route text color generation", () => {
    it("should not modify appropriate color pairings", () => {
      expect(getMostReadableTextColor("#EE352E", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#00933C", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#b933ad", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#808183", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#0039a6", "#ffffff")).toBe("#ffffff");

      // Both colors are readable and used by transit agencies.
      // The function accepts both colors.
      expect(getMostReadableTextColor("#ff6319", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#ff6319", "#000000")).toBe("#000000");
      expect(getMostReadableTextColor("#6cbe45", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#6cbe45", "#000000")).toBe("#000000");
      expect(getMostReadableTextColor("#a7a9ac", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#a7a9ac", "#000000")).toBe("#000000");
      expect(getMostReadableTextColor("#FF00FF", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#FF00FF", "#000000")).toBe("#000000");
      expect(getMostReadableTextColor("#009999", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#009999", "#000000")).toBe("#000000");

      expect(getMostReadableTextColor("#996633", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#fccc0a", "#000000")).toBe("#000000");

      expect(getMostReadableTextColor("#0075B2", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#D4A723", "#000000")).toBe("#000000");
      expect(getMostReadableTextColor("#009D4B", "#ffffff")).toBe("#ffffff");
      expect(getMostReadableTextColor("#CE242B", "#ffffff")).toBe("#ffffff");

      expect(getMostReadableTextColor("#00FF00", "#000000")).toBe("#000000");

      expect(getMostReadableTextColor("#E32400", "#FFFFFF")).toBe("#FFFFFF");
      expect(getMostReadableTextColor("#d18881", "#000000")).toBe("#000000");

      expect(getMostReadableTextColor("#004080", "#FFFFFF")).toBe("#FFFFFF");
    });

    it("should modify inappropriate color pairings", () => {
      expect(getMostReadableTextColor("#EE352E", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#00933C", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#b933ad", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#808183", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#0039a6", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#996633", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#fccc0a", "#ffffff")).toBe("#000000");

      expect(getMostReadableTextColor("#0075B2", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#D4A723", "#ffffff")).toBe("#000000");
      expect(getMostReadableTextColor("#009D4B", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#CE242B", "#000000")).toBe("#ffffff");

      expect(getMostReadableTextColor("#00FF00", "#ffffff")).toBe("#000000");
      expect(getMostReadableTextColor("#321b26", "#000000")).toBe("#ffffff");
      expect(getMostReadableTextColor("#321b26", "9e4141")).toBe("#ffffff");

      expect(getMostReadableTextColor("#f00", "#f00")).toBe("#ffffff");
      expect(getMostReadableTextColor("#fff", "#fff")).toBe("#000000");
      expect(getMostReadableTextColor("#000", "#000")).toBe("#ffffff");
    });
  });
});
