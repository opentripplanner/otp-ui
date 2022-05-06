import { reduceOtpFlexModes } from "../query";
import queryParams, { getCustomQueryParams } from "../query-params";

const customWalkDistanceOptions = [
  {
    text: "200 m",
    value: 200
  },
  {
    text: "500 m",
    value: 500
  }
];

describe("query-params", () => {
  describe("getCustomQueryParams", () => {
    it("should return the original unmodified queryParams if no customizations", () => {
      expect(getCustomQueryParams()).toEqual(queryParams);
    });

    it("should return queryParams with customizations", () => {
      const customizations = {
        maxWalkDistance: {
          label: "Max Walk Distance In Meters",
          options: customWalkDistanceOptions
        }
      };
      expect(getCustomQueryParams(customizations)).toMatchSnapshot();
    });

    it("should ignore unknown query params", () => {
      const customizations = {
        unknownQueryParameter: {
          label: "Unknown query parameter",
          options: customWalkDistanceOptions
        }
      };
      expect(getCustomQueryParams(customizations)).toEqual(queryParams);
    });
  });
});

describe("flex-reducer", () => {
  it("should not touch a query that doesn't include flex modes", () => {
    expect(reduceOtpFlexModes(["WALK", "TRANSIT", "BIKE"])).toStrictEqual([
      "WALK",
      "TRANSIT",
      "BIKE"
    ]);
  });
  it("should modify a query that includes some flex modes", () => {
    expect(
      reduceOtpFlexModes(["WALK", "TRANSIT", "BIKE", "FLEX_DIRECT"])
    ).toStrictEqual(["WALK", "TRANSIT", "BIKE", "FLEX"]);
  });
  it("should modify a query that includes all flex modes", () => {
    expect(
      reduceOtpFlexModes([
        "WALK",
        "TRANSIT",
        "BIKE",
        "FLEX_DIRECT",
        "FLEX_ACCESS",
        "FLEX_EGRESS"
      ])
    ).toStrictEqual(["WALK", "TRANSIT", "BIKE", "FLEX"]);
    expect(
      reduceOtpFlexModes([
        "FLEX_DIRECT",
        "BIKE",
        "FLEX_ACCESS",
        "WALK",
        "FLEX_EGRESS",
        "TRANSIT"
      ])
    ).toStrictEqual(["FLEX", "BIKE", "WALK", "TRANSIT"]);
  });
  it("should modify a query that includes only flex modes", () => {
    expect(
      reduceOtpFlexModes(["FLEX_DIRECT", "FLEX_ACCESS", "FLEX_EGRESS"])
    ).toStrictEqual(["FLEX"]);
  });
  it("should modify a query that includes duplicate flex modes", () => {
    expect(
      reduceOtpFlexModes([
        "FLEX_DIRECT",
        "FLEX_DIRECT",
        "FLEX_ACCESS",
        "FLEX_EGRESS"
      ])
    ).toStrictEqual(["FLEX"]);
  });
});
