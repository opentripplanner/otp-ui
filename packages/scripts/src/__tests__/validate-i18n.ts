import { combineExceptionFiles } from "../validate-i18n";

import { mocksFolderFromCwd } from "./util";

describe("validate-i18n", () => {
  describe("combineExceptionFiles", () => {
    it("should combine ignored ids", async () => {
      const exceptionFiles = [
        `${mocksFolderFromCwd}/i18n1/i18n-exceptions.json`,
        `${mocksFolderFromCwd}/i18n2/i18n-exceptions.json`
      ];
      const { ignoredIds } = await combineExceptionFiles(exceptionFiles);
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
