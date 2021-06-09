import coreUtils from "@opentripplanner/core-utils";
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
        <>{coreUtils.itinerary.getPlaceName(place, config.companies)}</>
      )}
    </>
  );
}

PlaceName.propTypes = {
  config: coreUtils.types.configType.isRequired,
  interline: PropTypes.bool,
  place: coreUtils.types.placeType.isRequired
};

PlaceName.defaultProps = {
  interline: false
};
