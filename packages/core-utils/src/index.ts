import * as itinerary from "./itinerary";
import * as map from "./map";
import * as profile from "./profile";
import * as query from "./query";
import * as queryParams from "./query-params";
import * as route from "./route";
import * as storage from "./storage";
import * as time from "./time";
import * as ui from "./ui";
import * as queryGen from "./query-gen";
import SafeSuspense from "./suspense";

const core = {
  itinerary,
  map,
  profile,
  query,
  queryGen,
  queryParams,
  route,
  storage,
  time,
  ui
};

export { SafeSuspense };
export default core;
