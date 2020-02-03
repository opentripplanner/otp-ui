// TODO: move to core-utils/types.js (maybe)
import PropTypes from "prop-types";

export const vehicleType = PropTypes.shape({
  routeShortName: PropTypes.string,
  routeLongName: PropTypes.string,
  routeType: PropTypes.string,

  status: PropTypes.string,
  reportDate: PropTypes.string,
  seconds: PropTypes.number,

  stopSequence: PropTypes.number,
  stopId: PropTypes.string,
  vehicleId: PropTypes.string,
  tripId: PropTypes.string,
  blockId: PropTypes.string,

  lat: PropTypes.number,
  lon: PropTypes.number,
  heading: PropTypes.number
});

export const avoidLintError = 1;
