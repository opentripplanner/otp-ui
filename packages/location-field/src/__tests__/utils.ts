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
    it("matches two locations if they have the typed content", () => {
      const match = getMatchingLocations(places, "123");
      expect(match.length).toBe(2);
      expect(match.includes(places[0])).toBe(true);
      expect(match.includes(places[1])).toBe(true);
    });
    it("matches no location when passing irrelevant text", () => {
      const match = getMatchingLocations(places, "stuff");
      expect(match.length).toBe(0);
    });
  });
});
