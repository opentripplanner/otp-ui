import { sortSourceAndYmlFiles } from "../util";

// eslint-disable-next-line import/prefer-default-export
export const mocksFolderFromCwd = `${process.cwd()}/packages/scripts/src/mocks`;

describe("util", () => {
  describe("sortSourceAndYmlFiles", () => {
    it("should sort files when passed folders", async () => {
      const args = [
        "node",
        "script-name.js",
        `${mocksFolderFromCwd}/i18n1`,
        `${mocksFolderFromCwd}/packages/from-to-location-picker/src`
      ];
      const {
        exceptionFiles
        // sourceFiles,
        // ymlFilesByLocale
      } = await sortSourceAndYmlFiles(args);

      expect(exceptionFiles.length).toBe(1);
      expect(exceptionFiles[0]).toBe(
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`
      );
    });
  });
});
