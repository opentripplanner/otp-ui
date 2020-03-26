import PropTypes from "prop-types";
import React from "react";

import * as Styled from "../styled";

export default function IntermediateStops({ stops }) {
  return (
    <Styled.IntermediateStops>
      {stops.map((stop, k) => {
        return (
          <Styled.StopRow key={k}>
            <Styled.StopMarker>&bull;</Styled.StopMarker>
            <Styled.StopName>{stop.name}</Styled.StopName>
          </Styled.StopRow>
        );
      })}
    </Styled.IntermediateStops>
  );
}

IntermediateStops.propTypes = {
  stops: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
