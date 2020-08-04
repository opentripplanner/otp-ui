import { isTransit } from "../itinerary";

describe("util > itinerary", () => {
  it("isTransit should work", () => {
    expect(isTransit("CAR")).toBeFalsy();
  });
});
