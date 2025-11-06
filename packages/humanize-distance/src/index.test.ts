import { UnitSystem } from "@opentripplanner/types";
import * as h from ".";

describe("humanizeDistanceString", () => {
  const testCases = [
    {
      meters: 10,
      unitType: "metric"
    },
    {
      abbreviate: true,
      meters: 10
    }
  ];

  testCases.forEach(({ abbreviate, meters, unitType }) => {
    it(`${meters}m should output correct ${abbreviate ? "abbreviated" : ""} ${
      unitType === "metric" ? "metric" : "imperial"
    }`, () => {
      if (unitType === "metric") {
        expect(h.humanizeDistanceString(meters, true)).toMatchSnapshot();
      } else {
        expect(
          h.humanizeDistanceStringImperial(meters, abbreviate)
        ).toMatchSnapshot();
      }
    });
  });
});

describe("isImperial", () => {
  const testCases = [
    {
      imperialExpected: false,
      unitType: "metric"
    },
    {
      imperialExpected: false
    },
    {
      imperialExpected: true,
      unitType: "imperial"
    }
  ];

  testCases.forEach(({ imperialExpected, unitType }) => {
    it(`${unitType} should be ${
      imperialExpected ? "imperial" : "metric"
    }`, () => {
      expect(h.isImperial(unitType as UnitSystem)).toBe(imperialExpected);
    });
  });
});
