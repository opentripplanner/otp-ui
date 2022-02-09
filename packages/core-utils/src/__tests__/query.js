import clone from "lodash/cloneDeep";

import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from "../../../../test-utils/time";

import {
  getDefaultQuery,
  getRoutingParams,
  isNotDefaultQuery,
  parseLocationString,
  planParamsToQuery
} from "../query";

const config = require("./__mocks__/config.json");

describe("query", () => {
  afterEach(restoreDateNowBehavior);

  describe("getDefaultQuery", () => {
    it("should return default query", () => {
      setDefaultTestTime();
      expect(getDefaultQuery()).toMatchSnapshot();
    });

    it("should allow config overrides for default query", () => {
      setDefaultTestTime();
      const configWithQueryParamOverrides = {
        defaultQueryParams: {
          maxWalkDistance: 3219 // 2 miles
        },
        routingTypes: [{ key: "ITINERARY", text: "Exact time" }]
      };
      expect(getDefaultQuery(configWithQueryParamOverrides)).toMatchSnapshot();
    });
  });

  describe("getRoutingParams", () => {
    // the config isn't actually used except for some wheelchair check, so it is
    // ok to send an empty object for most tests
    const fakeConfig = {};
    const makeBaseTestQuery = () => ({
      ...getDefaultQuery(),
      date: "2020-08-24",
      from: {
        lat: 36.95471026341096,
        lon: -122.0248185852425,
        name: "Steamer Lane, Santa Cruz, CA, 95060, USA"
      },
      time: "21:53",
      to: {
        lat: 36.961843106786766,
        lon: -122.02402657342725,
        name: "Municipal Wharf St, Santa Cruz, CA, 95060, USA"
      }
    });
    it("should create routing params for transit query", () => {
      expect(
        getRoutingParams(fakeConfig, makeBaseTestQuery())
      ).toMatchSnapshot();
    });

    it("should create routing params for car rental query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          companies: "FAKECOMPANY",
          mode: "CAR_RENT,BUS"
        })
      ).toMatchSnapshot();
    });

    it("should create routing params for personal micromobility query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          companies: "FAKECOMPANY",
          mode: "MICROMOBILITY,BUS",
          watts: 250
        })
      ).toMatchSnapshot();
    });

    it("should create routing params for intermediate places query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          intermediatePlaces: [
            {
              lat: 36.95145225211049,
              lon: -122.02672866668283,
              name: "Lighthouse Point Park, Santa Cruz, CA, USA"
            },
            {
              lat: 36.95028619314903,
              lon: -122.05711810284686,
              name:
                "Natural Bridges State Beach, 2531 W Cliff Dr, Santa Cruz, CA, 95060, USA"
            }
          ]
        })
      ).toMatchSnapshot();
    });

    it("should create routing params for standard flex query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode: "WALK,TRANSIT,FLEX"
        })
      ).toMatchSnapshot();
    });

    it("should create repaired routing params for broken flex query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode: "WALK,FLEX_DIRECT,TRANSIT,FLEX"
        })
      ).toMatchSnapshot();
    });

    it("should create routing params for flex-only query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode: "FLEX"
        })
      ).toMatchSnapshot();
    });

    it("should create routing params for standard flex query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode: "FLEX_EGRESS,FLEX_ACCESS,FLEX_DIRECT"
        })
      ).toMatchSnapshot();
    });

    it("should create repaired routing params for very broken flex query", () => {
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode: "FLEX_EGRESS,FLEX_ACCESS,FLEX_DIRECT,FLEX,WALK,BIKE"
        })
      ).toMatchSnapshot();
      expect(
        getRoutingParams(fakeConfig, {
          ...makeBaseTestQuery(),
          mode:
            "FLEX_EGRESS,FLEX,FLEX_EGRESS,FLEX_ACCESS,FLEX_DIRECT,FLEX,WALK,BIKE,WALK,TRANSIT,BUS"
        })
      ).toMatchSnapshot();
    });
  });

  describe("isNotDefaultQuery", () => {
    it("should return false for default query", () => {
      setDefaultTestTime();
      expect(isNotDefaultQuery(getDefaultQuery(config), config)).toBe(false);
    });

    it("should return false for default query with config overrides", () => {
      // Clone default config and add new default maxWalkDistance
      const configWithQueryParamOverrides = clone(config);
      configWithQueryParamOverrides.defaultQueryParams = {
        maxWalkDistance: 3219
      };
      setDefaultTestTime();
      expect(
        isNotDefaultQuery(
          getDefaultQuery(configWithQueryParamOverrides),
          configWithQueryParamOverrides
        )
      ).toBe(false);
    });

    it("should return true for query with modified maxWalkDistance", () => {
      setDefaultTestTime();
      const query = getDefaultQuery(config);
      // Double the max walk distance
      query.maxWalkDistance *= 2;
      expect(isNotDefaultQuery(query, config)).toBe(true);
    });

    it("should return true for query with non-default mode", () => {
      setDefaultTestTime();
      const query = getDefaultQuery(config);
      // Set the mode to walk
      query.mode = "WALK";
      expect(isNotDefaultQuery(query, config)).toBe(true);
    });
  });

  describe("parseLocationString", () => {
    it("should return null for null input", () => {
      expect(parseLocationString(null)).toMatchSnapshot();
    });

    it("should return location for valid input", () => {
      expect(
        parseLocationString("123 Main St::33.983929829,-87.3892387982")
      ).toMatchSnapshot();
    });

    it("should return location with coordinates as name for coordinates-only input", () => {
      expect(
        parseLocationString("33.983929829,-87.3892387982")
      ).toMatchSnapshot();
    });
  });

  describe("planParamsToQuery", () => {
    const makeBaseTestQuery = () => ({
      arriveBy: "false",
      bannedRoutes: "897ABC",
      companies: "",
      date: "2019-10-31",
      fromPlace:
        "Guide Dogs for the Blind, Portland, OR, USA::45.517373,-122.675601",
      ignoreRealtimeUpdates: "true",
      maxWalkDistance: "1207",
      mode: "BUS,TRAM,RAIL,GONDOLA,WALK",
      optimize: "QUICK",
      showIntermediateStops: "true",
      time: "17:45",
      toPlace: "Weather Machine, Portland, OR, USA::45.519015,-122.679321",
      ui_activeItinerary: "0",
      ui_activeSearch: "irc7h4rb8",
      walkSpeed: "1.34"
    });

    it("should parse a depart at query", () => {
      expect(planParamsToQuery(makeBaseTestQuery())).toMatchSnapshot();
    });

    it("should parse a query with intermediate places", () => {
      expect(
        planParamsToQuery({
          ...makeBaseTestQuery(),
          intermediatePlaces: [
            "Mill Ends Park, Downtown - Portland::45.516202,-122.673247",
            "International Rose Test Garden, Portland::45.519094,-122.705692"
          ]
        })
      ).toMatchSnapshot();
    });
  });
});
