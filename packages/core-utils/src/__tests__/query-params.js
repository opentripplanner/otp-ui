import { reduceOtpFlexModes } from "../query";
import queryParams, { getCustomQueryParams } from "../query-params";
import { generateCombinations } from "../query-gen";

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

function modeStrToTransportMode(m) {
  const splitVals = m.split("_");
  return {
    mode: splitVals[0],
    qualifier: splitVals?.[1] || null
  };
}

//            string array.  string array array
function help(modes, expectedModes) {
  const generatedModesList = generateCombinations({
    modes: modes.map(modeStrToTransportMode)
  });
  const expandedExpectedModesList = expectedModes.map(em => ({
    modes: em.map(modeStrToTransportMode)
  }));
  return it(
    modes.join(" "),
    () =>
      expect(generatedModesList.length === expandedExpectedModesList.length) &&
      expect(new Set(generatedModesList)).toEqual(
        new Set(expandedExpectedModesList)
      )
  );
}

describe("query-gen", () => {
  describe("generateCombinations", () => {
    help(["WALK"], [["WALK"]]);
    help(["WALK", "TRANSIT"], [["WALK"], ["TRANSIT"]]);
    help(
      ["WALK", "TRANSIT", "BICYCLE"],
      [["WALK"], ["TRANSIT"], ["BICYCLE"], ["TRANSIT", "BICYCLE"]]
    );
    help(
      ["WALK", "TRANSIT", "CAR"],
      [["WALK"], ["TRANSIT"], ["TRANSIT", "CAR"]]
    );
    help(["TRANSIT", "CAR"], [["TRANSIT"], ["TRANSIT", "CAR"]]);
    help(["CAR"], []);
    help(
      ["WALK", "TRANSIT", "BICYCLE", "CAR"],
      [
        ["WALK"],
        ["TRANSIT"],
        ["TRANSIT", "BICYCLE"],
        ["BICYCLE"],
        ["TRANSIT", "CAR"]
      ]
    );
    help(
      ["BICYCLE_RENT", "TRANSIT", "WALK"],
      [
        ["TRANSIT"],
        ["BICYCLE_RENT", "TRANSIT"],
        ["BICYCLE_RENT", "WALK"],
        ["WALK"]
      ]
    );
    help(
      ["BICYCLE_RENT", "BICYCLE", "TRANSIT", "WALK"],
      [
        ["TRANSIT"],
        ["BICYCLE_RENT", "TRANSIT"],
        ["BICYCLE", "TRANSIT"],
        ["BICYCLE_RENT", "WALK"],
        ["BICYCLE"],
        ["WALK"]
      ]
    );
    help(
      ["SCOOTER_RENT", "BICYCLE_RENT", "TRANSIT", "WALK"],
      [
        ["TRANSIT"],
        ["BICYCLE_RENT", "TRANSIT"],
        ["BICYCLE_RENT", "WALK"],
        ["SCOOTER_RENT", "TRANSIT"],
        ["SCOOTER_RENT", "WALK"],
        ["WALK"]
      ]
    );
    help(
      ["FLEX", "TRANSIT", "WALK"],
      [["TRANSIT"], ["FLEX", "TRANSIT"], ["FLEX", "WALK"], ["WALK"]]
    );
    help(
      ["FLEX", "SCOOTER_RENT", "TRANSIT", "WALK"],
      [
        ["TRANSIT"],
        ["FLEX", "TRANSIT"],
        ["WALK"],
        ["FLEX", "WALK"],
        ["FLEX", "SCOOTER_RENT", "WALK"], // Is this sensible?
        ["FLEX", "SCOOTER_RENT", "TRANSIT"],
        ["SCOOTER_RENT", "WALK"],
        ["SCOOTER_RENT", "TRANSIT"]
      ]
    );
    help(
      ["FLEX", "SCOOTER_RENT", "TRANSIT"],
      [
        ["TRANSIT"],
        ["FLEX", "TRANSIT"],
        ["FLEX", "SCOOTER_RENT", "TRANSIT"],
        ["SCOOTER_RENT", "TRANSIT"]
      ]
    );
    help(
      ["BUS", "RAIL", "GONDOLA", "TRAM"],
      [["BUS", "RAIL", "GONDOLA", "TRAM"]]
    );
  });
});

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
