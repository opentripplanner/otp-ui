import { combineExceptionFiles } from "../validate-i18n";

const mocksFolderFromCwd = `${process.cwd()}/packages/scripts/src/__tests__/__mocks__`;

describe("validate-i18n", () => {
  describe("combineExceptionFiles", () => {
    it("should combine ignored ids", async () => {
      const exceptionFiles = [
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`,
        `${mocksFolderFromCwd}/i18n2/i18n-exceptions.json`
      ];
      const { ignoredIds } = await combineExceptionFiles(exceptionFiles);
      expect(ignoredIds.length).toBe(2);
      expect(
        ignoredIds.includes("otpUi.TestComponent1.unusedTextThatIsIgnored")
      ).toBe(true);
      expect(
        ignoredIds.includes("otpUi.TestComponent2.unusedTextThatIsIgnored")
      ).toBe(true);
    });
  });
});
