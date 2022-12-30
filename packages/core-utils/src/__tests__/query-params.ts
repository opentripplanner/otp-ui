import { ModeSetting, TransportMode } from "@opentripplanner/types";

import { reduceOtpFlexModes } from "../query";
import queryParams, { getCustomQueryParams } from "../query-params";
import { extractAdditionalModes, generateCombinations } from "../query-gen";

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

function modeStrToTransportMode(m): TransportMode {
  const splitVals = m.split("_");
  return {
    mode: splitVals[0],
    qualifier: splitVals?.[1] || null
  };
}

const mockLatLon = {
  lat: 1,
  lon: 2
};

function expectModes(
  modes: Array<string>,
  expectedModes: Array<Array<string>>
) {
  const generatedModesList = generateCombinations({
    modes: modes.map(modeStrToTransportMode),
    to: mockLatLon,
    from: mockLatLon,
    modeSettings: []
  });
  const expandedExpectedModesList = expectedModes.map(em => ({
    modes: em.map(modeStrToTransportMode),
    to: mockLatLon,
    from: mockLatLon,
    modeSettings: []
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

describe("extract-modes", () => {
  const mode = {
    mode: "UNICYCLE"
  };
  const checkboxModeSetting: ModeSetting = {
    type: "CHECKBOX",
    icon: null,
    label: "test",
    applicableMode: "test",
    key: "test",
    value: true,
    addTransportMode: mode
  };

  const dropdownModeSetting: ModeSetting = {
    type: "DROPDOWN",
    label: "test",
    applicableMode: "test",
    key: "test",
    options: [{ text: "testop", value: "1", addTransportMode: mode }],
    value: "1"
  };

  it("a checkbox setting", () => {
    expect(extractAdditionalModes([checkboxModeSetting])).toEqual([mode]);
  });
  it("a dropdown setting", () => {
    expect(extractAdditionalModes([dropdownModeSetting])).toEqual([mode]);
  });
  it("a disabled mode setting", () => {
    expect(
      extractAdditionalModes([{ ...checkboxModeSetting, value: false }])
    ).toEqual([]);
  });
});

describe("query-gen", () => {
  describe("generateCombinations", () => {
    expectModes(["WALK"], [["WALK"]]);
    expectModes(["WALK", "TRANSIT"], [["WALK"], ["TRANSIT"]]);
    expectModes(
      ["WALK", "TRANSIT", "BICYCLE"],
      [["WALK"], ["TRANSIT"], ["BICYCLE"], ["TRANSIT", "BICYCLE"]]
    );
    expectModes(
      ["WALK", "TRANSIT", "CAR"],
      [["WALK"], ["TRANSIT"], ["TRANSIT", "CAR"]]
    );
    expectModes(["TRANSIT", "CAR"], [["TRANSIT"], ["TRANSIT", "CAR"]]);
    expectModes(["CAR"], []);
    expectModes(
      ["WALK", "TRANSIT", "BICYCLE", "CAR"],
      [
        ["WALK"],
        ["TRANSIT"],
        ["TRANSIT", "BICYCLE"],
        ["BICYCLE"],
        ["TRANSIT", "CAR"]
      ]
    );
    expectModes(
      ["BICYCLE_RENT", "TRANSIT", "WALK"],
      [
        ["TRANSIT"],
        ["BICYCLE_RENT", "TRANSIT"],
        ["BICYCLE_RENT", "WALK"],
        ["WALK"]
      ]
    );
    expectModes(
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
    expectModes(
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
    expectModes(
      ["FLEX", "TRANSIT", "WALK"],
      [["TRANSIT"], ["FLEX", "TRANSIT"], ["FLEX", "WALK"], ["WALK"]]
    );
    expectModes(
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
    expectModes(
      ["FLEX", "SCOOTER_RENT", "TRANSIT"],
      [
        ["TRANSIT"],
        ["FLEX", "TRANSIT"],
        ["FLEX", "SCOOTER_RENT", "TRANSIT"],
        ["SCOOTER_RENT", "TRANSIT"]
      ]
    );
    expectModes(
      // Transit is required to enable other transit submodes
      ["BUS", "RAIL", "GONDOLA", "TRAM", "TRANSIT"],
      [["BUS", "RAIL", "GONDOLA", "TRAM"]]
    );
    expectModes(
      // Transit is required to enable other transit submodes
      ["BUS", "RAIL", "GONDOLA", "TRAM"],
      []
    );
    expectModes(
      // Transit is required to enable other transit submodes
      ["TRANSIT"],
      [["TRANSIT"]]
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
