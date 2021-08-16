import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from "../../../../test-utils/time";

import {
  formatDuration,
  formatDurationWithSeconds,
  formatSecondsAfterMidnight,
  formatTime,
  getCurrentDate,
  getCurrentTime,
  getTimeFormat,
  getUserTimezone
} from "../time";

describe("time", () => {
  afterEach(restoreDateNowBehavior);

  describe("getCurrentDate", () => {
    it("should return current date at specified timezone", () => {
      setDefaultTestTime();
      expect(getCurrentDate("America/New_York")).toMatchSnapshot();
      expect(getCurrentDate()).toMatchSnapshot();
    });
  });

  describe("getCurrentTime", () => {
    it("should return time at specified timezone", () => {
      setDefaultTestTime();
      expect(getCurrentTime("America/New_York")).toMatchSnapshot();
      expect(getCurrentTime()).toMatchSnapshot();
    });
  });

  describe("time format functions", () => {
    const durationInSeconds = 9401;
    it(`should correctly format ${durationInSeconds} seconds as a duration with seconds`, () => {
      expect(formatDurationWithSeconds(durationInSeconds)).toMatchSnapshot();
    });
    it(`should correctly format ${durationInSeconds} seconds as a duration without seconds`, () => {
      expect(formatDuration(durationInSeconds)).toMatchSnapshot();
    });
    it(`should correctly format ${durationInSeconds} seconds as a narrative`, () => {
      expect(formatTime(durationInSeconds)).toMatchSnapshot();
    });
    it(`should correctly format ${durationInSeconds} seconds as a duration since midnight`, () => {
      expect(
        formatSecondsAfterMidnight(durationInSeconds, getTimeFormat())
      ).toMatchSnapshot();
    });
  });

  describe("getUserTimezone", () => {
    it("should get the correct timezone from the testing environment", () => {
      expect(getUserTimezone()).toMatchSnapshot();
    });
  });
});
