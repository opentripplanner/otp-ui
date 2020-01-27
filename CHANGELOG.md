# Changelog

- [Components via Storybook](http://www.opentripplanner.org/otp-ui/?path=/story/locationicon--to-locationicon)
- [npm packages](https://www.npmjs.com/org/opentripplanner)

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
