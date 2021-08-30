import queryParams, { getCustomQueryParams } from "../query-params";

describe("query-params", () => {
  describe("getCustomQueryParams", () => {
    it("should return the original unmodified queryParams if no customizations", () => {
      expect(getCustomQueryParams()).toEqual(queryParams);
    });

    it("should return queryParams with customizations", () => {
      const customizations = {
        maxWalkDistance: {
          label: "Max Walk Distance In Meters",
          options: [
            {
              text: "200 m",
              value: 100
            },
            {
              text: "500 m",
              value: 500
            }
          ]
        }
      };
      expect(getCustomQueryParams(customizations)).toMatchSnapshot();
    });

    it("should ignore unknown query params", () => {
      const customizations = {
        unknownQueryParameter: {
          label: "Unknown query parameter",
          options: [
            {
              text: "200 m",
              value: 100
            },
            {
              text: "500 m",
              value: 500
            }
          ]
        }
      };
      expect(getCustomQueryParams(customizations)).toEqual(queryParams);
    });
  });
});
