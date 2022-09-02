## WHAT:

Presentational React Components used to build an interactive vehicle map .
This component uses functional components and hooks (no more class components).

NOTE: eventually want this component (and OTP-UI in general) to support both leaflet and
mapbox gl libraries.

### CURRENTLY:

This package is being re-built from the ground-up to instead generate and render geojson from realtime transit data. Some features (and most components) have initially been removed, but they will be restored in future.

## HOW:

There is a type format for RT vehicle data in OTP-UI:
https://github.com/opentripplanner/otp-ui/blob/master/packages/core-utils/src/types.js#L54

This format was derived in this project to accord with a companion web service that delivers
realtime vehicle information information, based on GTFS-Realtime data
(https://github.com/OpenTransitTools/gtfsdb_realtime/blob/master/ott/gtfsdb_realtime/model/response/vehicle_list.py).

Other realtime vehicle data may be used with this layer. For example, there is demo code within the component that
shows converting another service response format (https://developer.trimet.org/ws_docs/vehicle_locations_ws.shtml)
to work with this layer.

### CURRENTLY:

Only input in the form of https://github.com/opentripplanner/otp-ui/blob/master/packages/types/src/index.ts#L90 is supported.

## NOTES:

- The use of hooks was a good thing, but there's a bit of resulting redirection (HL functions, etc...)
  in the component lib (and interface) which obfuscates things a bit ... apologies in advance.
- 2 very useful utilities for converting .svg to React svg .js files:
  - https://jakearchibald.github.io/svgomg -- .svg optimizer
  - https://react-svgr.com/playground -- good .svg => .npx converter

## TODO:

1.  more / better unit tests
1.  mapbox gl
