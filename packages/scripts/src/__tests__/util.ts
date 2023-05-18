import { shouldProcessFile, sortSourceAndYmlFiles } from "../util";

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
});
