# Changelog

- [Components via Storybook](http://www.opentripplanner.org/otp-ui)
- [npm packages](https://www.npmjs.com/org/opentripplanner)

## [0.0.22] - 2020-06-11

### Changes

Lots of map and props cleanup, etc...

- [#141](https://github.com/opentripplanner/otp-ui/issues/141)
- [#139](https://github.com/opentripplanner/otp-ui/issues/139)
- [#138](https://github.com/opentripplanner/otp-ui/issues/138)
- [#137](https://github.com/opentripplanner/otp-ui/issues/137)
- [#136](https://github.com/opentripplanner/otp-ui/issues/136)
- [#135](https://github.com/opentripplanner/otp-ui/issues/135)
- [#134](https://github.com/opentripplanner/otp-ui/issues/134)
- [#130](https://github.com/opentripplanner/otp-ui/issues/130)
- [#129](https://github.com/opentripplanner/otp-ui/issues/129)

---

## [0.0.21] - 2020-05-06

### Changes

major vehicle overlay refactor

## [0.0.20] - 2020-04-27

### Changes

minor changes / fixes

## [0.0.19] - 2020-03-26

### Changes

Itinerary and Mode Button improvements PRs (trimet.org project):

- [#97](https://github.com/opentripplanner/otp-ui/issues/97)
- [#92](https://github.com/opentripplanner/otp-ui/issues/92)

## [0.0.18] - 2020-03-19

### Changes

Handful of cleanup PRs:

- [#90](https://github.com/opentripplanner/otp-ui/issues/90)
- [#89](https://github.com/opentripplanner/otp-ui/issues/89)
- [#88](https://github.com/opentripplanner/otp-ui/issues/88)
- [#81](https://github.com/opentripplanner/otp-ui/issues/81)
- [#78](https://github.com/opentripplanner/otp-ui/issues/78)
- [#77](https://github.com/opentripplanner/otp-ui/issues/77)

## [0.0.17] - 2020-03-03

### Changes

Handful of cleanup PRs:

- [#74](https://github.com/opentripplanner/otp-ui/issues/74)
- [#75](https://github.com/opentripplanner/otp-ui/issues/75)
- [#76](https://github.com/opentripplanner/otp-ui/issues/76)

## [0.0.16] - 2020-02-21

### Changes

- [base-map](http://www.opentripplanner.org/otp-ui/?path=/story/basemap--on-context-menu-popup) Callbacks for Desktop right-click / Mobile long press. Resolves issue [#64](https://github.com/opentripplanner/otp-ui/issues/64)
- [stop-viewer-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/stopvieweroverlay--stopvieweroverlay-with-custom-marker) Slot for custom icon. Resolves issue [#62](https://github.com/opentripplanner/otp-ui/issues/62)
- [stops-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/stopsoverlay--stopsoverlay-with-custom-marker) Slot for custom icons (different stop icons (bus, MAX, SC, WES, TRAM) could be based on a 'mode' attribute if available in a stops service). Resolves issue [#59](https://github.com/opentripplanner/otp-ui/issues/59)

## [0.0.15] - 2020-02-20

### Added Components

- [printable-itinerary](http://www.opentripplanner.org/otp-ui/?path=/story/printableitinerary--itinerarybody-with-walk-only-itinerary) adds a component for rendering an OTP itinerary formatted for printing on 8.5x11 paper. Resolves issue [#38](https://github.com/opentripplanner/otp-ui/issues/38)

- [trip-details](http://www.opentripplanner.org/otp-ui/?path=/story/tripdetails--tripdetails-with-tnc-transit-itinerary) adds a component to render cost, date/time and calories based on an OTP itinerary.

### Changes

- [transit-vehicle-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/transitvehicleoverlay--real-time-vehicles-in-layer-switcher): fixes tracking and panning issue; adds panTo offsets, data callbacks and color styling improvements to the Real-time Transit Vehicle overlay. Resolves issue: [#58](https://github.com/opentripplanner/otp-ui/issues/58)

## [0.0.14] - 2020-02-04

### Changes

- core-utils: [fixes issue #50 ](https://github.com/opentripplanner/otp-ui/issues/50) fix nan bug on url params

## [0.0.13] - 2020-02-03

### Added Components

- [transit-vehicle-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/realtime-vehiclelayer--real-time-vehicles-layer): add Real-time Transit Vehicle overlay

### Changes

- from-to-location-picker: [fixes issue #54 ](https://github.com/opentripplanner/otp-ui/issues/54) get rid of 'module' enteries in package.json
- trip-form: [fixes issue #46 ](https://github.com/opentripplanner/otp-ui/issues/46) no longer throwing exception on bike optimize drop-down
- endpoints-overlay: [fixes issue #37](https://github.com/opentripplanner/otp-ui/issues/37) allow custom icons from/to on map
- itinerary-body: [fixes issue #18 ](https://github.com/opentripplanner/otp-ui/issues/18) allows custom naming of route and other aspects of the itinerary
- base-map: [fixes issue #16](https://github.com/opentripplanner/otp-ui/issues/16) map callbacks that tell a layer if it is displayed or not -- used to only fetching new data if a layer is 'on' the map
- misc other fixes and tweaks...

## [0.0.12] - 2020-01-24

### Added Components

- [park-and-ride-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/parkandrideoverlay--parkandrideoverlay): adds Park & Rides as a layer
- [vehicle-rental-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/vehiclerentaloverlay--vehiclerentaloverlay-with-rental-bicycles): adds e-scooters and BIKETOWN bikes

### Changes

- transitive-overlay: [fixes issue #36 ](https://github.com/opentripplanner/otp-ui/issues/36) error when no intermediate stops are in the itinerary.
- location-field: expose raw geocoder data https://github.com/opentripplanner/otp-ui/issues/33
- trip-form: switch to Styled Components

## [0.0.11] - 2020-01-20

### Added Components

- [transitive-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/transitiveoverlay--transitiveoverlay-with-e-scooter-rental-transit-itinerary): tripplanner itinerary path drawing on the map
- [endpoints-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/endpointsoverlay--endpointsoverlay): tripplanner (movable) from & to calipers for selecting points from the map
- [stop-viewer-overlay](http://www.opentripplanner.org/otp-ui/?path=/story/stopvieweroverlay--stopvieweroverlay): used to highlight an individual stop on the map (when showing transit tracker info)
- [trip-form](http://www.opentripplanner.org/otp-ui/?path=/story/datetimeselector--date-time-selector): adds [date and time form](http://www.opentripplanner.org/otp-ui/?path=/story/datetimeselector--date-time-selector), to go along with the [trip planner form](http://www.opentripplanner.org/otp-ui/?path=/story/settingsselectorpanel--settings-selector-panel)

### Changes

- stop-viewer-overlay: misc changes per https://github.com/opentripplanner/otp-ui/issues/18
- location-field: misc changes per:
  - https://github.com/opentripplanner/otp-ui/issues/13
  - https://github.com/opentripplanner/otp-ui/issues/14
