import { configType, placeType } from "@opentripplanner/core-utils/lib/types";
import { getPlaceName } from "@opentripplanner/core-utils/lib/itinerary";
import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

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
      {/* TODO: take another pass on this when working the Transit Leg */}
      {/* Place subheading: Transit stop */}
      {place.stopId && !interline && (
        <Styled.StopIdSpan>ID {place.stopId.split(":")[1]}</Styled.StopIdSpan>
        /*
        TODO: There is no explicit stop button on the mocks.
        Have a question out to marketing as to whether the above StopID
        is a button to navigate the user to the arrival list for the stop
        that's what the button below does
      */
        /* <ViewStopButton stopId={place.stopId} /> */
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
