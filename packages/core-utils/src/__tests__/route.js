import {
  getMostReadableTextColor,
  getTransitOperatorFromLeg,
  getTransitOperatorFromOtpRoute,
  makeRouteComparator
} from "../route";

const {
  route1,
  route2,
  route3,
  route4,
  route5,
  route6,
  route7,
  route8,
  route9,
  route10,
  route11,
  route12,
  route13,
  route14,
  route15,
  route16,
  route17
} = require("./__mocks__/routes.json");

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

  describe("getTransitOperatorFromOtpRoute", () => {
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
    it("should sort routes based off of agencyName", () => {
      expect(sortRoutes(route16, route17)).toMatchSnapshot();
    });

    it("should sort routes based off of transitOperators sort value when a match is found", () => {
      const comparatorWithTransitOperators = makeRouteComparator([
        { agencyId: "abc", feedId: "1", order: 2 },
        { agencyId: "abc", feedId: "2", order: 1 }
      ]);
      const routes = [route16, route17];
      expect(routes.sort(comparatorWithTransitOperators)).toMatchSnapshot();
    });

    it("should sort routes based off of sortOrder", () => {
      expect(sortRoutes(route1, route2)).toMatchSnapshot();
    });

    it("should prioritize routes with valid sortOrder", () => {
      expect(sortRoutes(route2, route3)).toMatchSnapshot();
    });

    it("should sort routes based off of integer shortName", () => {
      expect(sortRoutes(route3, route4)).toMatchSnapshot();
    });

    it("should prioritize routes with integer shortNames over alphabetic shortNames", () => {
      expect(sortRoutes(route4, route5)).toMatchSnapshot();
    });

    it("should sort routes based off of shortNames", () => {
      expect(sortRoutes(route5, route6)).toMatchSnapshot();
    });

    it("should sort routes with alphanumeric shortNames", () => {
      expect(sortRoutes(route14, route15)).toMatchSnapshot();
    });

    it("should prioritize routes with shortNames over those with just longNames", () => {
      expect(sortRoutes(route6, route7)).toMatchSnapshot();
    });

    it("should sort routes based off of longNames", () => {
      expect(sortRoutes(route9, route10)).toMatchSnapshot();
    });

    it("should sort routes on all of the criteria at once", () => {
      expect(
        sortRoutes(
          route1,
          route2,
          route3,
          route4,
          route5,
          route6,
          route7,
          route8,
          route9,
          route10,
          route11,
          route12,
          route13,
          route14,
          route15
        )
      ).toMatchSnapshot();
    });

    it("should sort based off of route type", () => {
      expect(sortRoutes(route12, route13)).toMatchSnapshot();
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
    });
  });
});
