import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from "../../../../test-utils/time";

import {
  formatDuration,
  formatDurationWithSeconds,
  getCurrentDate,
  getCurrentTime
} from "../time";

describe("time", () => {
  afterEach(restoreDateNowBehavior);

  describe("getCurrentDate", () => {
    it("should return current date at specified timezone", () => {
      setDefaultTestTime();
      expect(getCurrentDate("America/New_York")).toMatchSnapshot();
    });
  });

  describe("getCurrentTime", () => {
    it("should return time at specified timezone", () => {
      setDefaultTestTime();
      expect(getCurrentTime("America/New_York")).toMatchSnapshot();
    });
  });

  describe("getFormattedTime", () => {
    const withoutSeconds = formatDuration(9401);
    const withSeconds = formatDurationWithSeconds(9401);

    expect(withSeconds).not.toEqual(withoutSeconds);
    expect(withSeconds).toMatchSnapshot();
    expect(withoutSeconds).toMatchSnapshot();
  });
});
