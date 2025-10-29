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
      defaultUnits: "metric",
      imperialExpected: false,
      unitType: "metric"
    },
    {
      defaultUnits: "metric",
      imperialExpected: false
    },
    {
      defaultUnits: "metric",
      imperialExpected: true,
      unitType: "imperial"
    },
    {
      defaultUnits: "imperial",
      imperialExpected: true
    }
  ];

  testCases.forEach(({ defaultUnits, imperialExpected, unitType }) => {
    it(`${unitType} with default unit type ${defaultUnits} should be ${
      imperialExpected ? "imperial" : "metric"
    }`, () => {
      expect(
        h.isImperial(unitType as UnitSystem, defaultUnits as UnitSystem)
      ).toBe(imperialExpected);
    });
  });
});
