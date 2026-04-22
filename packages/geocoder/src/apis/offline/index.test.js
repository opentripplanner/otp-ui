import { autocomplete, search } from ".";

const baseItems = [
  {
    label: "Portland International Airport",
    lat: 45.588,
    lon: -122.597,
    synonyms: ["PDX", "Portland Airport"]
  },
  {
    label: "Union Station",
    lat: 45.528,
    lon: -122.673,
    synonyms: ["Train Station"]
  },
  { label: "Pioneer Courthouse Square", lat: 45.5189, lon: -122.6798 },
  {
    label: "Portland State University",
    lat: 45.5118,
    lon: -122.6825,
    synonyms: ["PSU"]
  },
  { label: "Multnomah Falls", lat: 45.5762, lon: -122.1156, synonyms: [] }
];

describe("offline geocoder", () => {
  describe("synonym support", () => {
    it("should find item by synonym", async () => {
      const result = await autocomplete({ items: baseItems, text: "PDX" });
      expect(result).toContainEqual(baseItems[0]);
    });

    it("should still find item by label when synonyms are present", async () => {
      const result = await autocomplete({
        items: baseItems,
        text: "Portland International Airport"
      });
      expect(result).toContainEqual(baseItems[0]);
    });

    it("should find item by synonym that partially matches", async () => {
      const result = await autocomplete({
        items: baseItems,
        text: "Train"
      });
      expect(result).toContainEqual(baseItems[1]);
    });
  });

  describe("no duplicates", () => {
    it("should not return duplicates when label and synonym both match", async () => {
      const result = await autocomplete({ items: baseItems, text: "Airport" });
      const idxs = result.filter(
        r => r.label === "Portland International Airport"
      );
      expect(idxs).toHaveLength(1);
    });

    it("should not return duplicates when multiple synonyms match", async () => {
      const items = [
        {
          label: "City Center",
          lat: 45.5,
          lon: -122.6,
          synonyms: ["Downtown Portland", "Portland City Center"]
        }
      ];
      const result = await autocomplete({ items, text: "Portland" });
      const matches = result.filter(r => r.label === "City Center");
      expect(matches).toHaveLength(1);
    });
  });

  describe("items without synonyms", () => {
    it("should find items that omit the synonyms field entirely", async () => {
      const result = await autocomplete({
        items: baseItems,
        text: "Pioneer Courthouse"
      });
      expect(result).toContainEqual(baseItems[2]);
    });

    it("should find items with an empty synonyms array", async () => {
      const result = await autocomplete({
        items: baseItems,
        text: "Multnomah"
      });
      expect(result).toContainEqual(baseItems[4]);
    });
  });

  describe("no matches", () => {
    it("should return empty array when nothing matches", async () => {
      const result = await autocomplete({
        items: baseItems,
        text: "fishtime1"
      });
      expect(result).toEqual([]);
    });
  });

  describe("multiple items matched", () => {
    it("should return multiple items when label and synonym matches come from different items", async () => {
      const result = await autocomplete({ items: baseItems, text: "Portland" });
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result).toContainEqual(baseItems[0]);
      expect(result).toContainEqual(baseItems[3]);
    });

    it("should return items matched via label and items matched via synonym together", async () => {
      const result = await autocomplete({ items: baseItems, text: "Union" });
      expect(result).toContainEqual(baseItems[1]);
    });
  });

  describe("search function", () => {
    it("should return same results as autocomplete for synonym queries", async () => {
      const autocompleteResult = await autocomplete({
        items: baseItems,
        text: "PDX"
      });
      const searchResult = await search({ items: baseItems, text: "PDX" });
      expect(searchResult).toEqual(autocompleteResult);
    });
  });

  describe("edge cases", () => {
    it("should return empty array for undefined text", async () => {
      const result = await autocomplete({ items: baseItems, text: undefined });
      expect(result).toEqual([]);
    });

    it("should return no items for empty string text", async () => {
      const result = await autocomplete({ items: baseItems, text: "" });
      expect(result).toHaveLength(0);
    });

    it("should handle items where all synonyms match the label text", async () => {
      const items = [
        { label: "Airport", lat: 1, lon: 2, synonyms: ["Airport", "Airport"] }
      ];
      const result = await autocomplete({ items, text: "Airport" });
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe("Airport");
    });
  });
});
