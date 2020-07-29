import {
  getTransitOperatorFromId,
  getTransitOperatorFromOtpRoute,
  routeComparator
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
  route15
} = require("./__mocks__/itinerary.json");

function sortRoutes(...routes) {
  routes.sort(routeComparator);
  return routes;
}

describe("util > route", () => {
  describe("getTransitOperatorFromId", () => {
    it("should get a transit operator", () => {
      const expectedTransitOperator = { id: "1" };
      expect(
        getTransitOperatorFromId("1", [{ id: "2" }, expectedTransitOperator])
      ).toBe(expectedTransitOperator);
    });

    it("should return null if transit operator is not found", () => {
      expect(getTransitOperatorFromId("abc", [])).toBeNull();
    });
  });

  describe("getTransitOperatorFromOtpRoute", () => {
    const otpRoute = { id: "1:abc" };
    it("should get a transit operator", () => {
      const expectedTransitOperator = { id: "1" };
      expect(
        getTransitOperatorFromOtpRoute(otpRoute, [
          { id: "2" },
          expectedTransitOperator
        ])
      ).toBe(expectedTransitOperator);
    });

    it("should return null if transit operator is not found", () => {
      expect(getTransitOperatorFromOtpRoute(otpRoute, [])).toBeNull();
    });
  });

  describe("routeComparator", () => {
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
});
