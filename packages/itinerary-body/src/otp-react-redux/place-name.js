import { configType, placeType } from "@opentripplanner/core-utils/lib/types";
import { getPlaceName } from "@opentripplanner/core-utils/lib/itinerary";
import PropTypes from "prop-types";
import React from "react";

export default function PlaceName({ config, interline, place }) {
  return (
    <>
      {interline ? (
        <>
          Stay on Board at <b>{place.name}</b>
        </>
      ) : (
        <>{getPlaceName(place, config.companies)}</>
      )}
    </>
  );
}

PlaceName.propTypes = {
  config: configType.isRequired,
  interline: PropTypes.bool,
  place: placeType.isRequired
};

PlaceName.defaultProps = {
  interline: false
};
