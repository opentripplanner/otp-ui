import {
  combineExceptionFiles,
  expandGroupIds,
  shouldProcessFile,
  sortSourceAndYmlFiles
} from "../util";

const packagesFolder = `${process.cwd()}/packages`;
export const mocksFolderFromCwd = `${packagesFolder}/scripts/src/__tests__/__mocks__`;

const fromToPickerSrcFolder = "from-to-location-picker/src";

export const sourceFileList = [
  "index.tsx",
  "index.story.tsx",
  "styled.ts",
  "types.ts",
  // Should not be picked up.
  "data.json"
];

describe("util", () => {
  describe("sortSourceAndYmlFiles", () => {
    it("should sort files when passed folders", async () => {
      const args = [
        "node",
        "script-name.js",
        `${mocksFolderFromCwd}/i18n1`,
        `${packagesFolder}/${fromToPickerSrcFolder}`
      ];
      const {
        exceptionFiles,
        sourceFiles,
        ymlFilesByLocale
      } = await sortSourceAndYmlFiles(args);

      expect(exceptionFiles.length).toBe(1);
      expect(exceptionFiles[0]).toBe(
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`
      );

      const localeKeys = Object.keys(ymlFilesByLocale);
      expect(localeKeys.length).toBe(2);
      expect(localeKeys.includes("en-US")).toBe(true);
      expect(localeKeys.includes("fr")).toBe(true);

      expect(sourceFiles.length).toBe(sourceFileList.length - 1);
      sourceFiles.forEach(f => {
        const fromToIndex = f.indexOf(fromToPickerSrcFolder);
        expect(fromToIndex !== -1);
        const trimmedName = f.substring(
          fromToIndex + fromToPickerSrcFolder.length + 1
        );
        expect(sourceFileList.includes(trimmedName));
      });
    });
  });

  describe("shouldProcessFile", () => {
    it("should not process */__* files except when /__ is present in the CLI parameters", async () => {
      expect(
        shouldProcessFile("/some/folder/__tests__/source.ts", "/some/folder")
      ).toBe(false);
      expect(
        shouldProcessFile(
          "/some/folder/__tests__/source.ts",
          "/some/folder/__tests__"
        )
      ).toBe(true);
    });
  });

  describe("expandGroupIds", () => {
    it("should expand group ids", () => {
      const groups = {
        "group1.*Message": ["key1", "key2"],
        "group2.*": ["key3", "key4", "key5"]
      };
      const idsFromGroups = expandGroupIds(groups);
      expect(idsFromGroups.length).toBe(5);
      expect(idsFromGroups.includes("group1.key1Message")).toBe(true);
      expect(idsFromGroups.includes("group1.key2Message")).toBe(true);
      expect(idsFromGroups.includes("group2.key3")).toBe(true);
      expect(idsFromGroups.includes("group2.key4")).toBe(true);
      expect(idsFromGroups.includes("group2.key5")).toBe(true);
    });
  });

  describe("combineExceptionFiles", () => {
    it("should combine ignored ids", async () => {
      const exceptionFiles = [
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`,
        `${mocksFolderFromCwd}/i18n2/i18n-exceptions.json`
      ];
      const { groups, ignoredIds } = await combineExceptionFiles(
        exceptionFiles
      );

      const groupKeys = Object.keys(groups);
      expect(groupKeys.length).toBe(1);
      expect(groupKeys[0]).toBe("otpUi.OtherComponent.*Message");

      expect(ignoredIds.size).toBe(2);
      expect(
        ignoredIds.has("otpUi.TestComponent1.unusedTextThatIsIgnored")
      ).toBe(true);
      expect(
        ignoredIds.has("otpUi.TestComponent2.unusedTextThatIsIgnored")
      ).toBe(true);
    });
  });
});
