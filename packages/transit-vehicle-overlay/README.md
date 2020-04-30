## WHAT:

Presentational React Components used to build an interactive vehicle map (leaflet) overlay.
This component uses functional components and hooks (no more class components).

NOTE: eventually want this component (and OTP-UI in general) to support both leaflet and
mapbox gl libraries.

## HOW:

There is a type format for RT vehicle data in OTP-UI:
https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/types.js#L54

This format was derived in this project to accord with a companion web service that delivers
realtime vehicle information information, based on GTFS-Realtime data
(https://github.com/OpenTransitTools/gtfsdb_realtime/blob/master/ott/gtfsdb_realtime/model/response/vehicle_list.py).

Other realtime vehicle data may be used with this layer. For example, there is demo code within the component that
shows converting another service response format (https://developer.trimet.org/ws_docs/vehicle_locations_ws.shtml)
to work with this layer.

## NOTES:

- The use of hooks was a good thing, but there's a bit of resulting redirection (HL functions, etc...)
  in the compoent lib (and interface) which obfuscates things a bit ... appologies in advnace.
- below are 2 utils I use in conjuction for converting .svg to React svg .js files
  - https://jakearchibald.github.io/svgomg -- .svg optimizer
  - https://react-svgr.com/playground -- good .svg => .npx converter

## TODO:

1.  more / better unit tests
1.  mapbox gl
