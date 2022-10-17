import { generateOtp2Query } from "../query-gen";

describe("util > query-gen", () => {
  it("should return a query", () => {
    const location = { lon: 1.2314, lat: 4.23123 };
    const query = generateOtp2Query({
      to: location,
      from: location,
      combinations: []
    });
    expect(query).toMatchSnapshot();
  });
});
