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
    const durationInSeconds = 9401;
    it(`should correctly format ${durationInSeconds} seconds as a duration with seconds`, () => {
      expect(formatDurationWithSeconds(durationInSeconds)).toMatchSnapshot();
    });
    it(`should correctly format ${durationInSeconds} seconds as a duration without seconds`, () => {
      expect(formatDuration(durationInSeconds)).toMatchSnapshot();
    });
  });
});
