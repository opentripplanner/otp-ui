import { checkLocale } from "../validate-i18n";

import { mocksFolderFromCwd } from "./util";

describe("validate-i18n", () => {
  describe("checkLocale", () => {
    it("should detect unused message ids, excluding declared groups", async () => {
      const ignoredIds = new Set([
        "otpUi.TestComponent1.unusedTextThatIsIgnored",
        "otpUi.ExtraId.fromCodeThatIsIgnored"
      ]);
      const groups = {
        "otpUi.OtherComponent.*Message": ["key1", "key2", "extraKey"]
      };
      const ymlFiles = [`${mocksFolderFromCwd}/i18n1/en-US.yml`];
      const messageIdsFromCode = [
        "otpUi.FromToLocationPicker.from",
        "otpUi.FromToLocationPicker.planATrip",
        "otpUi.FromToLocationPicker.to",
        // Extra ones not in the language files for detecting untranslated ids.
        "otpUi.ExtraId.fromCode",
        "otpUi.ExtraId.fromCodeThatIsIgnored"
      ];

      const { idsNotInCode, missingIdsForLocale } = await checkLocale(
        ymlFiles,
        messageIdsFromCode,
        ignoredIds,
        groups
      );

      expect(missingIdsForLocale.length).toBe(2);
      expect(missingIdsForLocale.includes("otpUi.ExtraId.fromCode")).toBe(true);
      expect(
        missingIdsForLocale.includes("otpUi.OtherComponent.extraKeyMessage")
      ).toBe(true);

      expect(idsNotInCode.length).toBe(1);
      expect(idsNotInCode[0]).toBe("otpUi.TestComponent1.unusedText");
    });
  });
});
