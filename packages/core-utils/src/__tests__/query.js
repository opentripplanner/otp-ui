import {
  restoreDateNowBehavior,
  setDefaultTestTime
} from "../../../../test-utils/time";

import { getDefaultQuery, planParamsToQuery } from "../query";

describe("query", () => {
  afterEach(restoreDateNowBehavior);

  describe("planParamsToQuery", () => {
    it("should parse a depart at query", async () => {
      expect(
        await planParamsToQuery(
          {
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
            toPlace:
              "Weather Machine, Portland, OR, USA::45.519015,-122.679321",
            ui_activeItinerary: "0",
            ui_activeSearch: "irc7h4rb8",
            walkSpeed: "1.34"
          },
          {
            geocoder: {
              baseUrl: "https://ws-st.trimet.org/peliaswrap/v1",
              maxNearbyStops: 6,
              type: "PELIAS",
              boundary: {
                rect: {
                  minLon: -123.2034,
                  maxLon: -122.135,
                  minLat: 45.273,
                  maxLat: 45.7445
                }
              }
            }
          }
        )
      ).toMatchSnapshot();
    });
  });

  describe("getDefaultQuery", () => {
    it("should return default query", () => {
      setDefaultTestTime();
      expect(getDefaultQuery()).toMatchSnapshot();
    });
  });
});
