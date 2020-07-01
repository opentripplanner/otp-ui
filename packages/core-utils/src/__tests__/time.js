import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from "../../../../test-utils/time";

import { getCurrentDate, getCurrentTime } from "../time";

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
});
