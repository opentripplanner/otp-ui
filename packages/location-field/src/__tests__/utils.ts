import { getMatchingLocations } from "../utils";

const places = [
  {
    displayName: "Work (123 Main Street)"
  },
  {
    displayName: "Home (123 Quiet Street)"
  },
  {
    displayName: "Coffee Shop (Best Coffee, 456 River Street)"
  }
];

describe("location-field > options", () => {
  describe("getMatchingLocations", () => {
    it("matches a location when passing substrings of its name or address", () => {
      const testCases = [
        {
          expected: places[0],
          strings: ["Wor", "ORK", "main"]
        },
        {
          expected: places[1],
          strings: ["Hom", "OM", "quiet"]
        },
        {
          expected: places[2],
          strings: ["fee", "456", "BEST"]
        }
      ];
      testCases.forEach(({ expected, strings }) => {
        strings.forEach(text => {
          const match = getMatchingLocations(places, text);
          expect(match.length).toBe(1);
          expect(match[0]).toBe(expected);
        });
      });
    });
  });
});
