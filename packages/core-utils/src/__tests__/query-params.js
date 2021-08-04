import queryParams, { getCustomQueryParams } from "../query-params";

describe("query-params", () => {
  describe("getCustomQueryParams", () => {
    it("should return the original unmodified queryParams if no customizations", () => {
      expect(getCustomQueryParams()).toEqual(queryParams);
    });

    it("should return queryParams with customizations", () => {
      const customizations = {
        maxWalkDistance: "Max Walk Distance In Meters",
        "maxWalkDistance.options": [
          {
            text: "200 m",
            value: 100
          },
          {
            text: "500 m",
            value: 500
          }
        ]
      };
      const customizedQueryParams = getCustomQueryParams(customizations);
      expect(customizedQueryParams).toMatchSnapshot();
    });
  });
});
