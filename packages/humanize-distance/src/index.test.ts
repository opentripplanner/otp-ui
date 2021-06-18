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
